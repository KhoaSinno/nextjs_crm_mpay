"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
// import Sidebar from '@/components/sidebar';
// import Header from '@/components/header';
import TabsAddNewEmp from "@/app/components/employee/TabsAddNewEmp";

export default function AddEmployeePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleBackToEmployees = () => {
    router.push("/employees");
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar */}
      {/* <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} /> */}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="flex flex-col">
          {/* Header */}
          {/* <Header onMenuClick={() => setSidebarOpen(true)} /> */}

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={handleBackToEmployees}
                  className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                  title="Back to All Employees"
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-900" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl text-zinc-900 font-lexend">
                    Add New Employee
                  </h1>
                  <p className="font-light text-zinc-400 font-lexend">
                    {"All employee > Add new employee"}
                  </p>
                </div>
              </div>
            </div>

            {/* Add Employee Form */}
            <div className="overflow-hidden bg-white border rounded-lg border-zinc-400/20">
              <TabsAddNewEmp onBack={handleBackToEmployees} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
