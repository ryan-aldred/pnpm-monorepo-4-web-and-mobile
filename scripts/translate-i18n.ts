#!/usr/bin/env npx tsx
/**
 * AI-powered translation script for i18n
 *
 * Reads .po files, finds untranslated strings, and uses Claude to translate them.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/translate-i18n.ts
 *
 * Or with a different provider:
 *   OPENAI_API_KEY=sk-... npx tsx scripts/translate-i18n.ts --provider openai
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// Configuration
const LOCALES_TO_TRANSLATE = ['es', 'fr']; // Don't translate source locale (en)
const PO_FILE_PATHS = [
  'apps/web/app/locales/{locale}/messages.po',
  'packages/i18n/src/locales/{locale}/messages.po',
];

interface POEntry {
  msgid: string;
  msgstr: string;
  comments: string[];
  lineNumber: number;
}

interface POFile {
  path: string;
  header: string;
  entries: POEntry[];
}

// Language names for prompts
const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Simplified)',
};

/**
 * Parse a .po file into structured entries
 */
function parsePOFile(filePath: string): POFile | null {
  if (!fs.existsSync(filePath)) {
    console.log(`  File not found: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const entries: POEntry[] = [];
  let header = '';
  let currentEntry: Partial<POEntry> | null = null;
  let inHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Header ends at first empty line after msgstr
    if (inHeader && line === '' && header.includes('msgstr')) {
      inHeader = false;
      continue;
    }

    if (inHeader) {
      header += line + '\n';
      continue;
    }

    // Skip empty lines between entries
    if (line === '') {
      if (currentEntry?.msgid !== undefined) {
        entries.push(currentEntry as POEntry);
        currentEntry = null;
      }
      continue;
    }

    // Start new entry
    if (!currentEntry) {
      currentEntry = { comments: [], lineNumber: i + 1 };
    }

    // Comments
    if (line.startsWith('#')) {
      currentEntry.comments = currentEntry.comments || [];
      currentEntry.comments.push(line);
      continue;
    }

    // msgid
    if (line.startsWith('msgid ')) {
      currentEntry.msgid = extractQuotedString(line.slice(6));
      continue;
    }

    // msgstr
    if (line.startsWith('msgstr ')) {
      currentEntry.msgstr = extractQuotedString(line.slice(7));
      continue;
    }

    // Continuation of multi-line string
    if (line.startsWith('"') && currentEntry) {
      const continued = extractQuotedString(line);
      if (currentEntry.msgstr !== undefined) {
        currentEntry.msgstr += continued;
      } else if (currentEntry.msgid !== undefined) {
        currentEntry.msgid += continued;
      }
    }
  }

  // Don't forget last entry
  if (currentEntry?.msgid !== undefined) {
    entries.push(currentEntry as POEntry);
  }

  return { path: filePath, header, entries };
}

/**
 * Extract string from PO quoted format
 */
function extractQuotedString(s: string): string {
  const match = s.match(/^"(.*)"$/);
  if (!match) return s;
  return match[1]
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

/**
 * Convert string to PO quoted format
 */
function toPOString(s: string): string {
  return (
    '"' +
    s
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t') +
    '"'
  );
}

/**
 * Write a PO file back to disk
 */
function writePOFile(poFile: POFile): void {
  let content = poFile.header;

  for (const entry of poFile.entries) {
    content += '\n';
    for (const comment of entry.comments) {
      content += comment + '\n';
    }
    content += `msgid ${toPOString(entry.msgid)}\n`;
    content += `msgstr ${toPOString(entry.msgstr)}\n`;
  }

  fs.writeFileSync(poFile.path, content);
}

/**
 * Translate strings using Claude
 */
async function translateWithClaude(
  strings: string[],
  targetLanguage: string
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  const client = new Anthropic({ apiKey });

  const languageName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

  const prompt = `You are a professional translator. Translate the following UI strings from English to ${languageName}.

Rules:
- Maintain the same tone and formality level
- Keep any placeholders like {name} or %s unchanged
- Keep technical terms that shouldn't be translated (e.g., brand names)
- Return ONLY the translations, one per line, in the same order as the input
- Do not include numbering, quotes, or any other formatting

Strings to translate:
${strings.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Translations (one per line, no numbers):`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '';
  const translations = text
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (translations.length !== strings.length) {
    console.warn(
      `Warning: Expected ${strings.length} translations, got ${translations.length}`
    );
    // Pad with empty strings if needed
    while (translations.length < strings.length) {
      translations.push('');
    }
  }

  return translations;
}

/**
 * Main function
 */
async function main() {
  console.log('🌍 AI Translation Script\n');

  let totalTranslated = 0;
  let totalSkipped = 0;

  for (const locale of LOCALES_TO_TRANSLATE) {
    console.log(`\n📝 Processing locale: ${locale}`);

    for (const pathTemplate of PO_FILE_PATHS) {
      const filePath = path.resolve(
        ROOT_DIR,
        pathTemplate.replace('{locale}', locale)
      );
      console.log(`\n  File: ${path.relative(ROOT_DIR, filePath)}`);

      const poFile = parsePOFile(filePath);
      if (!poFile) continue;

      // Find untranslated entries (empty msgstr)
      const untranslated = poFile.entries.filter(
        (e) => e.msgid && (!e.msgstr || e.msgstr === e.msgid)
      );

      if (untranslated.length === 0) {
        console.log('  ✓ All strings already translated');
        totalSkipped += poFile.entries.length;
        continue;
      }

      console.log(`  Found ${untranslated.length} untranslated strings`);

      // Translate in batches of 20
      const BATCH_SIZE = 20;
      for (let i = 0; i < untranslated.length; i += BATCH_SIZE) {
        const batch = untranslated.slice(i, i + BATCH_SIZE);
        const strings = batch.map((e) => e.msgid);

        console.log(
          `  Translating batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(untranslated.length / BATCH_SIZE)}...`
        );

        try {
          const translations = await translateWithClaude(strings, locale);

          // Update entries with translations
          for (let j = 0; j < batch.length; j++) {
            const entry = batch[j];
            const translation = translations[j];
            if (translation) {
              entry.msgstr = translation;
              totalTranslated++;
            }
          }
        } catch (error) {
          console.error(`  Error translating batch: ${error}`);
        }
      }

      // Write updated PO file
      writePOFile(poFile);
      console.log(`  ✓ Updated ${filePath}`);
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Translated: ${totalTranslated} strings`);
  console.log(`   Already translated: ${totalSkipped} strings`);

  // Remind to compile
  console.log(`\n📦 Run 'pnpm i18n:compile' to compile the translations`);
}

main().catch(console.error);
