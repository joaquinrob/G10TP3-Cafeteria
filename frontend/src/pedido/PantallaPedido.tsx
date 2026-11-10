import type { Producto } from '../api/contrato';
import { useCarrito } from '../carrito/CarritoContext';
import { itemsParaPedido } from '../carrito/selectores';
import type { ProductoCarrito } from '../carrito/tipos';
import { Carrito } from '../componentes/Carrito';
import { Pasteleria } from '../componentes/Pasteleria';
import { SelectorCafe } from '../componentes/SelectorCafe';
import { PedidoConfirmado } from './PedidoConfirmado';
import { useEnvioPedido } from './useEnvioPedido';

interface Props {
  productos: Producto[];
  /** Mesa del QR, o null si el pedido es para retirar en la barra. */
  mesa: number | null;
}

export function PantallaPedido({ productos, mesa }: Props) {
  const { estado, dispatch } = useCarrito();
  const { envio, confirmar, reiniciar } = useEnvioPedido(mesa);

  if (envio.estado === 'confirmado') {
    return <PedidoConfirmado pedido={envio.pedido} onNuevoPedido={reiniciar} />;
  }

  const agregar = ({ id, nombre, precio }: ProductoCarrito) =>
    dispatch({ tipo: 'agregar', producto: { id, nombre, precio } });

  async function alConfirmar() {
    const confirmado = await confirmar(itemsParaPedido(estado));
    if (confirmado) dispatch({ tipo: 'vaciar' });
  }

  return (
    <>
      <SelectorCafe productos={productos} onAgregar={agregar} />
      <Pasteleria productos={productos} onAgregar={agregar} />
      {envio.estado === 'error' && <p role="alert">{envio.mensaje}</p>}
      <Carrito onConfirmar={alConfirmar} enviando={envio.estado === 'enviando'} />
    </>
  );
}
