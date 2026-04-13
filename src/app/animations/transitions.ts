import { animate, query, style, transition, trigger } from '@angular/animations';

/**
 * Route-level page transition: the entering page fades in and slides up slightly.
 * Professional & minimal — 250ms ease-out.
 */
export const routeAnimations = trigger('routeAnimations', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ],
      { optional: true },
    ),
  ]),
]);

/**
 * Vocabulary modal backdrop: fades in on open, fades out on close.
 */
export const backdropAnimation = trigger('backdropAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('160ms ease-in', style({ opacity: 0 }))]),
]);

/**
 * Vocabulary modal panel: scales and fades in on open, reverses on close.
 */
export const modalAnimation = trigger('modalAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.96) translateY(10px)' }),
    animate('220ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
  ]),
  transition(':leave', [
    animate('160ms ease-in', style({ opacity: 0, transform: 'scale(0.96) translateY(10px)' })),
  ]),
]);

/**
 * Generic fade: used for skeleton loaders appearing/fading out to real content,
 * and for inline UI elements entering/leaving.
 */
export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('280ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
]);

/**
 * Auth error message: slides down and fades in, reverses on dismiss.
 */
export const errorSlide = trigger('errorSlide', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-4px)' }),
    animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-4px)' })),
  ]),
]);

/**
 * Lesson detail swap: when the selected lesson changes, the detail panel
 * content quickly fades out then fades in with a subtle upward drift.
 * Only animates on genuine lesson changes (void transitions are skipped).
 */
export const lessonTransition = trigger('lessonTransition', [
  transition('* => *', [
    style({ opacity: 0, transform: 'translateY(8px)' }),
    animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);
