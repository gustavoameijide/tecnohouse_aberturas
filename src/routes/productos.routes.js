import Router from "express-promise-router";
import {
  actualizarPerfil,
  createNuevaEntrada,
  createNuevaSalida,
  createPerfil,
  eliminarPerfil,
  getEntradaPorRangoDeFechas,
  getEntradasMesActual,
  getPerfil,
  getPerfiles,
  getSalidasPorRangoDeFechas,
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

router.post("/entrada-dos/rango-fechas", isAuth, getEntradaPorRangoDeFechas);

router.get("/entrada-dos-mensuales", isAuth, getEntradasMesActual);

router.post("/salidas-dos/rango-fechas", isAuth, getSalidasPorRangoDeFechas);

router.post("/nueva-entrada-dos", isAuth, createNuevaEntrada);
router.post("/nueva-salida-dos", isAuth, createNuevaSalida);

export default router;
