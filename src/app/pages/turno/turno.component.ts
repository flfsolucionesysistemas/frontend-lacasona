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
    public turnosP:TurnoProfesionales[];
    public turnosPS:TurnoProfesionales[];
    public mostrarAsignar;

    public turnosAdd:Turno[];
    public turnoM : TurnoModificacion;    
    public tipo:any;
    closeResult: string;

    public alta;
    public tituloModal;    

    public duracion;
    public hora;
    public cantidad;
    public fechaFiltro;

    constructor( 
        private modalService: NgbModal,
        private toastr: ToastrService,
        private _usuarioServicio:UsuarioService,
        private _turnoService: TurnoService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
        let hoy = new Date();
        this.turno = new Turno(0,hoy,'',1,'',0,0,0);
      }
    
    ngOnInit(){
      if(this.identity.nombre == 'Admin'){
        this.buscarTurnosTodos();
      }else{
        if(this.identity.nombre == 'Profesional'){
          this.buscarTurnosProfesionales();
          this.turnosPS = [];
        }        
      }
    }

    buscarTurnosProfesionales(){
      this._turnoService.getTurnosProfesionales().toPromise().then((data:any) => {
        if(data!=null){
          this.turnosP = data;
        }
      });  
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

  buscarTurnosTodos(){
    this._turnoService.getTurnosTodos().toPromise().then((data:any) => {
      if(data!=null){
        this.turnos = data;
      }
    });
  }
  
  onSeleccionarPorTipo(tipo){
    if(tipo=='Tratamiento'){
      this.buscarTurnosTratamiento();  
      // this.turno.turno_tratamiento = 1;
      // this.tipo = 1;
    }else{
      if(tipo=='Entrevista'){
        this.buscarTurnosEntrevista();
        // this.turno.turno_tratamiento = 0;
        // this.turno.costo_base = 0;

        // this.tipo = 0;

      }
    }
    
  }

  onNuevoTurnoTipo(tipoCreacion){
    if(tipoCreacion == 'Entrevista'){
      this.turno.turno_tratamiento = 0;
      this.turno.costo_base = 2500;
    }else{
      if(tipoCreacion == 'Tratamiento'){
        this.turno.turno_tratamiento = 1;
        this.turno.costo_base = 0;
      }
    }
  }

  onNuevoTurno(modalNuevoTurno){
    let hoy = new Date();
    this.turno = new Turno(0,hoy,'',1,'',0,0,0);
    this.alta = true;
    this.duracion =0;
    this.cantidad=0;
    this.hora=0;
    this.tituloModal = 'Crear Turnos';
    this.modalService.open(modalNuevoTurno).result.then( 
        (result) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
  }

  onAccion(){
    // CREO UNA VARIABLE 'DATE' DESDE LA HORA DEFINIDA POR EL USUARIO
    var date = moment(this.hora, "hh:mm").format('HH:mm');
    var cantidadCreada = 0;
    
    for (var i=1; i <= this.cantidad;i++){
      this.turno.hora = date;
      // console.log(this.turno);
      if(this.turno.costo_base==0){this.turno.turno_tratamiento=1}

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

    this.alertMessage =  'Turnos creados';
    this.tipoMessage = "alert alert-success alert-with-icon",
    this.showNotification();
    this.modalService.dismissAll();
    
    // // busco los turnos disponibles
    this.buscarTurnosTodos();
  }

  onMarcarOcupado(t){
    let fechaObj = new Date(t.fecha);
    let date = ("0" +  fechaObj.getDate()).slice(-2);
    // current month
    let month = ("0" + ( fechaObj.getMonth() + 1)).slice(-2);
    // current year
    let year =  fechaObj.getFullYear();
    // prints date in YYYY-MM-DD format
    let fechaBien = year + "-" + month + "-" + date;

    this.turno = t;
    this.turnoM = new TurnoModificacion(this.turno.id_turno,fechaBien,
                  this.turno.hora,0,
                  'Marcado ocupado',this.turno.id_tipo_turno, 
                  this.turno.turno_tratamiento, this.turno.costo_base);
    console.log(this.turnoM);
    this._turnoService.update(this.turnoM).toPromise().
      then((data:any) => {
        if(!data){
          console.log('error' , data);    
          this.alertMessage = 'Algo salio mal.';
          this.tipoMessage = "alert alert-warning alert-with-icon",
          this.showNotification();
          this.modalService.dismissAll();
        }else{
          console.log(data);
          this.alertMessage = 'Turno marcado como ocupado.';
          this.tipoMessage = "alert alert-success alert-with-icon",
          this.showNotification();
          this.buscarTurnosTodos();
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


  filtrarLista(){
    
    if(this.identity.nombre == 'Admin'){
      this._turnoService.getTurnosPorFecha(this.fechaFiltro).toPromise().then((data:any) => {
        if(data!=null){
          this.turnos = data;
        }
      });
    }else{
      this._turnoService.getTurnosPorFecha(this.fechaFiltro).toPromise().then((data:any) => {
        if(data!=null){
          this.turnosP = data;
        }
      });        
    }
    // let fil = this.fechaFiltro + 'T03:00:00.000Z';
    // let filtrado = this.turnos.filter(
    //   f => f.fecha === fil);
    // console.log(filtrado);
  }

  enviarSeleccionado(turno){
    this.turnosPS.push(turno);
    const index = this.turnosP.indexOf(turno, 0);
    if (index > -1) {
      this.turnosP.splice(index, 1);
    }       

    if (this.turnosPS.length>0) {this.mostrarAsignar = true;}
  }

  enviarDisponible(turno){
    console.log(turno);
    this.turnosP.push(turno);
    const index = this.turnosPS.indexOf(turno, 0);
    if (index > -1) {
      this.turnosPS.splice(index, 1);
    }
    if (this.turnosPS.length==0) {this.mostrarAsignar = false;}
  }

  asignarTurnos(){
    // var cantidadCreada =0;

    // recorro el array de turnos seleccionados y agrego uno a uno
    for (var i=0; i<this.turnosPS.length; i++){
      this.turnosPS[i].id_profesional = this.identity.id_persona;
      this.turnosPS[i].estado = 1;
      
      let fechaObj = new Date(this.turnosPS[i].fecha);
      let date = ("0" +  fechaObj.getDate()).slice(-2);
      let month = ("0" + ( fechaObj.getMonth() + 1)).slice(-2);
      let year =  fechaObj.getFullYear();
      let fechaBien = year + "-" + month + "-" + date;
      this.turnosPS[i].fecha = fechaBien;

      this._turnoService.update(this.turnosPS[i]).toPromise().then((response:any) => {
        if(!response){
            console.log('error');    
            this.alertMessage = 'Algo salio mal.';
            this.tipoMessage = "alert alert-warning alert-with-icon",
            this.showNotification();
        }else{
          console.log(response);
          // cantidadCreada = cantidadCreada + 1;
          // console.log(cantidadCreada + 'ok');
        }
      });
    }
    
    this.alertMessage =  ' Turnos Asignados OK.';
    this.tipoMessage = "alert alert-success alert-with-icon",
    this.showNotification();
    
    //limpio lista seleccionado y busco los turnos para profesionales
    this.turnosPS = [];    
    this.turnosP = [];    
    // this.delay(1500);
    this.buscarTurnosProfesionales();
  }

  private delay(ms: number)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
