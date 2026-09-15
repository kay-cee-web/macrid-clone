import { useMemo } from "react";
import QRCode from "qrcode";
import { cn } from "@/lib/cn";

/**
 * QR code drawn as one SVG path. Deliberately black on white in both themes
 * (the one exception to theme tokens): phone scanners need that contrast.
 */
export function QrCode({ value, label, className }: { value: string; label: string; className?: string }) {
  const { size, path } = useMemo(() => {
    const { modules } = QRCode.create(value, { errorCorrectionLevel: "M" });
    let d = "";
    for (let row = 0; row < modules.size; row += 1) {
      for (let col = 0; col < modules.size; col += 1) {
        if (modules.get(row, col)) d += `M${col} ${row}h1v1h-1z`;
      }
    }
    return { size: modules.size, path: d };
  }, [value]);

  const margin = 2;
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`${-margin} ${-margin} ${size + margin * 2} ${size + margin * 2}`}
      shapeRendering="crispEdges"
      className={cn("rounded-[10px] bg-white text-black", className)}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}
