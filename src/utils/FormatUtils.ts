import qs from "qs";

import { Dict } from "@/api/MainDTO";

export function parseSearch<TData = any>(search = ""): TData & Dict<string> {
  return qs.parse(search.replace("?", "")) as TData & Dict<string>;
}
