export function stringifyBigint(object: unknown) {
  return JSON.parse(
    JSON.stringify(
      object,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    )
  );
}
