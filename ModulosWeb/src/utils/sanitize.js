export const sanitizeInput = (input) => {
    if (typeof input !== "string") return input;
    return input
      .replace(/[<>{}"']/g, "")      // elimina caracteres peligrosos
      .replace(/script/gi, "")       // bloquea etiquetas <script>
      .trim();                       // elimina espacios al inicio/final
  };
  