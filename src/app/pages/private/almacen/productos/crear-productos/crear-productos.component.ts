import { PrimeNgModule } from 'src/app/core/modules/primeng/primeng.module';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';

import { SubidaImagenService } from '../../../../../core/services/subida-imagen.service';
import { ProductosService } from '../../../../../core/services/productos/productos.service';
import { CateboriasService } from '../../../../../core/services/categorias/cateborias.service';
import { MarcasService } from '../../../../../core/services/marcas/marcas.service';

import { Marca } from '../../../../../core/models/almacen/marca';
import { Categoria } from '../../../../../core/models/almacen/categoria';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { environment } from '../../../../../../environments/environment';
import { Producto } from '../../../../../core/models/almacen/producto';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../../../core/modules/material/material.module';
import { SwitchComponent } from 'src/app/shared/components/form/input/switch.component';

@Component({
  selector: 'app-crear-productos',
  standalone: true,
  imports: [PrimeNgModule, CommonModule, ReactiveFormsModule, MatStepperModule, MatSelectModule, MatDialogModule, NgxEditorModule, MaterialModule, MatIconModule, SwitchComponent],
  templateUrl: './crear-productos.component.html',
  styleUrl: './crear-productos.component.css',
})
export class CrearProductosComponent {
  /* servicios */
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CrearProductosComponent>);
  private subidaImagen = inject(SubidaImagenService);
  private prodSrv = inject(ProductosService);
  private catSrv = inject(CateboriasService);
  private marcaSrv = inject(MarcasService);
  data = inject(MAT_DIALOG_DATA) as any;

  /* catálogos */
  categorias: Categoria[] = [];
  marcas: Marca[] = [];

  /* editor rich-text */
  editor = new Editor();

  /* STEP 1 – Básicos */
  basicosForm = this.fb.group({
    descripcion: ['', Validators.required],
    sku: [''],
    medida: ['NIU'],
    categoria: [null, Validators.required],
    marca: [null, Validators.required],
  });

  /* STEP 2 – Imágenes */
  imagenesForm = this.fb.group({
    imagen: [null], // principal obligatoria
    img1: [''],
    img2: [''],
    img3: [''],
    img4: [''],
  });

  /* STEP 3 – Precios & estado */
  preciosForm = this.fb.group({
    status: [true],
    descc: [''],
  });

  /* previews & files */
  preview: Record<string, string | null> = {
    imagen: null,
    img1: null,
    img2: null,
    img3: null,
    img4: null,
  };
  files: Record<string, File | null> = { imagen: null, img1: null, img2: null, img3: null, img4: null };

  constructor() {
    /* cargar combos */
    this.catSrv.obtenerTodasLasCategorias().subscribe((r: any) => (this.categorias = r.data));
    this.marcaSrv.obtenerTodasLasMarcas().subscribe((r: any) => (this.marcas = r.data));

    /* edición */
    if (this.data) {
      this.basicosForm.patchValue(this.data);
      this.imagenesForm.patchValue({
        imagen: this.data.imagen,
        img1: this.data.img1,
        img2: this.data.img2,
        img3: this.data.img3,
        img4: this.data.img4,
      });
      this.preciosForm.patchValue(this.data);
      Object.keys(this.preview).forEach(k => (this.preview[k] = this.data[k] ?? null));
    }
  }

  /* ------- subir imagen en cuanto se selecciona -------- */
  onFileChange(e: Event, campo: string) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.files[campo] = file;
    const reader = new FileReader();
    reader.onload = () => (this.preview[campo] = reader.result as string);
    reader.readAsDataURL(file);

    /* subir inmediatamente */
    this.subidaImagen.subirImagen(file).subscribe((res: any) => {
      const url = environment.urlImgen + res.ruta_destino;
      this.imagenesForm.patchValue({ [campo]: url });
    });
  }

  /* ---------- guardar ---------- */
  guardar() {
    if (this.basicosForm.invalid || this.imagenesForm.invalid) return;

    const payload = {
      ...(this.basicosForm.value as object),
      ...(this.imagenesForm.value as object),
      ...(this.preciosForm.value as object),
      id: this.data?.id,
    } as Producto;

    const req$ = payload.id ? this.prodSrv.editarProducto(payload.id, payload) : this.prodSrv.crearProducto(payload);

    req$.subscribe(() => this.dialogRef.close(true));
  }

  cerrar() {
    this.dialogRef.close(false);
  }
}
