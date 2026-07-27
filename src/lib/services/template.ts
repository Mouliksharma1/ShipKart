import { EVENT_REGISTRY } from './notification-events';
import { NotificationEvent } from '@prisma/client';

export interface RenderTemplateOptions {
  messageTemplate: string;
  variables: Record<string, string | number | undefined | null>;
  event?: NotificationEvent;
  title?: string | null;
}

export interface RenderResult {
  title: string | null;
  message: string;
  missingVariables: string[];
  isValid: boolean;
}

/**
 * Parses and renders template string replacing {{variableName}} placeholders.
 * Performs validation against required variables if event is supplied.
 */
export function renderTemplate(options: RenderTemplateOptions): RenderResult {
  const { messageTemplate, variables, event, title } = options;
  const missingVariables: string[] = [];

  // Check required variables if event is known
  if (event && EVENT_REGISTRY[event]) {
    const required = EVENT_REGISTRY[event].requiredVariables;
    for (const reqVar of required) {
      if (variables[reqVar] === undefined || variables[reqVar] === null || variables[reqVar] === '') {
        missingVariables.push(reqVar);
      }
    }
  }

  // Find all placeholders in template
  const placeholderRegex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  let match;
  while ((match = placeholderRegex.exec(messageTemplate)) !== null) {
    const varName = match[1];
    if (variables[varName] === undefined || variables[varName] === null) {
      if (!missingVariables.includes(varName)) {
        missingVariables.push(varName);
      }
    }
  }

  // Replace placeholders with values (or empty fallback)
  let renderedMessage = messageTemplate.replace(placeholderRegex, (_, key) => {
    const val = variables[key];
    return val !== undefined && val !== null ? String(val) : `[${key}]`;
  });

  let renderedTitle: string | null = null;
  if (title) {
    renderedTitle = title.replace(placeholderRegex, (_, key) => {
      const val = variables[key];
      return val !== undefined && val !== null ? String(val) : `[${key}]`;
    });
  }

  return {
    title: renderedTitle,
    message: renderedMessage,
    missingVariables,
    isValid: missingVariables.length === 0,
  };
}
