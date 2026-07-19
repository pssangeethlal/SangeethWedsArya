// Auto-import all images from src/images/
// Add or remove photos from src/images/ and they'll appear automatically.

// Extensions are listed explicitly rather than globbing '*'. A bare glob
// imports every file in the folder, so formats browsers can't render (HEIC)
// still get bundled and downloaded before being filtered out at runtime.
const imageModules = import.meta.glob('../images/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const allImages: string[] = Object.values(imageModules)

// Specific photos — fallback to first available image if not found
const find = (name: string) =>
  Object.entries(imageModules).find(([k]) => k.includes(name))?.[1] ?? allImages[0]

export const groomPhoto = find('groom.')
export const groomPhoto1 = find('groom1')
export const bridePhoto = find('bride.')
// Hero + WhatsApp share card both use this shot (public/og-image.jpg is
// cropped from the same file), so the link preview matches the landing view.
export const heroPhoto = find('gandb')
