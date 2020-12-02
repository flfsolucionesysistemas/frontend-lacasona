import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "../../servicios/usuario";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";


// modelos
import { Turno } from "../../modelos/turno";

//servicios
import { TurnoService } from "../../servicios/turno";

@Component({
    selector: 'turno-cmp',
    moduleId: module.id,
    templateUrl: 'turno.component.html',
    providers:[UsuarioService,TurnoService],    
})

export class TurnoComponent implements OnInit{
    public identity;  
    public token;

    public alertMessage;
    public tipoMessage;

    public turno: Turno;
    public turnos:Turno[];
    public turnosAdd:Turno[];
    
    public tipo:any;
    closeResult: string;

    public alta;
    public tituloModal;    
    constructor( 
        private modalService: NgbModal,
        private toastr: ToastrService,
        private _usuarioServicio:UsuarioService,
        private _turnoService: TurnoService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
        let hoy = new Date();
        this.turno = new Turno(0,hoy,'','','',0,0,0);
      }
    
    ngOnInit(){
      this.buscarTurnosEntrevista();
      this.buscarTurnosTratamiento();
    }

    buscarTurnosEntrevista(){
      this._turnoService.getTurnos(0).toPromise().then((data:any) => {
        if(data!=null){
          this.turnos = data.body;
        }
      });
    }
    
  buscarTurnosTratamiento(){
    this._turnoService.getTurnos(1).toPromise().then((data:any) => {
      if(data!=null){
        this.turnos = data.body;
      }
    });
  }

  onSeleccionarPorTipo(tipo){
    if(tipo=='Tratamiento'){
      this.buscarTurnosTratamiento();  
    }else{
      if(tipo=='Entrevista'){
        this.buscarTurnosEntrevista();
      }
    }
  }

  onEditar(modalAltaEdicion, turno){
    this.turno = turno;
    this.alta = false;
    this.tituloModal = 'Modificar Turno';

    this.modalService.open(modalAltaEdicion).result.then( 
      (result) => {
          this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  onBorrar(eliminarModal,turno){
    this.tituloModal = 'Eliminar Turno';
    this.turno = turno;
    this.modalService.open(eliminarModal).result.then( 
        (result) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
  }

  onConfirmaBorrar(turno){
    this.turno = turno;
    this.turno.observacion = 'eliminado';
    this.turno.estado = '0';
    console.log(this.turno);
    this._turnoService.delete(this.turno).toPromise().
      then((data:any) => {
          if(!data){
          //   console.log('error');    
            //VER BIEN ESTE TEMA, LA DEVOLCUION DE ERRORES, 
            //CORREO REPETIDOS ETC.
            this.alertMessage = 'Algo salio mal.';
            this.tipoMessage = "alert alert-warning alert-with-icon",
            this.showNotification();
            this.modalService.dismissAll();
          }
          console.log('response',data);
          this.alertMessage = 'Turno eliminado';
          this.tipoMessage = "alert alert-success alert-with-icon",
          this.showNotification();
          this.modalService.dismissAll();
          // this.buscarUsuariosActivos();
        }
      );
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
