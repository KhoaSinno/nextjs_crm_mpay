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
  // const data = useMemo(
  //     () => [
  //         {
  //             id: 1,
  //             name: 'Bessie Cooper',
  //             phone: '091233412',
  //             department: 'HR',
  //             designation: 'HR Manager',
  //             type: 'Office',
  //             status: 'Permanent',
  //             avatar:
  //                 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
  //         },
  //         {
  //             id: 2,
  //             name: 'Devon Lane',
  //             phone: '091233412',
  //             department: 'BA',
  //             designation: 'Business Analyst',
  //             type: 'Remote',
  //             status: 'Permanent',
  //             avatar:
  //                 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
  //         },
  //     ],
  //     []
  // );
  const data = useMemo(() => users, [users]);

  console.log("Data fetched:", data);

  // Memoize the columns to prevent re-computation on every render
  const columns: ColumnDef<Employee>[] = useMemo(
    () => [
      {
        accessorKey: "fullName" as const,
        header: "Employee Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 min-w-0">
            {row.original.avatar && (
              <img
                className="flex-shrink-0 object-cover w-8 h-8 rounded-full sm:w-9 sm:h-9"
                src={row.original.avatar}
                alt={row.original.fullName}
                loading="lazy"
              />
            )}
            <span className="text-sm font-light truncate text-zinc-900 sm:text-base font-lexend">
              {row.original.fullName}
            </span>
          </div>
        ),
        filterFn: "includesString" as const,
      },
      {
        accessorKey: "phoneNumber" as const,
        header: "Phone",
        cell: ({ getValue }) => (
          <span className="text-sm font-light text-zinc-900 sm:text-base font-lexend">
            {getValue() as string}
          </span>
        ),
        filterFn: "includesString" as const,
      },

      {
        accessorKey: "salary" as const,
        header: "Salary",
        cell: ({ getValue }) => (
          <span className="text-sm font-light text-zinc-900 sm:text-base font-lexend">
            {(getValue() as string) || 0}
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
            <button className="flex items-center justify-center w-6 h-6 rounded sm:w-8 sm:h-8 hover:bg-gray-100">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900" />
            </button>
            <button
              onClick={() => openEditModal(row.original)}
              className="flex items-center justify-center w-6 h-6 rounded sm:w-8 sm:h-8 hover:bg-gray-100"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900" />
            </button>
            <button className="flex items-center justify-center w-6 h-6 rounded sm:w-8 sm:h-8 hover:bg-gray-100">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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

  // =========================== Handlers ===========================

  // const handleAddEmployee = () => {
  //     // Chuyển hướng đến trang thêm nhân viên
  //     navigate('/employees/add');
  // };

  // const handleEditEmployee = async (data) => {
  //     try {
  //         // TODO: Gọi API cập nhật nhân viên
  //         console.log('Updating employee:', data);
  //         // Tạm thời cập nhật state local để demo
  //         setUser(prev => prev?.map(emp =>
  //             emp.id === selectedEmployee.id
  //                 ? { ...emp, ...data }
  //                 : emp
  //         ));
  //         setShowEditModal(false);
  //         setSelectedEmployee(null);
  //     } catch (error) {
  //         console.error('Error updating employee:', error);
  //     }
  // };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="w-full p-3 overflow-hidden bg-white sm:p-4">
      <div className="flex items-center justify-between mb-4">
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search employees..."
            className="w-full max-w-xs h-10 px-3 rounded-[10px] border border-zinc-400/20 text-zinc-900 text-sm font-light font-lexend"
          />
        </div>
        <div className="flex items-center justify-center mb-4">
          {/* Add Employee Button */}
          {/* <button
                        onClick={handleAddEmployee}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 font-lexend"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm nhân viên
                    </button> */}

          {/* Search filter */}
          <div
            data-size="Large"
            data-state="Icon+Button Auto Width"
            data-type="Fill"
            className="w-28 h-12 p-5 rounded-[10px] outline-1 outline-offset-[-1px] outline-zinc-400/20 inline-flex justify-center items-center gap-2.5 ml-4"
          >
            <div className="relative w-6 h-6 overflow-hidden">
              <div className="w-1.5 h-0 left-[3px] top-[6px] absolute rounded-md outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
              <div className="w-2 h-0 left-[3px] top-[12px] absolute rounded-md outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
              <div className="w-0.5 h-0 left-[19px] top-[12px] absolute rounded-md outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
              <div className="w-1.5 h-0 left-[14px] top-[6px] absolute rounded-md outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
              <div className="w-1.5 h-0 left-[13px] top-[18px] absolute rounded-md outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
              <div className="w-[3px] h-0 left-[3px] top-[18px] absolute rounded-md outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
              <div className="w-1 h-1 left-[6px] top-[16px] absolute rounded-full outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
              <div className="w-1 h-1 left-[15px] top-[10px] absolute rounded-full outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
              <div className="w-1 h-1 left-[10px] top-[4px] absolute rounded-full outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
            </div>
            <div className="justify-start text-zinc-900 text-base font-light font-['Lexend'] leading-normal">
              Filter
            </div>
          </div>
        </div>
      </div>

      {/* Table Container - Horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="border-b bg-zinc-400/5 border-zinc-400/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`px-2 sm:px-4 py-2.5 text-left text-zinc-900 text-sm sm:text-base font-semibold font-lexend ${
                      // Hide columns on mobile based on priority
                      index === 1
                        ? "hidden sm:table-cell" // Phone
                        : index === 2
                        ? "hidden md:table-cell" // Department
                        : index === 3
                        ? "hidden lg:table-cell" // Designation
                        : index === 4
                        ? "hidden md:table-cell" // Type
                        : ""
                    }`}
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
                className="border-b border-zinc-400/10 hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    className={`px-2 sm:px-4 py-2.5 ${
                      // Hide columns on mobile based on priority
                      index === 1
                        ? "hidden sm:table-cell" // Phone
                        : index === 2
                        ? "hidden md:table-cell" // Department
                        : index === 3
                        ? "hidden lg:table-cell" // Designation
                        : index === 4
                        ? "hidden md:table-cell" // Type
                        : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col items-center justify-between gap-4 mt-4 sm:flex-row">
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="text-sm font-light text-zinc-400 font-lexend">
            Showing
          </span>
          <div className="relative">
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="w-16 sm:w-20 h-9 sm:h-11 bg-white rounded-[10px] border border-zinc-400/20 px-2 sm:px-3 appearance-none text-sm"
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute w-4 h-4 pointer-events-none sm:w-5 sm:h-5 right-1 sm:right-2 top-2 sm:top-3 text-zinc-900" />
          </div>
        </div>

        <span className="text-xs font-light text-center text-zinc-400 sm:text-sm font-lexend">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            data.length
          )}{" "}
          of {data.length} records
        </span>

        <div className="flex gap-2">
          <button
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Add Employee Button - Floating action button */}
      {/* <button
                onClick={() => setShowAddModal(true)}
                className="fixed p-3 text-white transition-all bg-indigo-600 rounded-full shadow-md bottom-5 right-5 hover:bg-indigo-700"
            >
                <Plus className="w-5 h-5" />
            </button> */}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <button
              onClick={closeModals}
              className="absolute z-10 p-1 text-gray-500 top-4 right-4 hover:text-gray-700"
            >
              <Edit className="w-6 h-6" />
            </button>
            {/* TODO: Create a simple edit form or use existing components */}
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Edit Employee</h2>
              <p>Edit form will be implemented here</p>
              <button
                onClick={closeModals}
                className="px-4 py-2 mt-4 text-white bg-gray-500 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
