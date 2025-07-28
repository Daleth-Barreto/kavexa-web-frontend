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
      </defs>

      {/* Main card */}
      <rect width="400" height="300" rx="12" fill="hsl(var(--card))" />
      <rect width="400" height="300" rx="12" fill="url(#grad1)" />
      <rect width="400" height="300" rx="12" fill="transparent" stroke="hsl(var(--border))" strokeWidth="1" />

      {/* Header */}
      <rect x="20" y="20" width="100" height="8" rx="4" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />
      <circle cx="370" cy="24" r="8" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />

      {/* Main chart area */}
      <g transform="translate(20, 50)">
        <path d="M 0 150 C 40 130, 80 80, 120 90 S 200 140, 240 120 S 320 60, 360 70" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        <path d="M 0 150 L 0 140 C 40 120, 80 70, 120 80 S 200 130, 240 110 S 320 50, 360 60 L 360 150 Z" fill="hsl(var(--primary))" fillOpacity="0.1" />
        
        <path d="M 0 150 C 30 160, 70 120, 110 130 S 190 180, 230 160 S 310 100, 360 110" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" />
        <path d="M 0 150 L 0 150 C 30 160, 70 120, 110 130 S 190 180, 230 160 S 310 100, 360 110 L 360 150 Z" fill="hsl(var(--accent))" fillOpacity="0.1" />
      </g>
      
      {/* Chart axes */}
      <line x1="20" y1="200" x2="380" y2="200" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="20" y1="50" x2="20" y2="200" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />

      {/* Side cards */}
      <g transform="translate(20, 220)">
        <rect width="110" height="60" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
        <rect x="10" y="10" width="50" height="6" rx="3" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />
        <rect x="10" y="25" width="80" height="10" rx="5" fill="hsl(var(--primary))" fillOpacity="0.5" />
      </g>
      <g transform="translate(145, 220)">
        <rect width="110" height="60" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
        <rect x="10" y="10" width="50" height="6" rx="3" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />
        <rect x="10" y="25" width="60" height="10" rx="5" fill="hsl(var(--accent))" fillOpacity="0.5" />
      </g>
      <g transform="translate(270, 220)">
        <rect width="110" height="60" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
        <rect x="10" y="10" width="50" height="6" rx="3" fill="hsl(var(--muted-foreground))" fillOpacity="0.2" />
        <rect x="10" y="25" width="90" height="10" rx="5" fill="hsl(var(--primary))" fillOpacity="0.3" />
      </g>

    </svg>
  );
}
