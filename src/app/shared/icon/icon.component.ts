import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type IconTone = 'default' | 'muted' | 'accent' | 'danger' | 'success';
type IconSize = 'sm' | 'md' | 'lg' | 'xl' | number;

@Component({
  selector: 'app-icon',
  template: `
    <span
      class="material-symbols-rounded app-icon-symbol"
      [class.app-icon-filled]="filled()"
      [class.app-icon-tone-muted]="tone() === 'muted'"
      [class.app-icon-tone-accent]="tone() === 'accent'"
      [class.app-icon-tone-danger]="tone() === 'danger'"
      [class.app-icon-tone-success]="tone() === 'success'"
      [style.font-size]="fontSize()"
      [attr.aria-hidden]="decorative() ? 'true' : null"
      [attr.aria-label]="decorative() ? null : accessibleLabel()"
      [attr.role]="decorative() ? null : 'img'"
    >{{ name() }}</span>
  `,
  host: {
    class: 'app-icon',
    '[style.display]': '"inline-flex"',
    '[style.align-items]': '"center"',
    '[style.justify-content]': '"center"',
    '[style.line-height]': '"1"'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly label = input<string | null>(null);
  readonly decorative = input(true);
  readonly tone = input<IconTone>('default');
  readonly size = input<IconSize>('md');
  readonly filled = input(false);

  readonly fontSize = computed(() => {
    const size = this.size();
    if (typeof size === 'number') {
      return `${size}px`;
    }

    switch (size) {
      case 'sm':
        return '1rem';
      case 'lg':
        return '1.35rem';
      case 'xl':
        return '1.7rem';
      case 'md':
      default:
        return '1.15rem';
    }
  });

  readonly accessibleLabel = computed(() => {
    const customLabel = this.label();
    if (customLabel) {
      return customLabel;
    }

    return this.name().replaceAll('_', ' ');
  });
}