// REACT IMPORTS
import React, { useEffect, useRef } from 'react';

// DATA IMPORTS
import { scenes } from '../data/scenes';

const Canvas = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');

      // Adjust canvas size for Retina displays
      const scaleFactor = window.devicePixelRatio;
      canvasRef.current.width = (canvasRef.current.clientWidth || 0) * scaleFactor;
      canvasRef.current.height = (canvasRef.current.clientHeight || 0) * scaleFactor;
    }    

    const image = new Image();
    image.src = scenes[0].media

    image.onload = () => {
      canvasCtxRef.current?.drawImage(image, 0, 0, canvasRef.current?.width ?? 300, canvasRef.current?.height ?? 168);
    };
  }, []);

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
