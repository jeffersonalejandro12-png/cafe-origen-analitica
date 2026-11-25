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

---



## MiniReto 3

**Objetivo**: Reescribir indicadores con `map`, `filter` y `reduce`, y construir agrupaciones y rankings con objetos como diccionarios y ordenamiento con criterio.

### Análisis por función (5 preguntas sobre colecciones)

1. **`totalVendidoM(ventas)`**

   - **¿Qué recorro?** El arreglo `ventas`.
   - **¿Qué filtro?** Nada (incluye todos los registros).
   - **¿Qué transformo?** Cada objeto `venta` en su valor monetario (`valorVenta(venta)`).
   - **¿Qué acumulo?** La suma total de los valores de venta (`acumulado + monto`, iniciando en `0`).
   - **¿Cómo agrupo?** No agrupa; reduce a un único número total.
2. **`unidadesVendidasM(ventas)`**

   - **¿Qué recorro?** El arreglo `ventas`.
   - **¿Qué filtro?** Nada (incluye todos los registros).
   - **¿Qué transformo?** Cada objeto `venta` en su `cantidad`.
   - **¿Qué acumulo?** La suma total de unidades (`acumulado + cantidad`, iniciando en `0`).
   - **¿Cómo agrupo?** No agrupa; reduce a un único número total.
3. **`ventasPorCiudadM(ventas, ciudad)`**

   - **¿Qué recorro?** El arreglo `ventas`.
   - **¿Qué filtro?** Las ventas cuya `ciudad` normalizada (`trim().toLowerCase()`) coincide con la ciudad solicitada.
   - **¿Qué transformo?** Las ventas filtradas a su valor monetario (`valorVenta(venta)`).
   - **¿Qué acumulo?** La suma de valores de las ventas de esa ciudad (iniciando en `0`).
   - **¿Cómo agrupo?** No agrupa en diccionario; filtra una ciudad y acumula su total.
4. **`totalPorCiudad(ventas)`**

   - **¿Qué recorro?** El arreglo `ventas`.
   - **¿Qué filtro?** Nada (procesa todas las ventas).
   - **¿Qué transformo?** Cada `venta` aporta su `valorVenta(venta)` bajo su clave de ciudad normalizada (`Medellín`, `Bogotá`, `Cali`, `Pereira`).
   - **¿Qué acumulo?** El monto acumulado por cada ciudad dentro de un objeto diccionario (`{}`).
   - **¿Cómo agrupo?** Usando un objeto acumulador donde la clave es el nombre de ciudad normalizado y el valor es el total vendido en ella.
5. **`unidadesPorProducto(ventas)`**

   - **¿Qué recorro?** El arreglo `ventas`.
   - **¿Qué filtro?** Nada (procesa todas las ventas).
   - **¿Qué transformo?** Cada `venta` aporta su `cantidad` asociada a su `producto` (`trim()`).
   - **¿Qué acumulo?** La suma de unidades por cada producto dentro de un objeto diccionario (`{}`).
   - **¿Cómo agrupo?** Usando un objeto acumulador cuya clave es el nombre del producto y cuyo valor es la cantidad total vendida.
6. **`topProductosPorValor(ventas, k)`**

   - **¿Qué recorro?** Primero `ventas` para acumular valores, luego `Object.entries(...)` para ordenar los pares `[producto, total]`.
   - **¿Qué filtro?** Recorta los `k` primeros elementos del ranking ordenado mediante `.slice(0, k)`.
   - **¿Qué transformo?** Primero acumula el valor por producto, luego convierte el diccionario en pares `[producto, total]` y finalmente formatea los `k` mejores como objetos `{ producto, totalValor }`.
   - **¿Qué acumulo?** El valor monetario generado por cada producto (`valorVenta(venta)`).
   - **¿Cómo agrupo?** Primero agrupa el valor total por producto en un objeto diccionario y luego ordena de mayor a menor sobre una copia (`[...entradas]`) sin mutar `ventas`.

