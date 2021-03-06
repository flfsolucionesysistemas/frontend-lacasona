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
    selector: 'creaEvolucion-cmp',
    moduleId: module.id,
    templateUrl: 'creaEvolucion.component.html',
    providers:[UsuarioService,Hc_TratamientoService,EvolucionService,HistoriaClinicaService ]
})

export class CreaEvolucionComponent implements OnInit{
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
    public evolucion : Evolucion;
    
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
        this.evolucion = new Evolucion(0,0,hoy,'','','','','','','','',1,0,0);
    }

    ngOnInit(){
        this._route.params.subscribe((params: Params) => this.pacienteParametro = params['idPaciente']);
        this.buscarPaciente(this.pacienteParametro);
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
                        // console.log('hc por persona',response.body);
                        let hc = response.body;
                        this.cgip = hc[0].numero_historia_clinica;
                        
                        // CON EL HC BUSCO EL TRATAMIENTO DE HC_TRATAMIENTO, lo necesito cuando guarde la evolucion
                        let idHC = hc[0].id_historia_clinica;
                        this._hcTratamientoServicio.getHCTratamientoPorHC(idHC).toPromise().then((response : any)=>{
                            if(response == null){
                                console.log('error');
                            }else{
                                console.log('hc tratamietno por hc',response.body);
                                let idT = response.body;
                                this.id_hc_tratamiento = idT[0].id_hc_tratamiento;
                            }    
                        })
                    }
                })
            }
          }
        );
    }

    onEvolucion(){
        this.evolucion.id_persona_creacion = this.identity.id_persona;
        this.evolucion.id_hc_tratamiento = this.id_hc_tratamiento;
        // console.log(this.evolucion);

        this._evolucionServicio.add(this.evolucion).toPromise().then((response : any)=>{
            if(response == null){
                console.log('error');
            }else{
                // console.log(response);
                if(response.sql.affectedRows > 0){
                    this.tipoMessage = "alert alert-success alert-with-icon";
                }else{
                    this.tipoMessage = "alert alert-danger alert-with-icon";
                }
    
                this.alertMessage =  response.mensaje;
                this.showNotification();
        
                let myDate = new Date();
                let hoy = myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
                this.evolucion = new Evolucion(0,0,hoy,'','','','','','','','',1,0,0);
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
