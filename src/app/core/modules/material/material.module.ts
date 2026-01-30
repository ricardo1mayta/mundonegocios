import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [],
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatButtonModule, MatIconModule, MatMenuModule, MatTabsModule, MatCheckboxModule, MatTooltipModule],
  exports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatButtonModule, MatIconModule, MatMenuModule, MatTabsModule, MatCheckboxModule, MatTooltipModule],
})
export class MaterialModule {}
