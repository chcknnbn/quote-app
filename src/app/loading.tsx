export default function Loading() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-surface">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block w-1.5 h-1.5 rounded-full bg-gold/40 animate-glow-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  )
}
