export function passwordValidator(password) {
  if (!password) return "El campo contraseña no puede estar vacio.";
  if (password.length < 5)
    return "La contraseña debe tener un mínimo de 5 caracteres.";
  return "";
}
