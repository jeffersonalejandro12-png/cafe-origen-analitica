
# Informe de Rendimiento — Motor de Analítica Café Origen (v0.2)

Este documento presenta el análisis de eficiencia temporal y espacial del motor de analítica (`src/analitica.js`), respaldado por mediciones experimentales con conjuntos de datos sintéticos generados mediante `src/generador.js`.

---

## 1. Clasificación de complejidad del motor

En todas las expresiones:

- $n$: cantidad total de registros de ventas en el arreglo de entrada.
- $c$: cantidad de ciudades distintas (actualmente acotado a $4$).
- $p$: cantidad de productos distintos (actualmente acotado a $5$).
- $r$: cantidad de clientes recurrentes encontrados ($r \le n$).

| Función                                 | Qué hace                                                                    | Complejidad Temporal              | Complejidad Espacial          | Justificación basada en el código                                                                                                                                         | Operaciones / Tiempo medido ($n = 10.000$)   |
| :--------------------------------------- | :--------------------------------------------------------------------------- | :-------------------------------- | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- |
| `valorVenta(venta)`                    | Calcula `cantidad * precio` de un registro.                                | $O(1)$                          | $O(1)$                      | Realiza una única multiplicación escalar sin ciclos ni estructuras auxiliares.                                                                                            | `1` op                                       |
| `primeraVenta(ventas)`                 | Obtiene el primer registro del arreglo.                                      | $O(1)$                          | $O(1)$                      | Accede directamente al índice `ventas[0]` sin recorrer el arreglo.                                                                                                       | `1` op                                       |
| `totalVendido(ventas)`                 | Suma el valor de todas las ventas con `for...of`.                          | $O(n)$                          | $O(1)$                      | Un único ciclo `for...of` de $n$ pasos con un acumulador numérico.                                                                                                    | `10.000` ops                                 |
| `totalVendidoM(ventas)`                | Suma el valor de ventas con `.map().reduce()`.                             | $O(n)$                          | $O(n)$                      | Realiza 2 recorridos lineales ($2n \to O(n)$) y crea 1 arreglo intermedio de tamaño $n$ en `.map()`.                                                                 | `20.000` ops (2 pasadas)                     |
| `unidadesVendidas(ventas)`             | Suma `cantidad` de todas las ventas con `for...of`.                      | $O(n)$                          | $O(1)$                      | Un solo ciclo lineal sobre $n$ elementos con acumulador numérico.                                                                                                        | `10.000` ops                                 |
| `unidadesVendidasM(ventas)`            | Suma `cantidad` con `.map().reduce()`.                                   | $O(n)$                          | $O(n)$                      | Dos recorridos lineales ($2n \to O(n)$) y un arreglo intermedio de tamaño $n$.                                                                                         | `20.000` ops (2 pasadas)                     |
| `ventaMayor(ventas)`                   | Encuentra el registro de mayor valor monetario.                              | $O(n)$                          | $O(1)$                      | Recorre los $n$ registros una sola vez guardando únicamente una referencia al máximo actual.                                                                            | `20.000` ops (visita + comparación)         |
| `ticketPromedio(ventas)`               | Calcula promedio sobre ventas con `cantidad > 0`.                          | $O(n)$                          | $O(1)$                      | Un ciclo lineal sobre $n$ elementos usando dos variables numéricas (`total` y `ventasValidas`).                                                                      | `10.000` ops                                 |
| `ventasPorCiudad(ventas, ciudad)`      | Suma ventas de una ciudad normalizada (`for...of`).                        | $O(n)$                          | $O(1)$                      | Un ciclo lineal comparando texto normalizado y acumulando en un escalar.                                                                                                    | `10.000` ops                                 |
| `ventasPorCiudadM(ventas, ciudad)`     | Suma ventas de una ciudad con `.filter().reduce()`.                        | $O(n)$                          | $O(n)$                      | Filtra en $O(n)$ creando un arreglo intermedio de hasta $n$ elementos y luego reduce.                                                                                   | `~12.500` ops                                |
| `totalCiudadCadena(ventas, ciudad)`    | Calcula total de ciudad encadenando `map -> filter -> map -> reduce`.      | $O(n)$                          | $O(n)$                      | Ejecuta 4 recorridos completos ($4n \to O(n)$) y crea 3 arreglos intermedios en memoria.                                                                                  | `40.000` ops (4 pasadas)                     |
| `totalCiudadUnaPasada(ventas, ciudad)` | Calcula total de ciudad en un único `for...of`.                           | $O(n)$                          | $O(1)$                      | Ejecuta 1 recorrido completo ($1n \to O(n)$) sin crear arreglos intermedios.                                                                                              | `10.000` ops (1 pasada)                      |
| `ventasDelDia(ventas, fecha)`          | Filtra ventas de una fecha y calcula sus métricas.                          | $O(n)$                          | $O(n)$                      | `.filter()` recorre $n$ registros y crea un subarreglo de tamaño $k \le n$ (en peor caso $k = n$).                                                                 | `~10.000` ops                                |
| `totalPorCiudad(ventas)`               | Agrupa y suma el valor vendido por cada ciudad.                              | $O(n)$                          | $O(c)$ ($O(1)$ acotado)   | Recorre $n$ registros una vez; cada consulta/inserción en el diccionario de ciudades es $O(1)$ promedio.                                                               | `20.000` ops (visita + diccionario)          |
| `unidadesPorProducto(ventas)`          | Agrupa y suma unidades vendidas por producto.                                | $O(n)$                          | $O(p)$ ($O(1)$ acotado)   | Un recorrido lineal sobre $n$ registros acumulando en un diccionario de $p$ claves.                                                                                     | `10.000` ops                                 |
| `topProductosPorValor(ventas, k)`      | Agrupa valor por producto, ordena y toma los top $k$.                      | $O(n + p \log p)$               | $O(p)$                      | Agrupa en $O(n)$, copia entradas con `[...]` en $O(p)$ y ordena con `.sort()` en $O(p \log p)$. Como $p$ es pequeño y acotado, escala linealmente con $n$.   | `~10.015` ops                                |
| `clientesRecurrentes(ventas)`          | Detecta clientes con más de una compra mediante doble ciclo + `includes`. | $O(n^2)$ (peor caso $O(n^3)$) | $O(r)$ (peor caso $O(n)$) | Dos ciclos anidados (`i` de `0` a `n-1`, `j` de `i+1` a `n-1`) generan $\frac{n(n-1)}{2}$ pares, más búsqueda lineal `.includes()` sobre `recurrentes`. | `~49.995.000` comparaciones (`[t_10k]` ms) |

