export class Tratamiento{
	constructor(
		public id_tratamiento: number,
		public id_historia_clinica: number,
		public id_patologia: number,
		public fase: string,
		public costo: number,
		public descripcion: string,
	){}
}