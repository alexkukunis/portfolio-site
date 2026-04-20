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
      className={`
        bg-white dark:bg-slate-800 rounded-2xl shadow-sm
        ${hoverable ? "cursor-pointer hover:shadow-lg transition-shadow duration-300" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
