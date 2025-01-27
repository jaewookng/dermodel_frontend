import './App.css'
import FaceModel from './components/FaceModel'
import Dropdown from './components/Dropdown'
import Tooltip from './components/Tooltip'
import ResetButton from './components/ResetButton'
import { useRef } from 'react'

function App() {
  const faceModelRef = useRef<{ resetView?: () => void }>({});

  const handleReset = () => {
    faceModelRef.current.resetView?.();
  }

  return (
    <>
      <div>
        <ResetButton onReset={handleReset} />
        <div className="right-center-element">
          <strong>dermodel</strong> by Jaewoo Kang<br />
          drag to rotate<br />
          scroll to zoom<br />
          ⌘ + drag to pan
        </div>
        <Dropdown />
        <Tooltip />
        <FaceModel ref={faceModelRef} />
      </div>
    </>
  )
}

export default App
