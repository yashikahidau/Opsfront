"use client";

import {
  createContext,
  useContext,
} from "react";

interface SearchContextType {
  search: string;
  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export const SearchContext =
  createContext<SearchContextType | null>(
    null
  );

export function useGlobalSearch() {
  const ctx =
    useContext(SearchContext);

  if (!ctx) {
    throw new Error(
      "SearchContext missing"
    );
  }

  return ctx;
}