import type { JsonLdSchema } from '~/lib/meta';

interface JsonLdProps {
  schema: JsonLdSchema | JsonLdSchema[];
}

/**
 * Render JSON-LD structured data as script tags
 * @param schema - Single schema or array of schemas
 */
export function JsonLd({ schema }: JsonLdProps) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((s, index) => (
        <script
          key={`${s['@type']}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(s),
          }}
        />
      ))}
    </>
  );
}
