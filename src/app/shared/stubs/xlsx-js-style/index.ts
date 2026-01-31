export interface CellStyle {
  font?: {
    bold?: boolean;
    name?: string;
    sz?: number;
    color?: { rgb?: string };
  };
  fill?: {
    patternType?: string;
    fgColor?: { rgb?: string };
  };
  border?: {
    top?: { color?: { rgb?: string }; style?: string };
    bottom?: { color?: { rgb?: string }; style?: string };
    left?: { color?: { rgb?: string }; style?: string };
    right?: { color?: { rgb?: string }; style?: string };
  };
  alignment?: {
    horizontal?: string;
    vertical?: string;
  };
}

export interface WorkBook {}

export interface WorkSheet {
  [key: string]: any;
  '!rows'?: Array<{ hpx?: number }>;
  '!cols'?: Array<{ wpx?: number }>;
}

export interface Utils {
  book_new(): WorkBook;
  aoa_to_sheet(data: unknown[][]): WorkSheet;
  sheet_add_aoa(_worksheet: WorkSheet, _data: unknown[][], _options?: unknown): void;
  encode_cell(_cell: { r: number; c: number }): string;
  book_append_sheet(_workbook: WorkBook, _worksheet: WorkSheet, _name: string): void;
}

export interface WriteOptions {
  bookType?: string;
  type?: string;
}

const XLSX = {
  utils: {
    book_new: () => ({} as WorkBook),
    aoa_to_sheet: (_data: unknown[][]) => ({} as WorkSheet),
    sheet_add_aoa: (_worksheet: WorkSheet, _data: unknown[][], _options?: unknown) => {
      return;
    },
    encode_cell: (_cell: { r: number; c: number }) => '',
    book_append_sheet: (_workbook: WorkBook, _worksheet: WorkSheet, _name: string) => {
      return;
    },
  } as Utils,
  write: (_workbook: WorkBook, _options?: WriteOptions) => new ArrayBuffer(0),
};

export default XLSX;
