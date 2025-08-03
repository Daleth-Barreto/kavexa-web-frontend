import { cn } from "@/lib/utils"

export function AbstractDashboard({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 0.1 }} />
        </linearGradient>
        <style>
        {`
          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes fade-in-scale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
           @keyframes pop-in {
            from { opacity: 0; transform: scale(0); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes rise {
            from { transform: scaleY(0); }
            to { transform: scaleY(1); }
          }

          .draw-chart-line {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw 2.5s ease-out 0.5s forwards;
          }
          .draw-chart-line-2 {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw 2.5s ease-out 1s forwards;
          }
          .chart-area, .side-cards {
             animation: fade-in-scale 1s ease-out forwards;
             transform-origin: bottom center;
          }
          .chart-point {
            opacity: 0;
            animation: pop-in 0.5s ease-out forwards;
          }
          .bar {
            transform-origin: bottom;
            animation: rise 1s ease-out forwards;
          }
        `}
      </style>
      </defs>

      {/* Main card */}
      <rect width="400" height="300" rx="12" fill="hsl(var(--card))" />
      <rect width="400" height="300" rx="12" fill="url(#grad1)" />
      <rect width="400" height="300" rx="12" fill="transparent" stroke="hsl(var(--border))" strokeWidth="1" />

      {/* Header */}
      <rect x="20" y="20" width="100" height="8" rx="4" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />
      <circle cx="370" cy="24" r="8" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />

      {/* Main chart area */}
      <g className="chart-area" transform="translate(20, 50)">
        {/* Axes */}
        <line x1="0" y1="150" x2="360" y2="150" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="0" y1="0" x2="0" y2="150" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* Lines and fills */}
        <path className="draw-chart-line" d="M 0 130 C 40 110, 80 60, 120 70 S 200 120, 240 100 S 320 40, 360 50" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        <path d="M 0 150 L 0 130 C 40 110, 80 60, 120 70 S 200 120, 240 100 S 320 40, 360 50 L 360 150 Z" fill="hsl(var(--primary))" fillOpacity="0.1" />
        
        <path className="draw-chart-line-2" d="M 0 140 C 30 150, 70 110, 110 120 S 190 170, 230 150 S 310 90, 360 100" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" />
        <path d="M 0 150 L 0 140 C 30 150, 70 110, 110 120 S 190 170, 230 150 S 310 90, 360 100 L 360 150 Z" fill="hsl(var(--accent))" fillOpacity="0.1" />

        {/* End points */}
        <circle className="chart-point" cx="360" cy="50" r="3" fill="hsl(var(--primary))" style={{ animationDelay: '3s' }} />
        <circle className="chart-point" cx="360" cy="100" r="3" fill="hsl(var(--accent))" style={{ animationDelay: '3.5s' }}/>
      </g>
      
      {/* Side cards */}
      <g className="side-cards">
        <g transform="translate(20, 220)">
            <rect width="110" height="60" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <rect x="10" y="10" width="50" height="6" rx="3" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />
            <rect className="bar" x="15" y="30" width="10" height="20" rx="2" fill="hsl(var(--primary))" fillOpacity="0.5" style={{ animationDelay: '1.2s' }} />
            <rect className="bar" x="30" y="40" width="10" height="10" rx="2" fill="hsl(var(--primary))" fillOpacity="0.5" style={{ animationDelay: '1.4s' }} />
            <rect className="bar" x="45" y="25" width="10" height="25" rx="2" fill="hsl(var(--primary))" fillOpacity="0.5" style={{ animationDelay: '1.6s' }} />
        </g>
        <g transform="translate(145, 220)">
            <rect width="110" height="60" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <rect x="10" y="10" width="50" height="6" rx="3" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />
            <rect className="bar" x="15" y="35" width="10" height="15" rx="2" fill="hsl(var(--accent))" fillOpacity="0.5" style={{ animationDelay: '1.3s' }} />
            <rect className="bar" x="30" y="25" width="10" height="25" rx="2" fill="hsl(var(--accent))" fillOpacity="0.5" style={{ animationDelay: '1.5s' }} />
            <rect className="bar" x="45" y="45" width="10" height="5" rx="2" fill="hsl(var(--accent))" fillOpacity="0.5" style={{ animationDelay: '1.7s' }} />
        </g>
        <g transform="translate(270, 220)">
            <rect width="110" height="60" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <rect x="10" y="10" width="50" height="6" rx="3" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />
            <rect x="10" y="25" width="90" height="10" rx="5" fill="hsl(var(--primary))" fillOpacity="0.3" />
        </g>
      </g>

    </svg>
  );
}
