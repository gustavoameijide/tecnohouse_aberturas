import Router from "express-promise-router";
import {
  actualizarColores,
  crearColores,
  eliminarColor,
  getColor,
  getColores,
} from "../controllers/colores-perfiles.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/color-perfiles", isAuth, getColores);

router.get("/color-perfiles/:id", isAuth, getColor);

router.post("/color-perfiles", isAuth, crearColores);

router.put("/color-perfiles/:id", isAuth, actualizarColores);

router.delete("/color-perfiles/:id", isAuth, eliminarColor);

export default router;
