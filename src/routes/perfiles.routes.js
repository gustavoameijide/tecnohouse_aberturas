import Router from "express-promise-router";
import {
  actualizarPerfil,
  getPerfiles,
  getPerfil,
  eliminarPerfil,
  createPerfil,
} from "../controllers/perfiles.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  createPerfilSchema,
  updatePerfilSchema,
} from "../schemas/productos.schema.js";

const router = Router();

router.get("/perfiles", isAuth, getPerfiles);

router.get("/perfiles/:id", isAuth, getPerfil);

router.post(
  "/perfiles",
  isAuth,
  validateSchema(createPerfilSchema),
  createPerfil
);

router.put(
  "/perfiles/:id",
  isAuth,
  validateSchema(updatePerfilSchema),
  actualizarPerfil
);

router.delete("/perfiles/:id", isAuth, eliminarPerfil);

export default router;
