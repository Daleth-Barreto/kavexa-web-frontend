'use client';

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const PageWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname + Math.random());
  }, [pathname]);

  return (
    <div key={key} className={cn("animate-in fade-in-0 duration-500", className)}>
      {children}
    </div>
  );
};
