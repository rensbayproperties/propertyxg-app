import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Options } from "nuqs";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  pageSizeOptions?: number[];
  loading?: boolean;
  setCurrentPage?: <Shallow>(
    value: number | ((old: number) => number | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>;
  currentPage?: number;
  setPageSize?: <Shallow>(
    value: number | ((old: number) => number | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>;
  pageSize?: number;
  isPagination?: boolean;
  rowSelection?: {};
  setRowSelection?: React.Dispatch<React.SetStateAction<{}>>;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  pageSizeOptions = [10, 20, 30, 40, 50],
  loading,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  isPagination,
  rowSelection,
  setRowSelection,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const paginationState = {
    pageIndex: (currentPage ?? 1) - 1,
    pageSize: pageSize ?? 1,
  };

  const pageCount = Math.ceil(totalItems / (pageSize ?? 1));

  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState)
  ) => {
    const pagination =
      typeof updaterOrValue === "function"
        ? updaterOrValue(paginationState)
        : updaterOrValue;

    setCurrentPage?.(pagination.pageIndex + 1);
    setPageSize?.(pagination.pageSize);
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination: paginationState,
      rowSelection: rowSelection ?? {},
    },

    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
    enableRowSelection: true,
  });

  return (
    <div className="space-y-4">
      <ScrollArea className="min-h-[calc(80vh-220px)] rounded-md border border-border md:min-h-[calc(80dvh-200px)] bg-card">
        <Table className="relative rounded">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: paginationState.pageSize }).map(
                (_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={colIndex} className="animate-pulse">
                        <div className="h-4 bg-muted rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {

                return (
                  <TableRow
                    key={row.id}
                    data-state={row?.getIsSelected() as any && "selected"}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {isPagination && (
        <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
              <div className="flex items-center space-x-2">
                <p className="whitespace-nowrap text-sm font-medium">
                  Rows per page
                </p>
                <Select
                  value={`${paginationState.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={paginationState.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {pageSizeOptions.map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
            <div className="flex w-[150px] items-center justify-center text-sm font-medium">
              {totalItems > 0 ? (
                <>
                  Page {paginationState.pageIndex + 1} of {table.getPageCount()}
                </>
              ) : (
                "No pages"
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                aria-label="Go to first page"
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to previous page"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to next page"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to last page"
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
