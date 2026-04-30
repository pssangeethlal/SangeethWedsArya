// Auto-import all images from src/images/
// Add or remove photos from src/images/ and they'll appear automatically.

const imageModules = import.meta.glob('../images/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const allImages: string[] = Object.values(imageModules)
  .filter((src) => !/\.heic$/i.test(src))

// Specific photos — fallback to first available image if not found
const find = (name: string) =>
  Object.entries(imageModules).find(([k]) => k.includes(name))?.[1] ?? allImages[0]

export const groomPhoto = find('groom.')
export const groomPhoto1 = find('groom1')
export const bridePhoto = find('bride.')
export const heroPhoto = find('groomandbride')
