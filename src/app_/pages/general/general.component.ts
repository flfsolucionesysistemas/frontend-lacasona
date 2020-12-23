import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";


// modelos
import { Provincia } from "../../modelos/provincia";
// servicios
import { UsuarioService } from "../../servicios/usuario";
import { ProvinciaService} from "../../servicios/provincia";
import { TurnoService } from "../../servicios/turno";

@Component({
    selector: 'general-cmp',
    moduleId: module.id,
    templateUrl: 'general.component.html',
    providers:[UsuarioService,TurnoService,ProvinciaService],    
})

export class GeneralComponent implements OnInit{
    public identity;  
    public token;

    public alertMessage;
    public tipoMessage;
    public errorMessage;

    public provincias:Provincia[];
    public provincia:Provincia;
    precioConsulta;
    valor;
    provinciaS : Provincia;

    constructor( 
        private toastr: ToastrService,
        private _usuarioServicio:UsuarioService,
        private _turnoServicio:TurnoService,
        private _provinciaServicio:ProvinciaService,
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
        this.provincia = new Provincia(0,'','',0,'');
      }
    
    ngOnInit(){
      this.buscarProvincias();
    }

    buscarProvincias(){
      this._provinciaServicio.getProvincias().toPromise().then((response: any) => {
        if(response == null){
          console.log('error');                    
        }else{
          this.provincias = response.body;
          this.buscarPrecioConsulta();              
        }
      });
    }

    onAccion(provincia){
      this._provinciaServicio.updateProvincia(provincia).toPromise().then((response: any)=>{
        if(response == null){
          console.log('error');                    
        }else{
            if(response.sql.affectedRows > 0){
              
              this.tipoMessage = "alert alert-success alert-with-icon";
            }else{
              this.tipoMessage = "alert alert-danger alert-with-icon";
            }

            this.alertMessage =  response.mensaje;
            this.showNotification();
        }
      });
    }

    buscarPrecioConsulta(){
      this._turnoServicio.getTurnoConsultaPrecio().toPromise().then((response:any)=>{
        if(response == null){
          console.log('error');                    
        }else{
          this.precioConsulta = response[0].costo_base;
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
