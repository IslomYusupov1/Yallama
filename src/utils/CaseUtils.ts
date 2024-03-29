import {
  map,
  flow,
  isArray,
  mapKeys,
  camelCase,
  snakeCase,
  mapValues,
  isPlainObject,
} from "lodash";

function createMapperLegacy<T>(changeCase: (value: string) => string): (value: T[] | T) => T[] | T {
  const mapArray = (x: T[]) => map(x, mapKeysDeep);
  const mapObject = flow(
    (x: any) => mapKeys(x, (_, k: string) => changeCase(k)),
    (x: any) => mapValues(x, mapKeysDeep),
  );

  return mapKeysDeep as (value: T[] | T) => T[] | T;

  function mapKeysDeep(value: T[]): any[] | {} {
    if (isArray(value)) {
      return mapArray(value);
    }

    if (isPlainObject(value)) {
      return mapObject(value);
    }

    return value;
  }
}

export function toCamelCase<T>(value: T[] | T): T[] | T {
  return createMapperLegacy<T>(camelCase)(value);
}

export function toSnakeCase<T>(value: T[] | T): any {
  return createMapperLegacy<T>(snakeCase)(value);
}
