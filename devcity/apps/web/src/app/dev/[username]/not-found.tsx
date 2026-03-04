import Link from "next/link";

export default function DevNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-shadow-pixel text-4xl font-bold text-danger">404</h1>
      <p className="text-lg text-muted">
        Developer not found. No building exists at this address.
      </p>
      <Link
        href="/"
        className="btn-press border-[3px] border-border bg-bg-raised px-6 py-3 text-sm font-bold text-accent hover:bg-bg-card"
      >
        BACK TO CITY
      </Link>
    </main>
  );
}
