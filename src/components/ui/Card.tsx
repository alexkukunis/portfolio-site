import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`card ${hoverable ? "cursor-pointer hover:bg-[#202020] transition-colors duration-200" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
