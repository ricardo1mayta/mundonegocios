import { NgModule } from "@angular/core";
import { PIcon } from "@primeicons/angular/p-icon";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { DrawerModule } from "primeng/drawer";
import { FieldsetModule } from "primeng/fieldset";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { MultiSelectModule } from "primeng/multiselect";
import { PaginatorModule } from "primeng/paginator";
import { SelectModule } from "primeng/select";
import { StepperModule } from "primeng/stepper";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";

const PRIMENG_MODULES = [
  ButtonModule,
  CardModule,
  TableModule,
  DialogModule,
  InputTextModule,
  InputNumberModule,
  SelectModule,
  MultiSelectModule,
  DatePickerModule,
  CheckboxModule,
  ToastModule,
  TooltipModule,
  ToolbarModule,
  MenuModule,
  DrawerModule,
  TabsModule,
  StepperModule,
  FieldsetModule,
  PaginatorModule,
  TagModule,
  PIcon,
];

@NgModule({
  imports: PRIMENG_MODULES,
  exports: PRIMENG_MODULES,
})
export class PrimeNgModule {}
