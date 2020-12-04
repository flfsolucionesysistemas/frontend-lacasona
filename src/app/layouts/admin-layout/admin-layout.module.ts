import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';
import { TableComponent }           from '../../pages/table/table.component';
import { EntrevistaComponent }         from '../../pages/entrevista/entrevista.component';
import { PacienteComponent }         from '../../pages/paciente/paciente.component';
import { UsuarioComponent }         from '../../pages/usuario/usuario.component';
import { CreaEntrevistaComponent } from "../../pages/entrevista/creaEntrevista/creaEntrevista.component";
import { CreaTratamientoComponent} from "../../pages/entrevista/creaTratamiento/creaTratamiento.component";

import { GeneralComponent } from "../../pages/general/general.component";
import { TurnoComponent} from "../../pages/turno/turno.component";
import { CobranzaComponent } from "../../pages/cobranza/cobranza.component";
import { TratamientoComponent } from "../../pages/tratamiento/tratamiento.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    GeneralComponent,
    TurnoComponent,
    CobranzaComponent,
    TratamientoComponent,
    TableComponent,
    EntrevistaComponent,
    PacienteComponent,
    UsuarioComponent,
    CreaEntrevistaComponent,
    CreaTratamientoComponent
  ]
})

export class AdminLayoutModule {}
