import Link from "next/link";

export default function ProblemNotFound() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-rail uppercase">
        Problem not found
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-track-mist">
        It may have been deleted, or it isn&apos;t in your library.
      </p>
      <Link
        href="/problems"
        className="w-fit font-display text-sm font-bold tracking-[0.12em] text-rail uppercase underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lane/60"
      >
        Back to problems
      </Link>
    </div>
  );
}
