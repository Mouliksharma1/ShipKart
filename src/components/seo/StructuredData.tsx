import React from "react";

interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders a JSON-LD `<script>` tag for structured data.
 * Accepts a single schema object or an array of schemas.
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data)
    ? data.map((d) => JSON.stringify(d)).join(",")
    : JSON.stringify(data);

  const html = Array.isArray(data) ? `[${jsonLd}]` : jsonLd;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
