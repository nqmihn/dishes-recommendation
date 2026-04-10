export function validateIntegerValue(value: number): boolean {
  return value >= -2147483648 && value <= 2147483647;
}
