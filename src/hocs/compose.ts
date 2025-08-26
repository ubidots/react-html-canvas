export function compose<T>(...fns: Array<(c: T) => T>) {
  return (c: T) => fns.reduceRight((acc, fn) => fn(acc), c);
}
