import React from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

export default function MetricBadge({ value, variant = 'neutral', className }) {
  const variants = {
    success: { classes: "bg-[var(--color-success)]/10 text-[var(--color-success)]", icon: TrendingUp },
    danger: { classes: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]", icon: TrendingDown },
    warning: { classes: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]", icon: AlertCircle },
    neutral: { classes: "bg-gray-100 text-[var(--color-muted-text)]", icon: Minus }
  };
  const Icon = variants[variant]?.icon || variants.neutral.icon;

  return (
    <span className={clsx("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold", variants[variant]?.classes || variants.neutral.classes, className)}>
      <Icon size={14} />
      {value}
    </span>
  );
}
