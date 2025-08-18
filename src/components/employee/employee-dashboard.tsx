// ...existing code...
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Wallet, History, LogOut } from "lucide-react";
import Sidebar from "../layout/sidebar";
import Header from "../layout/header";
// import WalletBalance from '../wallet/wallet-balance';
// import WalletConnector from '../wallet/wallet-connector';
// import { useAuth } from '../../providers/web3-provider';
// import { useWallet } from '../../hooks/useWallet';

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  // const { user: currentUser, logout } = useAuth();
  // const { isConnected } = useWallet();
  const currentUser = { fullName: "Demo User", salary: 0 };
  const logout = () => {};
  const isConnected = false;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleWalletConnect = (walletInfo: unknown) => {
    console.log("Wallet connected:", walletInfo);
    // In real app, update user's wallet address in database
  };

  const quickActions = [
    {
      icon: User,
      title: "View Profile",
      description: "Update your personal information",
      onClick: () => router.push("/employees/detail"),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: History,
      title: "Salary History",
      description: "View your payment history",
      onClick: () => router.push("/employee/salary-history"),
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Wallet,
      title: "Manage Wallet",
      description: "Connect or manage your crypto wallet",
      onClick: () => router.push("/employee/wallet"),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

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
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900 font-lexend">
                    Welcome back, {currentUser?.fullName || "Employee"}! 👋
                  </h1>
                  {/* <p className="mt-2 text-zinc-600 font-lexend">
                                        {currentUser.position} • {currentUser.department}
                                    </p> */}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 transition-colors border border-red-200 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
              {/* Wallet Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900 font-lexend">
                  Your Wallet
                </h2>

                {/* WalletBalance and WalletConnector are commented out due to missing files */}
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900 font-lexend">
                  Quick Stats
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 font-lexend">
                      ${currentUser.salary?.toLocaleString() || "0"}$
                      {currentUser?.salary?.toLocaleString() || "0"}
                    </div>
                    <div className="text-sm text-gray-600 font-lexend">
                      Monthly Salary
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 font-lexend">
                      {/* Years with Company: joinDate not in Employee type, so fallback to 0 */}
                      0
                      {/* Years with Company: joinDate not in Employee type, so fallback to 0 */}
                      0 ${currentUser?.salary?.toLocaleString() || "0"}
                    </div>
                    <div className="text-sm text-gray-600 font-lexend">
                      Years with Company
                    </div>
                  </div>
                </div>

                {/* Upcoming Payments */}
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h3 className="mb-3 font-semibold text-gray-900 font-lexend">
                    Next Payment
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900 font-lexend">
                        ${currentUser.salary?.toLocaleString() || "0"}
                      </div>
                      <div className="text-sm text-gray-500 font-lexend">
                        January 31, 2025
                      </div>
                    </div>
                    <div className="px-3 py-1 text-sm text-yellow-700 bg-yellow-100 rounded-full font-lexend">
                      Pending
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900 font-lexend">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="p-6 text-left transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md"
                  >
                    <div
                      className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900 font-lexend">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-lexend">
                      {action.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            {/* <div className="p-6 bg-white border border-gray-200 rounded-lg">
                            <h2 className="mb-4 text-xl font-semibold text-zinc-900 font-lexend">
                                Recent Activity
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 font-lexend">
                                            December salary payment received
                                        </div>
                                        <div className="text-xs text-gray-500 font-lexend">
                                            Dec 31, 2024 • $5,000 USDT
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 font-lexend">
                                            Profile updated
                                        </div>
                                        <div className="text-xs text-gray-500 font-lexend">
                                            Jan 10, 2025 • Contact information
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 font-lexend">
                                            Wallet connected
                                        </div>
                                        <div className="text-xs text-gray-500 font-lexend">
                                            Jan 5, 2025 • MetaMask wallet
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
