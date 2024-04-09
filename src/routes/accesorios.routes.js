import Router from "express-promise-router";
import {
  actualizarAccesorio,
  createAccesorio,
  eliminarAccesorio,
  getAccesorio,
  getAccesorios,
  createNuevaEntrada,
  createNuevaSalida,
  getEntradaPorRangoDeFechas,
  getSalidasPorRangoDeFechas,
  getEntradasMensualesActual,
  getSalidasMensualesActual,
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

router.post("/nueva-entrada", isAuth, createNuevaEntrada);
router.post("/nueva-salida", isAuth, createNuevaSalida);

router.post("/accesorios-entradas-mes", isAuth, getEntradasMensualesActual);

router.put(
  "/accesorios/:id",
  isAuth,
  validateSchema(updatePerfilSchema),
  actualizarAccesorio
);

router.delete("/accesorios/:id", isAuth, eliminarAccesorio);

router.post("/entrada/rango-fechas", isAuth, getEntradaPorRangoDeFechas);
router.post("/salidas/rango-fechas", isAuth, getSalidasPorRangoDeFechas);
router.post("/salidas-entradas-mes", isAuth, getSalidasMensualesActual);

export default router;
