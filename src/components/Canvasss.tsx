// REACT IMPORTS
import React, { useEffect, useRef, useState } from 'react'

// DATA IMPORTS
import { scenes } from '../data/scenes'

const VideoCanvas = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Function to handle video playback
  const handlePlayVideo = (): void => {
    const video = videoRef.current
    if (video != null) {
      void video?.play().catch((error) => {
        console.error('Failed to play video:', error)
      })
    }
  }

  const handlePauseVideo = (): void => {
    const video = videoRef.current
    if (video != null) {
      video.pause()
      setIsPlaying(false)
    }
  }

  const handleStopVideo = (): void => {
    const video = videoRef.current
    if (video != null) {
      video.pause()
      video.currentTime = 0
      setIsPlaying(false)
    }
  }

  const handlePlay = (): void => {
    setIsPlaying(true)
    handlePlayVideo()

    void audioRef.current?.play().catch((error) => {
      console.error('Failed to play audio:', error)
    })
  }

  const handlePause = (): void => {
    setIsPlaying(false)
    audioRef.current?.pause()
    handlePauseVideo()
  }

  const handleStop = (): void => {
    const canvasCtxRef = canvasRef.current?.getContext('2d')
    setCurrentSceneIndex(0)
    setCurrentText('')
    setCurrentTextIndex(0)
    setIsPlaying(false)
    if (animationRef.current != null) {
      cancelAnimationFrame(animationRef.current)
    }
    handleStopVideo()
    canvasCtxRef?.clearRect(
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
    if (currentTextIndex < scenes[currentSceneIndex].sentence.length) {
      setCurrentText((prevText) => prevText + scenes[currentSceneIndex].sentence[currentTextIndex])
      setCurrentTextIndex((prevIndex) => prevIndex + 1)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    const canvasCtxRef = canvasRef.current?.getContext('2d')

    const drawFrame = (): void => {
      if (video != null && canvasCtxRef != null) {
        canvasCtxRef.drawImage(
          video,
          0,
          0,
          canvasRef.current?.width ?? 3000,
          canvasRef.current?.height ?? 1680
        )
        requestAnimationFrame(drawFrame)
      }
    }

    // Typing animation effect
    const typingInterval = setInterval(() => {
      typeText()
    }, 150) // Adjust typing speed

    if (video != null && canvasRef.current != null && canvasCtxRef != null) {
      video.addEventListener('play', drawFrame)
      // Draw text
      canvasCtxRef.font = '80px Arial'
      canvasCtxRef.fillStyle = 'white'
      canvasCtxRef.textAlign = 'left'
      canvasCtxRef.fillText(currentText, 100, 100)
      return () => {
        video.removeEventListener('play', drawFrame)
        clearInterval(typingInterval)
      }
    }
  })

  useEffect(() => {
    if (isPlaying) {
      const currentScene = scenes[currentSceneIndex]
      const timeoutId = setTimeout(() => {
        setCurrentSceneIndex(currentSceneIndex + 1 > scenes.length - 1 ? 0 : currentSceneIndex + 1)
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

  useEffect(() => {
    const canvasCtxRef = canvasRef.current?.getContext('2d')

    if (isPlaying) {
      if (canvasRef.current != null) {
        // Adjust canvas size for Retina displays
        const scaleFactor = window.devicePixelRatio
        canvasRef.current.width = canvasRef.current.clientWidth * scaleFactor
        canvasRef.current.height = canvasRef.current.clientHeight * scaleFactor
      }

      const animate = (): void => {
        if (canvasCtxRef != null && canvasRef.current != null) {
          const currentScene = scenes[currentSceneIndex]
          const image = new Image()
          image.src = currentScene.media

          image.onload = () => {
            if (canvasCtxRef != null && canvasRef.current != null) {
              // Draw image
              canvasCtxRef?.drawImage(
                image,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              )

              // Draw text
              canvasCtxRef.font = '80px Arial'
              canvasCtxRef.fillStyle = 'white'
              canvasCtxRef.textAlign = 'left'
              canvasCtxRef.fillText(currentText, 100, 100)
            }
          }
        }

        // Request next frame
        animationRef.current = requestAnimationFrame(animate)
      }

      // Start animation loop
      animate()

      // Clean up function
      return () => {
        if (animationRef.current != null) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [isPlaying, currentSceneIndex, currentText])

  useEffect(() => {
    if (videoRef.current != null && isPlaying) {
      const video = videoRef.current
      video.src = scenes[currentSceneIndex].media
      video.load()
      void video?.play().catch((error) => {
        console.error('Failed to play video:', error)
      })
    }
  }, [currentSceneIndex, isPlaying])

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
      <video className="hidden" ref={videoRef} width="400" height="300" controls>
        <source src={scenes[currentSceneIndex].media} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoCanvas
