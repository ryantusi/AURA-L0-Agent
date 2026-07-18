import React from "react";

interface AuraLogoProps {
  className?: string;
}

export default function AuraLogo({ className = "w-8 h-8" }: AuraLogoProps) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Main Blue Upper Shape & Right Leg (with inner counter triangle cut out) */}
      <path
        d="M 498,120 
           L 756,670 
           C 720,670 655,670 610,670 
           L 572,590 
           L 428,590 
           L 336,490 
           C 366,420 422,290 498,120 Z 
           M 498,335 
           L 452,455 
           L 544,455 Z"
        fill="#0055d4"
        fillRule="evenodd"
      />

      {/* 2. Red Left Leg Shape */}
      <path
        d="M 285,600 
           L 160,850 
           L 325,850 
           L 395,710 Z"
        fill="#d32f2f"
      />

      {/* 3. Red Swoosh (Dynamic sweeping arc cutting across the letter A) */}
      <path
        d="M 215,165 
           C 215,165 228,380 342,500 
           C 456,620 658,740 865,810 
           L 865,850 
           C 655,850 432,740 312,600 
           C 212,480 180,250 180,250 Z"
        fill="#d32f2f"
      />

      {/* 4. Three Floating Accent Orbs / Circles */}
      {/* Small top-left circle */}
      <circle cx="305" cy="267" r="10" fill="#d32f2f" />
      {/* Medium center-left circle */}
      <circle cx="334" cy="362" r="38" fill="#d32f2f" />
      {/* Small bottom-left circle */}
      <circle cx="278" cy="524" r="18" fill="#d32f2f" />

      {/* 5. Blue Rocket Ship at the top of the swoosh */}
      <g transform="translate(202, 140) rotate(-22)">
        {/* Rocket body */}
        <path
          d="M 15,0 
             C 25,12 25,35 23,55 
             L 7,55 
             C 5,35 5,12 15,0 Z"
          fill="#004bb5"
        />
        {/* Rocket Left Fin */}
        <path
          d="M 7,40 
             L 0,55 
             L 7,50 Z"
          fill="#00358a"
        />
        {/* Rocket Right Fin */}
        <path
          d="M 23,40 
             L 30,55 
             L 23,50 Z"
          fill="#00358a"
        />
        {/* Rocket booster flame */}
        <path
          d="M 12,55 
             L 15,68 
             L 18,55 Z"
          fill="#d32f2f"
        />
      </g>
    </svg>
  );
}
