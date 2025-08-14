import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Download, ExternalLink, Filter } from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { getCurrentUser } from '../../utils/mockData';
import { getPayrollByEmployeeId } from '../../api/payroll';

const SalaryHistoryPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const [payrollSchedules, setPayrollSchedules] = useState([]);

    // get payroll schedule for current user vs real api getPayrollByEmployeeId
    useEffect(() => {
        if (!currentUser || currentUser.role !== 'employee') {
            // Don't fetch if not logged in or not employee
            return;
        }
        const fetchPayrollSchedule = async () => {
            try {
                const response = await getPayrollByEmployeeId(currentUser.id);
                // Handle the response and update state
                setPayrollSchedules(response.data.data || []);
            } catch (error) {
                console.error('Error fetching payroll schedule:', error);
            }
        };

        fetchPayrollSchedule();
    }, []);

    console.log('Payroll Schedule:', payrollSchedules);

    if (!currentUser || currentUser.role !== 'employee') {
        navigate('/login');
        return null;
    }

    // Filter salary history for current user (dùng data từ API)
    const filteredHistory = selectedFilter === 'all'
        ? payrollSchedules
        : payrollSchedules.filter(p => p.status === selectedFilter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-700';
            case 'approved':
                return 'bg-blue-100 text-blue-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const openBlockExplorer = (txHash) => {
        // Mock block explorer URL
        const url = `https://etherscan.io/tx/${txHash}`;
        window.open(url, '_blank');
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
                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="mb-2 text-3xl font-bold text-zinc-900 font-lexend">
                                Salary History 📊
                            </h1>
                            <p className="text-zinc-600 font-lexend">
                                View your complete salary payment history
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                            <div className="p-6 bg-white border border-gray-200 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 font-lexend">
                                    {payrollSchedules.filter(p => p.status === 'paid').length}
                                </div>
                                <div className="text-sm text-gray-600 font-lexend">
                                    Payments Received
                                </div>
                            </div>

                            <div className="p-6 bg-white border border-gray-200 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 font-lexend">
                                    ${payrollSchedules
                                        .filter(p => p.status === 'paid')
                                        .reduce((sum, p) => sum + p.amount, 0)
                                        .toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600 font-lexend">
                                    Total Earned
                                </div>
                            </div>

                            <div className="p-6 bg-white border border-gray-200 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600 font-lexend">
                                    {payrollSchedules.filter(p => p.status === 'pending').length}
                                </div>
                                <div className="text-sm text-gray-600 font-lexend">
                                    Pending Payments
                                </div>
                            </div>
                        </div>

                        {/* Filters and Controls */}
                        <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <Filter className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700 font-lexend">
                                        Filter by status:
                                    </span>
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(e.target.value)}
                                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg font-lexend"
                                    >
                                        <option value="all">All</option>
                                        <option value="paid">Paid</option>
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>

                                <button
                                    className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-indigo-500 rounded-lg hover:bg-indigo-600 font-lexend"
                                    onClick={() => {
                                        // Tạo CSV header
                                        const header = ['Pay Date', 'Amount', 'Currency', 'Status', 'Employee Name'];
                                        // Map data
                                        const rows = payrollSchedules.map(p => [
                                            p.payday,
                                            p.amount,
                                            p.stablecoin_type,
                                            p.status,
                                            p.employee?.fullName || ''
                                        ]);
                                        // Convert to CSV string
                                        const csvContent = [header, ...rows]
                                            .map(row => row.map(val => `"${val ?? ''}"`).join(','))
                                            .join('\n');
                                        // Download
                                        const blob = new Blob([csvContent], { type: 'text/csv' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'salary_history.csv';
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    }}
                                >
                                    <Download className="w-4 h-4" />
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {/* Salary History Table */}
                        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 font-lexend">
                                    Payment History
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-lexend">
                                                Pay Date
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-lexend">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-lexend">
                                                Currency
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-lexend">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-lexend">
                                                Transaction
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredHistory.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-900 font-lexend">
                                                            {new Date(payment.payday).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-semibold text-gray-900 font-lexend">
                                                        ${payment.amount.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900 font-lexend">
                                                        {payment.stablecoin_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)} font-lexend`}>
                                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {payment.transaction_hash ? (
                                                        <button
                                                            onClick={() => openBlockExplorer(payment.transaction_hash)}
                                                            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-lexend"
                                                        >
                                                            <span>View</span>
                                                            <ExternalLink className="w-3 h-3" />
                                                        </button>
                                                    ) : (
                                                        <span className="text-sm text-gray-500 font-lexend">
                                                            N/A
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredHistory.length === 0 && (
                                <div className="py-12 text-center">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="mb-2 text-lg font-medium text-gray-900 font-lexend">
                                        No salary history found
                                    </h3>
                                    <p className="text-gray-500 font-lexend">
                                        {selectedFilter === 'all'
                                            ? "You don't have any salary records yet."
                                            : `No ${selectedFilter} payments found.`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Recent Transactions */}
                        {/* {userTransactions.length > 0 && (
                            <div className="p-6 mt-6 bg-white border border-gray-200 rounded-lg">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900 font-lexend">
                                    Recent Transaction Details
                                </h2>

                                <div className="space-y-3">
                                    {userTransactions.slice(0, 3).map((transaction) => (
                                        <div key={transaction.id} className="flex items-center gap-4 p-4 rounded-lg bg-green-50">
                                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                                                <Download className="w-5 h-5 text-green-600" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 font-lexend">
                                                    {transaction.description}
                                                </div>
                                                <div className="text-sm text-gray-500 font-lexend">
                                                    {new Date(transaction.timestamp).toLocaleDateString()} •
                                                    TX: {transaction.transaction_hash?.slice(0, 10)}...
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="font-semibold text-green-600 font-lexend">
                                                    +{transaction.amount.toLocaleString()} {transaction.currency}
                                                </div>
                                                <div className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                                                    {transaction.status}
                                                </div>
                                            </div>

                                            {transaction.transaction_hash && (
                                                <button
                                                    onClick={() => openBlockExplorer(transaction.transaction_hash)}
                                                    className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryHistoryPage;
