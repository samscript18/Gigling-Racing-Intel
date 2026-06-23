import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export type DataTableColumn<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string;
  emptyMessage?: string;
};

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No rows match this intel view."
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm text-white/54">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overscroll-x-contain rounded-lg border border-white/10">
      <table className="min-w-[760px] divide-y divide-white/10 text-sm md:min-w-full">
        <thead className="bg-white/[0.04] text-left text-xs uppercase tracking-[0.18em] text-white/38">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className={cn("px-4 py-3 font-bold", column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/8">
          {data.map((row, index) => (
            <tr key={`${getRowKey(row, index)}-${index}`} className="transition hover:bg-white/[0.035]">
              {columns.map((column) => (
                <td key={column.header} className={cn("px-4 py-3 text-white/72", column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
