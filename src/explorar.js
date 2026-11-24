const ventas = require("./datos");

console.log("Cantidad de registros:", ventas.length);
console.log("Primer registro:", ventas[0]);
console.log("Último registro:", ventas[ventas.length - 1]);
console.log("Producto del registro en posición 4 (índice 3):", ventas[3].producto);

console.log("\nTabla completa de ventas:");
console.table(ventas);