import { Search, Bell, ChevronDown, Menu } from "lucide-react";
// import WalletDebugComponent from "./wallet/WalletDebugComponent";
// import { useAuth } from '../contexts/AuthContext';
import { WalletSelector } from "@/components/wallet/wallet-selector";

const Header = ({ greeting = "Good Morning", onMenuClick = () => {} }) => {
  // const { user } = useAuth();

  // const userName = user?.fullName || "User";
  // const userRole = user?.role === 'employee' ? 'Employee' :
  //     user?.role === 'accounting' ? 'Accounting Manager' : 'User';

  return (
    <div className="w-full px-4 py-4 bg-white border-b border-zinc-400/20 sm:px-6">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 transition-colors rounded-lg lg:hidden hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-zinc-900" />
          </button>

          {/* Greeting */}
          <div className="flex flex-col">
            {/* <div className="text-lg font-semibold leading-loose text-zinc-900 sm:text-xl font-lexend">
                            Hello {userName.split(' ')[0]} 👋🏻
                        </div> */}
            <div className="text-xs font-light leading-snug text-zinc-400 sm:text-sm font-lexend">
              🔆 {greeting} 👋🏻
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex w-48 lg:w-64 px-4 py-3 rounded-[10px] border border-zinc-400/10 items-center gap-2.5">
            <Search className="w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 text-sm font-light bg-transparent border-none outline-none text-zinc-900 lg:text-base font-lexend placeholder-zinc-400"
            />
          </div>

          {/* Search Button for Mobile */}
          <button className="md:hidden w-10 h-10 p-2 bg-zinc-400/10 rounded-[10px] flex justify-center items-center hover:bg-zinc-400/20 transition-colors">
            <Search className="w-5 h-5 text-zinc-900" />
          </button>

          {/* Notification Button */}
          <button className="w-10 h-10 sm:w-12 sm:h-12 p-2 sm:p-3 bg-zinc-400/10 rounded-[10px] flex justify-center items-center hover:bg-zinc-400/20 transition-colors">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900" />
          </button>

          {/* Wallet Connection */}
          <WalletSelector />

          {/* User Profile */}
          <div className="flex items-center gap-2 p-2 transition-colors border rounded-lg sm:gap-3 border-zinc-400/20 hover:bg-gray-50">
            {/* <img
                            className="object-cover w-8 h-8 rounded-lg sm:w-10 sm:h-10"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3"
                            alt={userName}
                        /> */}
            {/* User Info - Hidden on mobile */}
            <div className="flex-col hidden sm:flex">
              <div className="text-sm font-semibold leading-normal text-zinc-900 lg:text-base font-lexend">
                {/* {userName} */}
                Sinoo
              </div>
              <div className="text-xs font-light leading-none text-zinc-400 font-lexend">
                {/* {userRole} */}
                Sinoo
              </div>
            </div>
            {/* <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900" /> */}
          </div>
        </div>
      </div>
      {/* <WalletDebugComponent /> */}
    </div>
  );
};

export default Header;
