import { pool } from "../db.js";

export const getPerfiles = async (req, res, next) => {
  //obtener perfiles
  const result = await pool.query("SELECT * FROM perfiles WHERE user_id = $1", [
    req.userId,
  ]);
  return res.json(result.rows);
};

export const getPerfil = async (req, res) => {
  const result = await pool.query("SELECT * FROM perfiles WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe una tarea con ese id",
    });
  }

  return res.json(result.rows[0]);
};

export const createPerfil = async (req, res, next) => {
  const { nombre, color, descripcion, categoria, stock } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO perfiles (nombre, color ,descripcion, categoria,stock,user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nombre, color, descripcion, categoria, stock, req.userId]
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
  const { nombre, color, descripcion, categoria, stock } = req.body;

  const result = await pool.query(
    "UPDATE perfiles SET nombre = $1, color = $2 ,stock = $3, categoria = $4, descripcion = $5 WHERE id = $6",
    [nombre, color, stock, categoria, descripcion, id]
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
  const result = await pool.query("DELETE FROM perfiles WHERE id = $1", [
    req.params.id,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({
      message: "No existe ningun perfil con ese id",
    });
  }

  return res.sendStatus(204);
};
