import { z } from "zod";

export const createPedidoSchema = z.object({
  cliente: z
    .string({
      required_error: "El cliente es requerido",
      invalid_type_error: "El cliente debe ser un texto",
    })
    .min(1)
    .max(255),
  categoria: z
    .string({
      required_error: "La categoria es requerida",
      invalid_type_error: "La categoria debe ser un texto valido",
    })
    .min(1)
    .max(255),
  fecha: z
    .date({
      required_error: "La fecha es requerida",
      invalid_type_error: "La fecha debe ser un texto valido",
    })
    .min(1),
});
