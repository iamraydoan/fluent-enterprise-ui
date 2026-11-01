import { useState } from "react";
import { useQueryDetail } from "@/api";
import type { QueryFilter } from "@/api";
import {
  aiEditorAction,
  deleteAction,
  editAction,
  endpointAction,
  executeAction,
  exportAction,
  generateAction,
  ListPage,
  refreshAction,
  saveAction,
  SectionHeader,
  settingsAction, HStack, VStack 
} from "@/components/common";
import {
  Add24Regular,
  BotSparkle24Regular,
  Dismiss20Regular,
  DocumentSearch24Regular,
  Info20Regular,
  Send24Regular,
} from "@/components/icons";
import {
  Button,
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  makeStyles,
  mergeClasses,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";

const useDetailStyles = makeStyles({
  body: {
    minHeight: 0,
  },
  main: {
    minWidth: 0,
    minHeight: 0,
    overflowY: "auto",
  },
  card: { padding: "16px", flexShrink: 0 },
  sectionCard: { padding: "16px", flexShrink: 0 },
  kvRow: {
    padding: "6px 0",
  },
  kvLabel: {
    width: "120px",
    flexShrink: 0,
    color: theme.color.textTertiary,
    fontSize: "13px",
  },
  kvValue: { fontSize: "13px" },
  cardTitle: { fontSize: "14px", fontWeight: theme.font.weightSemibold, marginBottom: theme.spacing.sm },
  filterRow: {
    padding: "12px",
    marginTop: "8px",
    backgroundColor: theme.color.surfaceSecondary,
    borderRadius: theme.radius.md,
  },
  
  filterField: {
    flexGrow: 1,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.color.surface,
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
    fontSize: "13px",
  },
  
  addFilterRow: { marginTop: "8px" },
  tableScroll: { marginTop: "8px", overflowX: "auto" },
  aiPanel: {
    width: "340px",
    padding: "0",
    overflow: "hidden",
  },
  aiHeader: {
    padding: "12px 12px 12px 16px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  aiHeaderTitle: { flexGrow: 1 },
  chatBody: {
    minHeight: 0,
    overflowY: "auto",
    padding: "16px",
  },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    backgroundColor: theme.color.brandSubtle,
    borderRadius: theme.radius.lg,
    padding: "10px 14px",
  },
  
  agentBubble: {
    alignSelf: "flex-start",
    maxWidth: "90%",
    backgroundColor: theme.color.surfaceTertiary,
    borderRadius: theme.radius.lg,
    padding: "10px 14px",
  },
  aiInputRow: {
    padding: "12px 16px",
    borderTop: `1px solid ${theme.color.borderSubtle}`,
  },
  aiInput: { flexGrow: 1 },
  loading: { padding: theme.spacing["2xl"], color: theme.color.textTertiary },
});

interface QueryDetailPageProps {
  name: string;
}

export function QueryDetailPage({ name }: QueryDetailPageProps) {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useQueryDetail(name);
  const [aiOpen, setAiOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [resultsOpen, setResultsOpen] = useState(true);

  const actions = [
    refreshAction,
    saveAction,
    editAction,
    exportAction,
    settingsAction,
    deleteAction,
    generateAction,
    executeAction,
    { ...aiEditorAction, onClick: () => setAiOpen((value) => !value) },
    endpointAction,
  ];

  if (isLoading || data === undefined) {
    return (
      <ListPage header={{ icon: <DocumentSearch24Regular />, title: name, actions }}>
        <div className={styles.loading}>
          <Text>{t("queries.detail.loading")}</Text>
        </div>
      </ListPage>
    );
  }

  return (
    <ListPage header={{ icon: <DocumentSearch24Regular />, title: data.name, actions }}>
      <HStack gap="10px" className={styles.body}>
        <VStack gap="10px" className={styles.main}>
          <div className={mergeClasses(sharedStyles.contentCard, styles.card)}>
            <div className={styles.cardTitle}>{t("queries.detail.generalData")}</div>
            <HStack gap="12px" align="center" className={styles.kvRow}>
              <span className={styles.kvLabel}>{t("queries.detail.name")}</span>
              <Text weight="semibold" size={300} className={styles.kvValue}>
                {data.name}
              </Text>
              <Button
                variant="subtle"
                icon={<Info20Regular />}
                aria-label={t("queries.detail.generalData")}
              />
            </HStack>
            <HStack gap="12px" align="center" className={styles.kvRow}>
              <span className={styles.kvLabel}>{t("queries.detail.description")}</span>
              <Text size={300} className={styles.kvValue}>
                {data.description}
              </Text>
            </HStack>
          </div>

          <div className={mergeClasses(sharedStyles.contentCard, styles.sectionCard)}>
            <SectionHeader
              title={t("queries.detail.filtersCount", { count: data.filters.length })}
              collapsible
              expanded={filtersOpen}
              onToggle={() => setFiltersOpen((value) => !value)}
            />
            {filtersOpen && (
              <>
                {data.filters.map((filter) => (
                  <FilterRow key={filter.property} filter={filter} />
                ))}
                <div className={styles.addFilterRow}>
                  <Button variant="subtle" icon={<Add24Regular />}>
                    {t("queries.detail.addFilter")}
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className={mergeClasses(sharedStyles.contentCard, styles.sectionCard)}>
            <SectionHeader
              title={t("queries.detail.resultsCount", { count: data.results.length })}
              collapsible
              expanded={resultsOpen}
              onToggle={() => setResultsOpen((value) => !value)}
            />
            {resultsOpen && (
              <div className={styles.tableScroll}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {data.columns.map((column) => (
                        <TableHeaderCell key={column}>{column}</TableHeaderCell>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.results.map((row, index) => (
                      <TableRow key={`${data.name}-row-${index}`}>
                        {data.columns.map((column) => (
                          <TableCell key={column}>{String(row[column] ?? "")}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </VStack>

        {aiOpen && (
          <VStack className={mergeClasses(sharedStyles.contentCard, styles.aiPanel)}>
            <HStack gap="8px" align="center" className={styles.aiHeader}>
              <BotSparkle24Regular />
              <Text weight="semibold" size={400} className={styles.aiHeaderTitle}>
                {t("queries.aiEditor.title")}
              </Text>
              <Button
                variant="subtle"
                icon={<Dismiss20Regular />}
                aria-label={t("common.close")}
                onClick={() => setAiOpen(false)}
              />
            </HStack>
            <VStack gap="12px" className={styles.chatBody}>
              <div className={styles.userBubble}>
                <Text size={300}>{t("queries.aiEditor.sampleUserMsg")}</Text>
              </div>
              <HStack gap="6px" align="center">
                <BotSparkle24Regular />
                <Text weight="semibold" size={200}>
                  {t("queries.aiEditor.agentName")}
                </Text>
              </HStack>
              <div className={styles.agentBubble}>
                <Text size={300}>{t("queries.aiEditor.sampleAgentMsg")}</Text>
              </div>
            </VStack>
            <HStack gap="8px" align="center" className={styles.aiInputRow}>
              <Input className={styles.aiInput} placeholder={t("queries.aiEditor.placeholder")} />
              <Button
                variant="subtle"
                icon={<Send24Regular />}
                aria-label={t("queries.aiEditor.send")}
              />
            </HStack>
          </VStack>
        )}
      </HStack>
    </ListPage>
  );
}

function FilterRow({ filter }: { filter: QueryFilter }) {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  return (
    <VStack gap="8px" className={styles.filterRow}>
      <HStack gap="12px" align="center">
        <div className={styles.filterField}>
          <Text size={300}>{filter.property}</Text>
        </div>
        <div className={styles.filterField}>
          <Text size={300}>{filter.operator}</Text>
        </div>
        <div className={styles.filterField}>
          <Text size={300}>{filter.value}</Text>
        </div>
      </HStack>
      <HStack gap="16px" align="center">
        <Checkbox defaultChecked={filter.isParameter} label={t("queries.detail.parameter")} />
        <Checkbox defaultChecked={filter.isOptional} label={t("queries.detail.optional")} />
      </HStack>
    </VStack>
  );
}
