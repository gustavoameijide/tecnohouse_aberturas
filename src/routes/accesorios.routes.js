import Router from "express-promise-router";
import {
  actualizarAccesorio,
  createAccesorio,
  eliminarAccesorio,
  getAccesorio,
  getAccesorios,
} from "../controllers/accesorios.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  createPerfilSchema,
  updatePerfilSchema,
} from "../schemas/productos.schema.js";

const router = Router();

router.get("/accesorios", isAuth, getAccesorios);

router.get("/accesorios/:id", isAuth, getAccesorio);

router.post(
  "/accesorios",
  isAuth,
  validateSchema(createPerfilSchema),
  createAccesorio
);

router.put(
  "/accesorios/:id",
  isAuth,
  validateSchema(updatePerfilSchema),
  actualizarAccesorio
);

router.delete("/accesorios/:id", isAuth, eliminarAccesorio);

export default router;
