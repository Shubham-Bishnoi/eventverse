import { useEffect, useRef } from "react";

// Fades in every [data-reveal] element inside the returned ref as it scrolls into view.
// Content stays visible without JavaScript: nothing is hidden until `reveal-ready` is set.
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const show = (el: Element) => el.setAttribute("data-shown", "");
    // Anything already on screen is shown before hiding the rest, so it never flickers.
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) show(el);
    });
    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    items.forEach((el) => el.hasAttribute("data-shown") || observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}
