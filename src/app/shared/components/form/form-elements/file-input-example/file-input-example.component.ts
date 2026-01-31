
import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../common/component-card/component-card.component';
import { LabelComponent } from '../../label/label.component';
import { FileInputComponent } from '../../input/file-input.component';

@Component({
  selector: 'app-file-input-example',
  imports: [
    ComponentCardComponent,
    LabelComponent,
    FileInputComponent
],
  templateUrl: './file-input-example.component.html',
})
export class FileInputExampleComponent {
  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
  }
}
