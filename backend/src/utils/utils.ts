
export function getEnumDescription(e: any): string {
  return Object.keys(e)
    .map((k) => e[k])
    .join('|');
}
