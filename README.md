# Cafeteria Origen - API (base del TP3)

API de pedidos de la cafeteria Origen (Programacion IV, UTN FRBB). Es la API del Parcial I,
desarrollada con TDD. Sobre esta base se construye el menu de mesa del TP3.

## Requisitos
- Node 20 o superior

## Instalar y correr
```bash
npm install
npm run dev        # servidor en http://localhost:3000
npm test           # tests
npm run coverage   # cobertura
```

## Endpoints actuales
| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /productos | Lista de productos con su precio |
| GET | /productos/:id | Un producto |
| POST | /pedidos | Crea un pedido y devuelve su total (201) |
| GET | /pedidos | Lista de pedidos |
| GET | /pedidos/:id | Un pedido |
| GET | /reportes/facturacion | Total facturado |
| GET | /reportes/mas-vendido | Producto mas vendido |

Los errores responden `{ "error": "mensaje" }` con 400 (datos invalidos) o 404 (no existe).

## Estructura
- `src/models`: Producto, Cafe, Expreso, Filtrado, Pasteleria, Pedido
- `src/config`: precios y gramos
- `src/data`: catalogo de productos
- `src/repositories`: almacenamiento en memoria
- `src/services`: logica (precios, pedidos, reportes, validaciones)
- `src/routes` y `src/middleware`: capa HTTP
- `tests`: unitarios, repositorios, servicios y API (Vitest + Supertest)
