declare module '@mhd031/jsonapi-react' {
  interface IPlugin {
    initialize(client: ApiClient): void
  }

  type Falsey = false | undefined | null

  type QueryArg<TQueryParams = any> = Falsey | string | [
    type: string,
    queryParams?: TQueryParams,
    ...queryKeys: any[],
  ]

  type StringMap = { [key: string]: any }

  interface IResult<TData = StringMap | StringMap[]> {
    data?: TData
    meta?: StringMap
    links?: StringMap
    error?: StringMap
    errors?: StringMap[]
    refetch?: () => void
    isLoading?: boolean
    isFetching?: boolean
    client: ApiClient
  }

  interface IConfig {
    url?: string
    mediaType?: string
    cacheTime?: number
    staleTime?: number
    headers?: {}
    ssrMode?: boolean
    formatError?: (error) => any
    formatErrors?: (errors) => any
    fetch?: (url: string, options: {}) => Promise<{}>
    stringify?: <TQueryParams = any>(q: TQueryParams) => string
    fetchOptions?: {}
  }

  export class ApiClient {
    constructor({
      ...args
    }: {
      schema?: {}
      plugins?: IPlugin[]
    } & IConfig)

    addHeader(key: string, value: string): ApiClient

    clearCache(): void

    delete(queryArg: QueryArg, config?: IConfig): Promise<IResult>

    fetch(queryArg: QueryArg, config?: IConfig): Promise<IResult>

    isFetching(): boolean

    mutate(
      queryArg: QueryArg,
      data: {} | [],
      config?: IConfig
    ): Promise<IResult>

    removeHeader(key: string): ApiClient
  }

  export function ApiProvider({
    children,
    client,
  }: {
    children: React.ReactNode
    client: ApiClient
  }): JSX.Element

  export const ApiContext: React.Context<any>

  export function renderWithData(
    element: JSX.Element,
    client: ApiClient,
    config?: {}
  ): [content: string, initialState: any]

  export function useClient(): ApiClient

  export function useIsFetching(): { isFetching: boolean }

  export function useMutation<TData = StringMap | StringMap[]>(
    queryArg: QueryArg,
    config?: {
      invalidate?: boolean | string | string[]
      method?: string
      client?: ApiClient
    }
  ): [mutate: (any) => Promise<IResult<TData>>, result: IResult<TData>]

  export function useQuery<TData = StringMap | StringMap[]>(
    queryArg: QueryArg,
    config?: {
      cacheTime?: number
      client?: ApiClient
      headers?: {}
      initialData?: TData
      staleTime?: number
      ssr?: boolean
    }
  ): IResult<TData>

  type filterParameter = JsonApiDotNetFilter | string | boolean | number | null | Date | undefined;
  type whenThenOtherwise = { when: boolean, then?: JsonApiDotNetFilter, otherwise?: JsonApiDotNetFilter };

  export class JsonApiDotNetFilter {
    protected constructor(op: string, terms: filterParameter[]);
    toString(): string;

    protected __getParts(): string[];
    private __quoteParts(value: filterParameter);

    static equals(lhs: filterParameter, rhs: filterParameter): JsonApiDotNetFilter;
    static lessThan(lhs: filterParameter, rhs: filterParameter): JsonApiDotNetFilter;
    static lessOrEqual(lhs: filterParameter, rhs: filterParameter): JsonApiDotNetFilter;
    static greaterThan(lhs: filterParameter, rhs: filterParameter): JsonApiDotNetFilter;
    static greaterOrEqual(lhs: filterParameter, rhs: filterParameter): JsonApiDotNetFilter;
    static contains(lhs: filterParameter, rhs: filterParameter): JsonApiDotNetFilter;
    static startsWith(lhs: filterParameter, rhs: filterParameter): JsonApiDotNetFilter;
    static endsWith(lhs: filterParameter, rhs: filterParameter): JsonApiDotNetFilter;
    static attr<TEntity>(attribute: string | ((e: TEntity) => any)): JsonApiDotNetFilter;
    static or(...terms: (JsonApiDotNetFilter | whenThenOtherwise)[]): JsonApiDotNetFilter;
    static and(...terms: (JsonApiDotNetFilter | whenThenOtherwise)[]): JsonApiDotNetFilter;
    static any(operand: filterParameter, inList: filterParameter[] | undefined): JsonApiDotNetFilter;
    static not(term: JsonApiDotNetFilter): JsonApiDotNetFilter;
    static has(rel: JsonApiDotNetFilter, filter?: JsonApiDotNetFilter): JsonApiDotNetFilter;
    static id(): JsonApiDotNetFilter;
  }
}
