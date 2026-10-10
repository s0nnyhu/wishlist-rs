function Block({ className }: { className: string }) {
  return <div className={`rounded bg-line/70 ${className}`} />;
}

export function WishListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Chargement" className="animate-pulse">
      <div className="flex justify-between">
        <Block className="h-3.5 w-28" />
        <Block className="h-3.5 w-16" />
      </div>
      <Block className="mb-2 mt-4 h-11 w-3/5" />
      <Block className="mb-5 h-4 w-4/5" />
      <div className="mb-[18px] flex gap-2">
        <Block className="h-9 w-20 rounded-full" />
        <Block className="h-9 w-24 rounded-full" />
        <Block className="h-9 w-24 rounded-full" />
      </div>
      {[0, 1, 2].map((index) => (
        <div key={index} className="mb-3 flex gap-3.5 rounded-2xl border border-line bg-white p-4">
          <Block className="size-[72px] shrink-0 rounded-xl" />
          <div className="flex-1">
            <Block className="mb-2 h-5 w-3/4" />
            <Block className="mb-3 h-4 w-1/2" />
            <Block className="h-3.5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WishFormSkeleton() {
  return (
    <div aria-busy="true" aria-label="Chargement" className="animate-pulse">
      <div className="flex h-11 items-center justify-between">
        <Block className="h-4 w-16" />
        <Block className="h-3.5 w-20" />
      </div>
      <Block className="mb-[22px] mt-3.5 h-10 w-3/4" />
      <Block className="mb-1.5 h-3.5 w-16" />
      <Block className="mb-3.5 h-[72px] w-full rounded-xl" />
      {[0, 1].map((index) => (
        <div key={index}>
          <Block className="mb-1.5 h-3.5 w-20" />
          <Block className="mb-3.5 h-12 w-full rounded-xl" />
        </div>
      ))}
      <Block className="mb-1.5 h-3.5 w-24" />
      <Block className="h-[84px] w-full rounded-xl" />
    </div>
  );
}
