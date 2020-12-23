import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "../../servicios/usuario";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";

import * as moment from 'moment';
import { timer } from "rxjs";
// modelos
import { Turno } from "../../modelos/turno";
import { TurnoModificacion } from "../../modelos/turno_modificacion";
import { TurnoProfesionales } from "../../modelos/turno_profesionales";

//servicios
import { TurnoService } from "../../servicios/turno";
import { TipoPersonaService } from "../../servicios/tipos_persona";

@Component({
    selector: 'turno-cmp',
    moduleId: module.id,
    templateUrl: 'turno.component.html',
    providers:[UsuarioService,TipoPersonaService,TurnoService],    
})

export class TurnoComponent implements OnInit{
    public identity;  
    public token;

    public alertMessage;
    public tipoMessage;
    public turno: Turno;
    public turnos:Turno[];
    public turnoConsulta;

    alta;
    tituloModal;
    closeResult: string;
    listaProfesionaes:any [];

    hora;
    duracion;
    costo; 
    cantidad;

    constructor( 
        private modalService: NgbModal,
        private toastr: ToastrService,
        private _usuarioServicio:UsuarioService,
        private _tiposPersonaServicio:TipoPersonaService,
        private _turnoService: TurnoService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
      }
    
    ngOnInit(){
      if(this.identity.nombre == 'Admin'){
        this.buscarTurnosTodos();
      }
      // else{
      //   if(this.identity.nombre == 'Profesional'){
      //     this.buscarTurnosProfesionales();
      //   }        
      // }
    }

    // buscarTurnosProfesionales(){
    //   this._turnoService.getTurnosProfesionales().toPromise().then((data:any) => {
    //     if(data!=null){
    //       this.turnosP = data;
    //     }
    //   });  
    // }

    buscarTurnosTodos(){
      this._turnoService.getTurnosTodos().toPromise().then((data:any) => {
        if(data!=null){
          this.turnos = data;
        }
      });
    }

    onSwitch(){
      if(this.turnoConsulta){
        this.turnoConsulta=false;
        this.buscarTurnosConsulta();
      }else{
        this.turnoConsulta=true;
        this.buscarTurnosTratamiento();
        this.buscarProfesionales();
      }
    }  


    buscarProfesionales(){
      this._usuarioServicio.getUsuarioTipo(2).toPromise().then((response: any) => {
        if(response == null){
            console.log('error');                    
        }else{
            console.log(response);
            this.listaProfesionaes = response;
        }
      });
    }

    buscarTurnosConsulta(){
      this.turnos = [];
      this._turnoService.getTurnos(0).toPromise().then((data:any) => {
        if(data!=null){
          this.turnos = data.body;
        }
      });
    }
    
    buscarTurnosTratamiento(){
      this.turnos = [];
      this._turnoService.getTurnos(1).toPromise().then((data:any) => {
        if(data!=null){
          this.turnos = data.body;
        }
      });
    }

    onNuevoAgenda(modalNuevoTurno){
      let hoy = new Date();
      this.turno = new Turno(0,hoy,'',1,'',0,1,0);
      this.alta = true;
      this.tituloModal = 'Crear Agenda Profesionales';
      this.modalService.open(modalNuevoTurno).result.then( 
          (result) => {
              this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
      );
    }
  
    onNuevoConsulta(modalNuevoConsulta){
      let hoy = new Date();
      this.turno = new Turno(0,hoy,'',1,'',0,0,0);
      this.alta = true;
      this.tituloModal = 'Crear Turnos de Consulta';
      this.modalService.open(modalNuevoConsulta).result.then( 
          (result) => {
              this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
      );
    }

    onAccion(tipo){
      console.log(tipo);
      // CREO UNA VARIABLE 'DATE' DESDE LA HORA DEFINIDA POR EL USUARIO
      if(tipo=='consulta'){
        alert(tipo);
      }else{
        if(tipo=='agenda'){
          alert(tipo);
        }
      }
      
    }

    creaTurnoConsulta(){
      var date = moment(this.hora, "hh:mm").format('HH:mm');
      var cantidadCreada = 0;
      
      for (var i=1; i <= this.cantidad;i++){
        this.turno.hora = date;
  
        this._turnoService.add(this.turno).toPromise().then((response:any) => {
          if(!response){
              console.log('error');    
              this.alertMessage = 'Algo salio mal.';
              this.tipoMessage = "alert alert-warning alert-with-icon",
              this.showNotification();
              this.modalService.dismissAll();
          }else{
            console.log(response);
            cantidadCreada = cantidadCreada + 1;
            console.log(cantidadCreada + 'ok');
          }
        });
        date = moment(date, "hh:mm").add(this.duracion, 'minutes').format('HH:mm');
      }
  
      // this.alertMessage =  'Turnos creados';
      // this.tipoMessage = "alert alert-success alert-with-icon",
      // this.showNotification();
      // this.modalService.dismissAll();
      
      // this.buscarTurnosTodos();
    }

    creaTurnoProfesional(){

    }
    
    onSeleccionarProfesional(){
      
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
