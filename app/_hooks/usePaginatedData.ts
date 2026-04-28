"use client";

import { useEffect, useMemo, useState } from "react";
import { DATA_REFRESH_EVENT } from "@/app/_lib/client/dataRefresh";
import type { PaginatedResult } from "@/app/_lib/actions/pagination";

type Fetcher<T> = (params: {
  page: number;
  pageSize: number;
  search?: string;
}) => Promise<PaginatedResult<T>>;

export function usePaginatedData<T>(fetcher: Fetcher<T>, pageSize = 10) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize],
  );
  const safePage = Math.min(page, totalPages);

  async function load(p = safePage, s = search) {
    setLoading(true);
    try {
      const res = await fetcher({ page: p, pageSize, search: s });
      setItems(res.items);
      setTotal(res.total);
      setPage(res.page);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleDataRefresh() {
      load(safePage, search);
    }

    window.addEventListener(DATA_REFRESH_EVENT, handleDataRefresh);
    return () => {
      window.removeEventListener(DATA_REFRESH_EVENT, handleDataRefresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage, search]);

  function onSearchChange(value: string) {
    setSearch(value);
    setPage(1);
    load(1, value);
  }

  function prev() {
    const nextPage = Math.max(1, safePage - 1);
    setPage(nextPage);
    load(nextPage);
  }

  function next() {
    const nextPage = Math.min(totalPages, safePage + 1);
    setPage(nextPage);
    load(nextPage);
  }

  return {
    items,
    total,
    page: safePage,
    totalPages,
    loading,
    search,
    setSearch: onSearchChange,
    prev,
    next,
    reload: () => load(safePage, search),
  };
}
