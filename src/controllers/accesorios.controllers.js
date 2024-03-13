import { pool } from "../db.js";

export const getAccesorios = async (req, res, next) => {
  //obtener perfiles
  const result = await pool.query(
    "SELECT * FROM accesorios WHERE user_id = $1",
    [req.userId]
  );
  return res.json(result.rows);
};

export const getAccesorio = async (req, res) => {
  const result = await pool.query("SELECT * FROM accesorios WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe un accesorio con ese id",
    });
  }

  return res.json(result.rows[0]);
};

export const createAccesorio = async (req, res, next) => {
  const { nombre, color, descripcion, categoria, stock, stock_minimo } =
    req.body;

  // Assign default values of 0 to entrada and salida
  const entrada = 0;
  const salida = 0;

  try {
    const result = await pool.query(
      "INSERT INTO accesorios (nombre, color, descripcion, categoria, stock, stock_minimo, entrada, salida, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        nombre,
        color,
        descripcion,
        categoria,
        stock,
        stock_minimo,
        entrada,
        salida,
        req.userId,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un accesorio con ese nombre",
      });
    }
    next(error);
  }
};

export const actualizarAccesorio = async (req, res) => {
  const id = req.params.id;
  const {
    nombre,
    color,
    descripcion,
    categoria,
    stock,
    stock_minimo,
    entrada,
    salida,
  } = req.body;

  // Recuperar el valor actual de entrada desde la base de datos
  const resultadoConsulta = await pool.query(
    "SELECT entrada FROM accesorios WHERE id = $1",
    [id]
  );

  // Recuperar el valor actual de entrada desde la base de datos
  const resultadoConsultaDos = await pool.query(
    "SELECT salida FROM accesorios WHERE id = $1",
    [id]
  );

  // Verificar si la consulta retornó algún resultado
  if (resultadoConsulta.rows.length === 0) {
    return res.status(404).json({
      message: "No existe un accesorio con ese id",
    });
  }

  // Obtener el valor actual de entrada
  const entradaActual = resultadoConsulta.rows[0].entrada;

  const salidaActual = resultadoConsultaDos.rows[0].salida;

  // Verificar si entrada no se proporcionó en la solicitud
  const entradaActualizada = entrada ? entrada : entradaActual;

  const salidaActualizada = salida ? salida : salidaActual;

  // Ejecutar la consulta de actualización
  const result = await pool.query(
    "UPDATE accesorios SET nombre = $1, color = $2, stock = $3, categoria = $4, descripcion = $5, stock_minimo = $6, entrada = $7, salida = $8 WHERE id = $9",
    [
      nombre,
      color,
      stock,
      categoria,
      descripcion,
      stock_minimo,
      entradaActualizada,
      salidaActualizada,
      id,
    ]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe un accesorio con ese id",
    });
  }

  return res.json({
    message: "Tarea actualizada",
  });
};

export const eliminarAccesorio = async (req, res) => {
  const result = await pool.query("DELETE FROM accesorios WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun accesorio con ese id",
    });
  }

  return res.sendStatus(204);
};

export const createNuevaEntrada = async (req, res, next) => {
  const { codigo, detalle, ingreso, numero, sucursal } = req.body;

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Insert new entry into entradas table
    const entradaResult = await pool.query(
      "INSERT INTO entradas (codigo, detalle, ingreso, numero, sucursal) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [codigo, detalle, ingreso, numero, sucursal]
    );

    // Update stock and entrada in accesorios table
    const updateResult = await pool.query(
      "UPDATE accesorios SET stock = stock + $1, entrada = entrada + $1 WHERE nombre = $2",
      [ingreso, codigo]
    );

    // Commit the transaction
    await pool.query("COMMIT");

    res.json(entradaResult.rows[0]);
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query("ROLLBACK");

    next(error);
  }
};

export const createNuevaSalida = async (req, res, next) => {
  const { codigo, detalle, total } = req.body;

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Check if there's sufficient stock
    const stockCheckResult = await pool.query(
      "SELECT stock FROM accesorios WHERE nombre = $1",
      [codigo]
    );

    const currentStock = stockCheckResult.rows[0].stock;
    if (currentStock < total) {
      throw new Error("Insuficente stock - selecciona una cantidad menor");
    }

    // Insert new entry into salidas table
    const salidaResult = await pool.query(
      "INSERT INTO salidas (codigo, detalle, total) VALUES ($1, $2, $3) RETURNING *",
      [codigo, detalle, total]
    );

    // Update stock and salida in accesorios table
    const updateResult = await pool.query(
      "UPDATE accesorios SET stock = stock - $1, salida = salida + $1 WHERE nombre = $2",
      [total, codigo]
    );

    // Commit the transaction
    await pool.query("COMMIT");

    res.json(salidaResult.rows[0]);
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query("ROLLBACK");

    next(error);
  }
};

export const getEntradaPorRangoDeFechas = async (req, res, next) => {
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
      "SELECT * FROM entradas WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at",
      [fechaInicio, fechaFin]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getSalidasPorRangoDeFechas = async (req, res, next) => {
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
      "SELECT * FROM salidas WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at",
      [fechaInicio, fechaFin]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
