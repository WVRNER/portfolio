export function FeaturedStarIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={`${className} inline-block shrink-0`}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Featured Story"
    >
      <path
        d="M8 0L9.79611 6.20389L16 8L9.79611 9.79611L8 16L6.20389 9.79611L0 8L6.20389 6.20389L8 0Z"
        fill="url(#featured-star-gradient)"
      />
      <defs>
        <linearGradient id="featured-star-gradient" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
    </svg>
  );
}
