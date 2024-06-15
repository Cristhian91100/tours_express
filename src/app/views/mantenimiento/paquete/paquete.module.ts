import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaqueteRoutingModule } from './paquete-routing.module';
import { PaqueteListComponent } from './paquete-list/paquete-list.component';
import { PaqueteRegisterComponent } from './paquete-register/paquete-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FiltroPaquetesPipe } from '../../../pipes/filtro-paquete.pipe';
import { ExportExlsxCvsPdfComponent } from '../export-exlsx-cvs-pdf/export-exlsx-cvs-pdf.component';
@NgModule({
  declarations: [
    FiltroPaquetesPipe,
    PaqueteListComponent,
    PaqueteRegisterComponent,
    ExportExlsxCvsPdfComponent
  ],
  imports: [
    CommonModule,
    PaqueteRoutingModule, 
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class PaqueteModule { }
