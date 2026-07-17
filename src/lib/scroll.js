// Shared access to the app's Lenis instance.
// Native scrollIntoView fights Lenis' rAF loop (it re-asserts its own target each
// frame), which is what makes programmatic anchor jumps stutter. Routing anchor
// scrolls through Lenis keeps them buttery and consistent with wheel scrolling.

let lenisInstance = null;

export const setLenis = (l) => { lenisInstance = l; };
export const getLenis = () => lenisInstance;

// Offset matches html { scroll-padding-top: 90px } so the fixed navbar never overlaps.
export const NAV_OFFSET = 90;

export function scrollToSection(id, { offset = NAV_OFFSET } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -offset, duration: 1.2 });
  } else {
    // Lenis is skipped under prefers-reduced-motion — fall back to native.
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  }
  return true;
}
