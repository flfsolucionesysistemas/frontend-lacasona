import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
//LA CASONA
import { EntrevistaComponent } from "../../pages/entrevista/entrevista.component";
import { PacienteComponent} from "../../pages/paciente/paciente.component";
import { UsuarioComponent} from "../../pages/usuario/usuario.component";
import { CreaEntrevistaComponent } from "../../pages/entrevista/creaEntrevista/creaEntrevista.component";

import { CreaTratamientoComponent } from "../../pages/entrevista/creaTratamiento/creaTratamiento.component";
import { GeneralComponent } from "../../pages/general/general.component";
import { TurnoComponent } from "../../pages/turno/turno.component";
import { CobranzaComponent } from "../../pages/cobranza/cobranza.component";
import { TratamientoComponent } from "../../pages/tratamiento/tratamiento.component";
import { CreaEvaluacionComponent } from "../../pages/paciente/creaEvaluacion/creaEvaluacion.component";
import { CreaEvolucionComponent } from "../../pages/paciente/creaEvolucion/creaEvolucion.component";
import { CreaAltaComponent } from "../../pages/paciente/creaAlta/creaAlta.component";

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'icons',           component: IconsComponent },
    { path: 'notifications',   component: NotificationsComponent },
    { path: 'table',           component: TableComponent },
    { path: 'user',           component: UserComponent },
    { path: 'general', component: GeneralComponent},
    { path: 'turno', component: TurnoComponent},
    { path: 'cobranza', component: CobranzaComponent},
    { path: 'tratamiento', component: TratamientoComponent},
    { path: 'entrevista', component: EntrevistaComponent},
    { path: 'paciente', component: PacienteComponent},
    { path: 'usuario', component: UsuarioComponent},
    { path: 'creaEntrevista/:idUsuario', component:CreaEntrevistaComponent},
    { path: 'creaTratamiento/:idHC', component:CreaTratamientoComponent},
    { path: 'crearEvolucion/:idPaciente', component:CreaEvolucionComponent},
    { path: 'crearEvaluacion/:idPaciente', component:CreaEvaluacionComponent},
    { path: 'crearAlta/:idPaciente', component:CreaAltaComponent},
];
