import React from 'react';
import PageHeader from '../../components/dashboard/PageHeader';
import Card from '../../components/ui/Card';

export default function Events() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Events" />
      <Card className="p-8 text-center text-[var(--color-muted-text)]">
        Coming Soon
      </Card>
    </div>
  );
}

