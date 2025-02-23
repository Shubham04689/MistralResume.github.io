import { QueryClient, QueryFunction } from "@tanstack/react-query";

type ApiError = {
  status: number;
  message: string;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<TData = unknown, TBody = unknown>(
  method: string,
  url: string,
  data?: TBody,
): Promise<TData> {
  const headers: Record<string, string> = {};
  let body: BodyInit | null | undefined = undefined;

  if (data) {
    if (data instanceof FormData) {
      body = data;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    const responseData = await res.json();
    return responseData as TData;
  } catch (error) {
    const apiError: ApiError = {
      status: error instanceof Error ? 500 : 0,
      message: error instanceof Error ? error.message : String(error),
    };
    throw apiError;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      const apiError: ApiError = {
        status: error instanceof Error ? 500 : 0,
        message: error instanceof Error ? error.message : String(error),
      };
      throw apiError;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});