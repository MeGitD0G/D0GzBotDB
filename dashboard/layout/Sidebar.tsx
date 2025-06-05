
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants'; 
import { NavItemConfig } from '../../types'; 
import { ChevronDown, ChevronUp, X, Bug } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarItem: React.FC<{ item: NavItemConfig; currentPath: string; closeSidebar: () => void }> = ({ item, currentPath, closeSidebar }) => {
  // Initial state based on current path belonging to this item or its children
  const isInitiallyActiveOrParentOfActive = item.subItems && item.subItems.length > 0 &&
    (currentPath.startsWith(item.path) || item.subItems.some(sub => currentPath.startsWith(sub.path)));
  
  const [isOpen, setIsOpen] = React.useState(isInitiallyActiveOrParentOfActive);
  
  const isActive = currentPath === item.path || (item.subItems && item.subItems.some(sub => currentPath.startsWith(sub.path)));
  
  React.useEffect(() => {
    // If the current route is a child of this item, ensure this item is open.
    const isParentOfCurrentActiveRoute = item.subItems && item.subItems.length > 0 &&
                                        item.subItems.some(subItem => currentPath.startsWith(subItem.path));
    if (isParentOfCurrentActiveRoute && !isOpen) {
      setIsOpen(true);
    }
  }, [currentPath, item.subItems, item.path, isOpen, setIsOpen]); // Added item.path to dependencies for clarity

  const toggleOpen = () => {
    if (item.subItems && item.subItems.length > 0) {
      setIsOpen(!isOpen);
    }
  };

  const handleLinkClick = () => {
    if (!item.subItems || item.subItems.length === 0) {
        closeSidebar();
    }
  };

  return (
    <li className="mb-1">
      <Link
        to={item.subItems && item.subItems.length > 0 ? '#' : item.path}
        onClick={item.subItems && item.subItems.length > 0 ? toggleOpen : handleLinkClick}
        className={`flex items-center justify-between p-3 rounded-lg hover:bg-primary-500 dark:hover:bg-primary-700 hover:text-white transition-colors duration-150
                    ${isActive ? 'bg-primary-600 dark:bg-primary-800 text-white' : 'text-neutral-700 dark:text-neutral-300'}`}
        aria-expanded={item.subItems && item.subItems.length > 0 ? isOpen : undefined}
      >
        <div className="flex items-center">
          {item.icon && <item.icon className="w-5 h-5 mr-3" />}
          <span>{item.label}</span>
        </div>
        {item.subItems && item.subItems.length > 0 && (
          isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        )}
      </Link>
      {isOpen && item.subItems && (
        <ul className="pl-6 mt-1 space-y-1">
          {item.subItems.map((subItem) => (
            <li key={subItem.id}>
              <Link
                to={subItem.path}
                onClick={closeSidebar}
                className={`flex items-center p-2 rounded-md hover:bg-primary-100 dark:hover:bg-neutral-700 transition-colors duration-150
                            ${currentPath.startsWith(subItem.path) ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
              >
                {subItem.icon && <subItem.icon className="w-4 h-4 mr-2" />}
                <span>{subItem.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-white dark:bg-neutral-800 shadow-lg">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-4">
              <Bug className="h-8 w-auto text-primary-600 dark:text-primary-400" />
              <h1 className="ml-2 text-xl font-bold text-neutral-800 dark:text-neutral-100">D0GzBotz Dashboard</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <ul>
                {NAVIGATION_ITEMS.map((item) => (
                  <SidebarItem key={item.id} item={item} currentPath={location.pathname} closeSidebar={closeSidebar} />
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="w-14 flex-shrink-0" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white dark:bg-neutral-800 pt-5 pb-4 overflow-y-auto border-r border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center flex-shrink-0 px-4 mb-4">
              <Bug className="h-10 w-auto text-primary-600 dark:text-primary-400" />
              <h1 className="ml-3 text-2xl font-bold text-neutral-800 dark:text-neutral-100">D0GzBotz Dashboard</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <ul>
                {NAVIGATION_ITEMS.map((item) => (
                  <SidebarItem key={item.id} item={item} currentPath={location.pathname} closeSidebar={() => {}} />
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
