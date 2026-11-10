import { describe, it, expect } from 'vitest';
import { ErrorApi, ErrorContrato, ErrorRed } from '../api/errores';
import { mensajeDeError } from './mensajeDeError';

describe('mensajeDeError', () => {
  it('muestra el mensaje que devolvio la API', () => {
    expect(mensajeDeError(new ErrorApi(500, 'Error interno del servidor'))).toBe('Error interno del servidor');
  });

  it('muestra el mensaje de red cuando la API esta caida', () => {
    expect(mensajeDeError(new ErrorRed())).toBe(
      'No se pudo conectar con la cafeteria. Revisa tu conexion e intenta de nuevo.',
    );
  });

  it('muestra el mensaje de contrato cuando la respuesta no tiene el formato esperado', () => {
    expect(mensajeDeError(new ErrorContrato('detalle tecnico'))).toBe(
      'La respuesta del servidor no tiene el formato esperado.',
    );
  });

  it('no muestra el detalle de un error inesperado', () => {
    expect(mensajeDeError(new Error('detalle interno'))).toBe('Ocurrio un error inesperado. Intenta de nuevo.');
  });

  it('usa el mensaje generico si lo que se lanzo no es un Error', () => {
    expect(mensajeDeError('texto suelto')).toBe('Ocurrio un error inesperado. Intenta de nuevo.');
  });
});
