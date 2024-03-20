// REACT IMPORTS
import React, { useEffect, useRef, useState } from 'react';

// DATA IMPORTS
import { scenes } from '../data/scenes';

const Canvas = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [currentScene, setCurrentScene] = useState(scenes[0])

  console.log(setCurrentScene)

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');

      // Adjust canvas size for Retina displays
      const scaleFactor = window.devicePixelRatio;
      canvasRef.current.width = (canvasRef.current.clientWidth || 0) * scaleFactor;
      canvasRef.current.height = (canvasRef.current.clientHeight || 0) * scaleFactor;
    }    

    const image = new Image();
    image.src = currentScene.media


    image.onload = () => {
      if (canvasCtxRef.current) {
        // Draw image
        canvasCtxRef.current?.drawImage(image, 0, 0, canvasRef.current?.width ?? 300, canvasRef.current?.height ?? 168);

        // Add text on top of the image
        canvasCtxRef.current.font = '55px Arial';
        canvasCtxRef.current.fillStyle = 'white';
        canvasCtxRef.current.textAlign = 'right';
        canvasCtxRef.current.fillText(currentScene.sentence, (canvasRef.current?.width ?? 300 / 2), 50);
      };
    }
  }, [currentScene]);

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-full h-full flex justify-center items-center bg-black'>
        <canvas
          className='bg-red-500 h-full aspect-video'
          ref={canvasRef}
        ></canvas>
      </div>
    </div>
  );
}

export default Canvas;
