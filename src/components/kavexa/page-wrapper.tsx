'use client';

import { cn } from "@/lib/utils";

export const PageWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("animate-in fade-in-0 duration-500", className)}>
      {children}
    </div>
  );
};
