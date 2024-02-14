import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { EventsApi } from "./EventsApi";

interface Props {
  readonly EventsApi: EventsApi;
}

export function useEventsApiContext(): Props {
  const data = useApiBase();
  const api = useMemo(() => new EventsApi(data), [data]);

  return {
    EventsApi: api,
  };
}
