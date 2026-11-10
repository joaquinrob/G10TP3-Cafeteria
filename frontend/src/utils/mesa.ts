/** Lee la mesa del QR (?mesa=N). Devuelve null si no hay mesa: el pedido es para retirar en la barra. */
export function leerMesa(search: string): number | null {
  const valor = new URLSearchParams(search).get('mesa');
  if (valor === null || !/^\d+$/.test(valor)) return null;

  const mesa = Number(valor);
  return mesa > 0 ? mesa : null;
}
