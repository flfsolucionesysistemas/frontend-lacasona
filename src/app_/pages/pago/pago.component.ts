import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "../../servicios/usuario";


@Component({
    selector: 'pago-cmp',
    moduleId: module.id,
    templateUrl: 'pago.component.html',
    providers:[UsuarioService],    
})

export class PagoComponent implements OnInit{
    public identity;  
    public token;

    constructor( 
        private _usuarioServicio:UsuarioService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
      }
    
    ngOnInit(){
    }
}
