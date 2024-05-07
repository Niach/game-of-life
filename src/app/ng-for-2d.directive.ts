import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngFor2D]',
  standalone: true
})
export class NgFor2DDirective {
  private _array: any[][] = [];

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {
  }

  @Input() set ngFor2D(array: any[][]) {
    this._array = array;
    this.updateView();
  }

  updateView() {
    this.viewContainer.clear();
    for (let rowIndex = 0; rowIndex < this._array.length; rowIndex++) {
      const row = this._array[rowIndex];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        this.viewContainer.createEmbeddedView(this.templateRef, {
          rowIndex: rowIndex,
          columnIndex: columnIndex
        });
      }
    }
  }
}
