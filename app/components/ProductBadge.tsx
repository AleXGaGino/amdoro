interface ProductBadgeProps {
  type: 'new' | 'hotdeal' | 'limited' | 'trending' | 'bestseller' | 'discount';
  value?: string | number;
}

export default function ProductBadge({ type, value }: ProductBadgeProps) {
  const badges = {
    new: {
      className: 'bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg',
      icon: '✨',
      label: 'NOU'
    },
    hotdeal: {
      className: 'bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse shadow-lg shadow-red-500/50',
      icon: '🔥',
      label: 'HOT DEAL'
    },
    limited: {
      className: 'bg-orange-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg',
      icon: '⚡',
      label: 'STOC LIMITAT'
    },
    trending: {
      className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg',
      icon: '📈',
      label: 'TRENDING'
    },
    bestseller: {
      className: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs px-2.5 py-1 rounded-full font-bold shadow-lg',
      icon: '👑',
      label: 'BESTSELLER'
    },
    discount: {
      className: 'bg-green-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg',
      icon: '💰',
      label: value ? `-${value}%` : 'REDUCERE'
    }
  };

  const badge = badges[type];

  return (
    <span className={badge.className}>
      {badge.icon} {badge.label}
    </span>
  );
}
