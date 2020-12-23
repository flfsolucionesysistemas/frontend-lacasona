import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "../../servicios/usuario";


@Component({
    selector: 'guardia-cmp',
    moduleId: module.id,
    templateUrl: 'guardia.component.html',
    providers:[UsuarioService],    
})

export class GuardiaComponent implements OnInit{
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
