import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";


//MODELO
import { Tratamiento} from "../../modelos/tratamiento";

//SERVICIOS
import { TratamientoService } from "../../servicios/tratamiento";
import { UsuarioService } from "../../servicios/usuario";


@Component({
    selector: 'tratamiento-cmp',
    moduleId: module.id,
    templateUrl: 'tratamiento.component.html',
    providers:[UsuarioService,TratamientoService],    
})

export class TratamientoComponent implements OnInit{
    public alertMessage;
    public tipoMessage;

    public identity;  
    public token;
    public tratamiento : Tratamiento;
    public tratamientos : Tratamiento[];

    public alta;
    public tituloModal;

    closeResult: string;

    constructor( 
        private modalService: NgbModal,
        private toastr: ToastrService,
        private _usuarioServicio:UsuarioService,
        private _tratamientoServicio:TratamientoService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
        this.tratamiento = new Tratamiento(0,'',0,0,0,'','','',1,'');
      }
    
    ngOnInit(){
      this.buscarTratamientosActivas();
    }

    buscarTratamientosActivas(){
        this._tratamientoServicio.getTratamientosActivos(1).toPromise().then((response: any) => {
            if(response == null){
              console.log('error');                    
            }else{
                this.tratamientos = response.lista_tratamientos;
            }
          }
        );  
    }
  
  onNuevoTratamiento(modalAltaEdicion){
    this.tratamiento = new Tratamiento(0,'',0,0,0,'','','',1,'');
    this.alta = true;
    this.tituloModal = 'Crear Tratamiento';

    this.modalService.open(modalAltaEdicion).result.then( 
        (result) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
  }

  onEditar(modalAltaEdicion, tratamiento){
    this.tratamiento= tratamiento;
    this.alta = false;
    this.tituloModal = 'Modificar Tratamiento';

    this.modalService.open(modalAltaEdicion).result.then( 
      (result) => {
          this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  onBorrar(eliminarModal,tratamiento){
    this.tituloModal = 'Eliminar Tratamiento';
    this.tratamiento = tratamiento;
    this.modalService.open(eliminarModal).result.then( 
        (result) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
  }

  onConfirmaBorrar(tratamiento){
    tratamiento.activo = 0;
    this._tratamientoServicio.deleteTratamiento(tratamiento).toPromise().then((data: any) => {
      // console.log('res',data);
      this.alertMessage = 'Tratamiento Eliminado';
      this.tipoMessage = "alert alert-success alert-with-icon",
      this.showNotification();
      this.modalService.dismissAll();
      this.buscarTratamientosActivas();
    });
  }
  

  onAccion(){ 
    if(this.alta){
        this.tratamiento.activo = 1;
        this._tratamientoServicio.add(this.tratamiento).toPromise().
        then((data:any) => {
          if(data.affectedRows = 1){
            this.alertMessage = "Tratamiento creado con éxito";
            this.tipoMessage = "alert alert-success alert-with-icon",
            this.showNotification();
            this.modalService.dismissAll();
            this.buscarTratamientosActivas();
            this.tratamiento = new Tratamiento(0,'',0,0,0,'','','',1,'');
          }
        });
    }else{
        // console.log('usuario antes de editar',this.usuario);
        this._tratamientoServicio.update(this.tratamiento).toPromise().
        then((data:any) => {
            this.alertMessage = data.mensaje;
            this.tipoMessage = "alert alert-success alert-with-icon",
            this.showNotification();
            this.modalService.dismissAll();
            this.buscarTratamientosActivas();
            this.tratamiento = new Tratamiento(0,'',0,0,0,'','','',1,'');
        });
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
