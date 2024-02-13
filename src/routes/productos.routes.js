import Router from "express-promise-router";
import {
  actualizarPerfil,
  createPerfil,
  eliminarPerfil,
  getPerfil,
  getPerfiles,
} from "../controllers/productos.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  createPerfilSchema,
  updatePerfilSchema,
} from "../schemas/productos.schema.js";

const router = Router();

router.get("/productos", isAuth, getPerfiles);

router.get("/productos/:id", isAuth, getPerfil);

router.post(
  "/productos",
  isAuth,
  validateSchema(createPerfilSchema),
  createPerfil
);

router.put(
  "/productos/:id",
  isAuth,
  validateSchema(updatePerfilSchema),
  actualizarPerfil
);

router.delete("/productos/:id", isAuth, eliminarPerfil);

export default router;
