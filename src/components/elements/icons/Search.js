import React from 'react';

export default function Search() {
  return (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
      <linearGradient id="magGrad" gradientUnits="userSpaceOnUse" x1="287.0869" y1="227.6745" x2="533.7535" y2="385.6746">
        <stop offset="0" style={{ 'stopColor': '#0BD3F6' }}/>
        <stop offset="1" style={{ 'stopColor': '#2998D5' }}/>
      </linearGradient>   
      </defs>
      <g id="wholeGroup" fill="url(#magGrad)" stroke="url(#magGrad)">
        <line id="handle" fill="none"   strokeWidth="30" strokeLinecap="round" strokeMiterlimit="10" x1="466.5" y1="373.4" x2="577.7" y2="484.7"/>
        <path id="outerRing" strokeLinecap="round" fill="none"  strokeWidth="22" strokeMiterlimit="10" d="M464.9,368.6
          c-29.6,28.1-75.2,34.6-112.3,13.1c-45.1-26.1-60.5-83.9-34.3-129c26.1-45.1,83.9-60.5,129-34.3s60.5,83.9,34.3,129
          C477,355.4,471.4,362.5,464.9,368.6"
        />
        <circle id="startCircle"  stroke="none" cx="400" cy="300" r="94.4"/>
        <path id="shine" fill="none"  strokeWidth="10" strokeLinecap="round" strokeMiterlimit="10" d="M386.3,238.3
          c26.6-5.9,55.1,6,68.9,31.1"
        />    
        <circle id="hit" stroke="none" fill="rgba(34,123,45,0)" cx="400" cy="300" r="110"/>
      </g>
    </svg>
  );
}
