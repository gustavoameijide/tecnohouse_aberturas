import { pool } from "../db.js";

//obtener presupuestos
export const getPresupuestos = async (req, res, next) => {
  const result = await pool.query("SELECT * FROM pedido WHERE user_id = $1", [
    req.userId,
  ]);
  return res.json(result.rows);
};

//obtener pedido
export const getPresupuesto = async (req, res) => {
  const result = await pool.query("SELECT * FROM pedido WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun pedido con ese id",
    });
  }

  return res.json(result.rows[0]);
};

//crear pedido
export const createPresupuesto = async (req, res, next) => {
  const { cliente, productos, detalle, remito } = req.body;

  try {
    await pool.query(
      "INSERT INTO pedido (cliente, productos, detalle, remito, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [cliente, productos, detalle, remito, req.userId]
    );

    const todosLosPedidos = await pool.query("SELECT * FROM pedido");

    res.json(todosLosPedidos.rows);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un pedido con ese id",
      });
    }
    next(error);
  }
};

//actualizar cliente
export const actualizarPresupuesto = async (req, res) => {
  const id = req.params.id;
  const { productos } = req.body;

  const result = await pool.query(
    "UPDATE pedido SET productos = $1 WHERE id = $2",
    [productos, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun pedido con ese id",
    });
  }

  const todosLosPedidos = await pool.query("SELECT * FROM pedido");

  res.json(todosLosPedidos.rows);
};

export const actualizarRemito = async (req, res) => {
  const id = req.params.id;
  const { remito } = req.body;

  const result = await pool.query(
    "UPDATE pedido SET remito = $1 WHERE id = $2",
    [remito, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun pedido con ese id",
    });
  }

  return res.json({
    message: "Presupuesto actualizado",
  });
};

//actualizar eliminar
export const eliminarPresupuesto = async (req, res) => {
  try {
    // Eliminar el pedido con el ID especificado
    const result = await pool.query("DELETE FROM pedido WHERE id = $1", [
      req.params.id,
    ]);

    // Verificar si se eliminó algún registro
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No existe ningún pedido con ese ID",
      });
    }

    // Obtener todos los pedidos después de la eliminación
    const todosLosPedidos = await pool.query("SELECT * FROM pedido");

    // Devolver todas las filas como respuesta
    res.json(todosLosPedidos.rows);
  } catch (err) {
    console.error("Error al eliminar el pedido:", err.message);
    res.status(500).json({
      message: "Error interno del servidor al eliminar el pedido",
    });
  }
};

