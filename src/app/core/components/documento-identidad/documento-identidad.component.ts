/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/*import {
    Component,
    OnInit,
    forwardRef,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    ReactiveFormsModule,
    Validators,
    Validator,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';


@Component({
    selector: 'app-documento-identidad',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './documento-identidad.component.html',
    providers: [
        ParametrosHttp,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DocumentoIdentidadComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DocumentoIdentidadComponent),
            multi: true,
        },
    ],
})
export class DocumentoIdentidadComponent
    implements OnInit, ControlValueAccessor, Validator
{
    private readonly parametrosService = inject(ParametrosHttp);
    protected readonly TIPO_DNI = TipoDocumentoEnum.TIPO_DNI;
    idFormularioTipoDocumento = input<number>(ID_FORMULARIO_OSCE);
    permitirBuscar = input<boolean>(true);

    tiposDocumento = signal<TipoDocumento[]>([]);
    tipoDocumentoFormControl = new FormControl<number>(0);
    numeroDocumentoFormControl = new FormControl<string>('');
    datosEncontrados = output<IPersonaNatural>();

    private onChange = (_: any) => {};
    private onTouched = () => {};
    private onValidatorChange = () => {};

    ngOnInit() {
        this.parametrosService
            .getDocumentos(this.idFormularioTipoDocumento())
            .subscribe((response) => {
                this.tiposDocumento.set(response.data);
                if (response.data.length) {
                    this.tipoDocumentoFormControl.setValue(
                        response.data[0].idTipo
                    );
                    this.establecerValidadores();
                }
            });

        this.tipoDocumentoFormControl.valueChanges.subscribe(() => {
            this.establecerValidadores();
            this.emitirCambio();
            this.onValidatorChange(); // Notifica que el estado de validez puede haber cambiado
        });

        this.numeroDocumentoFormControl.valueChanges.subscribe(() => {
            this.emitirCambio();
            this.onValidatorChange();
        });
    }

    establecerValidadores() {
        const idTipoDocumento = this.tipoDocumentoFormControl.value;
        if (idTipoDocumento == this.TIPO_DNI) {
            this.numeroDocumentoFormControl.setValidators([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(8),
                Validators.pattern(/^[0-9]*$/),
            ]);
        } else {
            this.numeroDocumentoFormControl.setValidators([
                Validators.required,
                Validators.minLength(9),
                Validators.maxLength(12),
                Validators.pattern(/^[0-9]*$/),
            ]);
        }
        this.numeroDocumentoFormControl.updateValueAndValidity();
    }

    // Métodos de ControlValueAccessor
    writeValue(value: any): void {
        if (value) {
            this.tipoDocumentoFormControl.setValue(value.tipoDocumento, {
                emitEvent: false,
            });
            this.numeroDocumentoFormControl.setValue(value.numeroDocumento, {
                emitEvent: false,
            });
            this.establecerValidadores();
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.tipoDocumentoFormControl.disable();
            this.numeroDocumentoFormControl.disable();
        } else {
            this.tipoDocumentoFormControl.enable();
            this.numeroDocumentoFormControl.enable();
        }
    }

    emitirCambio() {
        const idTipoDocumento = this.tipoDocumentoFormControl.value;
        const tipoDocumento = this.tiposDocumento().find(
            (tipo) => tipo.idTipo === idTipoDocumento
        )?.descripcionTipo;

        this.onChange({
            tipoDocumento: idTipoDocumento,
            nombreTipoDocumento: tipoDocumento,
            numeroDocumento: this.numeroDocumentoFormControl.value,
        });
    }

    // Métodos del Validator
    validate(control: AbstractControl): ValidationErrors | null {
        if (control.touched) {
            this.tipoDocumentoFormControl.markAsTouched();
            this.numeroDocumentoFormControl.markAsTouched();
        }

        if (!this.tipoDocumentoFormControl.value) {
            this.tipoDocumentoFormControl.setErrors({ required: true });
        }

        if (!this.numeroDocumentoFormControl.value) {
            this.numeroDocumentoFormControl.setErrors({ required: true });
        }

        if (
            !this.tipoDocumentoFormControl.value ||
            !this.numeroDocumentoFormControl.value
        ) {
            return { required: true };
        }
        if (
            this.tipoDocumentoFormControl.invalid ||
            this.numeroDocumentoFormControl.invalid
        ) {
            return { documentoInvalido: true };
        }
        return null;
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onValidatorChange = fn;
    }

    buscarPersona() {
        this.tipoDocumentoFormControl.markAsTouched();
        this.numeroDocumentoFormControl.markAsTouched();
        this.tipoDocumentoFormControl.updateValueAndValidity();
        this.numeroDocumentoFormControl.updateValueAndValidity();

        if (
            this.tipoDocumentoFormControl.invalid ||
            this.numeroDocumentoFormControl.invalid
        ) {
            return;
        }

        const idTipoDocumento = this.tipoDocumentoFormControl.value;
        const numeroDocumento = this.numeroDocumentoFormControl.value;

        const fn$ =
            idTipoDocumento == this.TIPO_DNI
                ? this.parametrosService.getPersonaNatural(
                      idTipoDocumento,
                      numeroDocumento
                  )
                : this.parametrosService.getPersonaMigraciones(
                      idTipoDocumento,
                      numeroDocumento
                  );

        fn$.subscribe((response) => {
            if (response) {
                this.datosEncontrados.emit(response.data);
            }
        });
    }
}
*/
