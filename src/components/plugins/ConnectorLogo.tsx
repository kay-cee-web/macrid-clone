import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Connector } from "@/types/connector";

const LOGO_DIR = "/logos";

/**
 * A connector's brand mark on a light tile, the same in both themes so dark
 * marks (GitHub, Mailchimp) stay visible. The files in `public/logos` are the
 * vendors' own multicolour marks; a connector without one draws its Lucide glyph.
 * Size it with `className`; the mark fills 60% of the tile.
 */
export function ConnectorLogo({ connector, className }: { connector: Connector; className?: string }) {
  const { logo, Icon } = connector;
  return (
    <span aria-hidden className={cn("grid shrink-0 place-items-center rounded-lg bg-night-ink ring-1 ring-inset ring-line", className)}>
      {logo ? (
        <Image src={`${LOGO_DIR}/${logo}.svg`} alt="" width={32} height={32} unoptimized className="size-3/5 object-contain" />
      ) : (
        <Icon className="size-3/5 text-night" />
      )}
    </span>
  );
}
