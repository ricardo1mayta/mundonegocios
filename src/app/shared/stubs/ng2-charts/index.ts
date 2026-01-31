import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[baseChart]',
  standalone: true,
})
export class BaseChartDirective {
  @Input() data?: unknown;
  @Input() options?: unknown;
  @Input() type?: string;

  update() {
    return;
  }
}
