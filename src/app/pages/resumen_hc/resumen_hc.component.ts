import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "../../servicios/usuario";
import { ToastrService } from "ngx-toastr";
  
import { HistoriaClinicaService } from "../../servicios/historia_clinica";


@Component({
    selector: 'resumen_hc-cmp',
    moduleId: module.id,
    templateUrl: 'resumen_hc.component.html',
    providers:[UsuarioService,HistoriaClinicaService],    
})

export class ResumenHcComponent implements OnInit{
    public identity;  
    public token;
    public alertMessage;
    public tipoMessage;

    constructor( 
        private toastr: ToastrService,
        private _usuarioServicio:UsuarioService,
        private _hcServicio:HistoriaClinicaService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
      }
    
    ngOnInit(){
    }
    
    onBlog(){
      this._hcServicio.getSolicitudResumenHC(this.identity.id_persona).toPromise().then((data:any) => {
        if(data!=null){
          console.log(data);
          if(data.status==200){
            this.alertMessage = data.mensaje;
            this.tipoMessage = "alert alert-ssuccess alert-with-icon",
            this.showNotification();
          }
        }
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
