import { NgModule, Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";

// MODELOS
import { Usuario } from "./modelos/usuario";
import { Provincia } from "./modelos/provincia";
import { Localidad } from "./modelos/localidad";
import { Turno } from "./modelos/turno";
import { Consulta } from "./modelos/consulta";

//SERVICIOS
import { UsuarioService} from "./servicios/usuario";
import { ProvinciaService} from "./servicios/provincia";
import { LocalidadService} from "./servicios/localidad";
import { TurnoService} from "./servicios/turno";
import { ConsultaService} from "./servicios/consulta";


import { consoleTestResultHandler } from 'tslint/lib/test';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UsuarioService,TurnoService,ProvinciaService,LocalidadService, ConsultaService], 
})

export class AppComponent{
  public alertMessage;
  public tipoMessage;
  public identity;  
  public token;
  public titulo;
  public subtitulo;
  public errorMessage;

  public usuario : Usuario;
  public localidades : Localidad[];
  public localidadSeleccionada: number;
  public provincias: Provincia[];
  public provinciaSeleccionada: number;
  public factor;
  public costo_entrevista;

  public turnos: Turno[]; //SOLO LOS TURNOS CON FECHAS NO REPETIDAS
  public turnosTodos: Turno[]; //CON ESTE DESPUES BUSCO LAS HORAS DISPONIBLES
  public turnosHora:Turno[]; //LAS HORAS DE LA FECHA SELECCIONADA
  public turnoSeleccionado: number;

  public nuevaConsulta : Consulta;
  closeResult: string;
  public collapseDos = false;
  public collapseUno = true;


  // usuarioPattern = "[a-zA-Z]{6}";

  constructor( 
    private modalService: NgbModal,
    private _router: Router,
    private _consultaServicio:ConsultaService,
    private _usuarioServicio:UsuarioService,
    private toastr: ToastrService,
    private _localidadServicio:LocalidadService,
    private _provinciaSericio:ProvinciaService,
    private _turnoServicio:TurnoService
  ){
    this.usuario = new Usuario(0,3,1,'','','','','','','','',1);
    this.titulo = 'la casona web';
    this.subtitulo = 'Bienvenido a tu primer plataforma  de psicoterapia en línea.';
  }

  ngOnInit(){
    this.identity = this._usuarioServicio.getIdentity();
    this.token = this._usuarioServicio.getToken();
  }
  
  buscarTurnosEntrevista(tipo){
    this._turnoServicio.getTurnos(tipo).toPromise().then((response: any) => {
      if(response == null){
        console.log('error');                    
      }else{
        
        let lista:any[];
        lista = response;
        
        for (let p of Object.keys(response)) {
          var wregistro = response[p];
          lista = wregistro;        
          //ME QUEDO CON TODOS LOS TURNOS PARA BUSCAR DE ACA EL TURNO ELEGIDO
          this.turnosTodos = wregistro;
        }

        //FILTRO LOS TURNOS REPETIDOS
        this.turnos = lista.filter(
          (thing, i, arr) => arr.findIndex(t => t.fecha === thing.fecha) === i
        );      
        
        //ORDENO POR FECHA
        this.turnos.sort((a, b) => (a.fecha > b.fecha) ? 1 : -1)
      }
    });
  }

  onSeleccionTurno(fecha){
    //FILTRO LAS HORAS DE LOS TURNOS
    this.turnosHora = this.turnosTodos.filter(turno => turno.fecha == fecha);
    //ORDENO POR HORA
    this.turnosHora.sort((a, b) => (a.hora > b.hora) ? 1 : -1)

    this.turnoSeleccionado = this.turnosHora[0].id_turno;
  }

  onSeleccionTurnoFinal(turno){
    let idTurpo = turno.id_turno;
    this.turnoSeleccionado = idTurpo;
    // console.log(this.turnoSeleccionado);
    this.costo_entrevista = turno.costo_base * this.factor;
  }


