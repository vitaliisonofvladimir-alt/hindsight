"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { client, type KnowledgeNode } from "@/lib/api";
import { bankRoute } from "@/lib/bank-url";
import { Button } from "@/components/ui/button";
import { FileText, Layers, FilePlus, ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { formatRelativeTime, formatAbsoluteDateTime } from "@/lib/relative-time";
import { MemoryStoreCard, MemoriesActivityChart, type BankStats } from "./bank-stats-view";
import { TreeRow } from "./knowledge-base-view";
import { useFeatures } from "@/lib/features-context";

// Documents have no standard name field (metadata is free-form and varies by
// source), so recent-docs shows the document id.
type DocItem = { id?: string; created_at?: string | null };

function flattenPages(nodes: KnowledgeNode[], out: KnowledgeNode[] = []): KnowledgeNode[] {
  for (const n of nodes) {
    if (n.kind === "page") out.push(n);
    if (n.children?.length) flattenPages(n.children, out);
  }
  return out;
}

function flattenAll(nodes: KnowledgeNode[], out: KnowledgeNode[] = []): KnowledgeNode[] {
  for (const n of nodes) {
    out.push(n);
    if (n.children?.length) flattenAll(n.children, out);
  }
  return out;
}

export function HomeView({
  bankId,
  onNavigate,
}: {
  bankId: string;
  onNavigate: (tab: string) => void;
}) {
  const t = useTranslations("home");
  const tk = useTranslations("knowledgeBase");
  const router = useRouter();
  const { features } = useFeatures();
  const observationsEnabled = features?.observations ?? false;
  const [stats, setStats] = useState<BankStats | null>(null);
  const [roots, setRoots] = useState<KnowledgeNode[]>([]);
  const [pages, setPages] = useState<KnowledgeNode[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleFolder = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // The light panels (stats, pages, docs) gate the page — they're small and
    // fast, so the dashboard paints immediately.
    Promise.allSettled([
      client.getBankStats(bankId),
      client.getKnowledgeTree(bankId),
      client.listDocuments({ bank_id: bankId, limit: 6 }),
    ]).then(([s, k, d]) => {
      if (cancelled) return;
      if (s.status === "fulfilled") setStats(s.value as BankStats);
      if (k.status === "fulfilled") {
        const r = (k.value as { roots?: KnowledgeNode[] }).roots || [];
        setRoots(r);
        const flat = flattenPages(r);
        setPages(flat);
        // Expand all folders so the Home card shows the full structure at a glance.
        setExpanded(
          new Set(
            flattenAll(r)
              .filter((n) => n.kind === "folder")
              .map((n) => n.id)
          )
        );
      }
      if (d.status === "fulfilled") setDocs((d.value as { items?: DocItem[] }).items || []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [bankId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" variant="jump" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-foreground">{t("title")}</h1>
      <p className="text-muted-foreground mb-6">
        {t("subtitle")} <span className="font-mono text-foreground">{bankId}</span>
      </p>

      <div className="grid grid-cols-1 gap-4">
        {/* Lightweight knowledge pages and recent documents; no graph requests on Home. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
          <div className="bg-card border border-border border-solid rounded-[16px] flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <h2 className="text-sm font-semibold text-foreground">{t("pagesTitle")}</h2>
              {pages.length > 0 && (
                <button
                  onClick={() => onNavigate("knowledge")}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  {t("viewAll")} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            {pages.length > 0 ? (
              // Same folder/page tree (TOC) as the Pages tab, read-only: shows the
              // structure + freshness badges; clicking a page opens the Knowledge tab.
              <ul className="py-2 flex-1 min-h-0 overflow-y-auto">
                {roots.map((node) => (
                  <TreeRow
                    key={node.id}
                    node={node}
                    depth={0}
                    readOnly
                    expanded={expanded}
                    selectedId={null}
                    onToggle={toggleFolder}
                    onOpenPage={(pageId) =>
                      router.push(
                        bankRoute(bankId, `?view=knowledge&knowledgeTab=pages&page=${pageId}`)
                      )
                    }
                    t={tk}
                  />
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center">
                <Layers className="w-7 h-7 mx-auto mb-2 text-muted-foreground opacity-60" />
                <p className="text-sm text-muted-foreground mb-3">{t("pagesEmpty")}</p>
                <Button size="sm" onClick={() => onNavigate("knowledge")}>
                  <FilePlus className="w-4 h-4 mr-2" />
                  {t("pagesEmptyCta")}
                </Button>
              </div>
            )}
          </div>

          <div className="bg-card border border-border border-solid rounded-[16px] flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <h2 className="text-sm font-semibold text-foreground">{t("recentDocsTitle")}</h2>
              {docs.length > 0 && (
                <button
                  onClick={() => onNavigate("documents")}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  {t("viewAll")} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            {docs.length > 0 ? (
              <ul className="p-2 flex-1 min-h-0 overflow-y-auto">
                {docs.map((d, i) => (
                  <li key={`${d.id}-${i}`}>
                    <button
                      onClick={() => onNavigate("documents")}
                      className="w-full flex items-center justify-between gap-2 px-2 py-1 rounded hover:bg-muted text-left"
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs font-mono truncate" title={d.id}>
                          {d.id}
                        </span>
                      </span>
                      {d.created_at && (
                        <span
                          className="text-[11px] text-muted-foreground flex-shrink-0"
                          title={formatAbsoluteDateTime(d.created_at)}
                        >
                          {formatRelativeTime(d.created_at)}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {t("recentDocsEmpty")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Memory stats stay below the lightweight knowledge/docs cards. */}
      {stats && (
        <div className="mt-4">
          <MemoryStoreCard stats={stats} observationsEnabled={observationsEnabled} />
        </div>
      )}

      {/* Memories by ingested time — reuse the bank-profile activity chart. */}
      <div className="mt-4">
        <MemoriesActivityChart bankId={bankId} observationsEnabled={observationsEnabled} />
      </div>
    </div>
  );
}
