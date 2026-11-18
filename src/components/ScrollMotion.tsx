'use client';

import { useEffect } from 'react';

const groups = [
  '.hero-video', '.hero-chips', '.review-summary', '.performance-panel',
  '.metric', '.report-image', '.report-context',
  '.workflow-notes article', '.market-panel', '.demo-tabs', '.demo-frame', '.demo-feature-grid article',
  '.review-card', '.feature-card', '.pricing-card', '.faq-item', '.product-artwork',
  '.detail-specs', '.detail-features', '.detail-price', '.detail-lower article',
  '.contact-card', '.legal-page article', '.notice', '.footer-top > div', '.footer-bottom',
].join(', ');
const text = 'h1, h2, h3, h4, p, summary, .eyebrow, .price-value, .demo-caption, .offer-soon';
const targets = groups + ', ' + text + ', .access-cta, .access-alternative, .back-link, .review-toggle';

export function ScrollMotion() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const roots = document.querySelectorAll<HTMLElement>('#main-content, .site-footer');
    const observer = new IntersectionObserver(entries => {
      let sequence = 0;
      for (const { target, isIntersecting, boundingClientRect, rootBounds } of entries) {
        if (!rootBounds || !target.isConnected || !boundingClientRect.height) continue;

        const element = target as HTMLElement;
        const next = isIntersecting ? 'visible'
          : boundingClientRect.top < rootBounds.top ? 'above' : 'below';
        if (element.dataset.scrollMotion === next) continue;

        if (next === 'visible') {
          element.style.setProperty('--reveal-delay', `${Math.min(sequence++, 3) * 25}ms`);
        }
        element.dataset.scrollMotion = next;
      }
    }, { rootMargin: '-48px 0px -56px' });

    const observe = (element: HTMLElement) => {
      if (element.dataset.scrollMotion || !element.getClientRects().length) return;
      if (element.parentElement?.closest(groups)) element.classList.add('scroll-nested');
      element.dataset.scrollMotion = 'pending';
      observer.observe(element);
    };

    const clearMotion = (element: HTMLElement) => {
      delete element.dataset.scrollMotion;
      element.classList.remove('scroll-nested');
      element.style.removeProperty('--reveal-delay');
    };

    const updates = new MutationObserver(records => {
      for (const { addedNodes, removedNodes } of records) {
        for (const node of removedNodes) {
          if (!(node instanceof HTMLElement) || node.isConnected) continue;
          if (node.dataset.scrollMotion) {
            observer.unobserve(node);
            clearMotion(node);
          }
          node.querySelectorAll<HTMLElement>('[data-scroll-motion]').forEach(element => {
            observer.unobserve(element);
            clearMotion(element);
          });
        }
        for (const node of addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches(targets)) observe(node);
          node.querySelectorAll<HTMLElement>(targets).forEach(observe);
        }
      }
    });

    const revealOpenDetails = (event: Event) => {
      const details = event.target;
      if (details instanceof HTMLDetailsElement && details.open) {
        details.querySelectorAll<HTMLElement>(targets).forEach(observe);
      }
    };

    roots.forEach(root => {
      root.querySelectorAll<HTMLElement>(targets).forEach(observe);
      updates.observe(root, { childList: true, subtree: true });
      root.addEventListener('toggle', revealOpenDetails, true);
    });

    return () => {
      observer.disconnect();
      updates.disconnect();
      roots.forEach(root => {
        root.removeEventListener('toggle', revealOpenDetails, true);
        root.querySelectorAll<HTMLElement>('[data-scroll-motion]').forEach(clearMotion);
      });
    };
  }, []);

  return null;
}
