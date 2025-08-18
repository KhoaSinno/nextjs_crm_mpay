"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

// import EmployeeTable from "@/app/components/employee/EmployeeTable";
import EmployeeTable from "@/components/employee/employee-table";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export default function EmployeesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleAddEmployee = () => {
    router.push("/employees/add");
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="flex flex-col">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="mb-2 text-2xl font-bold sm:text-3xl text-zinc-900 font-lexend">
                    All Employees
                  </h1>
                  <p className="font-light text-zinc-400 font-lexend">
                    Complete list and management of all employees
                  </p>
                </div>
                <button
                  onClick={handleAddEmployee}
                  className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-indigo-500 rounded-lg hover:bg-indigo-600 font-lexend"
                >
                  <Plus className="w-5 h-5" />
                  Add New Employee
                </button>
              </div>
            </div>

            {/* Employee Table */}
            <div className="overflow-hidden bg-white border rounded-lg border-zinc-400/20">
              <EmployeeTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