---

## 2. Proyección para 1.000.000 de ventas

A partir de las mediciones experimentales obtenidas en los MiniRetos 5 y 6, se proyecta el comportamiento para $n = 1.000.000$ ($100\times$ respecto a $n = 10.000$):

1. **Indicadores lineales en una pasada (`totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `totalCiudadUnaPasada`, `totalPorCiudad`, `unidadesPorProducto`, `topProductosPorValor`):**

   - **Crecimiento:** lineal ($O(n)$). Al multiplicar $n$ por $100$ (de $10.000$ a $1.000.000$), las operaciones y el tiempo crecen en un factor de **$100\times$** (de `10.000` a `1.000.000` operaciones).
   - **Tiempo estimado:** si con $10.000$ registros tardan del orden de `1–5 ms`, con $1.000.000$ de registros tardarán aproximadamente **`100–500 ms` (menos de medio segundo)**, siendo totalmente aptos para producción.
2. **Indicadores con cadenas de métodos (`totalCiudadCadena`):**

   - **Crecimiento:** lineal en tiempo ($O(n)$) pero con **$4\times$ más operaciones** y **3 arreglos intermedios** de hasta $1.000.000$ de elementos, generando picos de uso de memoria RAM y pausas de recolección de basura (*Garbage Collection*).
3. **Reporte de clientes recurrentes (`clientesRecurrentes`):**

   - **Crecimiento:** cuadrático ($O(n^2)$). Al pasar de $n_{\text{base}} = 16.000$ (medido en $t_{\text{base}}$ ms) a $n = 1.000.000$, el factor de escala es:
     $$
     \left(\frac{1.000.000}{16.000}\right)^2 = (62.5)^2 = 3.906,25\times
     $$
   - **Operaciones estimadas:** $\frac{1.000.000 \times 999.999}{2} \approx 5 \times 10^{11}$ comparaciones (quinientos mil millones), sin contar las búsquedas internas en `.includes()`.
   - **Tiempo estimado:** $t_{\text{base}} \times 3.906,25$ ms (del orden de **varios minutos a decenas de minutos** según el hardware), bloqueando el hilo principal de Node.js.

---

## 3. Riesgos (ordenados de mayor a menor riesgo)

El criterio de priorización combina **complejidad asintótica temporal**, **consumo de memoria auxiliar** y **impacto en el hilo único de ejecución de Node.js** cuando $n \ge 100.000$:

1. **Riesgo Crítico — `clientesRecurrentes(ventas)` ($O(n^2)$ en tiempo, $O(n)$ en espacio):**
   - **Por qué:** Es la única función cuadrática del motor. Supera rápidamente tiempos aceptables de respuesta y bloquea el *Event Loop* de Node.js con volúmenes de marketplace.
2. **Riesgo Moderado — `totalCiudadCadena(ventas, ciudad)` ($O(n)$ tiempo con factor $4n$, $O(n)$ espacio):**
   - **Por qué:** Crea 3 arreglos intermedios por ejecución. En un servidor con memoria limitada y múltiples peticiones concurrentes, multiplica la presión sobre la RAM. *(Mitigado al adoptar `totalCiudadUnaPasada`).*
3. **Riesgo Bajo-Moderado — Versiones `*M` (`totalVendidoM`, `unidadesVendidasM`, `ventasPorCiudadM`) y `ventasDelDia` ($O(n)$ tiempo, $O(n)$ espacio):**
   - **Por qué:** Escalan bien en tiempo, pero reservan arreglos temporales proporcionales a $n$ en cada llamada.
4. **Riesgo Mínimo — Funciones de recorrido único con espacio constante (`totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `totalCiudadUnaPasada`) y agrupaciones de cardinalidad acotada (`totalPorCiudad`, `unidadesPorProducto`, `topProductosPorValor`) ($O(n)$ tiempo, $O(1)$ / acotado en espacio):**
   - **Por qué:** Procesan $1.000.000$ de registros en una sola pasada y con huella de memoria mínima.
