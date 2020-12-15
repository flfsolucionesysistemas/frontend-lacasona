export class Evolucion{
	constructor(
		public id_persona_creacion:number,
		public id_hc_tratamiento:number,
		public fecha_creacion:string,
		public hora_inicio:string,
		public hora_cierre:string,
		public intervenciones_realizadas:string,
		public respuesta_intervencion:string,
		public consideraciones_evolucion:string,
		public participantes_evaluacion:string,
		public resultado_evaluacion:string,
		public consideraciones_evaluacion:string,
		public es_evolucion:number,
		public avanzo:number,
		public fase:number,
	){}
}