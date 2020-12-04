export class Tratamiento{
	constructor(
		public id_tratamiento: number,
		public programa_tratamiento: string,
		// public derivacion_psicoterapia: string,
		public sesiones_psiquiatricas: number,
		public sesiones_psicologicas : number,
		public sesiones_grupales :number, 
		public frecuencia: string, 
		public abordaje : string, 
		// public otras_prestaciones: string,
		public tiempo_probable :string,
		public activo:number,
		public costo_mensual,
	){}
}