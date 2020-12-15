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
  
  constructor( 
    private _usuarioServicio:UsuarioService,
    private _tratamientoServicio: TratamientoService,
  ){
    this.identity = this._usuarioServicio.getIdentity();
    this.token = this._usuarioServicio.getToken();
    this.tratamiento = new Tratamiento(0,'-',0,0,0,'-','-','-','',1,0);
    // this.timeline =  [
    //   {
    //     ico: 'primary',
    //     titulo: 'titulo 1',
    //     texto: 'texto 1'
    //   },
    //   {
    //       ico: 'success',
    //       titulo: 'titulo 2',
    //       texto: 'texto 2'
    //   },
    //   {
    //       ico: 'info',
    //       titulo: 'titulo 3',
    //       texto: 'texto 3'
    //   }
    // ];

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
    this._tratamientoServicio.getTimeline(this.identity.id_persona).toPromise().then((response: any) => {
      if(response == null){
        console.log('error');                    
      }else{

        console.log(response.sql);
        var listaTime = response.sql;
        var limit = listaTime.length;
        var nuevoInicio:number = listaTime.length + 1;
        this.timeline = [];

        //COMPLETO CON LAS FASES AVANZADAS
        for (var i = 0; i < limit ; i++){
          switch (listaTime[i].fase){
            case 1:{
              var dato = {
                ico: 'primary',
                titulo: listaTime[i].fase,
                texto: listaTime[i].consideraciones_evaluacion
              };                
              this.timeline.push(dato);
              break;
            }
            case 2:{
              var dato = {
                ico: 'success',
                titulo: listaTime[i].fase,
                texto: listaTime[i].consideraciones_evaluacion
              };    
              this.timeline.push(dato);
              break;            
            }
            case 3:{
              var dato = {
                ico: 'danger',
                titulo: listaTime[i].fase,
                texto: listaTime[i].consideraciones_evaluacion
              };    
              this.timeline.push(dato);
              break;            
            }
            case  4:{
              var dato = {
                ico: 'warnig',
                titulo: listaTime[i].fase,
                texto: listaTime[i].consideraciones_evaluacion
              };    
              this.timeline.push(dato);
              break;            
            }
            case  5:{
              var dato = {
                ico: 'info',
                titulo: listaTime[i].fase,
                texto: listaTime[i].consideraciones_evaluacion
              };    
              this.timeline.push(dato);
              break;            
            }
            case  6:{
              var dato = {
                ico: 'light',
                titulo: listaTime[i].fase,
                texto: listaTime[i].consideraciones_evaluacion
              };    
              this.timeline.push(dato);
              break;            
            }
          }
        }

        //COMPLETO CON LAS FASES NO AVANZADAS
        for (var i = nuevoInicio; i <= listaTime[0].fases; i++){
          if(i == nuevoInicio){
            var datoNo = {
              ico: 'actual',
              titulo: i,
              texto: 'Actual'
            };    
            this.timeline.push(datoNo);  
          }else{
            var datoNo = {
              ico: 'gray-dark',
              titulo: i,
              texto: 'no completa'
            };    
            this.timeline.push(datoNo);
          }
        }  

        console.log(this.timeline);
      }  
    });
  }

  buscarTratamientoActivoPorPaciente(){
    this._tratamientoServicio.getTratamientoActivoPorPersonaConInfoTratamiento(this.identity.id_persona).toPromise().then((response: any) => {
      if(response == null){
        console.log('error');                    
      }else{
        // console.log(response.sql);
        this.tratamiento = response.sql[0];
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

  onBlog(){
    window.open('http://lacasonacoop.com/#!/blog/');
  }

}
