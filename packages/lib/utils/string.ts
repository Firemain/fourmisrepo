export function pluralize(count: number, singular: string, plural?: string): string {
  if (count <= 1) return singular;
  return plural || `${singular}s`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
