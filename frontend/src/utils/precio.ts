/** Formato de precio en pesos: separador de miles con punto y simbolo $ (por ejemplo $7.360). */
export function formatearPrecio(valor: number): string {
  return '$' + String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
