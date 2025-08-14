"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Eye, Edit, Trash2, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { employeeApi } from "@/lib/api";
import { Employee } from "@/types/employee";

const EmployeeTable = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [users, setUsers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await employeeApi.getUsers();
        if (response.success) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Memoize the data to prevent unnecessary re-computation
  const data = useMemo(() => users, [users]);

  // Memoize the columns to prevent re-computation on every render
  const columns: ColumnDef<Employee>[] = useMemo(
    () => [
      {
        accessorKey: "name" as const,
        header: "Employee Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 min-w-0">
            {row.original.avatar && (
              <img
                className="flex-shrink-0 object-cover w-8 h-8 rounded-full sm:w-9 sm:h-9"
                src={row.original.avatar}
                alt={row.original.name}
                loading="lazy"
              />
            )}
            <span className="text-sm font-light truncate text-zinc-900 sm:text-base font-lexend">
              {row.original.name}
            </span>
          </div>
        ),
        filterFn: "includesString" as const,
      },
      {
        accessorKey: "phone" as const,
        header: "Phone",
        cell: ({ getValue }) => (
          <span className="text-sm font-light text-zinc-900 sm:text-base font-lexend">
            {getValue() as string}
          </span>
        ),
        filterFn: "includesString" as const,
      },
      {
        accessorKey: "department" as const,
        header: "Department",
        cell: ({ getValue }) => (
          <span className="text-sm font-light text-zinc-900 sm:text-base font-lexend">
            {getValue() as string}
          </span>
        ),
        filterFn: "includesString" as const,
      },
      {
        accessorKey: "designation" as const,
        header: "Designation",
        cell: ({ getValue }) => (
          <span className="text-sm font-light text-zinc-900 sm:text-base font-lexend">
            {getValue() as string}
          </span>
        ),
        filterFn: "includesString" as const,
      },
      {
        accessorKey: "type" as const,
        header: "Type",
        cell: ({ getValue }) => (
          <span className="text-sm font-light text-zinc-900 sm:text-base font-lexend">
            {getValue() as string}
          </span>
        ),
        filterFn: "includesString" as const,
      },
      {
        accessorKey: "status" as const,
        header: "Status",
        cell: ({ getValue }) => (
          <div className="px-2 py-[3px] bg-indigo-500/10 rounded text-indigo-500 text-xs font-light font-lexend inline-block">
            {getValue() as string}
          </div>
        ),
        filterFn: "includesString" as const,
      },
      {
        id: "actions",
        header: "Action",
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="flex gap-1 sm:gap-2.5">
            <button
              className="flex items-center justify-center w-6 h-6 rounded sm:w-8 sm:h-8 hover:bg-gray-100"
              onClick={() => router.push(`/employees/${row.original.id}`)}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900" />
            </button>
            <button
              onClick={() => openEditModal(row.original)}
              className="flex items-center justify-center w-6 h-6 rounded sm:w-8 sm:h-8 hover:bg-gray-100"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900" />
            </button>
            <button
              className="flex items-center justify-center w-6 h-6 rounded sm:w-8 sm:h-8 hover:bg-gray-100"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            </button>
          </div>
        ),
      },
    ],
    [router]
  );

  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeApi.deleteUser(id);
        // Refresh the users list
        const response = await employeeApi.getUsers();
        if (response.success) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const closeModals = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block w-6 h-6 border-2 border-t-2 border-gray-200 rounded-full animate-spin border-t-indigo-500"></div>
        <p className="mt-2 text-gray-500">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex-1 max-w-md">
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search employees..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 sm:px-6"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 sm:px-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <div className="text-sm text-gray-700">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getPrePaginationRowModel().rows.length
          )}{" "}
          of {table.getPrePaginationRowModel().rows.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal - You can implement this as needed */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
            <h2 className="text-lg font-semibold mb-4">Edit Employee</h2>
            <p>Editing: {selectedEmployee.name}</p>
            {/* Add your edit form here */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
