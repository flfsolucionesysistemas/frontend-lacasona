import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "../../servicios/usuario";


@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html',
    providers:[UsuarioService],    
})

export class UserComponent implements OnInit{
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
