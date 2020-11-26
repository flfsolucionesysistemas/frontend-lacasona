import { Component, OnInit } from '@angular/core';

//SERVICIOS
import { UsuarioService} from "../servicios/usuario";

// MODELOS
import { Usuario } from "../modelos/usuario";


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTESPaciente: RouteInfo[] = [
    { path: '/dashboard',     title: 'Inicio',         icon:'fa fa-home',       class: '' },
    { path: '/user',          title: 'Mi Perfil',      icon:'fa fa-user-circle-o',  class: '' },
    { path: '/turno',          title: 'Mis Turnos',      icon:'fa fa-calendar',  class: '' },
    { path: '/pago',          title: 'Mis Pagos',      icon:'fa fa-money',  class: '' },
    { path: '/general',          title: 'Mi H.C.',      icon:'fa fa-file-text-o',  class: '' },
    { path: '/usuario',          title: 'Guardias',      icon:'fa fa-plus-circle',  class: '' },
];

export const ROUTESProfesional: RouteInfo[] = [
    { path: '/dashboard',     title: 'Inicio',         icon:'fa fa-home',       class: '' },
    { path: '/user',          title: 'Mi Perfil',      icon:'fa fa-user-circle-o',  class: '' },
    { path: '/paciente',          title: 'Pacientes',      icon:'fa fa-users',  class: '' },
    { path: '/entrevista',          title: 'Gestión H.C.',      icon:'fa fa-file-text-o',  class: '' },
    { path: '/turno',          title: 'Turnos',      icon:'fa fa-calendar',  class: '' },
    
];

export const ROUTESAdmin: RouteInfo[] = [
    { path: '/dashboard',     title: 'Inicio',         icon:'fa fa-home',       class: '' },
    { path: '/user',          title: 'Mi Perfil',      icon:'fa fa-user-circle-o',  class: '' },
    { path: '/general',         title: 'Datos Generales',             icon:'fa fa-gears',    class: '' },
    { path: '/usuario',         title: 'Usuarios',             icon:'fa fa-user',    class: '' },
    { path: '/turno',         title: 'Turnos',             icon:'fa fa-calendar',    class: '' },
    { path: '/cobranza',         title: 'Cobranzas',             icon:'fa fa-money',    class: '' },
    { path: '/tratamiento',         title: 'Tratamientos',             icon:'fa fa-list-ol',    class: '' },
    { path: '/patologia',         title: 'Patologias',             icon:'fa fa-superpowers',    class: '' },
    { path: '/paciente',         title: 'Asignar Trunos',             icon:'fa fa-users',    class: '' },
    // { path: '/entrevista',         title: 'Ver H.C.',             icon:'nc-single-02',    class: '' },
    // { path: '/pago',         title: 'Pagos',             icon:'nc-money-coins',    class: '' },    
    // { path: '/entrevista',         title: 'Entrevistas',             icon:'nc-bullet-list-67',    class: '' },    
    // { path: '/paciente',         title: 'Pacientes',             icon:'nc-badge',    class: '' },    
    // { path: '/turno',          title: 'Turnos',      icon:'nc-calendar-60',  class: '' },
];

export const ROUTESSuper: RouteInfo[] = [
    { path: '/dashboard',     title: 'Inicio',         icon:'nc-sound-wave',       class: '' },
    { path: '/icons',         title: 'Icons',             icon:'nc-diamond',    class: '' },
    // { path: '/maps',          title: 'Maps',              icon:'nc-pin-3',      class: '' },
    { path: '/notifications', title: 'Notifications',     icon:'nc-bell-55',    class: '' },
    { path: '/user',          title: 'Mi Perfil',      icon:'nc-single-02',  class: '' },
    { path: '/table',         title: 'lista',        icon:'nc-tile-56',    class: '' },
    // { path: '/typography',    title: 'Typography',        icon:'nc-caps-small', class: '' },
    // { path: '/upgrade',       title: 'Upgrade to PRO',    icon:'nc-spaceship',  class: 'active-pro' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public identity;  
    public token;
    public usuario : Usuario;

    constructor(
        private _usuarioServicio:UsuarioService
        ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
        this.usuario = this.identity;
    }

    ngOnInit() {
        /*SEGUN EL TIPO DE USUARIO CARGA UN MENU U OTRO */
        switch(this.identity.id_tipo_persona){
            case 1:{
                this.menuItems = ROUTESAdmin.filter(menuItem => menuItem);
                break;
            }
            case 2:{
                this.menuItems = ROUTESProfesional.filter(menuItem => menuItem);
                break;
            }
            case 3  :{
                this.menuItems = ROUTESPaciente.filter(menuItem => menuItem);
                break;
            }
            case 4  :{
                this.menuItems = ROUTESPaciente.filter(menuItem => menuItem);
                break;
            }
            case 5  :{
                this.menuItems = ROUTESSuper.filter(menuItem => menuItem);
                break;
            }
        }
    }
}
