import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription, timer, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { NotificationsApi, NotificationItem } from "./notifications.api";

type NotificationsState = {
  loading: boolean;
  error: string | null;
  hasNew: boolean;
};

const LS_KEY = "notifications.last";

@Injectable({ providedIn: "root" })
export class NotificationsBusService {
  private readonly notificationsSubject = new BehaviorSubject<NotificationItem[]>(this.loadFromStorage());
  readonly notifications$ = this.notificationsSubject.asObservable();

  private readonly stateSubject = new BehaviorSubject<NotificationsState>({
    loading: false,
    error: null,
    hasNew: this.notificationsSubject.value.some((n) => !n.read),
  });
  readonly state$ = this.stateSubject.asObservable();

  private sedeId: number | null = null;
  private pollSub: Subscription | null = null;

  constructor(private readonly api: NotificationsApi) {}

  refresh(sedeId: number) {
    if (!sedeId || Number.isNaN(Number(sedeId))) return;
    this.sedeId = Number(sedeId);
    if (!this.pollSub) this.startPolling();
    this.fetch();
  }

  markRead(id: string | number) {
    const list = this.notificationsSubject.value.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    this.setList(list);
  }

  private startPolling() {
    this.pollSub = timer(60000, 60000).subscribe(() => this.fetch());
  }

  private fetch() {
    if (!this.sedeId) return;
    this.stateSubject.next({ ...this.stateSubject.value, loading: true, error: null });
    this.api
      .listar(this.sedeId, 20)
      .pipe(
        catchError((err) => {
          const msg =
            err?.error?.status?.message ||
            err?.message ||
            "No se pudieron cargar las notificaciones.";
          this.stateSubject.next({ ...this.stateSubject.value, error: msg });
          return of([]);
        }),
        finalize(() => {
          this.stateSubject.next({ ...this.stateSubject.value, loading: false });
        }),
      )
      .subscribe((incoming: any) => {
        const list = Array.isArray(incoming) ? incoming : [];
        const prev = this.notificationsSubject.value;
        const prevRead = new Map(prev.map((n) => [n.id, n.read]));
        const merged = list.map((n) => ({ ...n, read: prevRead.get(n.id) ?? false }));
        this.setList(merged);
      });
  }

  private setList(list: NotificationItem[]) {
    this.notificationsSubject.next(list);
    this.stateSubject.next({
      ...this.stateSubject.value,
      hasNew: list.some((n) => !n.read),
    });
    this.saveToStorage(list);
  }

  private loadFromStorage(): NotificationItem[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(list: NotificationItem[]) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch {
      // noop
    }
  }
}
