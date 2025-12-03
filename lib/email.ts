/**
 * Normaliza un email para comparaciones:
 * - Convierte a minúsculas
 * - Elimina espacios al inicio y final
 * - Elimina acentos
 */
export function normalizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Elimina acentos
}