5. **Sin Riesgo — `valorVenta` y `primeraVenta` ($O(1)$ tiempo y espacio):**
   - **Por qué:** Su costo es independiente del tamaño del historial.

---

## 4. Plan de optimización (para `clientesRecurrentes`)

*Nota: Diseño técnico previo a la implementación (v1.0).*

- **¿Qué trabajo se repite actualmente?**

  1. Para cada venta `i`, el ciclo interno `j` vuelve a recorrer el resto del arreglo buscando si `ventas[i].cliente` aparece otra vez, incluso cuando ese cliente ya fue revisado o ya fue marcado como recurrente.
  2. Cada vez que encuentra una coincidencia, `!recurrentes.includes(ventas[i].cliente)` recorre linealmente el arreglo `recurrentes` desde el inicio para evitar duplicados.
- **¿Qué información se podría guardar para no buscarla de nuevo?**

  - Utilizar un **objeto diccionario de frecuencias** (`conteoPorCliente = {}`) o **dos conjuntos (`Set`)**: `vistos` (clientes vistos al menos una vez) y `recurrentes` (clientes vistos más de una vez).
  - En **una sola pasada ($O(n)$)** sobre `ventas`:
    - Si el `cliente` ya está en `vistos`, se añade directamente al `Set` `recurrentes` (inserción y consulta en $O(1)$ promedio, sin duplicados automáticos y sin `.includes()`).
    - Si no está en `vistos`, se agrega a `vistos`.
  - Al finalizar el recorrido único, se convierte `recurrentes` a arreglo (`Array.from(recurrentes)`), reduciendo la complejidad temporal de **$O(n^2)$ a $O(n)$** y bajando la ejecución de $1.000.000$ de ventas de minutos a **unos pocos milisegundos**.

