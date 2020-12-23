import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "../../servicios/usuario";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";

import * as moment from 'moment';
// import { timer } from "rxjs";
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
    public turnoM: TurnoModificacion;
    public turnos:Turno[];
    public turnoConsulta;

    alta;
    tituloModal;
    closeResult: string;
    listaProfesionaes:any [];

    hora;
    hoy;
    duracion;
    costo; 
    cantidad;
    fechaFiltro;

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
      
      let myDate = new Date();
      this.hoy = myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
      this.fechaFiltro = this.hoy;

      this.buscarProfesionales();

      if(this.identity.nombre_tipo_persona == 'Admin'){
        // this.buscarTurnosTodos();
        //POR DEFECTO MUESTRA TODOS LOS TURNOS CON FECHA MAYOR A HOY
        this.buscarTurnosConsulta();
      }
    }

    buscarTurnosTodos(){
      this._turnoService.getTurnosTodos().toPromise().then((data:any) => {
        if(data!=null){
          this.turnos = data;
        }
      });
    }

    onSwitch(){
      this.fechaFiltro = null;
      if(this.turnoConsulta){
        this.turnoConsulta=false;
        this.buscarTurnosConsulta();
      }else{
        this.turnoConsulta=true;
        this.buscarTurnosTratamiento();
        
      }
    }  

    buscarProfesionales(){
      this._usuarioServicio.getUsuarioTipo(2).toPromise().then((response: any) => {
        if(response == null){
            console.log('error');                    
        }else{
            // console.log(response);
            this.listaProfesionaes = response;
        }
      });
    }

    buscarTurnosConsulta(){
      this.turnos = [];
      this._turnoService.getTurnosDisponiblesTipoTodos(0).toPromise().then((data:any) => {
        if(data!=null){
          this.turnos = data.body;
          // console.log(data.body);
        }
      });
    }
    
    buscarTurnosTratamiento(){
      this.turnos = [];
      this._turnoService.getTurnosDisponiblesTipoTodos(1).toPromise().then((data:any) => {
        if(data!=null){
          this.turnos = data.body;
          // console.log(this.turnos);
        }
      });
    }

    onNuevoAgenda(modalNuevoTurno){
      let hoy = new Date();
      this.turno = new Turno(0,hoy,'',1,'',0,1,0,0,true);
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
      this.turno = new Turno(0,hoy,'',1,'',0,0,0,0,false);
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
      // CREO UNA VARIABLE 'DATE' DESDE LA HORA DEFINIDA POR EL USUARIO
      if(tipo=='consulta'){
        this.creaTurnoConsulta();
      }else{
        if(tipo=='agenda'){
          this.creaTurnoAgenda();
        }
      }
      
    }

    creaTurnoConsulta(){
      var date = moment(this.hora, "hh:mm").format('HH:mm');
      var cantidadCreada = 0;
      
      for (var i=1; i <= this.cantidad;i++){
        this.turno.hora = date;
  
        // console.log(this.turno);
        this._turnoService.add(this.turno).toPromise().then((response:any) => {
          if(!response){
              // console.log('error');    
              this.alertMessage = 'Algo salio mal.';
              this.tipoMessage = "alert alert-warning alert-with-icon",
              this.showNotification();
              this.modalService.dismissAll();
          }else{
            // console.log(response);
            cantidadCreada = cantidadCreada + 1;
            // console.log(cantidadCreada + 'ok');
          }
        });
        date = moment(date, "hh:mm").add(this.duracion, 'minutes').format('HH:mm');
      }
  
      this.alertMessage =  'Turnos creados';
      this.tipoMessage = "alert alert-success alert-with-icon",
      this.showNotification();
      this.modalService.dismissAll();
      
      this.buscarTurnosConsulta();
    }

    creaTurnoAgenda(){
      
      var cantidadCreada = 0;
      
      for (var p=0; p<this.listaProfesionaes.length;p++){
        var date = moment(this.hora, "hh:mm").format('HH:mm');
        this.turno.id_profesional = this.listaProfesionaes[p].id_persona;
      
        for (var i=1; i <= this.cantidad;i++){
          this.turno.hora = date;
          // console.log(this.turno);
          this._turnoService.add(this.turno).toPromise().then((response:any) => {
            if(!response){
                console.log('error');    
                this.alertMessage = 'Algo salio mal.';
                this.tipoMessage = "alert alert-warning alert-with-icon",
                this.showNotification();
                this.modalService.dismissAll();
            }else{
              // console.log(response);
              cantidadCreada = cantidadCreada + 1;
              // console.log(cantidadCreada + 'ok');
            }
          });
          date = moment(date, "hh:mm").add(this.duracion, 'minutes').format('HH:mm');
        }
      }

      this.alertMessage =  'Agneda Para Profesionales Creado ok.';
      this.tipoMessage = "alert alert-success alert-with-icon",
      this.showNotification();
      this.modalService.dismissAll();
      
      this.buscarTurnosTratamiento();
    }
    
    onSeleccionarProfesional(){
      
    }


    filtrarLista(){
      if(this.turnoConsulta){
        if(this.identity.nombre_tipo_persona == 'Admin'){
          this._turnoService.getTurnosPorFechaTipo(this.fechaFiltro,1).toPromise().then((data:any) => {
            if(data!=null){
              console.log(data);
              this.turnos = data;
            }
          });
        }
      }else{
        if(this.identity.nombre_tipo_persona == 'Admin'){
          this._turnoService.getTurnosPorFechaTipo(this.fechaFiltro,0).toPromise().then((data:any) => {
            if(data!=null){
              console.log(data);
              this.turnos = data;
            }
          });
        }
      }
    }

    onMarcarOcupado(t){
      let fechaObj = new Date(t.fecha);
      let date = ("0" +  fechaObj.getDate()).slice(-2);
      let month = ("0" + ( fechaObj.getMonth() + 1)).slice(-2);
      let year =  fechaObj.getFullYear();
      let fechaBien = year + "-" + month + "-" + date;
  
      this.turno = t;
      this.turnoM = new TurnoModificacion(this.turno.id_turno,fechaBien,
                    this.turno.hora,0,
                    'Marcado ocupado',this.turno.id_tipo_turno, 
                    this.turno.turno_tratamiento, this.turno.costo_base,this.turno.id_profesional,1);
      // console.log(this.turnoM);
      this._turnoService.update(this.turnoM).toPromise().
        then((data:any) => {
          if(!data){
            console.log('error' , data);    
            this.alertMessage = 'Algo salio mal.';
            this.tipoMessage = "alert alert-warning alert-with-icon",
            this.showNotification();
            this.modalService.dismissAll();
          }else{
            // console.log(data);
            this.alertMessage = 'Turno marcado como ocupado.';
            this.tipoMessage = "alert alert-success alert-with-icon",
            this.showNotification();
            // this.buscarTurnosConsulta();
            if (this.fechaFiltro != this.hoy){
              this.filtrarLista();
            }else{
              this.buscarTurnosConsulta()
            }
          }
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
