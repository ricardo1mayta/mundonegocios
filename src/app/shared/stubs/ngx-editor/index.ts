import { Component, Input, NgModule } from '@angular/core';

export class Editor {}

@Component({
  selector: 'ngx-editor-menu',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NgxEditorMenuComponent {
  @Input() editor: unknown;
}

@Component({
  selector: 'ngx-editor',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NgxEditorComponent {
  @Input() editor: unknown;
}

@NgModule({
  imports: [NgxEditorMenuComponent, NgxEditorComponent],
  exports: [NgxEditorMenuComponent, NgxEditorComponent],
})
export class NgxEditorModule {}
