import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { FullCalendarModule } from '@fullcalendar/angular';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';
import { TableComponent }           from '../../pages/table/table.component';
import { EntrevistaComponent }         from '../../pages/entrevista/entrevista.component';
import { PacienteComponent }         from '../../pages/paciente/paciente.component';
import { UsuarioComponent }         from '../../pages/usuario/usuario.component';
import { CreaEntrevistaComponent } from "../../pages/entrevista/creaEntrevista/creaEntrevista.component";
import { CreaTratamientoComponent} from "../../pages/entrevista/creaTratamiento/creaTratamiento.component";
import { CreaAltaComponent } from "../../pages/paciente/creaAlta/creaAlta.component";
import { CreaEvaluacionComponent } from "../../pages/paciente/creaEvaluacion/creaEvaluacion.component";
import { CreaEvolucionComponent} from "../../pages/paciente/creaEvolucion/creaEvolucion.component";

import { GeneralComponent } from "../../pages/general/general.component";
import { TurnoComponent} from "../../pages/turno/turno.component";
import { CobranzaComponent } from "../../pages/cobranza/cobranza.component";
import { TratamientoComponent } from "../../pages/tratamiento/tratamiento.component";



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    // FullCalendarModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    CreaAltaComponent,
    CreaEvolucionComponent,
    CreaEvaluacionComponent,
    GeneralComponent,
    TurnoComponent,
    CobranzaComponent,
    TratamientoComponent,
    TableComponent,
    EntrevistaComponent,
    PacienteComponent,
    UsuarioComponent,
    CreaEntrevistaComponent,
    CreaTratamientoComponent,    
  ]
})

export class AdminLayoutModule {}
