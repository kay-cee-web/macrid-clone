/** The fixed page backdrop behind every screen: a slow colour glow over a faded grid. */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-1/4 left-1/2 h-[80vh] w-[90vw] -translate-x-1/2 rounded-full bg-aurora opacity-90 blur-3xl lg:animate-aurora dark:opacity-80" />
      <div className="absolute inset-0 bg-grid mask-[radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
    </div>
  );
}
