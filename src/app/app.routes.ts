import { Routes } from "@angular/router";
import { EcommerceComponent } from "./pages/dashboard/ecommerce/ecommerce.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { FormElementsComponent } from "./pages/forms/form-elements/form-elements.component";
import { BasicTablesComponent } from "./pages/tables/basic-tables/basic-tables.component";
import { BlankComponent } from "./pages/blank/blank.component";
import { NotFoundComponent } from "./pages/other-page/not-found/not-found.component";
import { AppLayoutComponent } from "./shared/layout/app-layout/app-layout.component";
import { InvoicesComponent } from "./pages/invoices/invoices.component";
import { LineChartComponent } from "./pages/charts/line-chart/line-chart.component";
import { BarChartComponent } from "./pages/charts/bar-chart/bar-chart.component";
import { AlertsComponent } from "./pages/ui-elements/alerts/alerts.component";
import { AvatarElementComponent } from "./pages/ui-elements/avatar-element/avatar-element.component";
import { BadgesComponent } from "./pages/ui-elements/badges/badges.component";
import { ButtonsComponent } from "./pages/ui-elements/buttons/buttons.component";
import { ImagesComponent } from "./pages/ui-elements/images/images.component";
import { VideosComponent } from "./pages/ui-elements/videos/videos.component";
import { SignInComponent } from "./pages/auth-pages/sign-in/sign-in.component";
import { SignUpComponent } from "./pages/auth-pages/sign-up/sign-up.component";
import { CalenderComponent } from "./pages/calender/calender.component";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./pages/public/public.routes").then((m) => m.routes),
  },
  {
    path: "admin",
    loadChildren: () => import("./pages/private/private.routes").then((m) => m.routes),
  },

  // auth pages
  {
    path: "signin",
    component: SignInComponent,
    title: "Angular Sign In Dashboard | TailAdmin - Angular Admin Dashboard Template",
  },
  {
    path: "signup",
    component: SignUpComponent,
    title: "Angular Sign Up Dashboard | TailAdmin - Angular Admin Dashboard Template",
  },
  // error pages
  {
    path: "**",
    component: NotFoundComponent,
    title: "Angular NotFound Dashboard | TailAdmin - Angular Admin Dashboard Template",
  },
  {
    path: "**",
    redirectTo: "",
  },
];