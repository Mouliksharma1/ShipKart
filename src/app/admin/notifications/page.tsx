import React from 'react';
import { getNotificationMetricsAction, getNotificationQueueAction } from '@/app/actions/notifications';
import { AdminNotificationClient } from './AdminNotificationClient';

export const revalidate = 0;

export default async function AdminNotificationsPage() {
  const [metrics, queueData] = await Promise.all([
    getNotificationMetricsAction(),
    getNotificationQueueAction({ page: 1, pageSize: 20 }),
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminNotificationClient initialMetrics={metrics} initialQueueData={queueData} />
    </div>
  );
}
