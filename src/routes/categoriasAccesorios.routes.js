import Router from "express-promise-router";
import {
  actualizarCategoria,
  createCategoria,
  eliminarCategoria,
  getCategoria,
  getCategorias,
} from "../controllers/categorias-accesorios.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/categoria-accesorios", isAuth, getCategorias);

router.get("/categoria-accesorios/:id", isAuth, getCategoria);

router.post("/categoria-accesorios", isAuth, createCategoria);

router.put("/categoria-accesorios/:id", isAuth, actualizarCategoria);

router.delete("/categoria-accesorios/:id", isAuth, eliminarCategoria);

export default router;
