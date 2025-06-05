
import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants'; 
import { NavItemConfig } from '../../types'; 

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const findCurrentPageLabel = (pathname: string, items: NavItemConfig[]): string => {
  for (const item of items) {
    if (item.path === pathname) {
      return item.label;
    }
    if (item.subItems) {
      const subItemLabel = findCurrentPageLabel(pathname, item.subItems);
      if (subItemLabel !== 'Dashboard') return subItemLabel; // Avoid returning default if specific subitem found
    }
  }
  return 'Dashboard'; // Default or if not found
};

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const location = useLocation();
  const currentPageLabel = findCurrentPageLabel(location.pathname, NAVIGATION_ITEMS);
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="relative bg-white dark:bg-neutral-800 shadow-md z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-2 md:ml-0 text-xl font-semibold text-neutral-800 dark:text-neutral-100">{currentPageLabel}</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            {/* Add other header items here like profile dropdown if needed */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
