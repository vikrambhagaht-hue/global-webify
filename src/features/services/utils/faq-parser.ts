import { replaceLocation } from '@/lib/replaceLocation';

export interface FAQItem {
  question: string;
  answer: string;
}

export function parseFaqs(content: string, locationName: string = ""): { faqs: FAQItem[], cleanedContent: string } {
  let faqs: FAQItem[] = [];
  let cleanedContent = content ?? '';

  if (cleanedContent) {
    const matches = Array.from(cleanedContent.matchAll(/<!-- FAQ_DATA: (.*?) -->/g));
    if (matches && matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      try {
        const rawFaqs = JSON.parse(lastMatch[1]);
        if (Array.isArray(rawFaqs)) {
          faqs = rawFaqs
            .map((f: any) => ({
              question: replaceLocation(f.question || '', locationName),
              answer: replaceLocation(f.answer || '', locationName),
            }))
            .filter((f) => f.question.trim() !== '' && f.answer.trim() !== '');
        }
      } catch (e) {
        console.error("Failed to parse FAQ data", e);
      }
    }
    cleanedContent = cleanedContent.replace(/<!-- FAQ_DATA: (.*?) -->/g, '');
  }

  return { faqs, cleanedContent };
}
