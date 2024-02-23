export function stringifyBigint<T>(object: T): T {
  return JSON.parse(
    JSON.stringify(
      object,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    )
  );
}
