import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        <div className="space-y-6 sm:space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
