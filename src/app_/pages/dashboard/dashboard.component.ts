import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

import { Tratamiento } from "../../modelos/tratamiento";

import { UsuarioService } from "../../servicios/usuario";
import { TratamientoService } from "../../servicios/tratamiento";
import { Hc_TratamientoService } from "../../servicios/hc_tratamiento";


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    styleUrls: ['dashboard.style.less'],
    templateUrl: 'dashboard.component.html',
    providers:[UsuarioService,Hc_TratamientoService, TratamientoService],
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
    private _hcTratamientoServicio:Hc_TratamientoService
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
    }
  }

  buscarTimeline(){
    var faseActual;
    var fases;
    var consideraciones:string;
    var fecha;

    this.timeline=[];
    this._hcTratamientoServicio.getFaseActual(this.identity.id_persona).toPromise().then((response : any)=>{
      if(response == null){
          console.log('error');
      }else{
        // console.log(response);
        faseActual = response.sql[0].fase; 
        fases = response.sql[0].fases;        
        consideraciones = response.sql[0].consideraciones_evaluacion;
        
        if(fases == 6){
          for (var i=0;i<fases;i++){
            // console.log('indice',i);
            // console.log('indice',i);
            if(i < faseActual){
              var dato = {
                ico: this.coloresFase6[i].ico,
                titulo: i,
                texto: "Avanzado",
                actual: ""                
              }
            }
            if(i == faseActual){
              var dato = {
                ico: this.coloresFase6[i].ico,
                titulo: i,
                texto: consideraciones,
                actual: "Fase actual"       
              };  
            }  
            if(i > faseActual){
              var dato = {
                ico: this.coloresFase6[i].ico,
                titulo: i,
                texto: "Pendiente",
                actual: ""       
              };    
            }

            this.timeline.push(dato);
          }
        }else{
          if(fases == 4){
            for (var i=0;i<fases;i++){
              //si es la misma fase completo con las consideraciones
              
              if(i < faseActual){
                var dato = {
                  ico: this.coloresFase4[i].ico,
                  titulo: i,
                  texto: "Avanzado",
                  actual: ""       
                }
              }

              if(i == faseActual){
                var dato = {
                  ico: this.coloresFase4[i].ico,
                  titulo: i,
                  texto: consideraciones,
                  actual: ""       
                };  
              }  
              if(i > faseActual){
                var dato = {
                  ico: this.coloresFase4[i].ico,
                  titulo: i,
                  texto: "",
                  actual: ""       
                };    
              }

              this.timeline.push(dato);
            }  
          }
        }
      }    
    });    
    // console.log(this.timeline);
  }

  buscarTratamientoActivoPorPaciente(){
    this._tratamientoServicio.getTratamientoActivoPorPersonaConInfoTratamiento(this.identity.id_persona).toPromise().then((response: any) => {
      if(response == null){
        console.log('error');                    
      }else{
        this.tratamiento = response.sql[0];
        // console.log(response);
        this.buscarTimeline();
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
