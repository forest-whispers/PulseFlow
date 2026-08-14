import React from "react"

export default function Logo({ className = "h-9 w-auto" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 300 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-brand-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="35%" stopColor="#2563EB" />
          <stop offset="75%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <mask id="logo-crossover-mask">
          <rect x="-150" y="-150" width="300" height="300" fill="white" />
          <path d="M -30 15 C -20 12, -10 6, 0 0 C 10 -6, 20 -12, 30 -15" stroke="black" strokeWidth="18" strokeLinecap="round" fill="none" />
        </mask>
      </defs>

      <g transform="translate(48, 40) scale(0.7)">
        <path d="M -57.5 45 L -57.5 -45" stroke="url(#logo-brand-grad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M -57.5 -22.5 C -35 -22.5, -15 -10, 0 0 C -15 10, -35 22.5, -57.5 22.5" stroke="url(#logo-brand-grad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 0 0 C 15 10, 35 22.5, 35 22.5 C 50 22.5, 57.5 15, 57.5 0 C 57.5 -15, 50 -22.5, 35 -22.5" stroke="url(#logo-brand-grad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" mask="url(#logo-crossover-mask)" />
        <path d="M -57.5 22.5 C -35 22.5, -20 12, 0 0 C 20 -12, 35 -22.5, 35 -22.5 L 65 -22.5" stroke="url(#logo-brand-grad)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <path d="M 15 0 L 45 0" stroke="url(#logo-brand-grad)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>

      <text 
        x="108" 
        y="49" 
        className="font-extrabold tracking-tight fill-foreground font-sans" 
        fontSize="30"
      >
        Pulse<tspan fill="url(#logo-brand-grad)">Flow</tspan>
      </text>
    </svg>
  )
}