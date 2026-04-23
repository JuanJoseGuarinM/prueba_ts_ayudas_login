const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export interface RegisterInput {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): void {
  if (!EMAIL_REGEX.test(email.trim())) {
    throw new Error("Ingresa un correo electronico valido");
  }
}

export function validatePasswordStrength(password: string): void {
  if (!PASSWORD_REGEX.test(password)) {
    throw new Error(
      "La contrasena debe tener minimo 8 caracteres, mayuscula, minuscula, numero y simbolo"
    );
  }
}

export function validateRegisterInput(input: RegisterInput): RegisterInput {
  const nombre = input.nombre?.trim();
  const apellido = input.apellido?.trim();
  const email = normalizeEmail(input.email ?? "");
  const password = input.password ?? "";
  const confirmPassword = input.confirmPassword ?? "";

  if (!nombre || !apellido || !email || !password || !confirmPassword) {
    throw new Error("Nombre, apellido, correo, contrasena y confirmacion son requeridos");
  }

  validateEmail(email);
  validatePasswordStrength(password);

  if (password !== confirmPassword) {
    throw new Error("Las contrasenas no coinciden");
  }

  return {
    nombre,
    apellido,
    email,
    password,
    confirmPassword,
  };
}

export function validateLoginInput(input: LoginInput): LoginInput {
  const email = normalizeEmail(input.email ?? "");
  const password = input.password ?? "";

  if (!email || !password) {
    throw new Error("Correo y contrasena son requeridos");
  }

  validateEmail(email);

  return { email, password };
}
