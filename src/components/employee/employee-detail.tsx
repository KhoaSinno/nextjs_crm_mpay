import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { ProfileEmp } from './employee-profile';
import { useAuth } from '../../contexts/AuthContext';

const DetailEmployee = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const navigate = useNavigate();

    const { user } = useAuth();
    
    console.log(user)
    
    // const handleBackToEmployees = () => {
    //     navigate('/employees');
    // };
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
                        {/* <div className="mb-6 sm:mb-8">
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
                                        Employee detail
                                    </h1>
                                    <p className="font-light text-zinc-400 font-lexend">
                                        {"All employee > [Employee Name]"}
                                    </p>
                                </div>
                            </div>
                        </div> */}

                        {/* Employee Table */}
                        <div className="overflow-hidden bg-white border rounded-lg border-zinc-400/20">
                            <ProfileEmp employeeData={user} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailEmployee;
