import { ConnectorLogo } from "@/components/plugins/ConnectorLogo";
import { CONNECTORS_BY_KEY } from "@/data/connectors";
import { AD_PLATFORMS } from "@/data/connectors/social";
import { StackCell } from "./cells";

/**
 * An ad account: the logo of the sign-in it came with, its name, and the ad
 * platform underneath. Meta can return an account with no name, only its
 * number, so the number is labelled rather than shown bare.
 */
export function AdAccountCell({ platform, name }: { platform: string; name: string }) {
  const known = AD_PLATFORMS[platform];
  const via = known && CONNECTORS_BY_KEY[known.via];
  const numberOnly = /^\d+$/.test(name);
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {via && <ConnectorLogo connector={via} className="size-7 rounded-md" />}
      <StackCell
        primary={numberOnly || !name ? "Unnamed ad account" : name}
        secondary={[known?.name ?? platform, numberOnly ? name : ""].filter(Boolean).join(" · ")}
      />
    </span>
  );
}
