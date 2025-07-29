
'use client';
import { PageWrapper } from "@/components/kavexa/page-wrapper";

const RainingHeartsCloud = () => {
    return (
        <div className="relative w-64 h-64">
            <style jsx>{`
                .cloud {
                    animation: pulse 5s ease-in-out infinite;
                }
                .heart-rain-drop {
                    position: absolute;
                    top: 0;
                    animation: fall 4s linear infinite;
                    opacity: 0;
                    color: hsl(var(--primary));
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                @keyframes fall {
                    0% {
                        transform: translateY(40px) translateX(0) scale(0.3);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    25% {
                         transform: translateY(70px) translateX(5px) scale(0.7);
                    }
                     50% {
                         transform: translateY(120px) translateX(-5px) scale(0.6);
                    }
                    75% {
                         transform: translateY(170px) translateX(5px) scale(0.5);
                    }
                    90% {
                         opacity: 1;
                    }
                    100% {
                        transform: translateY(220px) translateX(0) scale(0.4);
                        opacity: 0;
                    }
                }
            `}</style>
            
            <svg viewBox="0 0 200 130" className="cloud w-full h-auto text-red-400 absolute top-0 left-0">
                 <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                        <feOffset dx="2" dy="4" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.5" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'hsl(var(--card))', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: 'hsl(var(--muted))', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <path 
                    d="M 50 100 C 20 100, 10 70, 40 60 C 10 50, 40 20, 70 20 C 90 0, 130 0, 150 20 C 180 20, 200 50, 180 70 C 210 80, 180 100, 160 100 Z"
                    fill="url(#cloud-gradient)" 
                    stroke="hsl(var(--border))" 
                    strokeWidth="1"
                    filter="url(#shadow)"
                />
            </svg>

            {[...Array(15)].map((_, i) => {
                 const style = {
                    left: `${15 + Math.random() * 70}%`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                    animationDelay: `${Math.random() * 4}s`
                };
                return (
                    <div key={i} className="heart-rain-drop" style={style}>
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                       </svg>
                    </div>
                )
            })}
        </div>
    )
}


export default function VotumPage() {
    return (
        <PageWrapper>
            <div className="flex flex-col items-center justify-center h-full min-h-[70vh] text-center gap-8">
                <RainingHeartsCloud />
                <blockquote className="text-xl italic text-muted-foreground max-w-lg pt-12">
                    &ldquo;Votum meum est tibi, pro te omnis, in omne tempus, sine fine.&rdquo;
                </blockquote>
            </div>
        </PageWrapper>
    )
}

