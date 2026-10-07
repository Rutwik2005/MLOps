import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  BrainCircuit,
  Rocket,
  Activity,
  LogOut,
  Box,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors font-medium ${
        isActive
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon
        size={20}
        className={`mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
      />
      {children}
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(false);
    toast('Logged out');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6 flex items-center font-black text-xl text-slate-900 tracking-tight">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mr-3 shadow-md shadow-indigo-200">
          <BrainCircuit size={20} />
        </div>
        Nexus<span className="text-indigo-600 font-normal ml-1">MLOps</span>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        <NavItem to="/" icon={LayoutDashboard}>
          Dashboard
        </NavItem>
        <NavItem to="/datasets" icon={Database}>
          Datasets
        </NavItem>
        <NavItem to="/training" icon={Activity}>
          Training Jobs
        </NavItem>
        <NavItem to="/registry" icon={Box}>
          Registry & Deploy
        </NavItem>
        <NavItem to="/predict" icon={Rocket}>
          Predictions
        </NavItem>
      </nav>

      <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handleLogout}
          className="flex items-center flex-1 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut size={18} className="mr-3" /> Logout
        </button>
        <ThemeToggle fixed={false} />
      </div>
    </aside>
  );
};

export default Sidebar;