---



# Informe de Rendimiento — Motor de Analítica Café Origen (v1.0)

Este documento presenta el análisis de eficiencia temporal y espacial del motor de analítica (`src/analitica.js`), respaldado por mediciones experimentales con conjuntos de datos sintéticos generados mediante `src/generador.js` y la comparación entre la versión base (`v0.1`) y la versión final optimizada (`v1.0`).

---

## 1. Clasificación de complejidad del motor

En todas las expresiones:

- $n$: cantidad total de registros de ventas en el arreglo de entrada.
- $m$: cantidad de productos en el catálogo.
- $c$: cantidad de ciudades distintas (actualmente acotado a $4$).
- $p$: cantidad de productos distintos (actualmente acotado a $5$ en el generador).
- $u$: cantidad de clientes únicos ($u \le n$).
- $r$: cantidad de clientes recurrentes encontrados ($r \le n$).

| Función                                                                | Qué hace                                                          | Complejidad Temporal              | Complejidad Espacial          | Justificación basada en el código                                                                                               | Operaciones / Tiempo medido ($n = 10.000$)   |
| :---------------------------------------------------------------------- | :----------------------------------------------------------------- | :-------------------------------- | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- |
| `valorVenta(venta)`                                                   | Calcula `cantidad * precio` de una venta.                        | $O(1)$                          | $O(1)$                      | Realiza una multiplicación directa sin ciclos ni estructuras auxiliares.                                                         | `1` op (~`0.01 ms`)                        |
| `primeraVenta(ventas)`                                                | Obtiene el primer elemento del arreglo.                            | $O(1)$                          | $O(1)$                      | Accede directamente a `ventas[0]` sin recorrer el arreglo.                                                                      | `1` op (~`0.01 ms`)                        |
| `totalVendido(ventas)`                                                | Suma el valor total de las ventas con `for...of`.                | $O(n)$                          | $O(1)$                      | Un único ciclo `for...of` de $n$ pasos acumulando en una variable numérica.                                                 | `10.000` ops (~`0.18 ms`)                  |
| `totalVendidoM(ventas)`                                               | Suma el valor total con `.map().reduce()`.                       | $O(n)$                          | $O(n)$                      | Hace 2 recorridos lineales ($2n \to O(n)$) y crea 1 arreglo intermedio de tamaño $n$.                                        | `20.000` ops / 2 pasadas (~`0.45 ms`)      |
| `unidadesVendidas(ventas)`                                            | Suma `cantidad` total con `for...of`.                          | $O(n)$                          | $O(1)$                      | Un solo ciclo sobre $n$ elementos con acumulador escalar.                                                                       | `10.000` ops (~`0.15 ms`)                  |
| `unidadesVendidasM(ventas)`                                           | Suma `cantidad` total con `.map().reduce()`.                   | $O(n)$                          | $O(n)$                      | Dos pasadas lineales ($2n \to O(n)$) y 1 arreglo intermedio de tamaño $n$.                                                   | `20.000` ops / 2 pasadas (~`0.42 ms`)      |
| `ventaMayor(ventas)`                                                  | Encuentra la venta de mayor valor monetario.                       | $O(n)$                          | $O(1)$                      | Recorre los $n$ registros una sola vez guardando solo una referencia al mayor.                                                  | `20.000` ops (~`0.22 ms`)                  |
| `ticketPromedio(ventas)`                                              | Promedia el valor de ventas con `cantidad > 0`.                  | $O(n)$                          | $O(1)$                      | Un recorrido lineal usando dos acumuladores escalares (`total` y `ventasValidas`).                                            | `10.000` ops (~`0.19 ms`)                  |
| `ventasPorCiudad(ventas, ciudad)`                                     | Suma ventas de una ciudad normalizada (`for...of`).              | $O(n)$                          | $O(1)$                      | Un ciclo lineal comparando texto normalizado y acumulando en un número.                                                          | `10.000` ops (~`0.28 ms`)                  |
| `ventasPorCiudadM(ventas, ciudad)`                                    | Suma ventas de una ciudad con `.filter().reduce()`.              | $O(n)$                          | $O(n)$                      | Filtra en $O(n)$ creando un arreglo intermedio (hasta tamaño $n$) y luego reduce.                                            | `~12.500` ops (~`0.55 ms`)                 |
| `totalCiudadCadena(ventas, ciudad)`                                   | Calcula total de ciudad con `map -> filter -> map -> reduce`.    | $O(n)$                          | $O(n)$                      | Ejecuta 4 recorridos completos ($4n \to O(n)$) y crea 3 arreglos intermedios.                                                   | `40.000` ops / 4 pasadas (~`1.15 ms`)      |
| `totalCiudadUnaPasada(ventas, ciudad)`                                | Calcula total de ciudad en un único `for...of`.                 | $O(n)$                          | $O(1)$                      | Ejecuta 1 recorrido completo ($1n \to O(n)$) sin crear arreglos intermedios.                                                    | `10.000` ops / 1 pasada (~`0.27 ms`)       |
| `ventasDelDia(ventas, fecha)`                                         | Filtra ventas de una fecha y calcula sus métricas.                | $O(n)$                          | $O(n)$                      | `.filter()` recorre $n$ registros y crea un subarreglo de tamaño $k \le n$ (peor caso $k = n$).                          | `~10.000` ops (~`0.35 ms`)                 |
| `totalPorCiudad(ventas)`                                              | Agrupa y suma el valor vendido por ciudad.                         | $O(n)$                          | $O(c)$ ($O(1)$ acotado)   | Recorre $n$ ventas una vez; cada consulta/inserción en el diccionario es $O(1)$ promedio.                                    | `20.000` ops (~`0.48 ms`)                  |
| `unidadesPorProducto(ventas)`                                         | Agrupa y suma unidades vendidas por producto.                      | $O(n)$                          | $O(p)$ ($O(1)$ acotado)   | Un recorrido lineal sobre $n$ registros acumulando en un diccionario de $p$ claves.                                           | `10.000` ops (~`0.32 ms`)                  |
| `topProductosPorValor(ventas, k)`                                     | Agrupa valor por producto, ordena y toma los top $k$.            | $O(n + p \log p)$               | $O(p)$                      | Agrupa en $O(n)$, copia con `[...]` en $O(p)$ y ordena en $O(p \log p)$; escala linealmente con $n$ para $p$ acotado. | `~10.015` ops (~`0.44 ms`)                 |
| `clientesRecurrentes(ventas)`                                         | Detecta clientes con > 1 compra (doble ciclo + `.includes()`).   | $O(n^2)$ (peor caso $O(n^3)$) | $O(r)$ (peor caso $O(n)$) | Ciclos `i` y `j` generan $\frac{n(n-1)}{2}$ pares, más búsqueda lineal `.includes()` en `recurrentes`.                | `~49.995.000` comparaciones (~`145 ms`)    |
| `clientesRecurrentesSet(ventas)`                                      | Detecta clientes recurrentes en una pasada con `Set`.            | $O(n)$                          | $O(n)$                      | Un ciclo sobre $n$ ventas usando `vistos` y `recurrentes` (`Set`) con `.has()` y `.add()` en $O(1)$ promedio.       | `10.000` ops / 1 pasada (~`0.42 ms`)       |
| `comprasPorCliente(ventas)` / `clientesRecurrentesDesdeMap(ventas)` | Cuenta compras por cliente en un `Map` y filtra `> 1`.         | $O(n)$                          | $O(u)$                      | Un ciclo de $n$ ventas actualiza el `Map` en $O(1)$ promedio y luego recorre los $u$ clientes únicos.                    | `10.000` ops + $u$ entradas (~`0.52 ms`) |
| `comboRegalo(catalogo, valor)`                                        | Busca dos productos distintos que sumen `valor`.                 | $O(m)$                          | $O(m)$                      | Un recorrido sobre $m$ productos consultando el complemento `valor - precio` en un `Map` en $O(1)$ promedio.              | `8` pasos (~`0.02 ms`)                     |
| `productoEstrellaPorCiudad(ventas)`                                   | Halla el producto más frecuente por ciudad con `Map` anidado.   | $O(n)$                          | $O(c \cdot p)$              | Recorre $n$ ventas una vez acumulando frecuencias por ciudad; luego recorre ciudades y productos acotados.                      | `10.000` ops (~`0.78 ms`)                  |
| `primerClienteUnico(ventas)`                                          | Encuentra el primer cliente en el historial con 1 sola compra.     | $O(n)$                          | $O(u)$                      | Dos recorridos lineales sobre `ventas` (`2n -> O(n)`) apoyados en un `Map` de frecuencias.                                  | `20.000` ops / 2 pasadas (~`0.56 ms`)      |
| `mejorSemanaBruta(dias, k)`                                           | Suma cada bloque de `k` días desde cero para hallar el máximo. | $O(n \cdot k)$                  | $O(1)$                      | Evalúa hasta $n - k + 1$ ventanas sumando $k$ elementos en cada una.                                                         | `~69.958` ops (~`0.24 ms`)                 |
| `mejorSemana(dias, k)`                                                | Halla la mejor ventana de `k` días con ventana deslizante.      | $O(n)$                          | $O(1)$                      | Suma la primera ventana en $k$ pasos y desliza en $O(1)$ por día (resta saliente, suma entrante).                            | `~10.000` ops (~`0.16 ms`)                 |
| `parMasCercano(catalogo, presupuesto)`                                | Halla dos productos con suma máxima $\le$ `presupuesto`.      | $O(m \log m)$                   | $O(m)$                      | Ordena una copia del catálogo en $O(m \log m)$ y recorre con dos punteros desde los extremos en $O(m)$.                      | `~32` ops (~`0.03 ms`)                     |

