import { cn } from "@/lib/utils";
import { Circle, Trash2, TreeDeciduous } from "lucide-react";
import { getIssueTypeLabel } from "@/lib/api";

interface IssueTypeIconProps {
  type: 'pothole' | 'garbage' | 'tree_fall';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const IssueTypeIcon = ({ type, showLabel = true, size = 'md' }: IssueTypeIconProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const icons = {
    pothole: Circle,
    garbage: Trash2,
    tree_fall: TreeDeciduous,
  };

  const colors = {
    pothole: 'text-slate-600',
    garbage: 'text-amber-600',
    tree_fall: 'text-emerald-600',
  };

  const Icon = icons[type];

  return (
    <span className={cn('inline-flex items-center gap-1.5', colors[type])}>
      <Icon className={sizeClasses[size]} />
      {showLabel && (
        <span className={cn('font-medium', textSizes[size])}>
          {getIssueTypeLabel(type)}
        </span>
      )}
    </span>
  );
};
