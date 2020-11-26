import { Component, OnInit } from '@angular/core';

//SERVICIOS
import { UsuarioService} from "../../servicios/usuario";

//MODELOS
import { Usuario } from "../../modelos/usuario";

@Component({
    selector: 'paciente-cmp',
    moduleId: module.id,
    templateUrl: 'paciente.component.html'
})

export class PacienteComponent implements OnInit{
    public identity;  
    public token;
    public usuariosPacientes : Usuario[];

    constructor(
        private _usuarioServicio:UsuarioService
        ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
    }
        
    ngOnInit(){
        this.buscarUsuarioTipo(4);
        // console.log('si');
    }
    
    buscarUsuarioTipo(tipo){
      this._usuarioServicio.getUsuarioTipo(tipo).toPromise().then((response: any) => {
          if(response == null){
            console.log('error');                    
          }else{
            
            let lista:any[];
            lista = response;
            
            for (let p of Object.keys(response)) {
              var wregistro = response[p];
              this.usuariosPacientes = wregistro;
            }
          }
        }
      );
    }
}