//actualizar eliminar
export const eliminarPresupuestoProducto = async (req, res) => {
  const productIdToDelete = req.params.id;

  try {
    // Obtener los datos JSONB actuales de la base de datos
    const result = await pool.query(
      "SELECT productos FROM pedido WHERE (productos->'respuesta')::jsonb @> $1",
      [`[{"id": ${productIdToDelete}}]`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No existe ningún producto con ese id",
      });
    }

    const existingJson = result.rows[0].productos;

    // Filtrar el elemento con el id especificado del array
    const updatedProductos = existingJson.respuesta.filter(
      (item) => item.id !== parseInt(productIdToDelete)
    );

    // Actualizar la base de datos con el JSON modificado
    await pool.query(
      "UPDATE pedido SET productos = $1 WHERE (productos->'respuesta')::jsonb @> $2",
      [{ respuesta: updatedProductos }, `[{ "id": ${productIdToDelete} }]`]
    );

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error durante la operación de eliminación:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const editarPresupuestoProducto = async (req, res) => {
  const productIdToEdit = req.params.id;
  const updatedProductData = req.body; // Suponiendo que recibes los nuevos datos del producto en el cuerpo de la solicitud

  try {
    // Obtener los datos JSONB actuales de la base de datos
    const result = await pool.query(
      "SELECT productos FROM pedido WHERE (productos->'respuesta')::jsonb @> $1",
      [`[{"id": ${productIdToEdit}}]`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No existe ningún producto con ese id",
      });
    }

    const existingJson = result.rows[0].productos;

    // Actualizar el elemento con el id especificado en el array con los nuevos datos
    const updatedProductos = existingJson.respuesta.map((item) => {
      if (item.id === parseInt(productIdToEdit)) {
        return { ...item, ...updatedProductData };
      }
      return item;
    });

    // Actualizar la base de datos con el JSON modificado
    await pool.query(
      "UPDATE pedido SET productos = $1 WHERE (productos->'respuesta')::jsonb @> $2",
      [{ respuesta: updatedProductos }, `[{ "id": ${productIdToEdit} }]`]
    );

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error durante la operación de edición:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const editarPresupuestoProductoEstado = async (req, res) => {
  const productIdToEdit = req.params.id;
  const updatedProductData = req.body;

  try {
    // Obtener los datos JSONB actuales de la base de datos
    const result = await pool.query(
      "SELECT productos FROM pedido WHERE (productos->'respuesta')::jsonb @> $1",
      [`[{"id": ${productIdToEdit}}]`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No existe ningún producto con ese id",
      });
    }

    const existingJson = result.rows[0].productos;

    // Encuentra el producto específico dentro del JSON
    const updatedProductos = existingJson.respuesta.map((item) => {
      if (item.id === parseInt(productIdToEdit)) {
        // Comprobar si la cantidad faltante es mayor que la nueva cantidad
        if (updatedProductData.cantidadFaltante > updatedProductData.cantidad) {
          return res.status(400).json({
            message:
              "La cantidad faltante no puede ser mayor que la cantidad total",
          });
        }

        return { ...item, ...updatedProductData };
      }
      return item;
    });

    // Actualizar la base de datos con el JSON modificado
    await pool.query(
      "UPDATE pedido SET productos = $1 WHERE (productos->'respuesta')::jsonb @> $2",
      [{ respuesta: updatedProductos }, `[{ "id": ${productIdToEdit} }]`]
    );

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error durante la operación de edición:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const obtenerValorUnico = async (req, res) => {
  const productId = req.params.id;

  try {
    // Obtener los datos JSONB actuales de la base de datos
    const result = await pool.query(
      "SELECT productos FROM pedido WHERE (productos->'respuesta')::jsonb @> $1",
      [`[{"id": ${productId}}]`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No existe ningún producto con ese id",
      });
    }

    const existingJson = result.rows[0].productos;

    // Find the product with the specified id in the respuesta array
    const product = existingJson.respuesta.find(
      (item) => item.id === parseInt(productId, 10)
    );

    if (!product) {
      return res.status(404).json({
        message: "No existe ningún producto con ese id",
      });
    }

    // Devolver el objeto completo del producto
    return res.json({
      producto: product,
    });
  } catch (error) {
    console.error("Error durante la operación de obtención del valor:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const CrearProducto = async (req, res) => {
  const tableId = req.params.id;
  const nuevoProducto = req.body.nuevoProducto;

  try {
    // Obtener los datos JSONB actuales de la base de datos
    const result = await pool.query(
      "SELECT productos FROM pedido WHERE id = $1",
      [tableId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No existe ningún registro con ese id de tabla",
      });
    }

    const existingJson = result.rows[0].productos;

    // Verificar que el nuevo producto sea un objeto válido
    if (!nuevoProducto || typeof nuevoProducto !== "object") {
      return res.status(400).json({
        message: "El nuevo producto no es un objeto válido",
        nuevoProducto: nuevoProducto,
      });
    }

    // Generar un ID aleatorio como número
    const nuevoId = Math.floor(Math.random() * 1000000) + 1;

    // Agregar el nuevo producto al array existente con el ID como número
    nuevoProducto.id = nuevoId;
    existingJson.respuesta = existingJson.respuesta || [];
    existingJson.respuesta.push(nuevoProducto);

    // Actualizar la base de datos con el JSON modificado
    const updateQuery =
      "UPDATE pedido SET productos = $1::jsonb WHERE id = $2 RETURNING *";

    const updatedResult = await pool.query(updateQuery, [
      { respuesta: existingJson.respuesta },
      tableId,
    ]);

    return res.json({
      message: "Producto agregado exitosamente al registro existente",
      updatedResult: updatedResult.rows[0],
    });
  } catch (error) {
    console.error("Error durante la operación de creación de producto:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getPedidoMesActual = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pedido WHERE (created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 days') AND created_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '5 days') OR (DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE))"
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const CrearProductos = async (req, res) => {
  const tableId = req.params.id;
  const nuevosProductos = req.body;

  try {
    // Obtener los datos JSONB actuales de la base de datos
    const result = await pool.query(
      "SELECT productos FROM pedido WHERE id = $1",
      [tableId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No existe ningún registro con ese id de tabla",
      });
    }

    const existingJson = result.rows[0].productos;

    // Verificar que la lista de nuevos productos sea un array válido
    if (!nuevosProductos || !Array.isArray(nuevosProductos)) {
      return res.status(400).json({
        message: "La lista de nuevos productos no es un array válido",
        nuevosProductos: nuevosProductos,
      });
    }

    // Generar IDs aleatorios para cada nuevo producto
    const nuevosIds = nuevosProductos.map(
      () => Math.floor(Math.random() * 1000000) + 1
    );

    // Agregar los nuevos productos al array existente con los IDs generados
    existingJson.respuesta = existingJson.respuesta || [];
    nuevosProductos.forEach((nuevoProducto, index) => {
      nuevoProducto.id = nuevosIds[index];
      existingJson.respuesta.push(nuevoProducto);
    });

    // Actualizar la base de datos con el JSON modificado
    const updateQuery =
      "UPDATE pedido SET productos = $1::jsonb WHERE id = $2 RETURNING *";

    const updatedResult = await pool.query(updateQuery, [
      { respuesta: existingJson.respuesta },
      tableId,
    ]);

    return res.json({
      message: "Productos agregados exitosamente al registro existente",
      updatedResult: updatedResult.rows[0],
    });
  } catch (error) {
    console.error(
      "Error durante la operación de creación de productos:",
      error
    );
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getPedidoPorRangoDeFechas = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin } = req.body;

    // Validación de fechas
    if (
      !fechaInicio ||
      !fechaFin ||
      !isValidDate(fechaInicio) ||
      !isValidDate(fechaFin)
    ) {
      return res.status(400).json({ message: "Fechas inválidas" });
    }

    // Función de validación de fecha
    function isValidDate(dateString) {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return dateString.match(regex) !== null;
    }

    // Ajuste de zona horaria UTC
    const result = await pool.query(
      "SELECT * FROM pedido WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at",
      [fechaInicio, fechaFin]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
