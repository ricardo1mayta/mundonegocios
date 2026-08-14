import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, computed, signal } from "@angular/core";
import { PrimeNgModule } from "../../modules/primeng/primeng.module";

export interface GpPageEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
  previousPageIndex?: number;
}

@Component({
  selector: "gp-paginator",
  standalone: true,
  imports: [CommonModule, PrimeNgModule],
  templateUrl: "./gp-paginator.component.html",
})
export class GpPaginatorComponent {
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

  @Output() page = new EventEmitter<GpPageEvent>();

  firstRecord = computed(() => this._pageIndex() * this._pageSize());
  totalPages = computed(() => Math.max(1, Math.ceil(this._length() / Math.max(1, this._pageSize()))));

  onPageChange(event: any) {
    this.page.emit({
      pageIndex: Number(event.page ?? 0),
      pageSize: Number(event.rows ?? this._pageSize()),
      length: this._length(),
      previousPageIndex: this._pageIndex(),
    });
  }
}