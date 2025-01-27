import React, { useEffect, useRef, useState } from 'react';
import { MoleculeService } from '../services/moleculeService';

interface MoleculeViewerProps {
  moleculeName: string;
  width?: string;
  height?: string;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({
  moleculeName,
  width = '300px',
  height = '300px'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const moleculeService = useRef(new MoleculeService());

  useEffect(() => {
    const loadMolecule = async () => {
      if (!containerRef.current) return;
      
      try {
        setIsLoading(true);
        setError(null);
        await moleculeService.current.initViewer(containerRef.current);
        await moleculeService.current.visualizeMolecule(moleculeName, containerRef.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load molecule');
      } finally {
        setIsLoading(false);
      }
    };

    loadMolecule();
    
    return () => {
        moleculeService.current.cleanup();
    };
  }, [moleculeName]);

  return (
    <div className="molecule-viewer" style={{ width, height }}>
      {isLoading && (
        <div className="loading-overlay">Loading...</div>
      )}
      {error && (
        <div className="error-overlay">{error}</div>
      )}
      <div
        ref={containerRef}
        className={`molecule-viewer-content ${isLoading ? 'hidden' : ''}`}
      />
    </div>
  );
};

export default MoleculeViewer;
