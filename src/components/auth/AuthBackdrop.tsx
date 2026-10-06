/**
 * The artwork behind every auth screen: Tapotik's drifting glow over a faded
 * grid. It spans the whole page; the form side lays a frosted pane over it,
 * so the colour carries across while the grid blurs out.
 */
export function AuthBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ground" />
      <div className="absolute inset-[-15%] bg-aurora opacity-95 blur-3xl animate-aurora dark:opacity-70" />
      {/* The floating glows sit near the seam, under the grid so they don't smear its lines. */}
      <div className="absolute right-[56%] top-[20%] size-24 rounded-full bg-accent/50 blur-2xl animate-drift" />
      <div className="absolute right-[52%] top-[48%] size-12 rounded-full bg-pink/40 blur-xl animate-drift [animation-delay:-4s]" />
      <div className="absolute inset-0 bg-grid" />
    </div>
  );
}
