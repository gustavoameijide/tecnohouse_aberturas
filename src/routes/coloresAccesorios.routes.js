import Router from "express-promise-router";
import {
  actualizarColores,
  crearColores,
  eliminarColor,
  getColor,
  getColores,
} from "../controllers/colores-accesorios.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/color-accesorios", isAuth, getColores);

router.get("/color-accesorios/:id", isAuth, getColor);

router.post("/color-accesorios", isAuth, crearColores);

router.put("/color-accesorios/:id", isAuth, actualizarColores);

router.delete("/color-accesorios/:id", isAuth, eliminarColor);

export default router;
