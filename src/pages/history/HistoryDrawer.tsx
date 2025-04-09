import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import HistorySearch from './HistorySearch';
import HistoryList from './HistoryRentList';

interface HistoryDrawerProps {
  id: string;
  isOpen: boolean;
  onOpenChange: (id: string, open: boolean) => void;
  onItemSelected: () => void;
  title: string;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  id,
  isOpen,
  onOpenChange,
  onItemSelected,
  title,
}) => {
  const [isListVisible, setIsListVisible] = useState(false);

  // drawer가 열릴 때 리스트를 보이게 함
  useEffect(() => {
    if (isOpen) {
      setIsListVisible(true);
    }
  }, [isOpen]);

  const handleHeaderClick = () => {
    setIsListVisible(!isListVisible);
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(id, open);
    if (!open) {
      setIsListVisible(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] p-0"
        style={{ 
          zIndex: 100, 
          marginBottom: 'env(safe-area-inset-bottom, 0px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)'
        }}
      >
        <SheetHeader 
          className="px-4 py-3 border-b cursor-pointer flex items-center justify-between" 
          onClick={handleHeaderClick}
        >
          <SheetTitle className="text-left text-lg">{title}</SheetTitle>
          <motion.div
            animate={{ rotate: isListVisible ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </SheetHeader>
        <AnimatePresence>
          {isListVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="overflow-y-auto">
                <HistorySearch />
                <HistoryList onItemClick={onItemSelected} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer; 