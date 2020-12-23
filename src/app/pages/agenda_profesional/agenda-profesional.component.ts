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
    selector: 'agenda-profesional-cmp',
    moduleId: module.id,
    styleUrls: ['agenda-profesional.component.css'],
    templateUrl: 'agenda-profesional.component.html',
    providers:[UsuarioService,TipoPersonaService,TurnoService],    
})

export class AgendaProfesionalComponent implements OnInit{
    public identity;  
    public token;

    public alertMessage;
    public tipoMessage;
    public turno: Turno;
    public turnoM : TurnoModificacion;
    public turnosAux: Turno[];
    public turnos:Turno[];
    public turnoConsulta;

    closeResult: string;
    listaProfesionaes:any [];

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
      let hoy = myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
      this.fechaFiltro = hoy;

      if(this.identity.nombre_tipo_persona == 'Profesional'){
        this.buscarTurnosTratamiento();
      }
    }

    // buscarTurnosTodos(){
    //   this._turnoService.getTurnosTodos().toPromise().then((data:any) => {
    //     if(data!=null){
    //       this.turnos = data;
    //     }
    //   });
    // }
    buscarTurnosTratamiento(){
      this.turnos = [];
      this.turnosAux = [];
                               
      this._turnoService.getTurnosDisponiblesTipoTodos(1).toPromise().then((data:any) => {
        if(data!=null){
          this.turnosAux = data.body;
          console.log(data);
          this.filtroProfesional();
          
        }
      });
    }

    filtroProfesional(){
      this.turnos = [];
      if(this.turnosAux != undefined){
        for (var i=0; i < this.turnosAux.length; i++){
          if(this.turnosAux[i].id_profesional == this.identity.id_persona){
            this.turnos.push(this.turnosAux[i]);
            // console.log(this.turnosAux[i]);    
          }
        }
      }
    }

    filtrarLista(){
      if(this.identity.nombre_tipo_persona == 'Profesional'){
        this._turnoService.getTurnosPorFechaTipo(this.fechaFiltro,1).toPromise().then((data:any) => {
          if(data!=null){
            this.turnosAux = data;
            this.filtroProfesional();
          }
        });
      }
    }

    onTrash(t){
      // console.log('trash');
      // console.log(t);
      let fechaObj = new Date(t.fecha);
      let date = ("0" +  fechaObj.getDate()).slice(-2);
      let month = ("0" + ( fechaObj.getMonth() + 1)).slice(-2);
      let year =  fechaObj.getFullYear();
      let fechaBien = year + "-" + month + "-" + date;
  
      this.turno = t;
      this.turnoM = new TurnoModificacion(this.turno.id_turno,fechaBien,
                    this.turno.hora,0,
                    'Profesional No Disponible',this.turno.id_tipo_turno, 
                    this.turno.turno_tratamiento, this.turno.costo_base,this.turno.id_profesional,0);
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
            // console.log(data);
            this.alertMessage = 'Turno marcado como ocupado.';
            this.tipoMessage = "alert alert-success alert-with-icon",
            this.showNotification();
            // this.buscarTurnosTratamiento();
            this.filtrarLista();  
          }
        }
      );
    }

    onCheck(t){
      // console.log('check');
      // console.log(t);
      let fechaObj = new Date(t.fecha);
      let date = ("0" +  fechaObj.getDate()).slice(-2);
      let month = ("0" + ( fechaObj.getMonth() + 1)).slice(-2);
      let year =  fechaObj.getFullYear();
      let fechaBien = year + "-" + month + "-" + date;
  
      this.turno = t;
      this.turnoM = new TurnoModificacion(this.turno.id_turno,fechaBien,
                    this.turno.hora,0,
                    'Libre',this.turno.id_tipo_turno, 
                    this.turno.turno_tratamiento, this.turno.costo_base,this.turno.id_profesional,1);
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
            // console.log(data);
            this.alertMessage = 'Turno reasignado al profesional.';
            this.tipoMessage = "alert alert-success alert-with-icon",
            this.showNotification();
            // this.buscarTurnosTratamiento();
            this.filtrarLista();
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
