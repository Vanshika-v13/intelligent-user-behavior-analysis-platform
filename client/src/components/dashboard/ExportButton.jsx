import React from 'react';
import { Download, Printer } from 'lucide-react';
import Button from '../ui/Button';

export function ExportButton({ onExportCsv, onExportJson, onPrint, label = 'Export' }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
        <Download size={16} className="mr-2" />
        {label}
      </Button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {onExportCsv && (
              <button
                onClick={() => { onExportCsv(); setIsOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Export CSV
              </button>
            )}
            {onExportJson && (
              <button
                onClick={() => { onExportJson(); setIsOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Export JSON
              </button>
            )}
            {onPrint && (
              <button
                onClick={() => { onPrint(); setIsOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                role="menuitem"
              >
                <Printer size={16} className="mr-2 text-gray-500" />
                Print
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
