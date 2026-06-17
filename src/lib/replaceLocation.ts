/**
 * Replaces {location} placeholders in text with the given location name.
 * If loc is empty, the placeholder (and surrounding prepositions) are removed cleanly.
 */
export function replaceLocation(text: string, loc: string): string {
  if (!text) return '';
  const spanRegex = /<span class="location-tag"[^>]*>\{\s*location\s*\}<\/span>/gi;
  const rawRegex = /\{\s*location\s*\}/gi;
  
  if (!loc) {
    let cleaned = text;
    // Strip location with prepositions/symbols first
    cleaned = cleaned.replace(/(?:in|at|for|from|within|near| -|-| ,|,| \/|\/|\|)?\s*(?:<span class="location-tag"[^>]*>)?\{\s*location\s*\}(?:<\/span>)?\s*/gi, '');
    // Catch any remaining location tags without prepositions
    cleaned = cleaned.replace(spanRegex, '').replace(rawRegex, '');
    cleaned = cleaned.replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1');
    return cleaned.trim();
  }
  
  let result = text.replace(spanRegex, loc).replace(rawRegex, loc);
  if (loc && loc.toLowerCase() !== 'ranchi') {
    result = result.replace(/ranchi,\s*jharkhand/gi, loc);
    result = result.replace(/ranchi\s*\(\s*jharkhand\s*\)/gi, loc);
    result = result.replace(/ranchi\s+jharkhand/gi, loc);
    result = result.replace(/ranchi/gi, loc);
  }
  return result;
}

/**
 * Strip all HTML tags from a string, returning only text content.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Converts a URL slug into a formatted title (e.g. /web-development -> Web Development).
 */
export function getSlugTitle(slug: string): string {
  if (!slug) return '';
  const clean = slug.replace(/^\//, '').replace(/-/g, ' ');
  return clean
    .split(' ')
    .map(word => {
      const upper = word.toUpperCase();
      if (['SEO', 'AI', 'PPC', 'SMO', 'GEO', 'AEO', 'VPS', 'SSL', 'PR', 'SMS', 'IT', 'B2B'].includes(upper)) {
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

