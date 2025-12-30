import { cn } from "@/lib/utils";
import { getStatusLabel } from "@/lib/api";

interface StatusBadgeProps {
  status: 'open' | 'resolved' | 'flagged';
  size?: 'sm' | 'md';
}

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  const statusClasses = {
    open: 'bg-blue-500/10 text-blue-600 border border-blue-200',
    resolved: 'bg-green-500/10 text-green-600 border border-green-200',
    flagged: 'bg-orange-500/10 text-orange-600 border border-orange-200',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium capitalize',
      sizeClasses[size],
      statusClasses[status]
    )}>
      {getStatusLabel(status)}
    </span>
  );
};
