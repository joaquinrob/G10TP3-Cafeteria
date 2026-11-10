import { CarritoProvider } from './carrito/CarritoContext';
import { Encabezado } from './componentes/Encabezado';
import { CargaMenu } from './menu/CargaMenu';
import { PantallaPedido } from './pedido/PantallaPedido';
import { leerMesa } from './utils/mesa';

export function App() {
  const mesa = leerMesa(window.location.search);

  return (
    <CarritoProvider>
      <Encabezado mesa={mesa} />
      <main className="container pb-4">
        <CargaMenu>{(productos) => <PantallaPedido productos={productos} mesa={mesa} />}</CargaMenu>
      </main>
    </CarritoProvider>
  );
}
