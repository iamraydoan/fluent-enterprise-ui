import { FluentProvider } from "@/components/ui";
import { MainLayout } from "@/layouts/MainLayout";
import { theme } from "@/theme";

export default function App() {
  return (
    <FluentProvider theme={theme} style={{ height: "100vh" }}>
      <MainLayout />
    </FluentProvider>
  );
}
