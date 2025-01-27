import './App.css'
import FaceModel from './components/FaceModel'
import Dropdown from './components/Dropdown'
import Tooltip from './components/Tooltip'
import ResetButton from './components/ResetButton'

function App() {
  // Add state management for the reset functionality
  const handleReset = () => {
    // Add your reset logic here
    console.log('Reset triggered')
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
        <FaceModel />
      </div>
    </>
  )
}

export default App
