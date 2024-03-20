// REACT IMPORTS
import React, { useEffect, useRef, useState } from 'react';

// DATA IMPORTS
import { scenes } from '../data/scenes';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number>();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [textPositionX, setTextPositionX] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');

      // Adjust canvas size for Retina displays
      const scaleFactor = window.devicePixelRatio;
      canvasRef.current.width = (canvasRef.current.clientWidth || 0) * scaleFactor;
      canvasRef.current.height = (canvasRef.current.clientHeight || 0) * scaleFactor;
    }

    const animate = () => {
      if (canvasCtxRef.current && canvasRef.current) {
        // canvasCtxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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
          return nextPositionX >= canvasRef.current!.width ? 0 : nextPositionX;
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
  }, [currentSceneIndex, textPositionX]);
  
  useEffect(() => {
    // Move to next scene after the duration of the current scene
    const currentScene = scenes[currentSceneIndex];
    const timeoutId = setTimeout(() => {
      setCurrentSceneIndex(currentSceneIndex + 1 > scenes.length - 1 ? 0 : currentSceneIndex + 1);
    }, currentScene.duration * 1000);

    return () => clearTimeout(timeoutId);
  }, [currentSceneIndex]);

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div id='canvas-container' className='relative w-full h-full flex justify-center items-center bg-black'>
        <canvas className='bg-red-500 h-full aspect-video' ref={canvasRef}></canvas>
        <div className='overlay absolute bg-black opacity-50 top-0 left-0 w-full h-full'></div>
        <div className='overlay absolute'>
          {!isPlaying &&
            <button className='w-[150px] p-2 m-4 text-white border border-white hover:border-black hover:text-black hover:bg-white'>Play</button>
          }
          {isPlaying &&
            <button className='w-[150px] p-2 m-4 text-white border border-white hover:border-black hover:text-black hover:bg-white'>Pause</button>
          }
          <button className='w-[150px] p-2 m-4 text-white border border-white hover:border-black hover:text-black hover:bg-white'>Stop</button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;