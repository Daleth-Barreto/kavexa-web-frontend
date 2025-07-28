import { cn } from "@/lib/utils";

type KavexaLogoIconProps = {
  className?: string;
};

export function KavexaLogoIcon({ className }: KavexaLogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-zap", className)}
    >
      <path d="M4 12 L12 2 L14.5 10 L20 11 L12 22 L9.5 14 Z" />
    </svg>
  );
}
