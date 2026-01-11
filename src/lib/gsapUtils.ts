import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
};

/**
 * Safe GSAP context wrapper that handles null refs and reduced motion
 */
export const createSafeGsapContext = (
  containerRef: React.RefObject<HTMLElement | null>,
  animations: () => void,
  onSkip?: () => void
): gsap.Context | null => {
  // Skip animations for reduced motion preference
  if (prefersReducedMotion()) {
    onSkip?.();
    return null;
  }

  // Skip if container doesn't exist
  if (!containerRef.current) {
    onSkip?.();
    return null;
  }

  try {
    return gsap.context(animations, containerRef);
  } catch (error) {
    console.warn('GSAP animation failed:', error);
    onSkip?.();
    return null;
  }
};

/**
 * Safe GSAP set that filters out null/undefined elements
 */
export const safeGsapSet = (
  targets: (Element | null | undefined)[] | NodeListOf<Element> | Element | null | undefined,
  vars: gsap.TweenVars
): void => {
  try {
    const elements = Array.isArray(targets) 
      ? targets.filter((el): el is Element => el != null)
      : targets instanceof NodeList
        ? Array.from(targets)
        : targets != null 
          ? [targets]
          : [];
    
    if (elements.length > 0) {
      gsap.set(elements, vars);
    }
  } catch (error) {
    console.warn('GSAP set failed:', error);
  }
};

/**
 * Cleanup function that ensures visibility of animated elements
 */
export const ensureElementsVisible = (selectors: string[]): void => {
  try {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        gsap.set(elements, { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'all' });
      }
    });
  } catch (error) {
    console.warn('Failed to ensure elements visible:', error);
  }
};