  buscarProvincias(){
    this._provinciaSericio.getProvincias().toPromise().then((response: any) => {
      if(response == null){
        console.log('error');                    
      }else{
        let lista:any[];
        lista = response;
        for (let p of Object.keys(lista)) {
          var wregistro = lista[p];
          this.provincias = wregistro;
        }
        //SELECCION EL PRIMERO POR DEFECTO
        this.provinciaSeleccionada = this.provincias[0].id_provincia;
      }
    });
  }
  
  onSeleccionLocalidad(localidad){
    let id_localidad = localidad.id_localidad;
    this.localidadSeleccionada = id_localidad;     
  }

  //SEGUN LA PROVINCIA ELEGIDA BUSCO LAS CIUDADES
  onSeleccionProvivincia(provincia){
    this.provinciaSeleccionada = provincia.id_provincia;
    //GUARDO EL FACTOR, LO USO CUANDO SELCCIONE EL TURNO QUE ES EL QUE TIENE EL PRECIO BASE
    this.factor = provincia.factor;

    this._localidadServicio.getLocalidadesPorProvincia(provincia.id_provincia).toPromise().then((response: any) => {
      if(response == null){
        console.log('error');                    
      }else{
        let lista:any[];
        lista = response;
        for (let p of Object.keys(lista)) {
          var wregistro = lista[p];
          this.localidades = wregistro;
        }
        //SELECCION EL PRIMERO POR DEFECTO
        this.localidadSeleccionada = this.localidades[0].id_localidad;
      }
    });
  }

  onSubmit(){
    this._usuarioServicio.login(this.usuario).toPromise().
      then((data:any) => {
        this.usuario.apellido = data.apellido;
        this.usuario.usuario = data.nombre_usuario;
        this.usuario.id_persona = data.id_persona;

        let identity = data;
        this.identity = identity;
                
        if(!this.identity.id_persona){
          alert("El usuario no está correctamente logueado");
          console.log('error');
        }else{

          console.log(data);
          localStorage.setItem('identity', JSON.stringify(identity));          
                    
          //BUCAMOS EL TOKEN PARA ENVIAR A CADA PETICION HTTP          
          this._usuarioServicio.login(this.usuario, 'true').toPromise().
          then((data:any) => {
            let token = data.token;
            this.token = token;
            
            if(this.token <= 0){
              alert("El token no se ha generado correctamente");
            }else{
              //CREAMOS EL ELEMENTO LOCALSTORAGE PARA TENER EL TOKEN DISPONIBLE
              localStorage.setItem('token',token);
              
              //PARA QUE EN EL PROXIMO LOGUEO NO APAREZCAN LOS DATOS DEL QUE SE LOGUUEO ANTES
              this.usuario = new Usuario(0,3,1,'','','','','','','','',1);

              this.modalService.dismissAll();
              this._router.navigate(['']);
            }
          }), 
          error => {
            var errorMessage = <any>error;
    
            if(errorMessage != null){
              var body = JSON.parse(error._body);
              this.errorMessage = body.message;
    
              console.log(error);
            }
          }
        } 
      }
    );
  }

  miCasona(content1){
      this.modalService.open(content1).result.then( 
        (result) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );                                        
  }

  consulta(content2){
    // console.log('dale');
    this.buscarProvincias();
    //BUSCA LOS TURNOS DE TIPO ENTREVISTA 0
    this.buscarTurnosEntrevista(0);
    this.modalService.open(content2).result.then( 
      (result) => {
          this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );                                        
  }

  conocerMas(content3){
      this.modalService.open(content3).result.then( 
        (result) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  onCrearConsulta(){
    this.nuevaConsulta = new Consulta(
                          this.usuario.nombre,
                          this.usuario.apellido,
                          this.usuario.email,
                          this.usuario.telefono,
                          this.localidadSeleccionada,
                          this.turnoSeleccionado,
                          this.costo_entrevista);
                              
    this._consultaServicio.add(this.nuevaConsulta).toPromise().
      then((data:any) => {
          if (data.status == 400){
            this.tipoMessage = "alert alert-danger alert-with-icon";
          }else{
            this.tipoMessage = "alert alert-success alert-with-icon";
          }
          this.alertMessage = data.mensaje;
          this.showNotification();
          this.modalService.dismissAll();
        }
      ); 

    this.usuario = new Usuario(0,3,1,'','','','','','','','',1);
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