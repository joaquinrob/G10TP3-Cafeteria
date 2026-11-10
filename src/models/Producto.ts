export abstract class Producto {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly precioBase: number,
  ) {}

  /** Precio base. Las subclases lo extienden con super.calcularPrecio(). */
  calcularPrecio(): number {
    return this.precioBase;
  }
}
