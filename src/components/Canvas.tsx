// REACT IMPORTS
import React, { useEffect, useRef, useState } from 'react';

// DATA IMPORTS
import { scenes } from '../data/scenes';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [textPositionX, setTextPositionX] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true);
    audioRef.current?.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  const handleStop = () => {
    setTextPositionX(0);
    setCurrentSceneIndex(0);
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    canvasCtxRef.current?.clearRect(0, 0, canvasRef.current?.width ?? 3000, canvasRef.current?.height ?? 1680);
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (canvasRef.current) {
        canvasCtxRef.current = canvasRef.current.getContext('2d');

        // Adjust canvas size for Retina displays
        const scaleFactor = window.devicePixelRatio;
        canvasRef.current.width = (canvasRef.current.clientWidth || 0) * scaleFactor;
        canvasRef.current.height = (canvasRef.current.clientHeight || 0) * scaleFactor;
      }

      const animate = () => {
        if (canvasCtxRef.current && canvasRef.current) {
          const currentScene = scenes[currentSceneIndex];
          const image = new Image();
          image.src = currentScene.media;

          image.onload = () => {
            if (canvasCtxRef.current && canvasRef.current) {
              // Draw image
              canvasCtxRef.current?.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);

              // Add text on top of the image
              canvasCtxRef.current.font = '95px Arial';
              canvasCtxRef.current.fillStyle = 'white';
              canvasCtxRef.current.textAlign = 'center';
              canvasCtxRef.current.fillText(currentScene.sentence, textPositionX, 100, 1000);
            }
          };

          // Update text position for next frame
          setTextPositionX((prevPositionX) => {
            const nextPositionX = prevPositionX + 0.15;
            return nextPositionX;
          });
        }

        // Request next frame
        animationRef.current = requestAnimationFrame(animate);
      };

      // Start animation loop
      animate();

      // Clean up function
      return () => {
        cancelAnimationFrame(animationRef.current!);
      };
    }
  }, [isPlaying, currentSceneIndex, textPositionX]);
  
  useEffect(() => {
    if (isPlaying) {
      const currentScene = scenes[currentSceneIndex];
      // Move to next scene after the duration of the current scene
      const timeoutId = setTimeout(() => {
        setCurrentSceneIndex(currentSceneIndex + 1 > scenes.length - 1 ? 0 : currentSceneIndex + 1);
        setTextPositionX(0)
      }, currentScene.duration * 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isPlaying, currentSceneIndex]);

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div id='canvas-container' className='relative w-full h-full flex justify-center items-center border border-black bg-black'>
        <canvas className='bg-white border border-black h-full aspect-video' ref={canvasRef}></canvas>
        <div className='overlay absolute bg-black opacity-50 top-0 left-0 w-full h-full'></div>
        <div className='overlay absolute'>
          {!isPlaying &&
            <button
              className='w-[150px] p-2 m-4 text-white border border-white hover:border-black hover:text-black hover:bg-white'
              onClick={handlePlay}
            >Play</button>
          }
          {isPlaying &&
            <button
              className='w-[150px] p-2 m-4 text-white border border-white hover:border-black hover:text-black hover:bg-white'
              onClick={handlePause}
            >Pause</button>
          }
          <button
            className='w-[150px] p-2 m-4 text-white border border-white hover:border-black hover:text-black hover:bg-white'
            onClick={handleStop}
          >Stop</button>
        </div>
        <audio className='hidden' ref={audioRef}>
          <source src="https://cdn.pixabay.com/audio/2023/09/29/audio_0eaceb1002.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default Canvas;