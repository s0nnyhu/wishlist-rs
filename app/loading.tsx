export default function Loading() {
  return (
    <div aria-busy="true" className="animate-pulse">
      <div className="ml-auto h-3.5 w-20 rounded bg-line" />
      <div className="mb-2 mt-5 h-12 w-3/4 rounded bg-line" />
      <div className="mb-5 h-4 w-2/3 rounded bg-line" />
      <div className="mb-5 h-10 w-full rounded-full bg-line" />
      <div className="mb-3 h-24 rounded-2xl bg-line" />
      <div className="mb-3 h-24 rounded-2xl bg-line" />
    </div>
  );
}
