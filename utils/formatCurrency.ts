export function formatToIDR(amount: number): string {
  return `Rp. ${amount.toLocaleString('id-ID')}`;
}