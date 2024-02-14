import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { ApiProvider } from "@/api/ApiContext";

interface Props {
  readonly children: ReactNode;
}

export function ProviderContainer({ children }: Props) {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUyZDkzNjgzLTkyODAtNGFjYy1iMWZiLTEyMTgyNzNjN2Q1ZiIsInJvbGUiOiJBRE1JTiIsInBob25lIjoiOTk4OTAxMjM0NTY3IiwiaWF0IjoxNzA3NzMwNTU2LCJleHAiOjE3MDgzMzUzNTZ9.o0Je1W6srYRFs4bdkiJPCOdX3dlV-jHvn35Ldd_8MIM"
  return (
    <ApiProvider data={{ token }}>
      <SWRConfig >{children}</SWRConfig>
    </ApiProvider>
  );
}
