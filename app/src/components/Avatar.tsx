import { categoryStyle, initials } from '../data/category';
import type { ContactCategory } from '../data/types';

interface AvatarProps {
  name: string;
  category: ContactCategory;
  size?: number;
}

export function Avatar({ name, category, size = 44 }: AvatarProps) {
  const { bg, text } = categoryStyle(category);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        background: bg,
        color: text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-ui)',
        fontWeight: 700,
        fontSize: size * 0.36,
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  );
}
