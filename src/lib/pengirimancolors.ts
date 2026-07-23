export const PENGIRIMAN_COLORS = [
  { name: 'red', hex: '#ef4444' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'green', hex: '#22c55e' },
  { name: 'orange', hex: '#f97316' },
  { name: 'purple', hex: '#a855f7' }
] as const;

export const getPengirimanColor = (id: number) => {
  return PENGIRIMAN_COLORS[id % PENGIRIMAN_COLORS.length];
};
