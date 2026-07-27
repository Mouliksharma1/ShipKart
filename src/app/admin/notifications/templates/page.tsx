import React from 'react';
import { getNotificationTemplatesAction } from '@/app/actions/notifications';
import { TemplateManagerClient } from './TemplateManagerClient';

export const revalidate = 0;

export default async function NotificationTemplatesPage() {
  const templates = await getNotificationTemplatesAction();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <TemplateManagerClient initialTemplates={templates} />
    </div>
  );
}
