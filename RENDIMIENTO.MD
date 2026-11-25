
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
