import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";


//MODELO
import { Usuario} from "../../modelos/usuario";

//SERVICIOS
import { UsuarioService } from "../../servicios/usuario";


@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html',
    providers:[UsuarioService],    
})

export class UserComponent implements OnInit{
    public alertMessage;
    public tipoMessage;
    public identityNew;
    public identity;  
    public token;
    public usuario : Usuario;

    constructor( 
        private _usuarioServicio:UsuarioService,
        private toastr: ToastrService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
      }
    
    ngOnInit(){
      this.usuario= new Usuario(
        this.identity.id_persona,
        this.identity.id_tipo_persona,
        this.identity.id_localidad,
        this.identity.dni,
        this.identity.nombre,
        this.identity.apellido,
        this.identity.nombre_usuario,
        this.identity.clave_usuario,
        this.identity.email,
        this.identity.telefono,
        this.identity.estado,
        this.identity.activos,
        this.identity.numero_matricula );
      console.log(this.usuario);
    
    }

    buscarUsuario(id_persona){
      this._usuarioServicio.getUsuario(id_persona).toPromise().then((response: any) => {
          if(response == null){
            console.log('error');                    
          }else{
              console.log(response[0]);
              this.usuario = response[0];
              localStorage.removeItem('identity');

              localStorage.setItem('identity', JSON.stringify(this.usuario));  
              location.reload();
            }
        }
      );  
    }
    onEditar(){
      this._usuarioServicio.update(this.usuario).toPromise().then((data: any) => {
        console.log(data.sql);
        let result = data.sql;
        //this.identityNew = identity;
             
        if(!result.affectedRows){
          
          console.log('error');
        }else{
          this.buscarUsuario(this.usuario.id_persona);
           
        }  
        ///   
       
        this.alertMessage = 'Se modificaron los datos';
        this.tipoMessage = "alert alert-success alert-with-icon",
        this.showNotification();
       });
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
