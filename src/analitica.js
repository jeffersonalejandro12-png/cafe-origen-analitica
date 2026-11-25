function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}


function totalVendido(ventas) {
  let total = 0;
  for (const venta of ventas) {
    total += valorVenta(venta);
  }
  return total;
}

function unidadesVendidas(ventas) {
  let unidades = 0;
  for (const venta of ventas) {
    unidades += venta.cantidad;
  }
  return unidades;
}

function ventaMayor(ventas) {
  let mayor = null;
  for (const venta of ventas) {
    if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }
  return mayor;
}

function ticketPromedio(ventas) {
  let total = 0;
  let ventasValidas = 0;

  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
      ventasValidas += 1;
    }
  }

  if (ventasValidas === 0) {
    return 0;
  }

  return total / ventasValidas;
}

function ventasPorCiudad(ventas, ciudad) {
  const objetivo = String(ciudad).trim().toLowerCase();
  let totalCiudad = 0;

  for (const venta of ventas) {
    const ciudadVenta = String(venta.ciudad).trim().toLowerCase();
    if (ciudadVenta === objetivo) {
      totalCiudad += valorVenta(venta);
    }
  }

  return totalCiudad;
}


function normalizarNombre(texto) {
  const limpio = String(texto).trim().toLowerCase();
  return limpio
    .split(/\s+/)
    .map((palabra) => {
      if (palabra === "de" || palabra === "del" || palabra === "la" || palabra === "el") {
        return palabra;
      }
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
}


function totalVendidoM(ventas) {
  return ventas
    .map((venta) => valorVenta(venta))
    .reduce((acumulado, monto) => acumulado + monto, 0);
}

function unidadesVendidasM(ventas) {
  return ventas
    .map((venta) => venta.cantidad)
    .reduce((acumulado, cantidad) => acumulado + cantidad, 0);
}

function ventasPorCiudadM(ventas, ciudad) {
  const objetivo = String(ciudad).trim().toLowerCase();
  return ventas
    .filter((venta) => String(venta.ciudad).trim().toLowerCase() === objetivo)
    .reduce((acumulado, venta) => acumulado + valorVenta(venta), 0);
}

function totalPorCiudad(ventas) {
  return ventas.reduce((diccionario, venta) => {
    const ciudadNormalizada = normalizarNombre(venta.ciudad);
    if (!Object.prototype.hasOwnProperty.call(diccionario, ciudadNormalizada)) {
      diccionario[ciudadNormalizada] = 0;
    }
    diccionario[ciudadNormalizada] += valorVenta(venta);
    return diccionario;
  }, {});
}

function unidadesPorProducto(ventas) {
  return ventas.reduce((diccionario, venta) => {
    const productoNormalizado = String(venta.producto).trim();
    if (!Object.prototype.hasOwnProperty.call(diccionario, productoNormalizado)) {
      diccionario[productoNormalizado] = 0;
    }
    diccionario[productoNormalizado] += venta.cantidad;
    return diccionario;
  }, {});
}

function topProductosPorValor(ventas, k) {
  const valorPorProducto = ventas.reduce((diccionario, venta) => {
    const productoNormalizado = String(venta.producto).trim();
    if (!Object.prototype.hasOwnProperty.call(diccionario, productoNormalizado)) {
      diccionario[productoNormalizado] = 0;
    }
    diccionario[productoNormalizado] += valorVenta(venta);
    return diccionario;
  }, {});

  const entradas = Object.entries(valorPorProducto);
  const copiaOrdenada = [...entradas].sort((a, b) => b[1] - a[1]);

  return copiaOrdenada.slice(0, k).map(([producto, total]) => ({
    producto,
    totalValor: total
  }));
}

function ventasDelDia(ventas, fecha) {
  const fechaObjetivo = String(fecha).trim();
  const registros = ventas.filter((venta) => String(venta.fecha).trim() === fechaObjetivo);

  return {
    fecha: fechaObjetivo,
    registros,
    cantidadVentas: registros.length,
    totalVendido: totalVendido(registros),
    unidadesVendidas: unidadesVendidas(registros),
    ticketPromedio: ticketPromedio(registros)
  };
}
function primeraVenta(ventas, contador = { ops: 0 }) {
  contador.ops += 1;
  return ventas.length > 0 ? ventas[0] : null;
}

function totalVendidoInst(ventas, contador) {
  let total = 0;
  for (const venta of ventas) {
    contador.ops += 1;
    total += valorVenta(venta);
  }
  return total;
}

function ventaMayorInst(ventas, contador) {
  let mayor = null;
  for (const venta of ventas) {
    contador.ops += 1; 
    if (mayor === null) {
      contador.ops += 1;
      mayor = venta;
    } else {
      contador.ops += 1; 
      if (valorVenta(venta) > valorVenta(mayor)) {
        mayor = venta;
      }
    }
  }
  return mayor;
}

function totalPorCiudadInst(ventas, contador) {
  const diccionario = {};
  for (const venta of ventas) {
    contador.ops += 1; // visita un elemento
    const ciudadNormalizada = normalizarNombre(venta.ciudad);
    contador.ops += 1; // consulta/actualización en diccionario
    if (!Object.prototype.hasOwnProperty.call(diccionario, ciudadNormalizada)) {
      diccionario[ciudadNormalizada] = 0;
    }
    diccionario[ciudadNormalizada] += valorVenta(venta);
  }
  return diccionario;
}

function clientesRecurrentes(ventas) {
  const recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (
        ventas[i].cliente === ventas[j].cliente &&
        !recurrentes.includes(ventas[i].cliente)
      ) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }
  return recurrentes;
}

function clientesRecurrentesSet(ventas) {
  const vistos = new Set();
  const recurrentes = new Set();

  for (const venta of ventas) {
    const cliente = venta.cliente;
    if (vistos.has(cliente)) {
      recurrentes.add(cliente);
    } else {
      vistos.add(cliente);
    }
  }

  return Array.from(recurrentes);
}

function comprasPorCliente(ventas) {
  const conteo = new Map();

  for (const venta of ventas) {
    const cliente = venta.cliente;
    const actual = conteo.has(cliente) ? conteo.get(cliente) : 0;
    conteo.set(cliente, actual + 1);
  }

  return conteo;
}

function clientesRecurrentesDesdeMap(ventas) {
  const conteo = comprasPorCliente(ventas);
  const recurrentes = [];

  for (const [cliente, cantidadCompras] of conteo.entries()) {
    if (cantidadCompras > 1) {
      recurrentes.push(cliente);
    }
  }

  return recurrentes;
}

function totalCiudadCadena(ventas, ciudad) {
  const objetivo = String(ciudad).trim().toLowerCase();

  return ventas
    .map((venta) => ({
      ...venta,
      ciudadNormalizada: String(venta.ciudad).trim().toLowerCase()
    }))
    .filter((venta) => venta.ciudadNormalizada === objetivo)
    .map((venta) => valorVenta(venta))
    .reduce((acumulado, monto) => acumulado + monto, 0);
}

function totalCiudadUnaPasada(ventas, ciudad) {
  const objetivo = String(ciudad).trim().toLowerCase();
  let total = 0;

  for (const venta of ventas) {
    if (String(venta.ciudad).trim().toLowerCase() === objetivo) {
      total += valorVenta(venta);
    }
  }

  return total;
}

function comboRegaloFuerzaBruta(catalogo, valor) {
  for (let i = 0; i < catalogo.length; i++) {
    for (let j = i + 1; j < catalogo.length; j++) {
      if (
        catalogo[i].producto !== catalogo[j].producto &&
        catalogo[i].precio + catalogo[j].precio === valor
      ) {
        return [catalogo[i], catalogo[j]];
      }
    }
  }
  return null;
}

function comboRegalo(catalogo, valor) {

  const vistosPorPrecio = new Map();

  for (const item of catalogo) {
    const complemento = valor - item.precio;
    if (vistosPorPrecio.has(complemento)) {
      const compañero = vistosPorPrecio.get(complemento);
      if (compañero.producto !== item.producto) {
        return [compañero, item];
      }
    }
    if (!vistosPorPrecio.has(item.precio)) {
      vistosPorPrecio.set(item.precio, item);
    }
  }

  return null;
}

function productoEstrellaPorCiudad(ventas) {

  const conteoPorCiudad = new Map();

  for (const venta of ventas) {
    const ciudad = normalizarNombre(venta.ciudad);
    const producto = String(venta.producto).trim();

    if (!conteoPorCiudad.has(ciudad)) {
      conteoPorCiudad.set(ciudad, new Map());
    }

    const mapaProductos = conteoPorCiudad.get(ciudad);
    const actual = mapaProductos.has(producto) ? mapaProductos.get(producto) : 0;
    mapaProductos.set(producto, actual + 1);
  }

  const resultado = {};

  for (const [ciudad, mapaProductos] of conteoPorCiudad.entries()) {
    let estrella = null;
    let maxApariciones = 0;

  
    for (const [producto, apariciones] of mapaProductos.entries()) {
      if (apariciones > maxApariciones) {
        maxApariciones = apariciones;
        estrella = producto;
      }
    }

    resultado[ciudad] = {
      producto: estrella,
      apariciones: maxApariciones
    };
  }

  return resultado;
}

function primerClienteUnico(ventas) {
  const frecuencia = new Map();


  for (const venta of ventas) {
    const cliente = venta.cliente;
    frecuencia.set(cliente, (frecuencia.get(cliente) || 0) + 1);
  }


  for (const venta of ventas) {
    if (frecuencia.get(venta.cliente) === 1) {
      return venta.cliente;
    }
  }

  return null;
}


function mejorSemanaBruta(dias, k = 7) {
  if (!Array.isArray(dias) || k <= 0 || dias.length < k) {
    return null;
  }

  let maxTotal = -Infinity;
  let diaInicio = 1; 

  for (let i = 0; i <= dias.length - k; i++) {
    let sumaBloque = 0;
    for (let j = i; j < i + k; j++) {
      sumaBloque += dias[j];
    }
    if (sumaBloque > maxTotal) {
      maxTotal = sumaBloque;
      diaInicio = i + 1;
    }
  }

  return {
    diaInicio,
    indiceInicio: diaInicio - 1,
    total: maxTotal
  };
}

function mejorSemana(dias, k = 7) {
  if (!Array.isArray(dias) || k <= 0 || dias.length < k) {
    return null;
  }

 
  let sumaVentana = 0;
  for (let i = 0; i < k; i++) {
    sumaVentana += dias[i];
  }

  let maxTotal = sumaVentana;
  let indiceInicio = 0;

  
  for (let i = k; i < dias.length; i++) {
    sumaVentana = sumaVentana + dias[i] - dias[i - k];
    if (sumaVentana > maxTotal) {
      maxTotal = sumaVentana;
      indiceInicio = i - k + 1;
    }
  }

  return {
    diaInicio: indiceInicio + 1,
    indiceInicio,
    total: maxTotal
  };
}

function parMasCercano(catalogo, presupuesto) {
  if (!Array.isArray(catalogo) || catalogo.length < 2) {
    return null;
  }

  
  const ordenados = [...catalogo].sort((a, b) => a.precio - b.precio);

  let izquierda = 0;
  let derecha = ordenados.length - 1;
  let mejorPar = null;
  let mejorSuma = -Infinity;

  
  while (izquierda < derecha) {
    const prodIzq = ordenados[izquierda];
    const prodDer = ordenados[derecha];
    const suma = prodIzq.precio + prodDer.precio;

    if (suma <= presupuesto) {
      if (suma > mejorSuma) {
        mejorSuma = suma;
        mejorPar = [prodIzq, prodDer];
      }
      izquierda += 1; 
    } else {
      derecha -= 1; 
    }
  }

  return mejorPar ? { productos: mejorPar, total: mejorSuma } : null;
}

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  primeraVenta,
  totalVendidoInst,
  ventaMayorInst,
  totalPorCiudadInst,
  clientesRecurrentes,
  totalCiudadCadena,
  totalCiudadUnaPasada,
  clientesRecurrentesSet,
  clientesRecurrentesDesdeMap,
  comboRegaloFuerzaBruta,
  comboRegalo,
  productoEstrellaPorCiudad,
  primerClienteUnico,
  mejorSemanaBruta,
  mejorSemana,
  parMasCercano
};