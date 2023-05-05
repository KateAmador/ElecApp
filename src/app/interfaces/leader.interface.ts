export interface Leader {
  id?: string;
  documento: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  uid?: string;
  email: string;
  contraseña: string;
  fechaNacimiento: string;
  genero: string;
  rol: 'lider';
}
