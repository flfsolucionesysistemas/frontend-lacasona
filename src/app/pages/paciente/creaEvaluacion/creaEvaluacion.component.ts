import { NgModule, Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";

//MODELOS
import { Usuario } from "../../../modelos/usuario";
import { HistoriaClinica } from "../../../modelos/historiaClinica";
import { Evolucion } from "../../../modelos/evolucion";

//SERVICIOS
import { UsuarioService } from "../../../servicios/usuario";
import { HistoriaClinicaService } from "../../../servicios/historia_clinica";
import { EvolucionService } from "../../../servicios/evolucion";
import { Hc_TratamientoService } from "../../../servicios/hc_tratamiento";

@Component({
    selector: 'creaEvaluacion-cmp',
    moduleId: module.id,
    templateUrl: 'creaEvaluacion.component.html',
    providers:[UsuarioService,Hc_TratamientoService,EvolucionService,HistoriaClinicaService ]
})

export class CreaEvaluacionComponent implements OnInit{
    public alertMessage;
    public tipoMessage;
    public identity;  
    public token;
    public errorMessage;

    public usuario:Usuario;
    public pacienteParametro;
    public paciente:Usuario;

    public cgip;
    public nombreApellidoPaciente;
    public id_hc_tratamiento;
    public fase;
    public fasesT;
    public evaluacion : Evolucion;

    public fases:any[];
    coloresFase6 = [{ico: '#fff'},{ico: '#e6f608'},{ico: '#0920f3'},{ ico: '#20f366'},{ ico: '#683ae6'},{ ico: '#f37209'}];
    coloresFase4 = [{ico: '#fff'},{ico: '#e6f608'},{ico: '#20f366'},{ico: '#f37209'}];  
  
    // coloresFase6 = [{ico: 'amarillo'},{ico: 'azul'},{ ico: 'verde'},{ ico: 'violeta'},{ ico: 'naranja'}];
    // coloresFase4 = [{ico: 'amarillo'},{ico: 'verde'},{ico: 'naranja'}];  
  
    constructor(
        private toastr: ToastrService,
        private modalService: NgbModal,
        private _router: Router,
        private _route: ActivatedRoute,
        private _hcServicio: HistoriaClinicaService,
        private _usuarioServicio: UsuarioService,
        private _evolucionServicio:EvolucionService,
        private _hcTratamientoServicio:Hc_TratamientoService
      ){
        this.identity = this._usuarioServicio.getIdentity();
        this.token = this._usuarioServicio.getToken();


        let myDate = new Date();
        let hoy = myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
        this.evaluacion = new Evolucion(0,0,hoy,'','','','','','','','',0,0,0);
    }

    ngOnInit(){
        this._route.params.subscribe((params: Params) => this.pacienteParametro = params['idPaciente']);
        this.buscarPaciente(this.pacienteParametro);
        //this.completarFases();
        // alert('cdf');
    }

    completarFases(){
        this.fases=[];
        console.log('fase',this.fasesT);
        console.log('fase',this.coloresFase4);
        // buscar la cantidad de fases del tratamiento
        // con el maximo de fases que envia el metodo GETFASEACTUAL
        if(this.fasesT == 4){
            for (var i = 0; i < this.fasesT; i++){
                var dato = {
                    ico: this.coloresFase4[i].ico,
                    fase: i+1
                };    
                this.fases.push(dato);
            }
        }else{
            if(this.fasesT == 6){
                for (var i = 0; i < this.fasesT; i++){
                    var dato = {
                        ico: this.coloresFase6[i].ico,
                        fase: i+1
                    };
                    this.fases.push(dato);
                }
            }
        }
        console.log(this.fases);
    }
    
    onSeleccionarFase(fase){
        this.evaluacion.fase = fase;
    }

    buscarPaciente(idPaciente){    
        this._usuarioServicio.getUsuario(idPaciente).toPromise().then((response: any) => {
            if(response == null){
              console.log('error');                    
            }else{
                this.paciente = response;  
                this.nombreApellidoPaciente = this.paciente[0].apellido + ', ' + this.paciente[0].nombre;
                // CON EL PACIENTE BUSCO EL NRO DE CGIP DE LA HISTORIA CLINICA
                this._hcServicio.getHCPorPersona(idPaciente).toPromise().then((response: any )=>{
                    if(response == null){
                        console.log('error');
                    }else{
                        console.log(response.body);

                        let hc = response.body;
                        this.cgip = hc[0].numero_historia_clinica;
                        
                        // CON EL HC BUSCO EL TRATAMIENTO DE HC_TRATAMIENTO, lo necesito cuando guarde la evaluacion
                        let idHC = hc[0].id_historia_clinica;
                        this._hcTratamientoServicio.getHCTratamientoPorHC(idHC).toPromise().then((response : any)=>{
                            if(response == null){
                                console.log('error');
                            }else{
                                console.log(response.body);
                                let idT = response.body;
                                this.id_hc_tratamiento = idT[0].id_hc_tratamiento;
                          
                                this._hcTratamientoServicio.getFaseActual(this.pacienteParametro).toPromise().then((response : any)=>{
                                    if(response == null){
                                        console.log('error');
                                    }else{
                                        console.log(response.sql[0].fase);
                                        this.fase = response.sql[0].fase; 
                                        this.fasesT = response.sql[0].fases;        
                                        
                                        this.completarFases();
                                    }    
                                })    
                            }    
                        })
                    }
                })
            }
          }
        );
    }

    onEvaluacion(){
        this.evaluacion.id_persona_creacion = this.identity.id_persona;
        this.evaluacion.id_hc_tratamiento = this.id_hc_tratamiento;

        console.log(this.evaluacion);
        this._evolucionServicio.add(this.evaluacion).toPromise().then((response : any)=>{
            if(response == null){
                console.log('error');
            }else{
                if(response.sql.affectedRows > 0){
                    this.tipoMessage = "alert alert-success alert-with-icon";
                }else{
                    this.tipoMessage = "alert alert-danger alert-with-icon";
                }
    
                this.alertMessage =  response.mensaje;
                this.showNotification();
        
                let myDate = new Date();
                let hoy = myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
                this.evaluacion = new Evolucion(0,0,hoy,'','','','','','','','',0,0,0);
                this._router.navigate(['/paciente']);
            }
        })
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