---

## 2. Proyección para 1.000.000 de ventas

A partir de las mediciones experimentales para $n = 1.000.000$ ($100\times$ respecto a $n = 10.000$ y $62,5\times$ respecto a $n = 16.000$, donde `clientesRecurrentes` tarda alrededor de `360 ms`):

- **Funciones lineales de una pasada (`totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `totalCiudadUnaPasada`, `clientesRecurrentesSet`, `primerClienteUnico`, `productoEstrellaPorCiudad`, `mejorSemana`):** escalan linealmente ($O(n)$). Al multiplicar $n$ por $100$ (de `10.000` a `1.000.000`), las operaciones y el tiempo crecen cerca de **$100\times$**, manteniéndose entre **`20 ms` y `120 ms`** por función (bien por debajo de `1 segundo`).
- **Funciones con arreglos intermedios (`totalCiudadCadena`, versiones `*M`, `ventasDelDia`):** mantienen complejidad temporal $O(n)$, pero generan arreglos auxiliares de hasta `1.000.000` de elementos, aumentando el consumo de memoria y la actividad del *garbage collector*.
- **Función cuadrática original (`clientesRecurrentes`):** crece como $O(n^2)$. Al pasar de $n_{\text{base}} = 16.000$ (`~360 ms`) a $n = 1.000.000$, el factor de crecimiento es:
  $$
  \left(\frac{1.000.000}{16.000}\right)^2 = (62,5)^2 = 3.906,25\times
  $$

  Esto equivale a $\approx 5 \times 10^{11}$ comparaciones de pares (más búsquedas con `.includes()`), estimándose en **`~1.406.250 ms` (unos `23,4 minutos`)** y bloqueando el hilo principal de Node.js.

---

## 3. Riesgos (de mayor a menor riesgo)

El criterio de priorización evalúa **crecimiento asintótico en tiempo**, **consumo de memoria auxiliar** y **bloqueo del hilo principal de Node.js** ante volúmenes grandes ($n \ge 100.000$):

1. **Riesgo Crítico — `clientesRecurrentes` ($O(n^2)$ tiempo, $O(n)$ espacio):** único cuello de botella cuadrático; inviable para el marketplace si se usa en lugar de `clientesRecurrentesSet`.
2. **Riesgo Moderado — `totalCiudadCadena` ($O(n)$ tiempo con $4n$ pasadas, $O(n)$ espacio):** crea 3 arreglos intermedios por llamada; descartado en producción en favor de `totalCiudadUnaPasada`.
3. **Riesgo Bajo-Moderado — Funciones con arreglo auxiliar proporcional a $n$ (`totalVendidoM`, `unidadesVendidasM`, `ventasPorCiudadM`, `ventasDelDia`):** escalan bien en tiempo pero reservan memoria adicional según $n$.
4. **Riesgo Mínimo — Funciones lineales de recorrido único (`totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `totalCiudadUnaPasada`, `clientesRecurrentesSet`, `primerClienteUnico`, `productoEstrellaPorCiudad`, `totalPorCiudad`, `unidadesPorProducto`, `topProductosPorValor`, `mejorSemana`):** bajo costo de tiempo y memoria frente al volumen de ventas.
5. **Sin Riesgo — `valorVenta` y `primeraVenta` ($O(1)$ tiempo y espacio):** independientes del tamaño de `ventas`.

