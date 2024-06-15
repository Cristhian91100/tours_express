import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaqueteModel } from 'src/app/models/paquete.model';
import { PaqueteService } from 'src/app/service/paquete.service';
import { DestinoService} from'src/app/service/destino.service';
// import { ProveedorService} from'src/app/service/proveedor.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-paquete-register',
  templateUrl: './paquete-register.component.html',
  styleUrls: ['./paquete-register.component.css']
})
export class PaqueteRegisterComponent implements OnInit {

  /*VARIABLES DE ENTRADA */
  @Input() paquete: PaqueteModel = new PaqueteModel();
  /*VARIABLES DE SALIDA */
  @Output() closeModalEmmit = new EventEmitter<boolean>();

  myForm: FormGroup;
  pipe = new DatePipe('en-US');
  destino$!:Observable<any[]>;
  destino:any=[];
  proveedor$!:Observable<any[]>;
  proveedor:any=[];
  constructor(
    private _destinoservice:DestinoService,
    // private _proveedorservice:ProveedorService,
    private fb: FormBuilder,
    private _paqueteService: PaqueteService
  ) {    
    this.myForm = this.fb.group({
      iD_Paquete: [null, [Validators.required]],
      iD_Destino: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      duracion: [null, [Validators.required]],
      precio_Base: [null],
      tipo: [null, [Validators.required]],
      fecha_Inicio: [null, [Validators.required]],
      fecha_Fin: [null, [Validators.required]],
      inclusiones: [null],
      exclusiones: [null]
    });
  }
  

  get f() { return this.myForm.controls; }
 
  ngOnInit(): void {
    /*FIXME: SET VALUE TRAE ERRORES CUANDO LOS ATRIBUTOS NO COINCIDEN AL 100% */
    //this.myForm.setValue(this.estado);

    // this.myForm.patchValue(this.paquete)
    this.myForm.patchValue({
      iD_Paquete: this.paquete.iD_Paquete,
      iD_Destino: this.paquete.iD_Destino,
      nombre: this.paquete.nombre,
      descripcion: this.paquete.descripcion,
      duracion: this.paquete.duracion,
      precio_Base: this.paquete.precio_Base,
      tipo: this.paquete.tipo,
      inclusiones: this.paquete.inclusiones,
      exclusiones: this.paquete.exclusiones,
      fecha_Inicio: this.formatDate(this.paquete.fecha_Inicio),
      fecha_Fin: this.formatDate(this.paquete.fecha_Fin)
    });

    this.destinogetall();

    // this.proveedorgetall();
    
  }

  formatDate(dateString: string): string {
    if (!dateString) {
        return ''; // Manejar casos donde la fecha es nula o indefinida
    }
    const dateParts = dateString.split('/'); // Suponiendo que tus fechas están en formato 'dd/MM/yyyy'
    const year = dateParts[2];
    const month = dateParts[1];
    const day = dateParts[0];
    // Formatear la fecha como 'yyyy-MM-dd', que es el formato esperado por los elementos de entrada de tipo 'date' en HTML
    return `${year}-${month}-${day}`;
}

  // proveedorgetall(){
  //   this._proveedorservice.getAll().subscribe(data=>{
  //     this.proveedor=data;
  //   })
  // }

  destinogetall(){
    this._destinoservice.getAll().subscribe(data=>{
      this.destino=data;
    })
  }
  
  closeModal(res: boolean) {
    this.closeModalEmmit.emit(res);
  }
  
  warningShown = false;
  save() {
    this.myForm.get('fecha_Inicio')?.clearValidators();
    this.myForm.get('fecha_Inicio')?.updateValueAndValidity();
  
    if (this.myForm.invalid) {
      this.warningShown = true;
      return;
    }
  
    this.paquete = this.myForm.getRawValue();
  
    if (this.paquete && this.paquete.iD_Paquete == 0) {
      this.createPaquete();
    } else {
      this.updatePaquete();
    }
  
    // Restaura la validación para 'fecha'
    this.myForm.get('fecha_Inicio')?.setValidators([Validators.required]);
    this.myForm.get('fecha_Inicio')?.updateValueAndValidity();
  }
  
  

  createPaquete() {
    let paquete: any = this.myForm.value;
  
    paquete.fecha_Inicio = this.formatDateForServer(paquete.fecha_Inicio);
    paquete.fecha_Fin = this.formatDateForServer(paquete.fecha_Fin);
  
    this._paqueteService.create(paquete).subscribe(
      (data: PaqueteModel) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro creado de forma satisfactoria',
          showConfirmButton: false,
          timer: 1650
        });
        this.closeModalEmmit.emit(true);
      },
      err => {
        console.log(err);
        this.closeModalEmmit.emit(false);
      }
    );
  }
  
  updatePaquete() {
    let paquete: any = this.myForm.value;
  
    paquete.fecha_Inicio = this.formatDateForServer(paquete.fecha_Inicio);
    paquete.fecha_Fin = this.formatDateForServer(paquete.fecha_Fin);
  
    this._paqueteService.update(paquete).subscribe(
      (data: PaqueteModel) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro actualizado de forma satisfactoria',
          showConfirmButton: false,
          timer: 1650
        });
        this.closeModalEmmit.emit(true);
      },
      err => {
        console.log(err);
        this.closeModalEmmit.emit(false);
      }
    );
  }

  formatDateForServer(dateString: string): string {
    if (!dateString) {
      return ''; // Manejar casos donde la fecha es nula o indefinida
    }
    const dateParts = dateString.split('-'); // Suponiendo que tus fechas están en formato 'yyyy-MM-dd'
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    // Formatear la fecha como 'dd/MM/yyyy', que es el formato esperado por tu servicio
    return `${day}/${month}/${year}`;
  }

}
