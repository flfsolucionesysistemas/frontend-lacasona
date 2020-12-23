import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ToastrService } from "ngx-toastr";

//SERVICIOS
import { UsuarioService} from "../../servicios/usuario";

//MODELOS
import { Usuario } from "../../modelos/usuario";

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'entrevista-cmp',
    moduleId: module.id,
    templateUrl: 'entrevista.component.html'
})

export class EntrevistaComponent implements OnInit{
    public alertMessage;
    public tipoMessage;
  
    public identity;  
    public token;
    public usuario;
    public usuariosEntrevistados : Usuario[];
    public idUsuario;
    constructor(
          private _router: Router,
          private toastr: ToastrService,
          private _usuarioServicio:UsuarioService
        ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
    }
        
    ngOnInit(){
        this.buscarUsuarioTipo(3);
    }
    
    buscarUsuarioTipo(tipo){
        this._usuarioServicio.getUsuarioTipo(tipo).toPromise().then((response: any) => {
            if(response == null){
              console.log('error', response); 
            }else{
              this.usuariosEntrevistados = response;
              // let lista:any[];
              // lista = response;
              
              // for (let p of Object.keys(response)) {
              //   var wregistro = response[p];
              //   //lista = wregistro;        
              //   this.usuariosEntrevistados = wregistro;
              // }
            }
          }
        );
    }

    crearHistoriaClinica(usuario){
      let idUsuario = usuario.id_persona;
      this._router.navigate(['/creaEntrevista', idUsuario]);
    }

    // NOTIFICACION
    showNotification() {
      this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">'
          + this.alertMessage + '</span>',
          "",
          {
          timeOut: 3000,
          closeButton: true,
          enableHtml: true,
          toastClass: this.tipoMessage,
          positionClass: "toast-top-center"
          }
      );
  }
  
}
