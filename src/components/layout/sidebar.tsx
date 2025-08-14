import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  DollarSign,
  Briefcase,
  UserCheck,
  FileText,
  Calendar,
  Settings,
  Coins,
  Sun,
  Moon,
  X,
  Menu,
  Wallet,
  History,
  User,
  CheckSquare,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
// import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [theme, setTheme] = useState("light");
  const router = useRouter();
  const pathname = usePathname();
  // const { user: currentUser } = useAuth();
  const currentUser = {
    id: "123",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "employee",
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    if (!currentUser) {
      return [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      ];
    }

    if (currentUser.role === "employee") {
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/employee/dashboard",
        },
        { icon: User, label: "My Profile", path: "/employee/profile" },
        { icon: Wallet, label: "My Wallet", path: "/employee/wallet" },
        {
          icon: History,
          label: "Salary History",
          path: "/employee/salary-history",
        },
      ];
    }

    if (currentUser.role === "accounting") {
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/accounting/dashboard",
        },
        // { icon: Users, label: 'All Employees', path: '/employees' },
        {
          icon: CheckSquare,
          label: "Payroll Approval",
          path: "/accounting/payroll-approval",
        },
        { icon: Coins, label: "Deposit Funds", path: "/accounting/deposit" },
        {
          icon: Wallet,
          label: "Company Wallet",
          path: "/accounting/company-wallet",
        },
        // { icon: History, label: 'Transactions', path: '/accounting/transactions' }
      ];
    }

    // Default menu for other roles
    return [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Users, label: "All Employees", path: "/employees" },
      { icon: DollarSign, label: "Payroll", path: "/payroll" },
      { icon: Coins, label: "Deposit", path: "/deposit" },
    ];
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (path: string) => {
    router.push(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const MenuItem = ({
    icon: Icon,
    label,
    path,
  }: {
    icon: React.ElementType;
    label: string;
    path: string;
  }) => {
    // Check if current path matches exactly or starts with the menu path (for sub-routes)
    const isActive =
      path === "/employees"
        ? pathname.startsWith("/employees")
        : pathname === path;

    return (
      <div className="relative">
        {/* Background */}
        <div
          className={`w-full h-12 rounded-tr-[10px] rounded-br-[10px] cursor-pointer transition-all ${
            isActive
              ? "bg-indigo-500/5"
              : "opacity-0 hover:bg-indigo-500/5 hover:opacity-100"
          }`}
          onClick={() => handleMenuClick(path)}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center gap-3 px-6 pointer-events-none">
          {Icon && (
            <Icon
              className={`w-6 h-6 ${
                isActive ? "text-indigo-500" : "text-zinc-900"
              }`}
            />
          )}
          <span
            className={`text-base font-lexend ${
              isActive
                ? "text-indigo-500 font-semibold"
                : "text-zinc-900 font-light"
            }`}
          >
            {label}
          </span>
        </div>

        {/* Active Indicator */}
        {isActive && (
          <div className="w-[3px] h-12 bg-indigo-500 rounded-[10px] absolute right-0 top-0" />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
                fixed top-0 left-0 z-50 lg:z-10 lg:sticky lg:top-0
                w-72 h-screen bg-white shadow-lg lg:shadow-none
                transform transition-transform duration-300 ease-in-out lg:transform-none
                ${
                  isOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
                }
                lg:translate-x-0 lg:flex-shrink-0
                overflow-hidden
            `}
      >
        {/* Background */}
        <div className="w-full h-full absolute bg-zinc-400/5 rounded-none lg:rounded-[20px]" />

        {/* Close button for mobile */}
        <button
          className="absolute z-20 p-2 top-4 right-4 lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-6 h-6 text-zinc-900" />
        </button>

        {/* Logo */}
        <div className="relative z-10 pt-6 px-6 lg:pt-[30px] lg:px-[30px]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 bg-violet-500 rounded-3xl">
              <div className="flex items-center justify-center w-5 h-5 bg-white rounded-lg">
                <span className="text-sm font-bold text-violet-500">C</span>
              </div>
            </div>
            <span className="text-lg font-semibold text-zinc-900 font-lexend">
              CRM Onchain
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="relative z-10 flex-1 px-6 lg:px-[30px] pt-8 lg:pt-[50px] pb-24 lg:pb-[100px] overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-2.5">
            {menuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="absolute bottom-6 left-6 right-6 lg:bottom-[30px] lg:left-[30px] lg:right-[30px] z-10">
          <div className="w-full h-12 bg-zinc-400/5 rounded-[10px] relative">
            {/* Light Theme Button */}
            <div
              className={`w-1/2 h-12 absolute rounded-[10px] transition-all ${
                theme === "light" ? "bg-indigo-500" : "bg-transparent"
              }`}
            />

            {/* Buttons */}
            <div className="flex h-12">
              <button
                onClick={() => setTheme("light")}
                className="flex-1 flex items-center justify-center gap-2.5 z-10"
              >
                <Sun
                  className={`w-5 h-5 lg:w-6 lg:h-6 ${
                    theme === "light" ? "text-white" : "text-zinc-900"
                  }`}
                />
                <span
                  className={`text-sm lg:text-base font-light font-lexend ${
                    theme === "light" ? "text-white" : "text-zinc-900"
                  }`}
                >
                  Light
                </span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className="flex-1 flex items-center justify-center gap-2.5"
              >
                <Moon
                  className={`w-5 h-5 lg:w-6 lg:h-6 ${
                    theme === "dark" ? "text-white" : "text-zinc-900"
                  }`}
                />
                <span
                  className={`text-sm lg:text-base font-light font-lexend ${
                    theme === "dark" ? "text-white" : "text-zinc-900"
                  }`}
                >
                  Dark
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
