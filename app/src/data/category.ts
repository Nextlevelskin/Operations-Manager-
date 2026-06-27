import type { ContactCategory } from './types';

export const categoryLabel: Record<ContactCategory, string> = {
  wholesale: 'Wholesale',
  clinical: 'Clinical',
  partnership: 'Partnership',
  massage: 'Massage',
};

export function categoryStyle(category: ContactCategory) {
  return {
    bg: `var(--cat-${category}-bg)`,
    text: `var(--cat-${category}-text)`,
    dot: `var(--cat-${category}-dot)`,
  };
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}
