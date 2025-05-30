export const deltaToText = (delta) => {
  if (!delta || !Array.isArray(delta.ops)) return '';
  return delta.ops.map(op => op.insert || '').join('');
}
