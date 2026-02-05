import { Routes } from "@angular/router";
import { DashboardLayoutComponent } from "./layout/dashboard-layout/dashboard-layout.component";
import { VentasComponent } from "./ventas/ventas.component";
import { ClientesComponent } from "./clientes/clientes.component";
import { NuevaVentaComponent } from "./ventas/nueva-venta/nueva-venta.component";
import { MarcasComponent } from "./almacen/marcas/marcas.component";
import { CategoriasComponent } from "./almacen/categorias/categorias.component";
import { ProductosComponent } from "./almacen/productos/productos.component";
import { InvertarioComponent } from "./almacen/invertario/invertario.component";
import { ComprasComponent } from "./compras/compras.component";
import { NuevaCompraComponent } from "./compras/nueva-compra/nueva-compra.component";
import { ProveedoresComponent } from "./proveedores/proveedores.component";
import { authGuard } from "../../core/interceptor/auth.guard";
import { AlmacenComponent } from "./almacen/almacen.component";
import { CotizacionesComponent } from "./cotizaciones/cotizaciones.component";
import { NuevaCotizacionComponent } from "./cotizaciones/nueva-cotizacion/nueva-cotizacion.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsuariosComponent } from "./usuarios/usuarios/usuarios.component";
import { SedesComponent } from "./sedes/sedes/sedes.component";
import { RolesComponent } from "./roles/roles/roles.component";
import { MenuComponent } from "./menu/menu/menu.component";
import { GuiaremisionComponent } from "./guiaremision/guiaremision.component";
import { NuevaGuiaremisionComponent } from "./guiaremision/nueva-guiaremision/nueva-guiaremision.component";
import { BomComponent } from "../../features/fabricacion/pages/bom/bom/bom.component";
import { CotizacionComponent } from "../../features/fabricacion/pages/cotizacion/cotizacion/cotizacion.component";
import { InsumosComponent } from "../../features/fabricacion/pages/insumos/insumos/insumos.component";
import { OpFlowComponent } from "../../features/fabricacion/pages/op-flow/op-flow/op-flow.component";
import { RequerimientosComponent } from "../../features/fabricacion/pages/requerimientos/requerimientos/requerimientos.component";
import { FichaTecnicaWizardComponent } from "../../features/fabricacion/pages/ficha-tecnica-listar/ficha-tecnica/ficha-tecnica-wizard.component";
import { FichaTecnicaListarComponent } from "../../features/fabricacion/pages/ficha-tecnica-listar/ficha-tecnica-listar.component";
import { ListarBomComponent } from "../../features/fabricacion/pages/bom/listar-bom/listar-bom.component";
import { ListarContizacionComponent } from "../../features/fabricacion/pages/cotizacion/listar-contizacion/listar-contizacion.component";
import { VerFichaComponent } from "../../features/fabricacion/pages/ficha-tecnica-listar/ver-ficha/ver-ficha.component";
import { ListaReportesComponent } from "./reportes/lista-reportes/lista-reportes.component";
import { CuadreDiarioComponent } from "./reportes/lista-reportes/cuadre-diario/cuadre-diario.component";
import { AppLayoutComponent } from "src/app/shared/layout/app-layout/app-layout.component";

export const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      // { path: "", component: DashboardComponent },

      {
        path: "ventas/pedidos",
        component: VentasComponent,
      },
      {
        path: "ventas/clientes",
        component: ClientesComponent,
      },
      {
        path: "ventas/newpedidos",
        component: NuevaVentaComponent,
      },
      {
        path: "system-manager/marcas",
        component: MarcasComponent,
      },
      {
        path: "system-manager/categorias",
        component: CategoriasComponent,
      },
      {
        path: "productos/lista",
        component: ProductosComponent,
      },
      {
        path: "inventario/listageneral",
        component: InvertarioComponent,
      },
      {
        path: "inventario/lista",
        component: AlmacenComponent,
      },
      {
        path: "compras/lista",
        component: ComprasComponent,
      },
      {
        path: "compras/newcompra",
        component: NuevaCompraComponent,
      },
      {
        path: "provedores/lista",
        component: ProveedoresComponent,
      },
      {
        path: "cotizaciones/lista",
        component: CotizacionesComponent,
      },
      {
        path: "cotizaciones/newcotizacion",
        component: NuevaCotizacionComponent,
      },
      {
        path: "system-manager/admin-usuarios",
        component: UsuariosComponent,
      },
      {
        path: "system-manager/admin-sede",
        component: SedesComponent,
      },
      {
        path: "system-manager/permisos-perfil",
        component: RolesComponent,
      },
      {
        path: "system-manager/admin-perfil",
        component: MenuComponent,
      },
      {
        path: "guia/listaguias",
        component: GuiaremisionComponent,
      },
      {
        path: "guia/nueva-guia",
        component: NuevaGuiaremisionComponent,
      },

      { path: "fabricacion/mf/insumos", component: InsumosComponent },
      { path: "fabricacion/mf/requerimientos", component: RequerimientosComponent },
      { path: "fabricacion/mf/bom", component: BomComponent },
      { path: "fabricacion/mf/cotizacion", component: CotizacionComponent },
      { path: "fabricacion/mf/cotizaciones-compra", component: ListarContizacionComponent },
      { path: "fabricacion/mf/ficha-tecnica", component: FichaTecnicaWizardComponent },
      { path: "fabricacion/mf/ver-ficha-tecnica", component: VerFichaComponent },
      { path: "fabricacion/mf/ficha-tecnica-listar", component: FichaTecnicaListarComponent },
      { path: "fabricacion/mf/bom-listar", component: ListarBomComponent },

      { path: "reportes/lista-reportes", component: ListaReportesComponent },
      { path: "reportes/cuadre-diario", component: CuadreDiarioComponent },
    ],
  },
];
