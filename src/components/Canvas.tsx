// REACT IMPORTS
import React, { useEffect, useRef, useState } from 'react';

// DATA IMPORTS
import { scenes } from '../data/scenes';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number>();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(1);
  const [textPositionX, setTextPositionX] = useState(0);

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

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-full h-full flex justify-center items-center bg-black'>
        <canvas className='bg-red-500 h-full aspect-video' ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default Canvas;