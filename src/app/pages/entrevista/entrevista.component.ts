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
          // private _route: ActivatedRoute,
          private _usuarioServicio:UsuarioService
        ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
    }
        
    ngOnInit(){
        this.buscarUsuarioTipo(3);
    }
    
    rechazar(usuario){
      this.usuario = new Usuario(usuario.id_persona,
                  6,
                  usuario.localidad,
                  usuario.dni,
                  usuario.nombre,
                  usuario.apellido,
                  usuario.usuario,
                  usuario.clave,
                  usuario.email, 
                  usuario.telefono,
                  'rechazado luego de la entrevista',
                  0);

      this._usuarioServicio.update(this.usuario).toPromise().then((response:any) => {
          if(response == null){
            console.log('error');                    
          }else{
            
            if(response.sql.changedRows == 0){              
              this.alertMessage = 'Algo salio mal, vuelva a intentar.';
              this.tipoMessage = "alert alert-warning alert-with-icon",
              this.showNotification();
            }else{
              this.alertMessage = 'Potencial cliente rechazado.';
              this.tipoMessage = "alert alert-warning alert-with-icon",
              this.showNotification();
              this.buscarUsuarioTipo(3);
            }
          }
        }
      );
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
                //lista = wregistro;        
                this.usuariosEntrevistados = wregistro;
              }
            }
          }
        );
    }

    crearHistoriaClinica(usuario){
        // console.log(usuario);
      let idUsuario = usuario.id_persona;
      // VAMOS A CREAR LA H.C. CON EL IDUSUARIO SELECCIONADO JE JE
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
