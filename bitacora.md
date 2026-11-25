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

---



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

---



## MiniReto 6

**Objetivo**: Diagnosticar la complejidad de una función con ciclos anidados, medir su
 tiempo real y predecir su comportamiento con volúmenes que todavía no
existen.

### 1. Traza con un arreglo de 5 ventas y generalización

Supongamos un arreglo de 5 ventas con clientes:
`["C01", "C02", "C01", "C03", "C02"]` (índices `0` a `4`).

- `i = 0` (`"C01"`): compara `j = 1, 2, 3, 4` → **4 comparaciones** (`j = 2` coincide → agrega `"C01"`).
- `i = 1` (`"C02"`): compara `j = 2, 3, 4` → **3 comparaciones** (`j = 4` coincide → agrega `"C02"`).
- `i = 2` (`"C01"`): compara `j = 3, 4` → **2 comparaciones**.
- `i = 3` (`"C03"`): compara `j = 4` → **1 comparación**.
- `i = 4` (`"C02"`): `j` inicia en `5` y no entra → **0 comparaciones**.

Total de comparaciones para $n = 5$:

$$
4 + 3 + 2 + 1 = 10 \text{ comparaciones}
$$

**Generalización para $n$ ventas:**
La suma de pares $(i, j)$ con $0 \le i < j < n$ es:

$$
\text{Comparaciones} = \frac{n(n - 1)}{2} = \frac{n^2 - n}{2}
$$

Al crecer $n$, el término dominante es $\frac{n^2}{2}$, lo que corresponde a un crecimiento cuadrático **$O(n^2)$**.

### 2. Mediciones de tiempo al duplicar $n$

*(Reemplaza los valores de `Tiempo (ms)` con los que obtengas al ejecutar `node src/medir-recurrentes.js`)*

| `n`  | Tiempo (`ms`)    | Factor vs. anterior |
| :----- | :----------------- | :------------------ |
| 1.000  | *(tu medición)* | —                  |
| 2.000  | *(tu medición)* | ~4x                 |
| 4.000  | *(tu medición)* | ~4x                 |
| 8.000  | *(tu medición)* | ~4x                 |
| 16.000 | *(tu medición)* | ~4x                 |

**Análisis de duplicación y $O(n^2)$:**
Cuando $n$ se duplica ($\times 2$), el número de pares $\frac{n(n-1)}{2}$ se multiplica aproximadamente por $2^2 = 4$. Por eso el tiempo de ejecución crece cerca de **4 veces** en cada duplicación, característica de una complejidad cuadrática $O(n^2)$.

### 3. Estimación para 100.000 y 1.000.000 de ventas

Usando la regla cuadrática a partir de la medición base en $n_{\text{base}} = 16.000$ con tiempo $t_{\text{base}}$:

$$
t_{\text{estimado}}(n) = t_{\text{base}} \times \left(\frac{n}{16.000}\right)^2
$$

- Para $n = 100.000$ ($\text{factor} = 6.25 \implies 6.25^2 = 39.0625$): se multiplica el tiempo de $16.000$ por $\approx 39.1$.
- Para $n = 1.000.000$ ($\text{factor} = 62.5 \implies 62.5^2 = 3.906.25$): se multiplica el tiempo de $16.000$ por $\approx 3.906.25$.
  *(Solo se ejecuta $n = 100.000$ si la estimación resulta menor a $120.000\text{ ms}$ / 2 minutos).*

### 4. Costo oculto de `recurrentes.includes(...)` en el peor caso

`recurrentes.includes(ventas[i].cliente)` no es una consulta instantánea: recorre el arreglo `recurrentes` elemento por elemento hasta encontrar el valor o llegar al final. En el **peor caso** (cuando casi todos los clientes son recurrentes, por lo que `recurrentes` crece hasta tamaño $k$, cercano a $n$), cada verificación dentro del doble ciclo puede costar hasta $O(n)$, elevando aún más el trabajo total en el peor caso (hasta $O(n^3)$ en el peor escenario teórico si se evalúa en cada iteración del par).

### 5. Conclusión para la gerente (sin tecnicismos)

Cuando Café Origen tenía pocas ventas, revisar cada compra contra todas las demás tomaba un instante. Pero cuando el negocio crezca a cientos de miles o un millón de ventas, comparar cada compra con el resto del historial hace que el trabajo se dispare muchísimo más rápido que la cantidad de ventas: duplicar las ventas cuadruplica la espera, y pasar a un millón de ventas puede hacer que el reporte tarde minutos en responder.

---


## MiniReto 7

**Objetivo**: Analizar la complejidad espacial de las funciones del motor y comparar una cadena de métodos con un recorrido único.

