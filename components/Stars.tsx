export default function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={i <= rounded ? "#f5a623" : "#d9d4cd"} aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      {typeof reviews === "number" && <span className="text-xs text-neutral-500">({reviews})</span>}
    </div>
  );
}
