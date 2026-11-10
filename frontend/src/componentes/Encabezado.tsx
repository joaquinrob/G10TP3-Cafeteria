interface Props {
  /** Mesa del QR, o null si el pedido es para retirar en la barra. */
  mesa: number | null;
}

export function Encabezado({ mesa }: Props) {
  return (
    <header>
      <h1>Cafeteria Origen</h1>
      <p>{mesa === null ? 'Retiro en la barra' : `Mesa ${mesa}`}</p>
    </header>
  );
}
