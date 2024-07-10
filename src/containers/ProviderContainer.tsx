import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { ApiProvider } from "@/api/ApiContext";
import {useShallowEqualSelector} from "@/hooks/useShallowSelector";
import {resetToken, tokenSelector} from "@/reducers/AuthReducer";
import {useDispatch} from "react-redux";

interface Props {
  readonly children: ReactNode;
}

export function ProviderContainer({ children }: Props) {
  const token = useShallowEqualSelector(tokenSelector);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(resetToken());
  }
  return (
    <ApiProvider data={{ token, logout }}>
      <SWRConfig >{children}</SWRConfig>
    </ApiProvider>
  );
}
