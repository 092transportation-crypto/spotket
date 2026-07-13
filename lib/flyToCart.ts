/**
 * Animates a small brand-colored dot from the clicked element to the cart
 * icon (desktop header or mobile bottom nav — whichever is visible).
 */
export function flyToCart(from: HTMLElement): void {
  const candidates = [
    document.getElementById("cart-icon"),
    document.getElementById("cart-icon-mobile"),
  ];
  const target = candidates.find(
    (element) => element && element.getBoundingClientRect().width > 0,
  );
  if (!target) return;

  const start = from.getBoundingClientRect();
  const end = target.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.style.cssText = [
    "position:fixed",
    `left:${start.left + start.width / 2 - 7}px`,
    `top:${start.top + start.height / 2 - 7}px`,
    "width:14px",
    "height:14px",
    "border-radius:9999px",
    "background:#6366f1",
    "box-shadow:0 0 12px rgba(99,102,241,0.8)",
    "z-index:9999",
    "pointer-events:none",
    "transition:transform 0.65s cubic-bezier(0.45,-0.2,0.9,0.9),opacity 0.65s ease-in",
  ].join(";");
  document.body.appendChild(dot);

  requestAnimationFrame(() => {
    const dx = end.left + end.width / 2 - (start.left + start.width / 2);
    const dy = end.top + end.height / 2 - (start.top + start.height / 2);
    dot.style.transform = `translate(${dx}px, ${dy}px) scale(0.35)`;
    dot.style.opacity = "0.3";
  });
  window.setTimeout(() => dot.remove(), 700);
}
