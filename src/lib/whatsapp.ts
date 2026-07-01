export function formatWhatsAppNumber(whatsapp?: string): string {
  const raw = (whatsapp || "917563901100").replace(/\D/g, "");
  if (raw.length === 10) return `91${raw}`;
  return raw;
}

export function getWhatsAppUrl(whatsapp?: string, message?: string): string {
  const cleanNumber = formatWhatsAppNumber(whatsapp);
  const baseUrl = `https://wa.me/${cleanNumber}`;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
}
