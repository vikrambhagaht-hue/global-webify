export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // 1. Remove <script> tags and their contents
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 2. Remove inline event handlers (onload, onerror, onmouseover, etc.)
  // Matches any attribute starting with 'on' followed by =
  clean = clean.replace(/ on\w+="[^"]*"/gi, '');
  clean = clean.replace(/ on\w+='[^']*'/gi, '');
  clean = clean.replace(/ on\w+=[^\s>]+/gi, '');
  
  // 3. Remove javascript: URIs in href and src attributes
  clean = clean.replace(/href="javascript:[^"]*"/gi, 'href="#"');
  clean = clean.replace(/href='javascript:[^']*'/gi, "href='#'");
  clean = clean.replace(/src="javascript:[^"]*"/gi, 'src="#"');
  clean = clean.replace(/src='javascript:[^']*'/gi, "src='#'");

  // 4. Remove object, embed, and iframe tags which can load external active content
  clean = clean.replace(/<(object|embed|iframe)\b[^<]*(?:(?!<\/(object|embed|iframe)>)<[^<]*)*<\/(object|embed|iframe)>/gi, '');

  return clean;
}
