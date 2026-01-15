import React from 'react';
import imgComixLogo from './comix_logo.png';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const ComixLogo: React.FC<LogoProps> = ({ className = "", width = 200, height = 100 }) => {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Comic bubble shape */}
      {/* <svg viewBox="0 0 200 100" width={width} height={height} className="absolute top-0 left-0">
        <path
          d="M20,10 L180,10 C190,10 195,15 195,25 L195,60 C195,70 190,75 180,75 L110,75 L100,90 L90,75 L20,75 C10,75 5,70 5,60 L5,25 C5,15 10,10 20,10 Z"
          fill="white"
          stroke="black"
          strokeWidth="4"
        />
      </svg> */}
      
      {/* Text elements */}
      <div className="absolute flex items-center justify-center w-full h-full">
        <span className="font-comic text-4xl" style={{ marginTop: "-5px" }}>
        <img src={imgComixLogo} width={'300px'} alt="Co.mix logo" />
          {/* <span className="text-primary-blue">co</span>
          <span className="text-primary-red">.</span>
          <span className="text-primary-green">mi</span>
          <span className="text-primary-red">x</span> */}
        </span>
      </div>
    </div>
  );
};

export default ComixLogo;