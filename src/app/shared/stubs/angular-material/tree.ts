import { Component, Directive, Input, NgModule, TemplateRef, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'mat-tree',
  standalone: true,
  template: '<ng-content></ng-content>',
  exportAs: 'matTree',
})
export class MatTree {
  @Input() dataSource: unknown;
  @Input() childrenAccessor: unknown;

  isExpanded(_: unknown): boolean {
    return false;
  }
}

@Component({
  selector: 'mat-tree-node',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatTreeNode {}

@Directive({
  selector: '[matTreeNodeDef]',
  standalone: true,
})
export class MatTreeNodeDef {
  @Input('matTreeNodeDefWhen') when?: (_index: number, node: unknown) => boolean;
  constructor(public templateRef: TemplateRef<unknown>, public viewContainerRef: ViewContainerRef) {}
}

@Directive({
  selector: '[matTreeNodePadding]',
  standalone: true,
})
export class MatTreeNodePadding {}

@Directive({
  selector: '[matTreeNodeToggle]',
  standalone: true,
})
export class MatTreeNodeToggle {}

@NgModule({
  imports: [MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle],
  exports: [MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle],
})
export class MatTreeModule {}
