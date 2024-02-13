import Router from "express-promise-router";
import {
  actualizarCategoria,
  createCategoria,
  eliminarCategoria,
  getCategoria,
  getCategorias,
} from "../controllers/categorias-perfiles.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";
// import { validateSchema } from "../middlewares/validate.middleware.js";
// import {
//   createPerfilSchema,
//   updatePerfilSchema,
// } from "../schemas/aluminio.schema.js";

const router = Router();

router.get("/categoria-perfiles", isAuth, getCategorias);

router.get("/categoria-perfiles/:id", isAuth, getCategoria);

router.post("/categoria-perfiles", isAuth, createCategoria);

router.put("/categoria-perfiles/:id", isAuth, actualizarCategoria);

router.delete("/categoria-perfiles/:id", isAuth, eliminarCategoria);

export default router;
