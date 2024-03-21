// REACT IMPORTS
import React, { useEffect, useRef, useState } from 'react'

// DATA IMPORTS
import { videoScenes } from '../data/scenes'

const VideoCanvas = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const animationRef = useRef<number>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoControlsRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = (): void => {
    setIsPlaying(true)
    const video = videoRef.current;
    if (video) {
      video.play();
      setIsPlaying(true);
    }

    audioRef.current
      ?.play()
      .then(() => {
        // Play successful
      })
      .catch((error) => {
        console.error('Failed to play audio:', error)
      })
  }

  const handlePause = (): void => {
    setIsPlaying(false)
    audioRef.current?.pause()

    const video = videoRef.current;
    if (video) {
      video.pause()
      setIsPlaying(false)
    }
  }

  const handleStop = (): void => {
    setCurrentSceneIndex(0)
    setCurrentText('')
    setCurrentTextIndex(0)
    setIsPlaying(false)
    if (animationRef.current != null) {
      cancelAnimationFrame(animationRef.current)
    }
    canvasCtxRef.current?.clearRect(
      0,
      0,
      canvasRef.current?.width ?? 3000,
      canvasRef.current?.height ?? 1680
    )

    if (audioRef.current != null) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  // Function to simulate typing effect
  const typeText = (): void => {
    if (currentTextIndex < videoScenes[currentSceneIndex].sentence.length) {
      setCurrentText(
        (prevText) => prevText + videoScenes[currentSceneIndex].sentence[currentTextIndex]
      )
      setCurrentTextIndex((prevIndex) => prevIndex + 1)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    const drawFrame = () => {
      if (video && context) {
        context.drawImage(video, 0, 0, canvas!.width, canvas!.height)
        requestAnimationFrame(drawFrame)
      }
    }

          // Typing animation effect
          const typingInterval = setInterval(() => {
            typeText()
          }, 150) // Adjust typing speed
    

    if (video && canvas) {
      video.addEventListener('play', drawFrame)
      return () => {
        video.removeEventListener('play', drawFrame)
        clearInterval(typingInterval)
      }
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      const currentScene = videoScenes[currentSceneIndex]
      const timeoutId = setTimeout(() => {
        setCurrentSceneIndex(
          currentSceneIndex + 1 > videoScenes.length - 1 ? 0 : currentSceneIndex + 1
        )
        setCurrentText('')
        setCurrentTextIndex(0)
      }, currentScene.duration * 1000)

      // Typing animation effect
      const typingInterval = setInterval(() => {
        typeText()
      }, 150) // Adjust typing speed

      return () => {
        clearTimeout(timeoutId)
        clearInterval(typingInterval)
      }
    }
  })

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        id="canvas-container"
        className="relative w-full h-full flex justify-center items-center border border-black bg-black">
        <canvas
          className="bg-white border border-black h-full aspect-video"
          ref={canvasRef}></canvas>
        <div className="overlay absolute bg-black opacity-50 top-0 left-0 w-full h-full"></div>
        <div className="overlay absolute">
          {!isPlaying && (
            <button
              className="w-[150px] p-2 m-4 text-white border border-white hover:border-black hover:text-black hover:bg-white"
              onClick={handlePlay}>
              Play
            </button>
          )}
          {isPlaying && (
            <button
              className="w-[150px] p-2 m-4 text-white border border-white hover:border-black hover:text-black hover:bg-white"
              onClick={handlePause}>
              Pause
            </button>
          )}
          <button
            className="w-[150px] p-2 m-4 text-white border border-white hover:border-black hover:text-black hover:bg-white"
            onClick={handleStop}>
            Stop
          </button>
        </div>
        <audio className="hidden" ref={audioRef}>
          <source
            src="https://cdn.pixabay.com/audio/2023/09/29/audio_0eaceb1002.mp3"
            type="audio/mpeg"
          />
          Your browser does not support the audio element.
        </audio>
      </div>
      <video ref={videoRef} width="400" height="300" controls>
        <source src={videoScenes[0].media} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div ref={videoControlsRef}>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
      </div>
    </div>
  )
}

export default VideoCanvas