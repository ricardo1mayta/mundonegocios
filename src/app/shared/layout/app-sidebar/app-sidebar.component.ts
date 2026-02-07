import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
  inject,
  Signal,
  computed,
} from "@angular/core";
import { SidebarService } from "../../services/sidebar.service";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { SafeHtmlPipe } from "../../pipe/safe-html.pipe";
import { SidebarWidgetComponent } from "./app-sidebar-widget.component";
import { catchError, combineLatest, map, of, Subscription } from "rxjs";
import { MenuRolService } from "src/app/core/services/menu/menu-rol.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthService } from "src/app/core/services/auth.service";

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

@Component({
  selector: "app-sidebar",
  imports: [CommonModule, RouterModule, SafeHtmlPipe],
  templateUrl: "./app-sidebar.component.html",
})
export class AppSidebarComponent {
  private menuService = inject(MenuRolService);
  idRol = 1;
  idSede = 10;
  private auth = inject(AuthService);
  ctx = this.auth.ctx; // signal completo
  nombre = this.auth.nombres; // computed
  empresa = this.auth.razonSocial;
  logo = this.auth.logo;
  navItems: Signal<NavItem[]> = toSignal(
    this.menuService.getMenuNew(this.idRol, this.idSede).pipe(
      map((res: any) => this.ensureImeiMenu((res ?? res ?? []) as NavItem[])),
      catchError((err) => {
        console.error("Error cargando menús", err);
        return of([] as NavItem[]);
      }),
    ),
    { initialValue: [] as NavItem[] },
  );

  initials = computed(() => {
    const name = (this.empresa() ?? "").trim();
    if (!name) return "??";

    const clean = name
      .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const parts = clean.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase(); // "MOVILES" -> "MO"

    // toma 2 iniciales (o 3 si quieres)
    const first = parts[0][0] ?? "";
    const second = parts[1][0] ?? "";
    return (first + second).toUpperCase();
  });

  // clase para variar “color” (sin inline styles)
  badgeClass = computed(() => {
    const key = (this.empresa() ?? "").toLowerCase();
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
    const idx = Math.abs(hash) % 6;

    const classes = [
      "bg-indigo-600 text-white ring-indigo-200 dark:ring-indigo-900/40",
      "bg-emerald-600 text-white ring-emerald-200 dark:ring-emerald-900/40",
      "bg-sky-600 text-white ring-sky-200 dark:ring-sky-900/40",
      "bg-rose-600 text-white ring-rose-200 dark:ring-rose-900/40",
      "bg-amber-600 text-white ring-amber-200 dark:ring-amber-900/40",
      "bg-violet-600 text-white ring-violet-200 dark:ring-violet-900/40",
    ];
    return classes[idx];
  });

  // Others nav items

  openSubmenu: string | null | number = null;
  subMenuHeights: { [key: string]: number } = {};
  @ViewChildren("subMenu") subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
  }

  ngOnInit() {
    // Subscribe to router events
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenuFromRoute(this.router.url);
        }
      }),
    );

    // Subscribe to combined observables to close submenus when all are false
    this.subscription.add(
      combineLatest([this.isExpanded$, this.isMobileOpen$, this.isHovered$]).subscribe(
        ([isExpanded, isMobileOpen, isHovered]) => {
          if (!isExpanded && !isMobileOpen && !isHovered) {
            // this.openSubmenu = null;
            // this.savedSubMenuHeights = { ...this.subMenuHeights };
            // this.subMenuHeights = {};
            this.cdr.detectChanges();
          } else {
            // Restore saved heights when reopening
            // this.subMenuHeights = { ...this.savedSubMenuHeights };
            // this.cdr.detectChanges();
          }
        },
      ),
    );

    // Initial load
    this.setActiveMenuFromRoute(this.router.url);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
    } else {
      this.openSubmenu = key;

      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges(); // Ensure UI updates
        }
      });
    }
  }

  onSidebarMouseEnter() {
    this.isExpanded$
      .subscribe((expanded) => {
        if (!expanded) {
          this.sidebarService.setHovered(true);
        }
      })
      .unsubscribe();
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    const menuGroups: Array<{ items: NavItem[] | Signal<NavItem[]>; prefix: string }> = [
      { items: this.navItems, prefix: "main" },
    ];

    menuGroups.forEach((group) => {
      const items = this.asArray(group.items); // ✅ aquí ya es NavItem[]

      items.forEach((nav, i) => {
        nav.subItems?.forEach((subItem) => {
          if (currentUrl === subItem.path) {
            const key = `${group.prefix}-${i}`;
            this.openSubmenu = key;

            setTimeout(() => {
              const el = document.getElementById(key);
              if (el) {
                this.subMenuHeights[key] = el.scrollHeight;
                this.cdr.detectChanges();
              }
            }, 0);
          }
        });
      });
    });
  }

  private asArray(v: NavItem[] | Signal<NavItem[]>): NavItem[] {
    return typeof v === "function" ? v() : v;
  }
  onSubmenuClick() {
    console.log("click submenu");
    this.isMobileOpen$
      .subscribe((isMobile) => {
        if (isMobile) {
          this.sidebarService.setMobileOpen(false);
        }
      })
      .unsubscribe();
  }

  private ensureImeiMenu(items: NavItem[]): NavItem[] {
    const targetPath = "/admin/compras/consultar-imei";
    const exists = items.some((i) => i.path === targetPath || i.subItems?.some((s) => s.path === targetPath));
    if (exists) return items;

    return [
      {
        name: "Seriales",
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4a7 7 0 1 0 4.39 12.47l3.57 3.56 1.41-1.41-3.56-3.57A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" fill="currentColor"/></svg>',
        new: true,
        subItems: [{ name: "Consultar IMEI", path: targetPath }],
      },
      ...items,
    ];
  }
}
