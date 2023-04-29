export default interface Leader {
  id?: string;
  documento: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  uid?: string;
  email: string | null;
  contraseña: string | null;
  edad: string | null;
  rol: 'lider';
}
