"use client";

import { ReactNode } from 'react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  tips?: { label: string; items: string[] };
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  tips 
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center space-y-4 max-w-md">
    <div className="rounded-full bg-primary/10 p-6 text-primary">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold">{title}</h3>
    <p className="text-muted-foreground text-center">{description}</p>
    {action}
    
    {tips && (
      <div className="text-sm text-muted-foreground mt-6 border-t border-border pt-4 w-full text-center">
        <p className="mb-2">{tips.label}</p>
        <ul className="text-left list-disc pl-4 space-y-2 text-xs">
          {tips.items.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default EmptyState;
