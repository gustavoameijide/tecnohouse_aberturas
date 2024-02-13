import express from "express";
import morgan from "morgan";
import perfilesRoutes from "./routes/perfiles.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoriasRoutes from "./routes/categoriasPerfiles.routes.js";
import coloresRoutes from "./routes/coloresPerfiles.routes.js";
import categoriasAccesoriosRoutes from "./routes/categoriasAccesorios.routes.js";
import coloresAccesoriosRoutes from "./routes/coloresAccesorios.routes.js";
import accesoriosRoutes from "./routes/accesorios.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import coloresProductosRoutes from "./routes/coloresProductos.routes.js";
import categoriasProductosRoutes from "./routes/categoriasProductos.routes.js";
import pedidoRoutes from "./routes/pedido.routes.js";
import remitoRoutes from "./routes/remito.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { pool } from "./db.js";
import { ORIGIN } from "./config.js";

const app = express();

//middlewaress
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
// Routes
app.get("/", (req, res) => res.json({ message: "welcome to my API" }));
app.get("/api/ping", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  return res.json(result.rows[0]);
});
app.use("/api", perfilesRoutes);
app.use("/api", authRoutes);
app.use("/api", categoriasRoutes);
app.use("/api", coloresRoutes);
app.use("/api", accesoriosRoutes);
app.use("/api", categoriasAccesoriosRoutes);
app.use("/api", coloresAccesoriosRoutes);
app.use("/api", productosRoutes);
app.use("/api", coloresProductosRoutes);
app.use("/api", categoriasProductosRoutes);
app.use("/api", pedidoRoutes);
app.use("/api", remitoRoutes);

//error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

export default app;
