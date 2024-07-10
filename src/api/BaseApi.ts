import qs from "qs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import pathParams from "path-params";
import ky, { Hooks, NormalizedOptions, Options as KYOptions, ResponsePromise } from "ky";

import { toCamelCase } from "@/utils/CaseUtils";
import { AppError, AppErrorProps } from "@/utils/AppError";

export interface ApiProps {
  readonly host: string;
  readonly token?: string;
  readonly logout?: () => void;
  readonly reGetToken?: (options: NormalizedOptions) => void;
}

export interface Options extends KYOptions {
  readonly query?: object;
  readonly params?: object;
  readonly method?: string;
}

export class BaseApi {
  private readonly host: string;
  private readonly token?: string;
  readonly reGetToken?: (options: NormalizedOptions) => void;
  readonly logout?: () => void;

  constructor({ host, token, reGetToken, logout }: ApiProps) {
    this.host = host;
    this.token = token;
    this.logout = logout;
    this.reGetToken = reGetToken;
  }

  private queryToString(query = {}): string {
    return qs.stringify(query);
  }

  private createRequestUrl(url: string, query = {}, params = {}): string {
    const formattedUrl = pathParams(url, params);

    return [formattedUrl, this.queryToString(query)].filter(Boolean).join("?");
  }

  private createRequestOptions(options: KYOptions): KYOptions {
    const { hooks = {} as Hooks, headers: optionHeaders = [] as any } = options;
    const headers = new Headers(optionHeaders);
    headers.set("language".toLocaleUpperCase(), "rus");
    if (this.token) {
      headers.set("authorization", `Bearer ${this.token}`);
    }

    return {
      timeout: 200000,
      prefixUrl: this.host,
      ...options,
      headers: [...(headers as any), ...optionHeaders],
      hooks: {
        ...hooks,
        beforeRequest: [...(hooks?.beforeRequest || [])],
        // beforeRetry: [
        //   async ({ request }) => {
        //     const token = await ky("https://example.com/refresh-token");
        //     request.headers.set("Authorization", `token ${token}`);
        //   },
        // ],
        afterResponse: [
          ...(hooks?.afterResponse || []),
          async (_,__, response) => {
            if (response.status === 401 && this.logout) {
              this.logout();
            }
          },
        ],
      },
    };
  }

  private request(url: string, options: Options = {}): ResponsePromise {
    const { query, params, ...kyOptions } = options;

    const formattedOptions = this.createRequestOptions(kyOptions);
    const formattedUrl = this.createRequestUrl(url, query, params);

    return ky(formattedUrl, formattedOptions);
  }
  private jsonRequest<TData>(url: string, options?: Options): Promise<TData> {
    return new Promise<TData>((resolve, reject) => {
      this.request(url, options)
        .then((response) => {
          if (response.ok) {
            if (response.status == 200) {
              return response.json();
            }
            if (response.status === 201) {
              return response.json();
            } else if (response.status === 204) {
              return response;
            } else {
              return response.json().then((data: any) => {
                if (data.success && data.data) {
                  return data.data;
                } else if (data) {
                  return data;
                } else {
                  return this.parseError(data);
                }
              });
            }
          }
          return response
            .json()
            .then((data: any) => this.parseError(data))
            .then((error) => {
              throw error;
            });
        })
        .then(resolve)
        .catch((error) => {
          if (error instanceof AppError) {
            reject(error);
          } else if (error?.response?.json) {
            error?.response?.json().then((data: Response) =>
              reject(
                this.parseError({
                  ...data,
                  status: error?.response?.status,
                  // errors: [{ userMsg: error.message }],
                } as any),
              ),
            );
          } else if (error) {
            reject(
              this.parseError({
                statusText: error.message,
                status: error?.response?.status,
                errors: [{ userMsg: error.message }],
              } as any),
            );
          } else {
            reject(
              this.parseError({
                statusText: "Unknown",
                status: error?.response?.status,
                errors: [{ userMsg: "Unknown" }],
              } as any),
            );
          }
        });
    });
  }

  private parseError(response: Response): AppError {
    const error = new Error(response.statusText) as AppErrorProps;

    error.status = response?.status;
    // @ts-ignore
    error.data = toCamelCase(response?.message || []);

    return new AppError(error);
  }

  public get<TData = any>(url: string, options?: Options): Promise<TData> {
    return this.jsonRequest(url, { ...options, method: "get" });
  }

  protected post<TData = any>(url: string, options?: Options): Promise<TData> {
    return this.jsonRequest(url, { ...options, method: "post" });
  }

  protected put<TData = any>(url: string, options?: Options): Promise<TData> {
    return this.jsonRequest(url, { ...options, method: "put" });
  }

  protected patch<TData = any>(url: string, options?: Options): Promise<TData> {
    return this.jsonRequest(url, { ...options, method: "patch" });
  }

  protected delete<TData = any>(url: string, options?: Options): Promise<TData> {
    return this.jsonRequest(url, { ...options, method: "delete" });
  }
}
