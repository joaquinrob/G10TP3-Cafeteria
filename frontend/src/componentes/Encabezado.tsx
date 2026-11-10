interface Props {
  /** Mesa del QR, o null si el pedido es para retirar en la barra. */
  mesa: number | null;
}

export function Encabezado({ mesa }: Props) {
  return (
    <header className="container py-3">
      <h1 className="h3 mb-1">Cafeteria Origen</h1>
      <p className="mb-0 text-secondary">{mesa === null ? 'Retiro en la barra' : `Mesa ${mesa}`}</p>
    </header>
  );
}
