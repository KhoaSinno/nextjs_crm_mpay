import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, Download, History, AlertCircle } from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import WalletBalance from '../../components/wallet/WalletBalance';
import WalletConnector from '../../components/wallet/WalletConnector';
import { getCurrentUser, mockTransactions } from '../../utils/mockData';
import { useWallet } from '../../hooks/useWallet';

const EmployeeWalletPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawCurrency, setWithdrawCurrency] = useState('USDT');
    const [withdrawAddress, setWithdrawAddress] = useState('');
    const [showWithdrawForm, setShowWithdrawForm] = useState(false);

    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const { isConnected, sendTransaction, balance } = useWallet();

    const handleWalletConnect = (walletInfo) => {
        console.log('Wallet connected:', walletInfo);
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();

        if (!withdrawAmount || !withdrawAddress) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const result = await sendTransaction(withdrawAddress, withdrawAmount, withdrawCurrency);
            alert(`Withdrawal initiated! Transaction: ${result.hash}`);
            setShowWithdrawForm(false);
            setWithdrawAmount('');
            setWithdrawAddress('');
        } catch (error) {
            alert(`Withdrawal failed: ${error.message}`);
        }
    };

    if (!currentUser || currentUser.role !== 'employee') {
        navigate('/login');
        return null;
    }

    // Filter transactions for current user
    const userTransactions = mockTransactions.filter(tx =>
        tx.to_address === currentUser.walletAddress ||
        tx.from_address === currentUser.walletAddress ||
        tx.employee_name === currentUser.fullName
    );

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
                                My Wallet 💰
                            </h1>
                            <p className="text-zinc-600 font-lexend">
                                Manage your crypto wallet and view transaction history
                            </p>
                        </div>

                        {/* Wallet Connection Section */}
                        {!isConnected ? (
                            <div className="p-8 mb-6 text-center bg-white border border-gray-200 rounded-lg">
                                <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h2 className="mb-2 text-xl font-semibold text-gray-900 font-lexend">
                                    Connect Your Wallet
                                </h2>
                                <p className="mb-6 text-gray-600 font-lexend">
                                    Connect your crypto wallet to manage your funds and receive salary payments
                                </p>
                                <WalletConnector
                                    onConnect={handleWalletConnect}
                                    className="mx-auto"
                                />
                            </div>
                        ) : (
                            <>
                                {/* Wallet Balance */}
                                <div className="mb-6">
                                    <WalletBalance />
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                                    <button
                                        onClick={() => setShowWithdrawForm(true)}
                                        className="flex items-center justify-center gap-3 p-6 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md"
                                    >
                                        <Send className="w-6 h-6 text-blue-600" />
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900 font-lexend">
                                                Withdraw Funds
                                            </div>
                                            <div className="text-sm text-gray-600 font-lexend">
                                                Send crypto to external wallet
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => navigate('/employee/salary-history')}
                                        className="flex items-center justify-center gap-3 p-6 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md"
                                    >
                                        <History className="w-6 h-6 text-green-600" />
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900 font-lexend">
                                                Salary History
                                            </div>
                                            <div className="text-sm text-gray-600 font-lexend">
                                                View payment history
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {/* Withdraw Form Modal */}
                                {showWithdrawForm && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="w-full max-w-md p-6 mx-4 bg-white rounded-xl">
                                            <h3 className="mb-4 text-lg font-semibold text-gray-900 font-lexend">
                                                Withdraw Funds
                                            </h3>

                                            <form onSubmit={handleWithdraw} className="space-y-4">
                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-gray-700 font-lexend">
                                                        Currency
                                                    </label>
                                                    <select
                                                        value={withdrawCurrency}
                                                        onChange={(e) => setWithdrawCurrency(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    >
                                                        {balance && Object.keys(balance).map(currency => (
                                                            <option key={currency} value={currency}>
                                                                {currency} (Available: {balance[currency]})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-gray-700 font-lexend">
                                                        Amount
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={withdrawAmount}
                                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-gray-700 font-lexend">
                                                        Destination Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={withdrawAddress}
                                                        onChange={(e) => setWithdrawAddress(e.target.value)}
                                                        placeholder="0x..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        required
                                                    />
                                                </div>

                                                <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                                                        <span className="text-sm text-yellow-800 font-lexend">
                                                            Please double-check the address. Transactions cannot be reversed.
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowWithdrawForm(false)}
                                                        className="flex-1 px-4 py-2 text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50 font-lexend"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="flex-1 px-4 py-2 text-white transition-colors bg-indigo-500 rounded-lg hover:bg-indigo-600 font-lexend"
                                                    >
                                                        Withdraw
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Recent Transactions */}
                        {/* <div className="p-6 bg-white border border-gray-200 rounded-lg">
                            <h2 className="mb-4 text-xl font-semibold text-zinc-900 font-lexend">
                                Recent Transactions
                            </h2>

                            {userTransactions.length > 0 ? (
                                <div className="space-y-3">
                                    {userTransactions.slice(0, 5).map((transaction) => (
                                        <div key={transaction.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'payroll' ? 'bg-green-100' :
                                                    transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                                                }`}>
                                                {transaction.type === 'payroll' ? (
                                                    <Download className={`w-5 h-5 text-green-600`} />
                                                ) : transaction.type === 'withdrawal' ? (
                                                    <Send className={`w-5 h-5 text-red-600`} />
                                                ) : (
                                                    <Download className={`w-5 h-5 text-blue-600`} />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 font-lexend">
                                                    {transaction.description}
                                                </div>
                                                <div className="text-sm text-gray-500 font-lexend">
                                                    {new Date(transaction.timestamp).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className={`font-semibold font-lexend ${transaction.type === 'payroll' ? 'text-green-600' :
                                                        transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'
                                                    }`}>
                                                    {transaction.type === 'withdrawal' ? '-' : '+'}
                                                    {transaction.amount.toLocaleString()} {transaction.currency}
                                                </div>
                                                <div className={`text-center text-xs px-2 py-1 rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {transaction.status}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-500 font-lexend">No transactions yet</p>
                                </div>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeWalletPage;
