# Bitácora - Café Origen Analítica

## Minireto 1

**Objetivo:** Configurar el proyecto, representar el historial de ventas como un
arreglo de objetos y explorarlo para identificar su estructura y sus
casos borde.

### Diccionario de datos

| Propiedad    | Tipo JS    | Significado                                                           |
| :----------- | :--------- | :-------------------------------------------------------------------- |
| `id`       | `number` | Identificador numérico único de cada transacción en la muestra.    |
| `fecha`    | `string` | Fecha de la venta en formato `YYYY-MM-DD`.                          |
| `cliente`  | `string` | Código identificador del cliente (ej. `C01`).                      |
| `producto` | `string` | Nombre del café o accesorio vendido (incluye gramaje cuando aplica). |
| `ciudad`   | `string` | Ciudad de destino o punto de venta asociada a la transacción.        |
| `cantidad` | `number` | Número de unidades vendidas en el registro.                          |
| `precio`   | `number` | Precio unitario en pesos colombianos (COP).                           |

### Casos borde detectados

- Inconsistencia de mayúsculas y minúsculas en `ciudad "Medellín", "medellín".`
- Cantidad igual a `0` en `id: 8`
- Clientes recurrentes vs. códigos secuenciales (`C01`, `C02`, `C03` repiten; `C04`–`C08` aparecen una vez)

---

## Minireto 2

**Objetivo:** Calcular indicadores básicos de negocio con ciclos manuales, aplicando
los patrones contador, acumulador y máximo, y manejando los casos borde
de forma explícita.

### Plan en pseudocódigo

1. **`valorVenta(venta)`**

   - Entrada: un objeto `venta` con `cantidad` y `precio`.
   - Acción: devolver `venta.cantidad * venta.precio`. (No requiere ciclo).
2. **`totalVendido(ventas)`**

   - Qué recorres: cada `venta` en `ventas`.
   - Valor inicial: `total = 0`.
   - Condición: ninguna (se suman todos los registros de la muestra, incluyendo los de `cantidad: 0` que aportan `0`).
   - Qué acumulas: `total += valorVenta(venta)`.
   - Retorno con arreglo vacío `[]`: `0`.
3. **`unidadesVendidas(ventas)`**

   - Qué recorres: cada `venta` en `ventas`.
   - Valor inicial: `unidades = 0`.
   - Condición: ninguna (se suman todas las `venta.cantidad`).
   - Qué acumulas: `unidades += venta.cantidad`.
   - Retorno con arreglo vacío `[]`: `0`.
4. **`ventaMayor(ventas)`**

   - Qué recorres: cada `venta` en `ventas`.
   - Valor inicial: `mejorVenta = null` (o el primer elemento si `ventas.length > 0`).
   - Condición: `mejorVenta === null || valorVenta(venta) > valorVenta(mejorVenta)`.
   - Qué acumulas/actualizas: `mejorVenta = venta` (guarda el registro completo, no solo el monto).
   - Retorno con arreglo vacío `[]`: `null`.
5. **`ticketPromedio(ventas)`**

   - Qué recorres: cada `venta` en `ventas`.
   - Valor inicial: `total = 0` y `ventasValidas = 0`.
   - Condición: `venta.cantidad > 0` para contar como venta válida.
   - Qué acumulas: si `venta.cantidad > 0`, `total += valorVenta(venta)` y `ventasValidas += 1`.
   - Retorno: si `ventasValidas === 0` (incluyendo arreglo vacío `[]`), devolver `0` para evitar división entre cero o `NaN`; si no, `total / ventasValidas`.
6. **`ventasPorCiudad(ventas, ciudad)`**

   - Qué recorres: cada `venta` en `ventas`.
   - Valor inicial: `totalCiudad = 0` y `ciudadBuscada = ciudad.trim().toLowerCase()`.
   - Condición: `venta.ciudad.trim().toLowerCase() === ciudadBuscada`.
   - Qué acumulas: `totalCiudad += valorVenta(venta)`.
   - Retorno con arreglo vacío `[]` (o ciudad sin ventas): `0`.

### Pruebas

#### totalVendido:

1. Arreglo completo: 985000
2. Un solo elemento: 84000
3. Arreglo vacío: 0

#### unidadesVendidas:

1. Arreglo completo: 20
2. Un solo elemento: 2
3. Arreglo vacío: 0

#### ventaMayor:

1. Arreglo completo: { id: 7, fecha: "2026-09-04", cliente: "C02", producto: "Molino manual", ciudad: "Bogotá", cantidad: 1, precio: 120000 }
2. Un solo elemento: { id: 1, fecha: "2026-09-01", cliente: "C01", producto: "Origen Huila 500 g", ciudad: "Medellín", cantidad: 2, precio: 42000 }
3. Arreglo vacío: null

#### ticketPromedio:

1. Arreglo completo: 89545.45454545454 (985000 / 11 ventas válidas)
2. Un solo elemento: 84000
3. Arreglo vacío: 0

#### ventasPorCiudad (buscando "Medellín"):

1. Arreglo completo: 356000 (incluye id 1, id 4, id 5 con "medellín" y id 11)
2. Un solo elemento: 84000 (si se busca otra ciudad distinta a "Medellín", da 0)
3. Arreglo vacío: 0
