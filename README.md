
# Café Origen — Motor de Analítica (v0.1)

Motor de analítica de ventas en **Node.js** para **Café Origen** (tostadora de café de especialidad en Medellín), construido sobre arreglos de objetos sin dependencias externas.

## ¿Qué preguntas responde?

- ¿Cuál es el total vendido y cuántas unidades han salido?
- ¿Cuál fue la venta más grande y cuál es el ticket promedio de las ventas válidas?
- ¿Cuánto se vende por ciudad (sin duplicar nombres por espacios o mayúsculas/minúsculas)?
- ¿Cuántas unidades se venden por producto y cuáles son los top 3 productos por valor generado?
- ¿Cómo se comporta un día con ventas frente a un día sin ventas?

## Cómo ejecutar el proyecto

Asegúrate de tener **Node.js (LTS)** instalado y ubícate en la raíz del repositorio `cafe-origen-analitica`:

- **Explorar los datos crudos y casos borde:**
  ```bash
  node src/explorar.js
  ```
