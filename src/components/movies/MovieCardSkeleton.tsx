import PosterSkeleton from "./PosterSkeleton";
import TextSkeleton from "./TextSkeleton";

export function MovieCardSkeleton() {
  return (
    <article className="flex flex-col gap-3">
      <PosterSkeleton />
      <div className="space-y-2">
        <TextSkeleton w="w-3/4" />
        <TextSkeleton w="w-full" />
        <TextSkeleton w="w-5/6" />
      </div>
    </article>
  )
}