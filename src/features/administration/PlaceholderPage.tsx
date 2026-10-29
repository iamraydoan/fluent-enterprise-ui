import { Text } from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";

interface PlaceholderPageProps {
  title: string;
  body: string;
}

export function PlaceholderPage({ title, body }: PlaceholderPageProps) {
  const sharedStyles = useSharedStyles();
  return (
    <section className={sharedStyles.contentCard} aria-label={title}>
      <div style={{ padding: "24px 8px", display: "flex", flexDirection: "column", rowGap: 8 }}>
        <Text weight="semibold" size={400}>
          {title}
        </Text>
        <Text size={300}>{body}</Text>
      </div>
    </section>
  );
}
