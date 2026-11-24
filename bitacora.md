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

Objetivo:
