import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "gp-paginator",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./gp-paginator.component.html",
})
export class GpPaginatorComponent {
  // ✅ inputs como setters -> actualizan signals internos
  private _length = signal(0);
  @Input() set length(v: number) {
    this._length.set(Number(v ?? 0));
  }
  get length() {
    return this._length();
  }

  private _pageIndex = signal(0);
  @Input() set pageIndex(v: number) {
    this._pageIndex.set(Number(v ?? 0));
  }
  get pageIndex() {
    return this._pageIndex();
  }

  private _pageSize = signal(10);
  @Input() set pageSize(v: number) {
    this._pageSize.set(Number(v ?? 10));
  }
  get pageSize() {
    return this._pageSize();
  }

  @Input() pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  @Input() showFirstLastButtons = true;

  private _loading = signal(false);
  @Input() set loading(v: boolean) {
    this._loading.set(!!v);
  }
  get loading() {
    return this._loading();
  }

  @Output() page = new EventEmitter<PageEvent>();

  totalPages = computed(() => {
    const size = Math.max(1, this._pageSize());
    return Math.max(1, Math.ceil(this._length() / size));
  });

  from = computed(() => (this._length() <= 0 ? 0 : this._pageIndex() * this._pageSize() + 1));
  to = computed(() => Math.min(this._length(), (this._pageIndex() + 1) * this._pageSize()));

  canPrev = computed(() => !this._loading() && this._pageIndex() > 0);
  canNext = computed(() => !this._loading() && this._pageIndex() < this.totalPages() - 1);

  private emit(nextIndex: number, nextSize: number) {
    this.page.emit({
      pageIndex: nextIndex,
      pageSize: nextSize,
      length: this._length(),
      previousPageIndex: this._pageIndex(),
    });
  }

  first() {
    if (!this.canPrev()) return;
    this.emit(0, this._pageSize());
  }
  prev() {
    if (!this.canPrev()) return;
    this.emit(Math.max(0, this._pageIndex() - 1), this._pageSize());
  }
  next() {
    if (!this.canNext()) return;
    this.emit(Math.min(this.totalPages() - 1, this._pageIndex() + 1), this._pageSize());
  }
  last() {
    if (!this.canNext()) return;
    this.emit(this.totalPages() - 1, this._pageSize());
  }

  onPageSizeChange(v: any) {
    const newSize = Number(v);
    if (!Number.isFinite(newSize) || newSize <= 0) return;
    this.emit(0, newSize); // backend: al cambiar size vuelves a 0
  }
}
