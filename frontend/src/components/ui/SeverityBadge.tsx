import { cn } from "@/lib/utils";
import { getSeverityLevel } from "@/lib/api";

interface SeverityBadgeProps {
  severity: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SeverityBadge = ({ severity, showValue = true, size = 'md' }: SeverityBadgeProps) => {
  const level = getSeverityLevel(severity);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  
  const levelClasses = {
    high: 'bg-red-500/10 text-red-600 border border-red-200',
    medium: 'bg-orange-500/10 text-orange-600 border border-orange-200',
    low: 'bg-green-500/10 text-green-600 border border-green-200',
  };
  
  const levelLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      sizeClasses[size],
      levelClasses[level]
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        level === 'high' && 'bg-red-500',
        level === 'medium' && 'bg-orange-500',
        level === 'low' && 'bg-green-500'
      )} />
      {levelLabels[level]}
      {showValue && <span className="opacity-70">({severity})</span>}
    </span>
  );
};
