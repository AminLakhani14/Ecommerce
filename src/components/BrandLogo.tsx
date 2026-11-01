const BrandLogo = ({ className = 'brand-mark' }: { className?: string }) => (
  <svg className={className} viewBox='0 0 64 64' aria-hidden='true' focusable='false'>
    <rect width='64' height='64' rx='14' fill='#20392b' />
    <text x='32' y='44' textAnchor='middle' fontFamily="Georgia, 'Times New Roman', serif" fontSize='38' fontStyle='italic' fill='#ffffff'>S</text>
    <rect x='18' y='50' width='28' height='3' rx='1.5' fill='#d5ed99' />
  </svg>
);

export default BrandLogo;
