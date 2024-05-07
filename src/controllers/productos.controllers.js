import { pool } from "../db.js";

export const getPerfiles = async (req, res, next) => {
  //obtener perfiles
  const result = await pool.query(
    "SELECT * FROM productos WHERE user_id = $1",
    [req.userId]
  );
  return res.json(result.rows);
};

export const getPerfil = async (req, res) => {
  const result = await pool.query("SELECT * FROM productos WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun perfil con ese id",
    });
  }

  return res.json(result.rows[0]);
};

export const createPerfil = async (req, res, next) => {
  const { nombre, color, descripcion, categoria, stock, ancho, alto } =
    req.body;

  try {
    const result = await pool.query(
      "INSERT INTO productos (nombre, color ,descripcion, categoria,stock,ancho,alto,user_id) VALUES ($1, $2, $3, $4, $5, $6,$7,$8) RETURNING *",
      [nombre, color, descripcion, categoria, stock, ancho, alto, req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Ya existe un perfil con ese nombre",
      });
    }
    next(error);
  }
};

export const actualizarPerfil = async (req, res) => {
  const id = req.params.id;
  const { nombre, color, descripcion, categoria, stock, ancho, alto } =
    req.body;

  const result = await pool.query(
    "UPDATE productos SET nombre = $1, color = $2 ,stock = $3, categoria = $4, descripcion = $5, ancho = $6, alto = $7 WHERE id = $8",
    [nombre, color, stock, categoria, descripcion, ancho, alto, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe un perfil con ese id",
    });
  }

  return res.json({
    message: "Tarea actualizada",
  });
};

export const eliminarPerfil = async (req, res) => {
  const result = await pool.query("DELETE FROM productos WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun perfil con ese id",
    });
  }

  return res.sendStatus(204);
};

export const createNuevaEntrada = async (req, res, next) => {
  const { codigo, detalle, ancho, alto, stock } = req.body;

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Insert new entry into entradas table
    const entradaResult = await pool.query(
      "INSERT INTO entradasdos (codigo, detalle, ancho, alto, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [codigo, detalle, ancho, alto, stock]
    );

    // Update stock and entrada in accesorios table
    const updateResult = await pool.query(
      "UPDATE productos SET stock = stock + $1 WHERE nombre = $2",
      [stock, codigo]
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

export const getEntradasMesActual = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM entradasdos WHERE (created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 days') AND created_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '5 days') OR (DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE))"
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createNuevaSalida = async (req, res, next) => {
  const { codigo, detalle, total, ancho, alto, cliente, sucursal, categoria } =
    req.body;

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Check if there's sufficient stock
    const stockCheckResult = await pool.query(
      "SELECT stock FROM productos WHERE nombre = $1",
      [codigo]
    );

    const currentStock = stockCheckResult.rows[0].stock;
    if (currentStock < total) {
      throw new Error("Insuficente stock - selecciona una cantidad menor");
    }

    // Insert new entry into salidas table
    const salidaResult = await pool.query(
      "INSERT INTO salidasdos (codigo, detalle, ancho, alto, cliente, sucursal,categoria, total) VALUES ($1, $2, $3, $4, $5, $6,$7,$8) RETURNING *",
      [codigo, detalle, ancho, alto, cliente, sucursal, categoria, total]
    );

    // Update stock and salida in accesorios table
    const updateResult = await pool.query(
      "UPDATE productos SET stock = stock - $1 WHERE nombre = $2",
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
      "SELECT * FROM entradasdos WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at",
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
      "SELECT * FROM salidasdos WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at",
      [fechaInicio, fechaFin]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
