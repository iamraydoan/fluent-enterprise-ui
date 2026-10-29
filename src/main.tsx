import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { initI18n } from "@/i18n";
import { routeTree } from "@/routeTree.gen";

initI18n();

async function startMocks(): Promise<void> {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    const { worker } = await import("@/mocks/browser");
    await worker.start();
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount) => {
        if (import.meta.env.DEV) return false;
        if (failureCount > 3) return false;
        return true;
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000,
    },
  },
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root") as HTMLElement;

void startMocks().then(() => {
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
});
