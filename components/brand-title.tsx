// Titre de l'app : « Wish » droit en prune, « list » en italique couleur accent
export function BrandTitle({ className = "" }: { className?: string }) {
  return (
    <h1 className={`font-serif font-bold leading-none tracking-tight text-plum ${className}`}>
      Wish<em className="-ml-0.5 font-medium text-accent">list</em>
    </h1>
  );
}
