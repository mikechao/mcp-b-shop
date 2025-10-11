export function formatCategoryLabel(value: string): string {
  return value
    .split(' ')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}
