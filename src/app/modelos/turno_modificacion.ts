export class TurnoModificacion{
	constructor(
		public id_turno:number,
		public fecha: string,
		public hora: string,
		public estado:number,
		public observacion:string,
		public id_tipo_turno:number,
		public turno_tratamiento: number,
		public costo_base: number,
	){}
}