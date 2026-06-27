import { categoryLabel, categoryStyle } from '../data/category';
import type { ContactCategory } from '../data/types';

export function CategoryChip({ category }: { category: ContactCategory }) {
  const { bg, text } = categoryStyle(category);
  return (
    <span
      style={{
        background: bg,
        color: text,
        borderRadius: 'var(--radius-chip)',
        padding: '4px 10px',
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {categoryLabel[category]}
    </span>
  );
}
