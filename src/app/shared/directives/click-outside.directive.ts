import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[clickOutside], [appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output('clickOutside') clickOutside = new EventEmitter<MouseEvent>();
  @Output('appClickOutside') appClickOutside = this.clickOutside;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.clickOutside.emit(event);
    }
  }
}
