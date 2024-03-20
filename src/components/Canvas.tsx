// REACT IMPORT
import React from 'react';

const Canvas = (): JSX.Element => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      {/* canvas container */}
      <div className='w-full h-full flex justify-center items-center bg-black'>
        <canvas id="myCanvas" className='bg-red-500 h-full aspect-video'>
        </canvas>
      </div>
    </div>
  );
}

export default Canvas;