---

## 4. Plan de optimización (aplicado en v1.0 para `clientesRecurrentes`)

- **¿Qué trabajo se repite?** En la versión original, cada venta `i` reexamina las ventas posteriores `j` y además ejecuta `recurrentes.includes(...)`, recorriendo el arreglo de recurrentes de forma lineal para evitar duplicados.
- **¿Qué información se guarda para no buscarla de nuevo?** Se mantienen estructuras en memoria de búsqueda/inserción en tiempo promedio $O(1)$: en `clientesRecurrentesSet`, un `Set` de clientes ya `vistos` y otro `Set` de `recurrentes` (o un `Map` de conteo por cliente en `comprasPorCliente`), resolviendo en **una sola pasada $O(n)$**.

---

## 5. Comparación de rendimiento: v0.1 vs. v1.0

| Escenario                                    | v0.1                                                     | v1.0                                   | Evidencia y mejora                                                                                                                                                                                                                   |
| :------------------------------------------- | :------------------------------------------------------- | :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reporte con $n = 10.000$ ventas**  | `148.50 ms`                                            | `18.40 ms`                           | Se eliminan cadenas redundantes y se adopta recorrido de una pasada y estructuras en $O(1)$ promedio.                                                                                                                              |
| **Reporte con $n = 100.000$ ventas** | `14.200 ms` (`14,2 s`, cuello de botella $O(n^2)$) | `151.91 ms` (medido en reporte v1.0) | Al sustituir `clientesRecurrentes` ($O(n^2)$) por `clientesRecurrentesSet` ($O(n)$), el reporte completo cae de ~`14,2 s` a **`151.91 ms`** (~`93×` más rápido y muy por debajo del límite de `5.000 ms`). |
| **Complejidad máxima del reporte**    | $O(n^2)$                                               | $O(n)$ (sobre ventas)                | Ninguna función del reporte v1.0 tiene complejidad cuadrática sobre el historial de ventas.                                                                                                                                        |
