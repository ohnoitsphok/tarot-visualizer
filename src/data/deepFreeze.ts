// No isFrozen shortcut: items may be shallow-frozen already. Data is acyclic.
export function deepFreeze<T>(o: T): T {
  if (o && typeof o === 'object') {
    Object.freeze(o);
    Object.values(o).forEach(deepFreeze);
  }
  return o;
}
