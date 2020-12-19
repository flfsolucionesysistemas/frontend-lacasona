import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

import { Tratamiento } from "../../modelos/tratamiento";

import { UsuarioService } from "../../servicios/usuario";
import { TratamientoService } from "../../servicios/tratamiento";

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    styleUrls: ['dashboard.style.less'],
    templateUrl: 'dashboard.component.html',
    providers:[UsuarioService, TratamientoService],
})

export class DashboardComponent implements OnInit{
  public identity;  
  public token;
  public tratamiento : Tratamiento;

  public lista: any[];
  public timeline;
  public cantidadPacientes;
  public entrevistasPendientes;

  
  coloresFase6 = [{ico: 'blanco'},{ico: 'amarillo'},{ico: 'azul'},{ ico: 'verde'},{ ico: 'violeta'},{ ico: 'naranja'}];

  coloresFase4 = [{ico: 'blanco'},{ico: 'amarillo'},{ico: 'verde'},{ico: 'naranja'}];  

  constructor( 
    private _usuarioServicio:UsuarioService,
    private _tratamientoServicio: TratamientoService,
  ){
    this.identity = this._usuarioServicio.getIdentity();
    this.token = this._usuarioServicio.getToken();
    this.tratamiento = new Tratamiento(0,'-',0,0,0,'-','-','-','',1,0);
  }

  ngOnInit(){
    // this.buscarUsuarioTipo(3);
    // this.buscarUsuarioTipo(4);
    if(this.identity.nombre == 'Paciente'){
      this.buscarTratamientoActivoPorPaciente();
      this.buscarTimeline();
    }
  }

  buscarTimeline(){
    // this._tratamientoServicio.getTimeline(this.identity.id_persona).toPromise().then((response: any) => {
    //   if(response == null){
    //     console.log('error');                    
    //   }else{
    //     var cantFases = response.sql[0].fases;
    //     var listaTime = response.sql;
    //     var limit = listaTime.length;
    //     this.timeline = [];

    //     if(cantFases == 6){
    //       for (var i = 0; i < limit  ; i++){
    //         var dato = {
    //           ico: this.coloresFase6[i].ico,
    //           titulo: listaTime[i].fase,
    //           texto: listaTime[i].consideraciones_evaluacion
    //         };    
    //         this.timeline.push(dato);
    //       }
    //     }else{
    //       if(cantFases == 4){
    //         for (var i = 0; i < limit; i++){
    //           var dato = {ñ
    //             ico: this.coloresFase4[i].ico,
    //             titulo: listaTime[i].fase - 1,
    //             texto: listaTime[i].consideraciones_evaluacion
    //           };                
    //           this.timeline.push(dato);
    //         }
    //       }
    //     }
        
    //     if(cantFases == 6){
    //       for (var j = limit; j <= listaTime[0].fases; j++){
    //         var datoNo = {
    //           ico: 'gray-lighter',
    //           titulo: j,
    //           texto: 'Pendiente'
    //         };    
    //         this.timeline.push(datoNo);
    //     }
    //     }else{
    //       if(cantFases == 4){
    //         for (var j = limit; j <= listaTime[0].fases - 1 ; j++){
    //             var datoNo = {
    //               ico: 'gray-lighter',
    //               titulo: j,
    //               texto: 'Pendiente'
    //             };    
    //             this.timeline.push(datoNo);
    //         }  
    //     }
    //   }  
    //   }
    // });
  }

  buscarTratamientoActivoPorPaciente(){
    this._tratamientoServicio.getTratamientoActivoPorPersonaConInfoTratamiento(this.identity.id_persona).toPromise().then((response: any) => {
      if(response == null){
        console.log('error');                    
      }else{
        this.tratamiento = response.sql[0];
        // console.log(response);
      }  
    });
  }

  buscarUsuarioTipo(tipo){
    this._usuarioServicio.getUsuarioTipo(tipo).toPromise().then((response: any) => {
        if(response == null){
          console.log('error');                    
        }else{
          this.lista = response;
          for (let p of Object.keys(response)) {
            this.lista = response[p];
          }

          switch (tipo) {
            case 3:{
              this.entrevistasPendientes = this.lista.length;  
              break;
            }
            case 4:{
              this.cantidadPacientes = this.lista.length;  
              break;
            } 
          }
        }
      }
    );
  }


}