### 1. Comparación de `totalCiudadCadena` vs. `totalCiudadUnaPasada`

| Aspecto                                | `totalCiudadCadena`                                                                                 | `totalCiudadUnaPasada`                                                              |
| :------------------------------------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **Recorridos completos**         | **4 pasadas** (`map` normaliza, `filter` filtra, `map` calcula valor, `reduce` acumula) | **1 pasada** (`for...of` evalúa y acumula en un solo ciclo)                  |
| **Arreglos nuevos creados**      | **3 arreglos intermedios** (el del primer `map`, el de `filter` y el del segundo `map`)   | **0 arreglos intermedios**                                                      |
| **Complejidad temporal (Big O)** | $O(n)$ (en detalle, $4n$ recorridos → se simplifica a $O(n)$)                                  | $O(n)$ (en detalle, $1n$ recorrido → $O(n)$)                                   |
| **Complejidad espacial (Big O)** | $O(n)$ en memoria auxiliar por los arreglos intermedios (hasta tamaño $n$)                       | $O(1)$ en memoria auxiliar (solo variables escalares como `objetivo` y `total`) |

### 2. Por qué $O(4n)$ se simplifica a $O(n)$

En notación Big O analizamos la **tasa de crecimiento asintótica** cuando $n$ crece mucho, no el conteo exacto de instrucciones. Multiplicar el trabajo por una constante fija (como hacer $4$ pasadas en vez de $1$, es decir, $4n$) escala de forma **lineal** con $n$: si $n$ se multiplica por 10, $4n$ también se multiplica por 10. Por las reglas de simplificación de Big O, **se eliminan las constantes multiplicativas**, por lo que tanto $O(4n)$ como $O(n)$ pertenecen a la clase $O(n)$.

### 3. Complejidad espacial del motor (memoria adicional)

- **`primeraVenta`:** Espacio $O(1)$ — no crea estructuras proporcionales a `ventas`.
- **`valorVenta`:** Espacio $O(1)$ — solo multiplica dos valores.
- **`totalVendido` / `totalVendidoM` / `unidadesVendidas` / `unidadesVendidasM`:**
  - `totalVendido` y `unidadesVendidas` (con `for...of`): Espacio auxiliar $O(1)$ (solo un acumulador numérico).
  - `totalVendidoM` y `unidadesVendidasM` (con `.map().reduce()`): Espacio auxiliar $O(n)$ por el arreglo intermedio creado por `.map()`.
- **`ventaMayor`:** Espacio auxiliar $O(1)$ — guarda solo una referencia al registro mayor actual.
- **`ticketPromedio`:** Espacio auxiliar $O(1)$ — usa dos contadores/acumuladores numéricos.
- **`ventasPorCiudad` / `ventasPorCiudadM`:**
  - `ventasPorCiudad` (con `for...of`): Espacio auxiliar $O(1)$ (un acumulador numérico).
  - `ventasPorCiudadM` (`.filter().reduce()`): Espacio auxiliar $O(n)$ en el peor caso (si todas las ventas pertenecen a esa ciudad, `.filter()` crea un arreglo de tamaño $n$).
- **`ventasDelDia`:** Espacio $O(k)$ donde $k \le n$ es la cantidad de ventas del día filtrado (en el peor caso, si todas las ventas son del mismo día, $O(n)$).
- **`totalPorCiudad`:** Espacio auxiliar $O(c)$ donde $c$ es el número de ciudades distintas. Como el conjunto de ciudades es acotado/fijo (4 ciudades en el dominio actual), en práctica es $O(1)$ acotado (o $O(u)$ si el número de ciudades únicas creciera con los datos).
- **`unidadesPorProducto`:** Espacio auxiliar $O(p)$ donde $p$ es el número de productos distintos (en el catálogo actual es acotado, y en general proporcional a la cantidad de productos únicos).
- **`topProductosPorValor`:** Espacio auxiliar $O(p)$ para el diccionario de productos y el arreglo de entradas/ordenamiento (donde $p$ es la cantidad de productos distintos; $p \le n$).
- **`clientesRecurrentes`:** Espacio auxiliar $O(r)$ donde $r \le n$ es la cantidad de clientes recurrentes almacenados en el arreglo `recurrentes` (en el peor caso, $O(n)$).

### 4. Decisión final y justificación

Dejaré **`totalCiudadUnaPasada`** como implementación principal en el motor para producción/marketplace. Aunque `totalCiudadCadena` es muy expresiva y legible para transformaciones cortas, en un servidor con memoria limitada y cientos de miles de registros evitar **3 arreglos intermedios** y **3 recorridos extra** reduce la presión sobre la memoria y el *garbage collector* (recolector de basura), manteniendo exactamente la misma claridad de propósito con una función corta y directa.

---
