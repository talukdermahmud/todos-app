"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans px-4">
      <main className="flex flex-col items-center text-center gap-6 max-w-md">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black">
          Page Not Found
        </h1>
        <p className="text-lg leading-8 text-zinc-600">
          The page you&apos;re looking for doesn&apos;t exist. You can try going
          back to the home page.
        </p>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            onClick={() => router.push("/")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-[158px]"
          >
            Go Home
          </button>
        </div>
      </main>
    </div>
  );
}
