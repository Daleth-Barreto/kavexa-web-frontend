
'use client';
import { PageWrapper } from "@/components/kavexa/page-wrapper";

const RainingHeartsCloud = () => {
    return (
        <svg viewBox="0 0 200 200" className="w-64 h-64 text-red-400">
            <defs>
                <path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z" />
                <symbol id="heart-symbol" viewBox="0 0 100 100">
                    <use href="#heart" fill="currentColor" />
                </symbol>
            </defs>
            
            {/* Cloud */}
            <path d="M 50 80 C 30 80, 20 60, 40 50 C 20 40, 40 20, 60 20 C 80 10, 110 10, 130 30 C 150 20, 170 40, 160 60 C 180 70, 160 90, 140 90 Z" 
                  fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" />

            {/* Raining Hearts */}
            <g className="animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <use 
                        key={i}
                        href="#heart-symbol" 
                        width="12" 
                        height="12"
                        className="opacity-0"
                        style={{
                            animation: `fall 4s linear infinite`,
                            animationDelay: `${i * 0.8}s`
                        }}
                    >
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            values={`${30 + i * 28} 95; ${30 + i * 28} 180`}
                            dur="4s"
                            repeatCount="indefinite"
                            begin={`${i * 0.8}s`}
                        />
                        <animate
                            attributeName="opacity"
                            values="0; 1; 1; 0"
                            dur="4s"
                            repeatCount="indefinite"
                            begin={`${i * 0.8}s`}
                         />

                    </use>
                ))}
            </g>
            <style jsx>{`
                @keyframes fall {
                    to {
                        transform: translateY(180px);
                        opacity: 0;
                    }
                }
            `}</style>
        </svg>
    )
}


export default function VotumPage() {
    return (
        <PageWrapper>
            <div className="flex flex-col items-center justify-center h-full min-h-[70vh] text-center gap-8">
                <RainingHeartsCloud />
                <blockquote className="text-xl italic text-muted-foreground max-w-lg">
                    &ldquo;Votum meum est tibi, pro te omnis, in omne tempus, sine fine.&rdquo;
                </blockquote>
            </div>
        </PageWrapper>
    )
}
