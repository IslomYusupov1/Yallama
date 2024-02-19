import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { ApiProvider } from "@/api/ApiContext";
import {useShallowEqualSelector} from "@/hooks/useShallowSelector";
import {tokenSelector} from "@/reducers/AuthReducer";

interface Props {
  readonly children: ReactNode;
}

export function ProviderContainer({ children }: Props) {
  const token = useShallowEqualSelector(tokenSelector);
  return (
    <ApiProvider data={{ token }}>
      <SWRConfig >{children}</SWRConfig>
    </ApiProvider>
  );
}
