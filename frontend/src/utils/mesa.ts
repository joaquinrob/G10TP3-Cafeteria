/** Lee la mesa del QR (?mesa=N). Devuelve null si no hay mesa: el pedido es para retirar en la barra. */
export function leerMesa(search: string): number | null {
  const valor = new URLSearchParams(search).get('mesa');
  return valor ? Number(valor) : null;
}
