import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ShowcaseQuotes } from "./ShowcaseQuotes";

/**
 * The branded half of every auth screen: the logo, one line about the product,
 * and a rotating example of what an agent reports back. Hidden below lg, where
 * the form takes the whole screen.
 */
export function AuthShowcase() {
  return (
    <aside className="relative isolate hidden overflow-hidden border-r border-line lg:grid lg:grid-rows-[auto_minmax(0,1fr)]">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-ground" />
        <div className="absolute inset-[-15%] bg-aurora opacity-95 blur-3xl animate-aurora dark:opacity-70" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="px-10 pt-8 xl:px-14">
        <Link href="/login" aria-label="Dexisphere Agents">
          <Logo />
        </Link>
      </div>

      {/* The headline and the card are centred as one block between the logo and the foot. */}
      <div className="grid content-center gap-12 px-10 pb-14 xl:px-14">
        <h2 className="max-w-[15ch] font-display text-5xl font-semibold leading-[1.05] xl:text-6xl">
          Your agent works.
          <br />
          <span className="text-brand">You don&apos;t have to.</span>
        </h2>
        <ShowcaseQuotes />
      </div>
    </aside>
  );
}
