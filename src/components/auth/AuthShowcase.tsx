import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ShowcaseFacts } from "./ShowcaseFacts";
import { ShowcaseQuotes } from "./ShowcaseQuotes";

/**
 * The branded half of every auth screen, laid out like Tapotik's: the logo,
 * one line about the product, a rotating example of what an agent reports
 * back, and product facts along the foot. Hidden below lg, where the form
 * takes the whole screen. Its artwork is `AuthBackdrop`, drawn by the layout
 * behind both halves so the form side can frost over it.
 */
export function AuthShowcase() {
  return (
    <aside className="hidden border-r border-line lg:grid lg:grid-rows-[auto_minmax(0,1fr)_auto]">
      <div className="px-10 pt-8 xl:px-14">
        <Link href="/login" aria-label="Dexisphere Agents">
          <Logo />
        </Link>
      </div>

      {/* The headline and the card are centred as one block between the logo and the facts. */}
      <div className="grid content-center gap-8 px-10 py-10 xl:px-14">
        <h2 className="max-w-[18ch] font-display text-4xl font-semibold leading-[1.1] xl:text-5xl">
          Your agent works. <span className="text-brand">You don&apos;t have to.</span>
        </h2>
        <ShowcaseQuotes />
      </div>

      <div className="px-10 pb-10 xl:px-14">
        <ShowcaseFacts />
      </div>
    </aside>
  );
}
