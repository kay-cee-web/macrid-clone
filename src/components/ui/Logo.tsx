import Image from "next/image";
import { cn } from "@/lib/cn";

const MARK = "/image/dexisphere-icon100.png";
const WORDMARK_ON_LIGHT = "/image/dexisphere-logo-dark.png";
const WORDMARK_ON_DARK = "/image/dexisphere-logo-white.png";

/** The brand mark, with the wordmark swapping artwork between light and dark. */
export function Logo({ withWordmark = true, className }: { withWordmark?: boolean; className?: string }) {
  if (!withWordmark) {
    return <Image src={MARK} alt="Dexisphere" width={100} height={100} priority className={cn("h-9 w-auto", className)} />;
  }

  return (
    <span className="inline-flex">
      <Image
        src={WORDMARK_ON_LIGHT}
        alt="Dexisphere"
        width={300}
        height={100}
        priority
        className={cn("h-10 w-auto dark:hidden", className)}
      />
      <Image
        src={WORDMARK_ON_DARK}
        alt=""
        aria-hidden
        width={300}
        height={100}
        priority
        className={cn("hidden h-10 w-auto dark:block", className)}
      />
    </span>
  );
}
