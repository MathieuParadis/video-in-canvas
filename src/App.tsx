// REACT IMPORT
import React from 'react'

// COMPONENTS IMPORTS
import VideoImgCanvas from './components/VideoImgCanvas'

function App(): JSX.Element {
  return (
    <div className="h-screen w-screen flex justify-center items-center p-10 md:p-20">
      <VideoImgCanvas />
    </div>
  )
}

export default App
