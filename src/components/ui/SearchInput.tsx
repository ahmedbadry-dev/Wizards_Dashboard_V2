import type { InputHTMLAttributes } from "react";

import { IconSearch } from "../icons";
import { cn } from "../../lib/cn";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <label className={cn("relative flex w-full items-center text-sm", className)}>
      <IconSearch className="pointer-events-none absolute left-4 h-4 w-4 shrink-0 text-body-muted" />
      <input
        type="search"
        className="search-field w-full"
        {...props}
      />
    </label>
  );
}
