export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/;
  if (!email) return "El campo email no puede estar vacio.";
  if (!re.test(email)) return "El formato de email introducido no es válido.";
  return "";
}