## MiniReto 4

**Objetivo**: Integrar las funciones en un reporte de negocio legible por consola y aplicar depuración sistemática a los errores reportados.

### Error 1: "Bogotá aparecía dos veces"

- **Síntoma:** Al agrupar ventas por ciudad, `"Bogotá"` y `"Bogotá "` (o variaciones de mayúsculas/espacios) se registraban como dos claves distintas en el objeto acumulador.
- **Entrada que lo produce:** Registros con espacios extra al final o al inicio (ej. `"Bogotá "`) o diferencias de capitalización (ej. `"medellín"` frente a `"Medellín"`).
- **Hipótesis:** La agrupación usa `venta.ciudad` directamente como clave del objeto sin limpiar espacios ni estandarizar el formato del texto.
- **Prueba realizada:** Se revisó `totalPorCiudad(ventas)` y `ventasPorCiudad(ventas, "Bogotá ")` comparando la salida sin normalizar contra la salida aplicando `.trim()` y normalización de capitalización (`normalizarNombre`).
- **Causa:** Falta de normalización de cadenas (`trim()` y estandarización de casing) antes de crear o acumular claves en el diccionario de ciudades.
- **Corrección:** Se normalizó el nombre de ciudad antes de agrupar/comparar, unificando `"Bogotá"` y `"Bogotá "` en una sola entrada y dejando exactamente 4 ciudades (`Medellín`, `Bogotá`, `Cali` y `Pereira`).

### Error 2: "El ticket promedio daba NaN cuando filtraba un día sin ventas"

- **Síntoma:** Al calcular el ticket promedio sobre un subconjunto sin ventas válidas (como un día sin ventas), el resultado mostraba `NaN`.
- **Entrada que lo produce:** `ticketPromedio([])` o `ticketPromedio(ventasDelDia(ventas, "2026-09-10").registros)` (donde `registros` está vacío, `total = 0` y `ventasValidas = 0`).
- **Hipótesis:** La función divide `total / ventasValidas` sin verificar si `ventasValidas` es igual a `0`.
- **Prueba realizada:** Se ejecutó `ticketPromedio([])` y `ventasDelDia(ventas, "2026-09-10")` observando el valor de `total` y `ventasValidas`.
- **Causa:** División entre cero (`0 / 0`), que en JavaScript produce `NaN`.
- **Corrección:** Se añadió una guarda `if (ventasValidas === 0) return 0;` antes de realizar la división, garantizando `0` (y sin `NaN` ni errores) en días sin ventas o arreglos vacíos.


## MiniReto 5

**Objetivo**: Construir un generador de datos y un contador de operaciones para medir el crecimiento del trabajo de las funciones del motor.

### Comparación predicciones vs. resultados

- Al multiplicar `n` por 10 (`100` → `1.000` → `10.000` → `100.000`), las operaciones de `totalVendidoInst`, `ventaMayorInst` y `totalPorCiudadInst` crecen en un factor cercano a 10x, confirmando la predicción.
- `primeraVenta` permanece constante (`1` operación) en todos los tamaños de entrada.

### Clasificación Big O y justificación

- **`primeraVenta` — $O(1)$ (tiempo constante):** Accede directamente a `ventas[0]` sin depender de `n`.
- **`totalVendidoInst` — $O(n)$ (tiempo lineal):** Ejecuta un único ciclo `for...of` de `1` a `n` iteraciones, haciendo un trabajo constante por venta.
- **`ventaMayorInst` — $O(n)$ (tiempo lineal):** Recorre el arreglo una sola vez (`n` elementos) y realiza comparaciones de costo constante en cada paso.
- **`totalPorCiudadInst` — $O(n)$ en tiempo promedio (lineal):** Recorre los `n` registros una vez y normaliza/acumula en un objeto diccionario; las ciudades son un conjunto acotado (4 ciudades), por lo que el trabajo por registro es constante.
