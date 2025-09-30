import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Case-insensitive filter
const defaultFilterFn = (row, columnId, value) =>
  String(row.getValue(columnId) ?? "")
    .toLowerCase()
    .includes(String(value).toLowerCase());

const CustomerTable = ({ data, deleteMutation, setEditing }) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

// Helper function to truncate text
const truncate = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "…" : text;
};

// Columns
const columns = [
  {
    header: "Profile",
    accessorKey: "image",
    enableSorting: false,
    filterFn: defaultFilterFn,
    cell: ({ row }) => {
      const name = row.original.name || "User";
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <Avatar className="w-10 h-10 md:w-12 md:h-12">
          {row.original.image?.url ? (
            <AvatarImage
              src={row.original.image.url}
              alt={name}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-muted text-muted-foreground">
              {initials || "👤"}
            </AvatarFallback>
          )}
        </Avatar>
      );
    },
  },
  {
    header: "Name",
    accessorKey: "name",
    filterFn: defaultFilterFn,
    cell: ({ row }) => (
      <span
        className="text-primary cursor-pointer underline hover:underline"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/customers/${row.original._id}`);
        }}
        title={row.original.name} // full name on hover
      >
        {row.original.name}
      </span>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
    filterFn: defaultFilterFn,
    cell: ({ row }) => (
      <span title={row.original.email}>{truncate(row.original.email, 15)}</span>
    ),
  },
  {
    header: "Phone",
    accessorKey: "phone",
    filterFn: defaultFilterFn,
    cell: ({ row }) => (
      <span title={row.original.phone}>{truncate(row.original.phone, 10)}</span>
    ),
  },
  {
    header: "Company",
    accessorKey: "company",
    filterFn: defaultFilterFn,
    cell: ({ row }) => <span title={row.original.company}>{row.original.company}</span>,
  },
  {
    header: "Address",
    accessorKey: "address",
    filterFn: defaultFilterFn,
    cell: ({ row }) => (
      <span title={row.original.address}>{truncate(row.original.address, 15)}</span>
    ),
  },
  {
    header: "Notes",
    accessorKey: "notes",
    filterFn: defaultFilterFn,
    cell: ({ row }) => (
      <span title={row.original.notes}>{truncate(row.original.notes, 15)}</span>
    ),
  },
  {
    header: "Actions",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setEditing(row.original);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              deleteMutation.mutate([row.original._id], {
                onSuccess: () => {
                  setSelectedIds((prev) =>
                    prev.filter((id) => id !== row.original._id)
                  );
                  toast.success("Customer deleted successfully!");
                },
                onError: () => {
                  toast.error("Failed to delete customer.");
                },
              });
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];


  // React Table
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: defaultFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Selection handlers
  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () => {
    const allIds = data.map((c) => c._id);
    setSelectedIds(selectedIds.length === data.length ? [] : allIds);
  };

  // Global filter effect
  useEffect(() => {
    table.setGlobalFilter(globalFilter);
  }, [globalFilter]);

  // Bulk delete handler
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    deleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(
          `Deleted ${selectedIds.length} customer(s) successfully!`
        );
        setSelectedIds([]); // clear selection
      },
      onError: () => {
        toast.error("Failed to delete selected customers.");
      },
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Search + Bulk Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <Input
          placeholder="Search customers..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        {selectedIds.length > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            Delete Selected ({selectedIds.length})
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <Table className="min-w-full text-sm md:text-base">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 px-3 py-2">
                <Checkbox
                  checked={
                    selectedIds.length === data.length && data.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              {table.getFlatHeaders().map((header) => (
                <TableHead
                  key={header.id}
                  className="cursor-pointer select-none font-semibold text-muted-foreground px-3 py-2"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc" ? "↑" : ""}
                    {header.column.getIsSorted() === "desc" ? "↓" : ""}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/60 transition-colors border-b border-muted/20 last:border-b-0"
                >
                  <TableCell className="px-3 py-2 align-middle">
                    <Checkbox
                      checked={selectedIds.includes(row.original._id)}
                      onCheckedChange={() => toggleSelect(row.original._id)}
                    />
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-3 py-2 align-middle text-sm md:text-base"
                    >
                      <div
                        className="truncate max-w-[150px] md:max-w-xs"
                        title={flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-6 text-muted-foreground"
                >
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-2 gap-2">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
