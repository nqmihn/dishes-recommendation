export function formatCurrency(amount: number, currency = 'đ'): string {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}${currency}`;
}
