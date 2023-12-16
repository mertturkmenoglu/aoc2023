export function measure(
  fn: () => number | string,
): [number | string, time: number] {
  const start = performance.now();
  const res = fn();
  const end = performance.now();

  return [res, end - start];
}
