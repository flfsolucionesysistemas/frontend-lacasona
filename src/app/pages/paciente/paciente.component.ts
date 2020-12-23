import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

//SERVICIOS
import { UsuarioService} from "../../servicios/usuario";
import { Hc_TratamientoService } from "../../servicios/hc_tratamiento";

//MODELOS
import { Usuario } from "../../modelos/usuario";

@Component({
    selector: 'paciente-cmp',
    moduleId: module.id,
    templateUrl: 'paciente.component.html',
    providers:[UsuarioService,Hc_TratamientoService]
})


export class PacienteComponent implements OnInit{
    public identity;  
    public token;
    public usuariosPacientes : Usuario[];
    public hc_tratamientos:any[];
    public hc_tratamientosf:any[];
    // public vigentes;
    public buscar;
    
    constructor(
      private _router: Router,
      private _usuarioServicio:UsuarioService,
      private _hcTratamientoServicio:Hc_TratamientoService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();
    }
        
    ngOnInit(){
        // this.buscarUsuarioTipo(4);
        this.buscarHc_tratamientoSinFechaAlta();
    }
    
    buscarHc_tratamientoSinFechaAlta(){
      this._hcTratamientoServicio.getHCTratamientoSinFechaAlta().toPromise().then((response:any)=>{
        if(response == null){
          console.log('error');                    
        }else{
          this.hc_tratamientos = response.body;
        }
      })
    }

    // onBuscarHc(){
    //   alert('cdf');
    // }
    // buscarUsuarioTipo(tipo){
    //   this._usuarioServicio.getUsuarioTipo(tipo).toPromise().then((response: any) => {
    //       if(response == null){
    //         console.log('error');                    
    //       }else{
    //         this.usuariosPacientes = response;
    //       }
    //     }
    //   );
    // }

    // onBuscar(){
    //   alert(this.buscar);
    //   this.hc_tratamientos = this.hc_tratamientos.filter(function(apellido){
        
    //     return this.hc_tratamientos.apellido == this.buscar;
        
    //   });
      
    // }

    onCrearEvaluacion(paciente){
      let idPaciente=paciente.id_persona;
      this._router.navigate(['/crearEvaluacion', idPaciente]);
    }
    
    onCrearEvolucion(paciente){
      let idPaciente=paciente.id_persona;
      this._router.navigate(['/crearEvolucion', idPaciente]);
    }
    
    onVerHC(usuario){
      // console.log(usuario);
    }

    onAltaHC(paciente){
      let idPaciente = paciente.id_persona;
      this._router.navigate(['/crearAlta', idPaciente]);
    }

    // filter() {
      // console.log(this.buscar);
      // this.hc_tratamientos = this.hc_tratamientos.filter(
      //   hct => hct.apellido === this.buscar);
      
      // this.hc_tratamientos.forEach(items, function(item) {
      //     if( item.label.toLowerCase().indexOf(this.buscar) >= 0 ) filtered.push(item);
      // });  
      // console.log(this.hc_tratamientos);
    // }
}