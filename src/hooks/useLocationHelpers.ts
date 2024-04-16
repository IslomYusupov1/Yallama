import qs from "qs";
import { update } from "immupdate";
import { useCallback } from "react";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";

import { Dict } from "@/api/MainDTO";
import { parseSearch } from "../utils/FormatUtils";

type QueryType = Dict<string | number> | any;

export interface HelpersLocationProps extends Location {
  readonly query: QueryType;
}

interface HelpersProps<T> {
  readonly pushLocation: (location: Partial<HelpersLocationProps>) => void;
  readonly replaceLocation: (location: Partial<HelpersLocationProps>) => void;

  readonly pushNewQuery: (query: T | QueryType) => void;
  readonly replaceNewQuery: (query: T | QueryType) => void;

  readonly pushQuery: (query: T | QueryType) => void;
  readonly replaceQuery: (query: T | QueryType) => void;
}

export function useLocationHelpers<T>(): HelpersProps<T> {
  const history = useNavigate();
  const routerLocation = useRouterLocation();
  const getUpdatedLocation = useCallback(
    ({ query: locationQuery = {}, ...location }, newQuery = {}) => {
      const search = parseSearch(location.search);

      const query = update(search, locationQuery);

      return update(location, { search: qs.stringify(update(query, newQuery)) });
    },
    [],
  );

  //@ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getNewLocation = useCallback(({ query, ...location }, newQuery = {}) => {
    return update(location, { search: qs.stringify(newQuery) });
  }, []);

  return {
    pushLocation: (l) => history(getUpdatedLocation(l)),
    replaceLocation: (l) => history(getUpdatedLocation(l)),
    /*@ts-ignore*/
    pushNewQuery: (query) => history(getNewLocation(routerLocation, query)),
    /*@ts-ignore*/
    replaceNewQuery: (query) => history(getNewLocation(routerLocation, query)),
    pushQuery: (query) => history(getUpdatedLocation(routerLocation, query)),
    replaceQuery: (query) => history(getUpdatedLocation(routerLocation, query)),
  };
}
