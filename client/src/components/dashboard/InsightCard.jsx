import React from 'react';
import Card from '../ui/Card';
import clsx from 'clsx';
import { Lightbulb } from 'lucide-react';

export default function InsightCard({ title, description, type = 'info', className }) {
  const types = {
    info: "bg-white/60 text-[var(--color-primary)]",
    success: "bg-white/60 text-[var(--color-success)]",
    warning: "bg-white/60 text-[var(--color-warning)]"
  };

  return (
    <Card 
      className={clsx("p-5 flex gap-4 items-start !bg-transparent", className)}
      style={{ background: 'linear-gradient(135deg, #FFE0CC, #FFF6D9, #E0F2FE)' }}
    >
      <div className={clsx("p-2 rounded-full shrink-0 shadow-sm", types[type])}>
        <Lightbulb size={20} />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}
