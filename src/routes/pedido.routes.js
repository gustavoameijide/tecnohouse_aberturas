import Router from "express-promise-router";
import {
  actualizarPresupuesto,
  createPresupuesto,
  getPresupuesto,
  getPresupuestos,
  eliminarPresupuesto,
  eliminarPresupuestoProducto,
  editarPresupuestoProducto,
  obtenerValorUnico,
  CrearProducto,
  actualizarRemito,
  getPedidoMesActual,
  CrearProductos,
  getPedidoPorRangoDeFechas,
  editarPresupuestoProductoEstado,
} from "../controllers/pedido.controllers.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/pedido", isAuth, getPresupuestos);

router.get("/pedido/:id", isAuth, getPresupuesto);

router.post(
  "/pedido",
  isAuth,
  // validateSchema(createPedidoSchema),
  createPresupuesto
);

router.put("/pedido/:id", isAuth, actualizarPresupuesto);

router.delete("/pedido-delete/:id", isAuth, eliminarPresupuestoProducto);

router.put("/pedido-edit/:id", isAuth, editarPresupuestoProducto);

router.put("/pedido-edit-two/:id", isAuth, editarPresupuestoProductoEstado);

router.put("/remito-edit/:id", isAuth, actualizarRemito);

router.delete("/pedido/:id", isAuth, eliminarPresupuesto);

router.get("/pedido-unico/:id", isAuth, obtenerValorUnico);

router.post("/:id/pedido-create", isAuth, CrearProducto);

router.post("/pedido/:id/crear-productos", isAuth, CrearProductos);

router.post("/pedido/rango-fechas", isAuth, getPedidoPorRangoDeFechas);

router.get("/pedido-mensual", isAuth, getPedidoMesActual);

export default router;
