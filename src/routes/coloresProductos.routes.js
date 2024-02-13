import Router from "express-promise-router";
import {
  actualizarColores,
  crearColores,
  eliminarColor,
  getColor,
  getColores,
} from "../controllers/colores-productos.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/color-productos", isAuth, getColores);

router.get("/color-productos/:id", isAuth, getColor);

router.post("/color-productos", isAuth, crearColores);

router.put("/color-productos/:id", isAuth, actualizarColores);

router.delete("/color-productos/:id", isAuth, eliminarColor);

export default router;
