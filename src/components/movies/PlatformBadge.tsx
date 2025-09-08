export default function PlatformBadge({ name, logoUrl }: { name: string; logoUrl: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-white/10 px-2 py-0.5 text-xs text-white/90">
      <img
        src={logoUrl}
        alt={name}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png'
        }}
        className="h-3 rounded-sm object-contain"
        loading="lazy"
      />
      {name}
    </span>
  )
}