import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import {
  PegasusAdminService,
  PegasusMenuPayload,
  PegasusSistemaPayload,
} from "../../../core/services/pegasus-admin/pegasus-admin.service";

interface SistemaItem extends PegasusSistemaPayload {
  id: number;
}

interface MenuItem extends PegasusMenuPayload {
  id: number;
  level: number;
}

interface RawMenuNode {
  idItem?: number;
  idMenu?: number;
  itemId?: number;
  children?: RawMenuNode[];
  [key: string]: unknown;
}

@Component({
  selector: "app-pegasus-admin",
  standalone: true,
  templateUrl: "./pegasus-admin.component.html",
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatSnackBarModule],
})
export class PegasusAdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pegasusAdminService = inject(PegasusAdminService);
  private readonly snackBar = inject(MatSnackBar);

  readonly sistemas = signal<SistemaItem[]>([]);
  readonly menuItems = signal<MenuItem[]>([]);
  readonly selectedSistemaId = signal<number | null>(null);
  readonly editingSistemaId = signal<number | null>(null);
  readonly editingMenuId = signal<number | null>(null);
  readonly isSistemaModalOpen = signal(false);
  readonly isMenuModalOpen = signal(false);
  readonly loadingSistemas = signal(false);
  readonly loadingMenu = signal(false);
  readonly selectedSistema = computed(() =>
    this.sistemas().find((item) => item.id === this.selectedSistemaId()) ?? null,
  );

  readonly sistemaForm = this.fb.nonNullable.group({
    nombreSis: ["", [Validators.required]],
    descripcionSis: [""],
    flgActivoSis: [true],
  });

  readonly menuForm = this.fb.nonNullable.group({
    obraItem: [""],
    idModulo: ["1", ],
    idSistema: [0, ],
    name: ["", [Validators.required]],
    icon: ["box",],
    routeOrFunction: ["", ],
    routeOrFunction2: [""],
    idPadreItem: [0],
    position: [10, ],
    pathMatchExact: [true],
    badge: [""],
    badgeColor: [""],
    type: [""],
    customClass: [""],
  });

  constructor() {
    this.loadSistemas();
  }

  loadSistemas() {
    this.loadingSistemas.set(true);

    this.pegasusAdminService.listarSistemas().subscribe({
      next: (response) => {
        const sistemas = this.normalizeSistemas(response);
        this.sistemas.set(sistemas);

        if (!sistemas.length) {
          this.selectedSistemaId.set(null);
          this.menuItems.set([]);
          this.loadingSistemas.set(false);
          return;
        }

        const currentSelection = this.selectedSistemaId();
        const selectedId = sistemas.some((item) => item.id === currentSelection) ? currentSelection : sistemas[0].id;

        this.selectSistema(selectedId);
        this.loadingSistemas.set(false);
      },
      error: () => {
        this.loadingSistemas.set(false);
        this.showMessage("No se pudo listar sistemas");
      },
    });
  }

  selectSistema(idSistema: number | null) {
    this.selectedSistemaId.set(idSistema);
    this.menuItems.set([]);
    this.editingMenuId.set(null);
    this.resetMenuForm(false);

    if (!idSistema) {
      this.menuForm.controls.idSistema.setValue(0);
      return;
    }

    this.menuForm.controls.idSistema.setValue(idSistema);
    this.loadMenu(idSistema);
  }

  openCreateSistemaModal() {
    this.resetSistemaForm();
    this.isSistemaModalOpen.set(true);
  }

  openEditSistemaModal(item: SistemaItem) {
    this.editingSistemaId.set(item.id);
    this.sistemaForm.patchValue({
      nombreSis: item.nombreSis,
      descripcionSis: item.descripcionSis,
      flgActivoSis: item.flgActivoSis,
    });
    this.isSistemaModalOpen.set(true);
  }

  closeSistemaModal() {
    this.isSistemaModalOpen.set(false);
    this.resetSistemaForm();
  }

  saveSistema() {
    if (this.sistemaForm.invalid) {
      this.sistemaForm.markAllAsTouched();
      return;
    }

    const raw = this.sistemaForm.getRawValue();
    const payload: PegasusSistemaPayload = {
      nombreSis: raw.nombreSis.trim(),
      descripcionSis: raw.descripcionSis.trim(),
      flgActivoSis: raw.flgActivoSis,
    };

    const editingId = this.editingSistemaId();
    const request = editingId
      ? this.pegasusAdminService.actualizarSistema(editingId, payload)
      : this.pegasusAdminService.crearSistema(payload);

    request.subscribe({
      next: () => {
        this.showMessage(editingId ? "Sistema actualizado" : "Sistema creado");
        this.closeSistemaModal();
        this.loadSistemas();
      },
      error: () => this.showMessage("No se pudo guardar el sistema"),
    });
  }

  resetSistemaForm() {
    this.editingSistemaId.set(null);
    this.sistemaForm.reset({
      nombreSis: "",
      descripcionSis: "",
      flgActivoSis: true,
    });
  }

  openCreateMenuModal() {
    const selectedSistemaId = this.selectedSistemaId();
    if (!selectedSistemaId) {
      this.showMessage("Selecciona un sistema antes de agregar menu");
      return;
    }

    this.resetMenuForm();
    this.isMenuModalOpen.set(true);
  }

  openEditMenuModal(item: MenuItem) {
    this.editingMenuId.set(item.id);
    this.menuForm.patchValue({
      obraItem: item.obraItem ?? "",
      idModulo: item.idModulo,
      idSistema: item.idSistema,
      name: item.name,
      icon: item.icon,
      routeOrFunction: item.routeOrFunction,
      routeOrFunction2: item.routeOrFunction2 ?? "",
      idPadreItem: item.idPadreItem,
      position: item.position,
      pathMatchExact: item.pathMatchExact,
      badge: item.badge ?? "",
      badgeColor: item.badgeColor ?? "",
      type: item.type ?? "",
      customClass: item.customClass ?? "",
    });
    this.isMenuModalOpen.set(true);
  }

  closeMenuModal() {
    this.isMenuModalOpen.set(false);
    this.resetMenuForm();
  }

  saveMenu() {
    const selectedSistemaId = this.selectedSistemaId();
    if (!selectedSistemaId) {
      this.showMessage("Selecciona un sistema antes de guardar el menu");
      return;
    }

    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    const raw = this.menuForm.getRawValue();
    const payload: PegasusMenuPayload = {
      obraItem: this.asNullable(raw.obraItem),
      idModulo: raw.idModulo.trim(),
      idSistema: selectedSistemaId,
      name: raw.name.trim(),
      icon: raw.icon.trim(),
      routeOrFunction: raw.routeOrFunction.trim(),
      routeOrFunction2: this.asNullable(raw.routeOrFunction2),
      idPadreItem: Number(raw.idPadreItem) || 0,
      position: Number(raw.position) || 0,
      pathMatchExact: raw.pathMatchExact,
      badge: this.asNullable(raw.badge),
      badgeColor: this.asNullable(raw.badgeColor),
      type: this.asNullable(raw.type),
      customClass: this.asNullable(raw.customClass),
    };

    const editingId = this.editingMenuId();
    const request = editingId
      ? this.pegasusAdminService.actualizarMenu(editingId, payload)
      : this.pegasusAdminService.crearMenu(payload);

    request.subscribe({
      next: () => {
        this.showMessage(editingId ? "Menu actualizado" : "Menu creado");
        this.closeMenuModal();
        this.loadMenu(selectedSistemaId);
      },
      error: () => this.showMessage("No se pudo guardar el menu"),
    });
  }

  resetMenuForm(keepSystem = true) {
    const sistemaId = keepSystem ? this.selectedSistemaId() ?? 0 : 0;
    this.editingMenuId.set(null);
    this.menuForm.reset({
      obraItem: "",
      idModulo: "1",
      idSistema: sistemaId,
      name: "",
      icon: "box",
      routeOrFunction: "",
      routeOrFunction2: "",
      idPadreItem: 0,
      position: 10,
      pathMatchExact: true,
      badge: "",
      badgeColor: "",
      type: "",
      customClass: "",
    });
  }

  private loadMenu(idSistema: number) {
    this.loadingMenu.set(true);

    this.pegasusAdminService.listarMenuPorSistema(idSistema).subscribe({
      next: (response) => {
        this.menuItems.set(this.normalizeMenu(response));
        this.loadingMenu.set(false);
      },
      error: () => {
        this.menuItems.set([]);
        this.loadingMenu.set(false);
        this.showMessage("No se pudo listar el menu");
      },
    });
  }

  private normalizeSistemas(response: unknown): SistemaItem[] {
    const items = Array.isArray(response) ? response : [];

    return items
      .map((item: Record<string, unknown>) => {
        const id = Number(item["idSistema"] ?? item["idSis"] ?? item["id"]);
        if (!id) {
          return null;
        }

        return {
          id,
          nombreSis: String(item["nombreSis"] ?? ""),
          descripcionSis: String(item["descripcionSis"] ?? ""),
          flgActivoSis: Boolean(item["flgActivoSis"]),
        };
      })
      .filter((item): item is SistemaItem => item !== null);
  }

  private normalizeMenu(response: unknown): MenuItem[] {
    const source = Array.isArray(response) ? (response as RawMenuNode[]) : [];
    const flattened: MenuItem[] = [];

    const walk = (nodes: RawMenuNode[], level: number) => {
      nodes.forEach((node) => {
        const id = Number(node.idItem ?? node.idMenu ?? node.itemId);
        if (!id) {
          return;
        }

        flattened.push({
          id,
          level,
          obraItem: this.readNullableString(node["obraItem"]),
          idModulo: String(node["idModulo"] ?? "1"),
          idSistema: Number(node["idSistema"] ?? this.selectedSistemaId() ?? 0),
          name: String(node["name"] ?? ""),
          icon: String(node["icon"] ?? "box"),
          routeOrFunction: String(node["routeOrFunction"] ?? ""),
          routeOrFunction2: this.readNullableString(node["routeOrFunction2"]),
          idPadreItem: Number(node["idPadreItem"] ?? 0),
          position: Number(node["position"] ?? 0),
          pathMatchExact: Boolean(node["pathMatchExact"]),
          badge: this.readNullableString(node["badge"]),
          badgeColor: this.readNullableString(node["badgeColor"]),
          type: this.readNullableString(node["type"]),
          customClass: this.readNullableString(node["customClass"]),
        });

        if (Array.isArray(node.children) && node.children.length) {
          walk(node.children, level + 1);
        }
      });
    };

    walk(source, 0);
    return flattened;
  }

  private readNullableString(value: unknown): string | null {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    return String(value);
  }

  private asNullable(value: string): string | null {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  private showMessage(message: string) {
    this.snackBar.open(message, "Cerrar", { duration: 3000 });
  }
}