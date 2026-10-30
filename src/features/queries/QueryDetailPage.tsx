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
  settingsAction,
} from "@/components/common";
import {
  Add24Regular,
  BotSparkle24Regular,
  ChevronDown20Regular,
  ChevronRight20Regular,
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
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useDetailStyles = makeStyles({
  body: { display: "flex", columnGap: "10px", flexGrow: 1, minHeight: 0 },
  main: {
    flexGrow: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
    minHeight: 0,
    overflowY: "auto",
  },
  card: { padding: "16px", flexShrink: 0 },
  sectionCard: { padding: "16px", flexShrink: 0 },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    padding: "4px 0",
  },
  kvRow: { display: "flex", alignItems: "center", columnGap: "12px", padding: "6px 0" },
  kvLabel: {
    width: "120px",
    flexShrink: 0,
    color: tokens.colorNeutralForeground3,
    fontSize: "13px",
  },
  kvValue: { fontSize: "13px" },
  cardTitle: { fontSize: "14px", fontWeight: tokens.fontWeightSemibold, marginBottom: "8px" },
  filterRow: {
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
    padding: "12px",
    marginTop: "8px",
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  filterFields: { display: "flex", alignItems: "center", columnGap: "12px" },
  filterField: {
    flexGrow: 1,
    padding: "8px 12px",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: "13px",
  },
  filterToggles: { display: "flex", alignItems: "center", columnGap: "16px" },
  addFilterRow: { marginTop: "8px" },
  tableScroll: { marginTop: "8px", overflowX: "auto" },
  aiPanel: {
    width: "340px",
    flexShrink: 0,
    padding: "0",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  aiHeader: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    padding: "12px 12px 12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  aiHeaderTitle: { flexGrow: 1 },
  chatBody: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    rowGap: "12px",
    padding: "16px",
  },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusLarge,
    padding: "10px 14px",
  },
  agentNameRow: { display: "flex", alignItems: "center", columnGap: "6px" },
  agentBubble: {
    alignSelf: "flex-start",
    maxWidth: "90%",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusLarge,
    padding: "10px 14px",
  },
  aiInputRow: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  aiInput: { flexGrow: 1 },
  loading: { padding: "32px", color: tokens.colorNeutralForeground3 },
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
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={mergeClasses(sharedStyles.contentCard, styles.card)}>
            <div className={styles.cardTitle}>{t("queries.detail.generalData")}</div>
            <div className={styles.kvRow}>
              <span className={styles.kvLabel}>{t("queries.detail.name")}</span>
              <Text weight="semibold" size={300} className={styles.kvValue}>
                {data.name}
              </Text>
              <Button
                appearance="subtle"
                icon={<Info20Regular />}
                aria-label={t("queries.detail.generalData")}
              />
            </div>
            <div className={styles.kvRow}>
              <span className={styles.kvLabel}>{t("queries.detail.description")}</span>
              <Text size={300} className={styles.kvValue}>
                {data.description}
              </Text>
            </div>
          </div>

          <div className={mergeClasses(sharedStyles.contentCard, styles.sectionCard)}>
            <button
              className={styles.sectionHeader}
              onClick={() => setFiltersOpen((value) => !value)}
              aria-expanded={filtersOpen}
            >
              {filtersOpen ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
              <Text weight="semibold" size={300}>
                {t("queries.detail.filtersCount", { count: data.filters.length })}
              </Text>
            </button>
            {filtersOpen && (
              <>
                {data.filters.map((filter) => (
                  <FilterRow key={filter.property} filter={filter} />
                ))}
                <div className={styles.addFilterRow}>
                  <Button appearance="subtle" icon={<Add24Regular />}>
                    {t("queries.detail.addFilter")}
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className={mergeClasses(sharedStyles.contentCard, styles.sectionCard)}>
            <button
              className={styles.sectionHeader}
              onClick={() => setResultsOpen((value) => !value)}
              aria-expanded={resultsOpen}
            >
              {resultsOpen ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
              <Text weight="semibold" size={300}>
                {t("queries.detail.resultsCount", { count: data.results.length })}
              </Text>
            </button>
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
        </div>

        {aiOpen && (
          <div className={mergeClasses(sharedStyles.contentCard, styles.aiPanel)}>
            <div className={styles.aiHeader}>
              <BotSparkle24Regular />
              <Text weight="semibold" size={400} className={styles.aiHeaderTitle}>
                {t("queries.aiEditor.title")}
              </Text>
              <Button
                appearance="subtle"
                icon={<Dismiss20Regular />}
                aria-label={t("common.close")}
                onClick={() => setAiOpen(false)}
              />
            </div>
            <div className={styles.chatBody}>
              <div className={styles.userBubble}>
                <Text size={300}>{t("queries.aiEditor.sampleUserMsg")}</Text>
              </div>
              <div className={styles.agentNameRow}>
                <BotSparkle24Regular />
                <Text weight="semibold" size={200}>
                  {t("queries.aiEditor.agentName")}
                </Text>
              </div>
              <div className={styles.agentBubble}>
                <Text size={300}>{t("queries.aiEditor.sampleAgentMsg")}</Text>
              </div>
            </div>
            <div className={styles.aiInputRow}>
              <Input className={styles.aiInput} placeholder={t("queries.aiEditor.placeholder")} />
              <Button
                appearance="subtle"
                icon={<Send24Regular />}
                aria-label={t("queries.aiEditor.send")}
              />
            </div>
          </div>
        )}
      </div>
    </ListPage>
  );
}

function FilterRow({ filter }: { filter: QueryFilter }) {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  return (
    <div className={styles.filterRow}>
      <div className={styles.filterFields}>
        <div className={styles.filterField}>
          <Text size={300}>{filter.property}</Text>
        </div>
        <div className={styles.filterField}>
          <Text size={300}>{filter.operator}</Text>
        </div>
        <div className={styles.filterField}>
          <Text size={300}>{filter.value}</Text>
        </div>
      </div>
      <div className={styles.filterToggles}>
        <Checkbox defaultChecked={filter.isParameter} label={t("queries.detail.parameter")} />
        <Checkbox defaultChecked={filter.isOptional} label={t("queries.detail.optional")} />
      </div>
    </div>
  );
}
