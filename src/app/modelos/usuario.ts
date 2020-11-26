export class Usuario{
	constructor(
		public id_persona: number,
		public id_tipo_persona: number,
		public localidad: number,
		public dni: string,
		public nombre: string,
		public apellido: string,
		public usuario: string,
		public clave: string,
		public email: string,
		public telefono: string,
		public estado: string,
		public activo:number,
		// public nombre_tipo_persona:string,
	){}
}