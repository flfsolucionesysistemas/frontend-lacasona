import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';
import { TableComponent }           from '../../pages/table/table.component';
// import { TypographyComponent }      from '../../pages/typography/typography.component';
import { IconsComponent }           from '../../pages/icons/icons.component';
// import { MapsComponent }            from '../../pages/maps/maps.component';
// import { NotificationsComponent }   from '../../pages/notifications/notifications.component';
// import { UpgradeComponent }         from '../../pages/upgrade/upgrade.component';
import { EntrevistaComponent }         from '../../pages/entrevista/entrevista.component';
import { PacienteComponent }         from '../../pages/paciente/paciente.component';
import { UsuarioComponent }         from '../../pages/usuario/usuario.component';
import { CreaEntrevistaComponent } from "../../pages/entrevista/creaEntrevista/creaEntrevista.component";

import { GeneralComponent } from "../../pages/general/general.component";
import { TurnoComponent} from "../../pages/turno/turno.component";
import { CobranzaComponent } from "../../pages/cobranza/cobranza.component";
import { TratamientoComponent } from "../../pages/tratamiento/tratamiento.component";
import { PatologiaComponent} from "../../pages/patologia/patologia.component";

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
    PatologiaComponent,
    TableComponent,
    // UpgradeComponent,
    // TypographyComponent,
    IconsComponent,
    // MapsComponent,
    EntrevistaComponent,
    // NotificationsComponent,
    PacienteComponent,
    UsuarioComponent,
    CreaEntrevistaComponent
  ]
})

export class AdminLayoutModule {}
