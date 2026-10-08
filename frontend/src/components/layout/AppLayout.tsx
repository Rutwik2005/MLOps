import React from 'react';
import Sidebar from './Sidebar';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 md:p-12 pb-24 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
