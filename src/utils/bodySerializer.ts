const toCamel = (s: string) =>
  s.replace(/([-_][a-z])/gi, ($1) =>
    $1.toUpperCase().replace("-", "").replace("_", "")
  );

const toSnake = (s: string) =>
  s.replace(/[A-Z]/g, ($1) => `_${$1.toLowerCase()}`);

export const keysToCamel = (o: any) => {
  if (o instanceof Object && !Array.isArray(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  } else if (o instanceof Object && Array.isArray(o)) {
    const n = [];
    return o.map((i) => keysToCamel(i));
  }

  return o;
};

export const keysToSnake = (o: any) => {
  if (o instanceof Object && !Array.isArray(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toSnake(k)] = keysToSnake(o[k]);
    });

    return n;
  } else if (o instanceof Object && Array.isArray(o)) {
    return o.map((i) => keysToSnake(i));
  }

  return o;
};
