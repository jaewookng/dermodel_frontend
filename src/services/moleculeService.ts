const MOLECULE_MAPPINGS: Record<string, { cid: string; name: string; fallbackImage: string }> = {
    ceramide: {
        cid: '5283565',
        name: 'Ceramide',
        fallbackImage: './resources/images/molecules/ceramide.png'
    },
    cholesterol: {
        cid: '5997',
        name: 'Cholesterol',
        fallbackImage: './resources/images/molecules/cholesterol.png'
    },
    'fatty-acids': {
        cid: '985',  // Using palmitic acid as representative
        name: 'Fatty Acids',
        fallbackImage: './resources/images/molecules/fatty-acids.png'
    },
    hyaluronan: {
        cid: '24847768',
        name: 'Hyaluronic Acid',
        fallbackImage: './resources/images/molecules/hyaluronan.png'
    }
};

// Add type for 3Dmol viewer
type Viewer3D = {
    clear: () => void;
    addModel: (data: string, format: string) => void;
    setStyle: (sel: object, style: object) => void;
    zoomTo: () => void;
    render: () => void;
    removeAllModels: () => void;
    dispose: () => void;
};

interface MoleculeImageConfig {
    fallbackImage: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export class MoleculeService {
    private viewer: Viewer3D | null = null;
    private initializationPromise: Promise<Viewer3D> | null = null;
    private requestQueue: Map<string, Promise<any>> = new Map();
    private fallbackImage: string = '/path/to/default-molecule.png';  // Set default path

    constructor(config?: MoleculeImageConfig) {
        this.fallbackImage = config?.fallbackImage ?? this.fallbackImage;
    }

    getFallbackImage(): string {
        return this.fallbackImage;
    }

    // Use in error handling
    handleViewerError(): string {
        return this.fallbackImage;
    }

    private async retry<T>(
        operation: () => Promise<T>,
        retries = MAX_RETRIES
    ): Promise<T> {
        for (let i = 0; i < retries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
        throw new Error('Max retries reached');
    }

    async initViewer(container: HTMLElement): Promise<Viewer3D> {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = new Promise((resolve, reject) => {
            if (!window.$3Dmol) {
                reject(new Error('3Dmol.js not loaded'));
                return;
            }

            const checkInterval = setInterval(() => {
                if (container.offsetParent !== null) {  // Check if element is visible
                    clearInterval(checkInterval);
                    try {
                        this.viewer = window.$3Dmol.createViewer(container, {
                            backgroundColor: 'white',
                            defaultcolors: window.$3Dmol.rasmolElementColors
                        });
                        resolve(this.viewer);
                    } catch (error) {
                        reject(error);
                    }
                }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('Viewer initialization timeout'));
            }, 5000);
        });

        return this.initializationPromise;
    }

    cleanup(): void {
        if (this.viewer) {
            try {
                this.viewer.removeAllModels();
                this.viewer.dispose();
            } catch (error) {
                console.warn('Error during cleanup:', error);
            }
            this.viewer = null;
            this.initializationPromise = null;
        }
        this.requestQueue.clear();
    }

    async visualizeMolecule(name: string, container: HTMLElement): Promise<void> {
        if (!name || !container) {
            throw new Error('Invalid parameters');
        }

        try {
            const result = await this.fetchFromPubChem(name);
            if (!result) throw new Error('No molecule data');

            if ('useFallback' in result) {
                await this.validateAndDisplayImage(container, result.fallbackImage);
                return;
            }

            const sdf = await this.fetch3DStructure(result.cid);
            if (!sdf) {
                throw new Error('Failed to fetch 3D structure');
            }

            await this.display3DStructure(container, sdf);
        } catch (error) {
            const mapping = MOLECULE_MAPPINGS[name.toLowerCase()];
            if (mapping) {
                await this.validateAndDisplayImage(container, mapping.fallbackImage);
            } else {
                throw error;
            }
        }
    }

    private async validateAndDisplayImage(container: HTMLElement, src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.displayFallbackImage(container, src);
                resolve();
            };
            img.onerror = () => reject(new Error('Failed to load fallback image'));
            img.src = src;
        });
    }

    async fetchFromPubChem(name: string) {
        const cacheKey = `pubchem:${name}`;
        
        if (this.requestQueue.has(cacheKey)) {
            return this.requestQueue.get(cacheKey);
        }

        const request = this.retry(async () => {
            const mapping = MOLECULE_MAPPINGS[name.toLowerCase()];
            if (mapping) return { cid: mapping.cid };

            const response = await fetch(
                `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/cids/JSON`,
                { signal: AbortSignal.timeout(5000) }
            );

            if (!response.ok) {
                throw new Error(`PubChem API error: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.IdentifierList?.CID?.length) {
                throw new Error('No molecule data found');
            }

            return { cid: data.IdentifierList.CID[0] };
        });

        this.requestQueue.set(cacheKey, request);
        
        try {
            const result = await request;
            this.requestQueue.delete(cacheKey);
            return result;
        } catch (error) {
            this.requestQueue.delete(cacheKey);
            throw error;
        }
    }

    async fetch3DStructure(cid: string): Promise<string | null> {
        try {
            const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF/?record_type=3d`);
            return response.ok ? await response.text() : null;
        } catch (error) {
            console.error('Error fetching 3D structure:', error);
            return null;
        }
    }

    async display3DStructure(container: HTMLElement, sdf: string): Promise<void> {
        if (!this.viewer) {
            await this.initViewer(container);
        }

        try {
            this.viewer?.clear();
            this.viewer?.addModel(sdf, 'sdf');
            this.viewer?.setStyle({}, {
                stick: { radius: 0.2 },
                sphere: { radius: 0.5 }
            });
            this.viewer?.zoomTo();
            this.viewer?.render();
        } catch (error) {
            console.error('Error displaying 3D structure:', error);
            throw new Error('Failed to display 3D structure');
        }
    }

    display2DStructure(container: HTMLElement, cid: string): void {
        const img = document.createElement('img');
        img.src = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`;
        img.style.maxWidth = '100%';
        container.innerHTML = '';
        container.appendChild(img);
    }

    displayFallbackImage(container: HTMLElement, imagePath: string): void {
        const img = document.createElement('img');
        img.src = imagePath;
        img.style.maxWidth = '100%';
        container.innerHTML = '';
        container.appendChild(img);
    }
}

// Add types for window
declare global {
    interface Window {
        $3Dmol: {
            createViewer: (element: HTMLElement, config: any) => Viewer3D;
            rasmolElementColors: any;
        };
    }
}
