# Cafeteria Origen - Menu de mesa

TP3 de Programacion IV (UTN FRBB). En cada mesa de Origen hay un codigo QR: al escanearlo se abre el menu en el celular, el cliente arma su pedido y lo envia directo a la API.

El repositorio tiene dos proyectos:

| Carpeta | Que es |
|---|---|
| `/` (raiz) | API del Parcial I con los cambios del TP3 (Node, Express y TypeScript) |
| `frontend/` | Menu de mesa (Vite 7, React 19 y TypeScript estricto) |

## Requisitos

- Node 20.19 o superior y npm.

## Como levantar la API

Desde la raiz del repositorio:

```bash
npm install
npm run dev
```

La API queda en http://localhost:3000. Los pedidos se guardan en memoria: se pierden al reiniciar.

Variables de entorno (opcionales):

| Variable | Para que sirve | Por defecto |
|---|---|---|
| `PORT` | Puerto de la API | `3000` |
| `NODE_ENV=test` | Habilita los endpoints `/__test__/reset` y `/__test__/seed` | sin definir |

## Como levantar el front

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El front queda en http://localhost:5173. Para simular el QR de una mesa, abrirlo con `?mesa=N`, por ejemplo http://localhost:5173/?mesa=4. Sin `?mesa` (o con un valor invalido) el pedido es para retirar en la barra.

El front busca la API en `http://localhost:3000`. Para usar otra direccion se define `VITE_API_URL`:

```bash
VITE_API_URL=http://localhost:3100 npm run dev
```

## Como correr los tests

| Nivel | Herramientas | Donde | Como correrlo |
|---|---|---|---|
| API (unitarios e integracion) | Vitest y Supertest | `tests/` | `npm test` en la raiz |
| Unitarios del front | Vitest | `frontend/src/**` | `cd frontend` y `npm test` |
| Componentes del front | Vitest, React Testing Library, user-event y jest-dom | `frontend/src/**` | `cd frontend` y `npm test` |
| Integracion del front | MSW 2 | `frontend/src/**` | `cd frontend` y `npm test` |
| E2E | Playwright | `frontend/e2e/` | `cd frontend` y `npm run test:e2e` |

- `npm test` en `frontend/` corre unitarios, componentes e integracion **sin necesitar la API levantada**: MSW imita la API.
- Los E2E usan la API y el front reales. Antes de la primera vez hay que instalar el navegador con `npx playwright install chromium`. Despues `npm run test:e2e` levanta solo la API (en modo test, puerto 3100) y el front (puerto 5273), asi que no hace falta tener nada corriendo y no choca con `npm run dev`.
- Cada E2E empieza con `POST /__test__/reset`, para arrancar siempre con los mismos datos.
- Cobertura de la API: `npm run coverage` en la raiz.

## Contrato de la API que usa el front

El front valida cada respuesta con esquemas de Zod (`frontend/src/api/contrato.ts`). Si una respuesta no cumple el contrato, se muestra un error.

### GET /productos y GET /productos/:id

Devuelven el precio ya calculado por el dominio (`calcularPrecio()`) y el `tipo` del producto (`expreso`, `filtrado` o `pasteleria`). El front no calcula precios.

```json
{
  "id": 5,
  "tipo": "expreso",
  "nombre": "Expreso Mediano Colombia",
  "precioBase": 2500,
  "tamanio": "Mediano",
  "gramosCafe": 27,
  "variedad": {
    "nombre": "Colombia",
    "descripcion": "Acidez media, cuerpo equilibrado y notas citricas y florales"
  },
  "precio": 7360
}
```

Una pasteleria no trae `tamanio`, `gramosCafe` ni `variedad`:

```json
{ "id": 19, "tipo": "pasteleria", "nombre": "Muffin de chocolate", "precioBase": 2500, "precio": 2500 }
```

### POST /pedidos

`mesaId` es opcional. Sin `mesaId` el pedido es para retirar en la barra.

```json
{
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```

Responde `201` con el pedido, su estado inicial y el total calculado por la API:

```json
{
  "id": 1,
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ],
  "estado": "pendiente",
  "total": 17220
}
```

Estados posibles: `pendiente`, `en preparacion` y `entregado`.

### GET /pedidos/:id

Devuelve el pedido con su estado, sus items y su total (el mismo formato de arriba). El front lo usa para seguir el pedido sin recargar la pagina.

### Errores

Todos los errores responden `{ "error": "mensaje" }`, y el front muestra el mensaje tal cual:

| Codigo | Cuando |
|---|---|
| 400 | Datos invalidos: items vacio, cantidad que no es un entero mayor a 0, `mesaId` invalido, id no numerico o JSON mal formado |
| 404 | Producto, pedido o ruta inexistente |
| 413 | Cuerpo de la solicitud demasiado grande |
| 500 | Falla interna inesperada (sin mostrar detalles) |

Una mesa o un producto inexistente responde 400 o 404, nunca 500.

### CORS

Habilitado para cualquier origen (metodos `GET`, `POST` y `OPTIONS`), para que el front pueda llamar a la API desde otro puerto.

### Endpoints de apoyo para los E2E

Solo existen con `NODE_ENV=test`. Fuera de ese modo responden 404.

| Endpoint | Que hace |
|---|---|
| `POST /__test__/reset` | Borra todos los pedidos y reinicia la numeracion (responde 204) |
| `POST /__test__/seed` | Hace un reset y carga los pedidos que se le pasen en `{ "pedidos": [...] }`. Sin cuerpo carga un pedido fijo (responde 201) |

### Reportes (no los usa el front)

`GET /reportes/facturacion` y `GET /reportes/mas-vendido`.

## Flujo de trabajo

- Todo se desarrollo con TDD. Los commits marcan cada fase: `test(red):` (el test falla), `feat(green):` (el codigo minimo que lo pasa) y `refactor:` (se mejora sin tocar los tests).
- Los E2E y algunos tests que ya pasan de entrada se commitean como `test:`.
- Una rama por funcionalidad, integrada a `main` con Pull Request (con merge commit).

## Versiones fijadas del front

Vite 7.3.8, Vitest 3.2.7, MSW 2.15.0 y Zod 4.6.7 (versiones exactas en `frontend/package.json`).
