import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarcasService } from '../../../../../core/services/marcas/marcas.service';
import { Marca } from '../../../../../core/models/almacen/marca';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CateboriasService } from '../../../../../core/services/categorias/cateborias.service';
import { SubidaImagenService } from '../../../../../core/services/subida-imagen.service';

@Component({
  selector: 'app-crear-categoria',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crear-categoria.component.html',
  styleUrl: './crear-categoria.component.css',
})
export class CrearCategoriaComponent {
  categoriaForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  constructor(
    private fb: FormBuilder,
    private categoriaService: CateboriasService,
    private dialogRef: MatDialogRef<CrearCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Marca | null,
    private subidaImagen: SubidaImagenService
  ) {}

  ngOnInit(): void {
    this.categoriaForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      slug: [''],
      descripionweb: [null],
      image: [null],
      stadoweb: [false],
      statuscat: [true],
      codigo: [null],
    });
    console.log('data', this.data);

    if (this.data) {
      this.categoriaForm.patchValue(this.data);
    }
  }

  guardarCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched(); // <- solo aquí se activa la validación visual
      return;
    }
    //subir imagen
    if (this.categoriaForm.value.image) {
      this.subidaImagen.subirImagen(this.categoriaForm.value.image).subscribe((url: any) => {
        this.categoriaForm.patchValue({ image: url.ruta_destino });
        this.guardarCategoriaFinal();
      });
    } else {
      this.guardarCategoriaFinal();
    }
  }
  guardarCategoriaFinal(): void {
    const marca = this.categoriaForm.value;
    if (marca.id) {
      console.log('Editando marca:', marca);
      this.categoriaService.editarCategoria(marca.id, marca).subscribe(() => {
        this.onCerrar(true);
      });
    } else {
      this.categoriaService.crearCategoria(marca).subscribe(() => {
        this.onCerrar(true);
      });
    }
  }
  editarMarca(marca: Marca): void {
    this.categoriaForm.patchValue(marca);
  }

  limpiarFormulario(): void {
    this.categoriaForm.reset({ estado: true, stadoweb: false });
  }
  //cerrar
  cerrarDialogo(): void {
    this.limpiarFormulario();
  }

  onCerrar(ok: boolean = false): void {
    this.dialogRef.close(ok); // devuelve true si fue exitoso
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.categoriaForm.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }
}
