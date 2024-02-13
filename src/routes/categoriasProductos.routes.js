import Router from "express-promise-router";
import {
  actualizarCategoria,
  createCategoria,
  eliminarCategoria,
  getCategoria,
  getCategorias,
} from "../controllers/categorias-productos.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/categoria-productos", isAuth, getCategorias);

router.get("/categoria-productos/:id", isAuth, getCategoria);

router.post("/categoria-productos", isAuth, createCategoria);

router.put("/categoria-productos/:id", isAuth, actualizarCategoria);

router.delete("/categoria-productos/:id", isAuth, eliminarCategoria);

export default router;
