import React from 'react';
import Button from './Button';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-background)] p-4 text-center">
      <h2 className="text-2xl font-bold text-[var(--color-danger)] mb-4">Something went wrong</h2>
      <p className="text-[var(--color-text)] mb-6 bg-[var(--color-surface)] p-4 rounded-md border border-[var(--color-border)] shadow-sm font-mono text-sm">
        {error?.message || 'An unknown error occurred'}
      </p>
      <div className="flex gap-4">
        <Button onClick={resetErrorBoundary} variant="primary">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go Home
        </Button>
      </div>
    </div>
  );
}
