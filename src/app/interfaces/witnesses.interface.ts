export interface Witness {
  id?: string;
  documento: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  uid?: string;
  email: string;
  puesto: string;
  contraseña: string;
  fechaNacimiento: string;
  genero: string;
  rol: 'testigo'
}
