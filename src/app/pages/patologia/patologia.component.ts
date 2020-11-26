import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";


//MODELO
import { Patologia} from "../../modelos/patologia";

//SERVICIOS
import { PatologiaService } from "../../servicios/patologia";
import { UsuarioService } from "../../servicios/usuario";


@Component({
    selector: 'patologia-cmp',
    moduleId: module.id,
    templateUrl: 'patologia.component.html',
    providers:[UsuarioService,PatologiaService],    
})

export class PatologiaComponent implements OnInit{
    public alertMessage;
    public tipoMessage;

    public identity;  
    public token;
    public patologias:Patologia[];
    public patologia : Patologia;
    public alta;
    public tituloModal;

    closeResult: string;

    // nombrePattern = "[a-zA-Z0-9]"; 
    constructor( 
        private modalService: NgbModal,
        private toastr: ToastrService,
        private _usuarioServicio:UsuarioService,
        private _patologiaServicio: PatologiaService,
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
        this.patologia = new Patologia(0,'','',1);
      }
    
    ngOnInit(){
      this.buscarPatologiasActivas();
    }

    buscarPatologiasActivas(){
        let activo = 1;
        this._patologiaServicio.getPatologiasActivos(activo).toPromise().then((response: any) => {
            if(response == null){
              console.log('error');                    
            }else{
                this.patologias = response.lista_patologia;
            }
          }
        );  
    }
  
  onNuevaPatologia(modalAltaEdicion){
    this.patologia = new Patologia(0,'','',0);
    this.alta = true;
    this.tituloModal = 'Crear Patologia';

    this.modalService.open(modalAltaEdicion).result.then( 
        (result) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
  }

  onEditar(modalAltaEdicion, patologia){
    this.patologia = patologia;
    this.alta = false;
    this.tituloModal = 'Modificar Patologia';

    this.modalService.open(modalAltaEdicion).result.then( 
      (result) => {
          this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  onBorrar(eliminarModal,patologia){
    this.tituloModal = 'Eliminar Patología';
    this.patologia = patologia;
    this.modalService.open(eliminarModal).result.then( 
        (result) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
  }

  onConfirmaBorrar(patologia){
    patologia.activo = 0;
    this._patologiaServicio.deletePatologia(patologia).toPromise().then((data: any) => {
        if(!data){
            this.alertMessage = 'Algo salio mal. Reintentar';
            this.tipoMessage = "alert alert-warning alert-with-icon",
            this.showNotification();
            this.modalService.dismissAll();        
        }else{
            console.log('res',data);
            this.alertMessage = 'Patologia Eliminada';
            this.tipoMessage = "alert alert-success alert-with-icon",
            this.showNotification();
            this.modalService.dismissAll();
            this.buscarPatologiasActivas();
        }
    });
  }
  

  onAccion(){ 
    if(this.alta){
        this.patologia.activo = 1;
        this._patologiaServicio.add(this.patologia).toPromise().
        then((data:any) => {
            if(!data){
              console.log('error');    
              //VER BIEN ESTE TEMA, LA DEVOLCUION DE ERRORES, 
              //CORREO REPETIDOS ETC.
              this.alertMessage = 'Algo salio mal. Reintentar.';
              this.tipoMessage = "alert alert-warning alert-with-icon",
              this.showNotification();
              this.modalService.dismissAll();
            }
            this.alertMessage = 'Patología creada.';
            this.tipoMessage = "alert alert-success alert-with-icon",
            this.showNotification();
            this.modalService.dismissAll();
            this.buscarPatologiasActivas();
            this.patologia = new Patologia(0,'','',1);
          }
        );
    }else{
        // console.log('usuario antes de editar',this.usuario);
        this._patologiaServicio.update(this.patologia).toPromise().
        then((data:any) => {
            if(!data){
            //   console.log('error');    
              //VER BIEN ESTE TEMA, LA DEVOLCUION DE ERRORES, 
              //CORREO REPETIDOS ETC.
              this.alertMessage = 'Algo salio mal. Reintentar.';
              this.tipoMessage = "alert alert-warning alert-with-icon",
              this.showNotification();
              this.modalService.dismissAll();
            }
            console.log('response',data);
            this.alertMessage = 'Patología modificada.';
            this.tipoMessage = "alert alert-success alert-with-icon",
            this.showNotification();
            this.modalService.dismissAll();
            this.buscarPatologiasActivas();
          }
        );
    }
  }


  /*PARA SABER COMO SALIO DEL MODAL */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {            
        return 'by clicking on a backdrop';

    } else {            
        return `with: ${reason}`;
    }
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
