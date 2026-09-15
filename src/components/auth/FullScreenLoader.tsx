import { Logo } from "@/components/ui/Logo";
import { WorkingTrace } from "@/components/ui/WorkingTrace";

export function FullScreenLoader({ label = "Getting things ready" }: { label?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-ground px-4">
      <div className="grid justify-items-center gap-5">
        <Logo withWordmark={false} />
        <WorkingTrace label={label} />
      </div>
    </div>
  );
}
