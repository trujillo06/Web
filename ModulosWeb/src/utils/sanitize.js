export const sanitizeInput = (input) => {
    if (typeof input !== "string") return input;
    return input
      .replace(/[<>{}"']/g, "")     
      .replace(/script/gi, "")      
      .trim();                       
  };
  