import Router from "express-promise-router";
import {
  actualizarPresupuesto,
  createPresupuesto,
  getPresupuesto,
  getPresupuestos,
  eliminarPresupuesto,
} from "../controllers/remito.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
// import { validateSchema } from "../middlewares/validate.middleware.js";
// import { createPedidoSchema } from "../schemas/pedido.schema.js";

const router = Router();

router.get("/remito", isAuth, getPresupuestos);

router.get("/remito/:id", isAuth, getPresupuesto);

router.post(
  "/remito",
  isAuth,
  // validateSchema(createPedidoSchema),
  createPresupuesto
);

router.delete("/remito/:id", isAuth, eliminarPresupuesto);

router.put("/remito/:id", isAuth, actualizarPresupuesto);

export default router;
