import React from 'react';

export function YetiEyeOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7" />
    </svg>
  );
}

export function YetiEyeClosed(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {/* Ojo base (igual que abierto pero atenuado) */}
        <circle cx="12" cy="12" r="3" />
        <path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7" />
        
        {/* Diagonal estilo tabla de snowboard/ski */}
        <path 
          d="M5 18l14-14" 
          strokeWidth="3"
          stroke="white"
        />
        
        {/* Detalle de fijación de snowboard */}
        <rect 
          x="10" y="10" 
          width="4" height="4" 
          stroke="white" 
          strokeWidth="1.5"
          transform="rotate(45 12 12)"
        />
      </svg>
    );
  }