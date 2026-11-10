/** La API respondio con un error (4xx o 5xx). El mensaje es el que devolvio la API. */
export class ErrorApi extends Error {
  constructor(
    public readonly status: number,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = 'ErrorApi';
  }
}

/** No hubo respuesta: la API esta caida o no hay conexion. */
export class ErrorRed extends Error {
  constructor() {
    super('No se pudo conectar con la cafeteria. Revisa tu conexion e intenta de nuevo.');
    this.name = 'ErrorRed';
  }
}

/** La API respondio, pero el cuerpo no cumple el contrato acordado. */
export class ErrorContrato extends Error {
  constructor(public readonly detalle: string) {
    super('La respuesta del servidor no tiene el formato esperado.');
    this.name = 'ErrorContrato';
  }
}
