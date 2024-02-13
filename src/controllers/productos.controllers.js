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
