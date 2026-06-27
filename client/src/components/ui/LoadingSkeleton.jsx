import React from 'react';
import clsx from 'clsx';

export default function LoadingSkeleton({ className, type = 'rect', ...props }) {
  const BaseSkeleton = ({ className, ...rest }) => (
    <div className={clsx("animate-pulse bg-gray-200 rounded-[var(--radius-sm)]", className)} {...rest} />
  );

  if (type === 'card') {
    return (
      <div className={clsx("p-6 bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] w-full flex flex-col gap-4", className)} {...props}>
        <div className="flex justify-between items-start">
          <div>
            <BaseSkeleton className="h-4 w-24 mb-2" />
            <BaseSkeleton className="h-8 w-32" />
          </div>
          <BaseSkeleton className="h-10 w-10 rounded-[var(--radius-md)]" />
        </div>
        <BaseSkeleton className="h-6 w-full mt-auto" />
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={clsx("w-full h-full flex flex-col gap-4 min-h-[250px]", className)} {...props}>
        <BaseSkeleton className="w-full flex-1" />
        <div className="flex justify-between gap-4">
          <BaseSkeleton className="h-4 w-1/4" />
          <BaseSkeleton className="h-4 w-1/4" />
          <BaseSkeleton className="h-4 w-1/4" />
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={clsx("w-full flex flex-col gap-3", className)} {...props}>
        <div className="flex gap-4 mb-2">
          <BaseSkeleton className="h-6 w-1/3" />
          <BaseSkeleton className="h-6 w-1/4" />
          <BaseSkeleton className="h-6 w-1/4" />
          <BaseSkeleton className="h-6 w-1/6" />
        </div>
        {[...Array(5)].map((_, i) => (
          <BaseSkeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (type === 'header') {
    return (
      <div className={clsx("w-full flex justify-between items-center mb-6", className)} {...props}>
        <div className="flex flex-col gap-2">
          <BaseSkeleton className="h-8 w-64" />
          <BaseSkeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <BaseSkeleton className="h-10 w-24" />
          <BaseSkeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={clsx(
        "animate-pulse bg-gray-200",
        type === 'circle' ? "rounded-full" : "rounded-[var(--radius-sm)]",
        className
      )}
      {...props}
    />
  );
}
