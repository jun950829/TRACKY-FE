import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import HistorySearch from "./HistorySearch";
import HistoryRentList from "./HistoryRentList";
import HistoryCarList from "./HistoryCarList";
import { useHistoryStore } from "@/stores/useHistoryStore";

interface HistorySheetProps {
  id: string;
  isOpen: boolean;
  onOpenChange: (id: string, open: boolean) => void;
  onItemClick: () => void;
  title: string;
}

const HistorySheet: React.FC<HistorySheetProps> = ({
  id,
  isOpen,
  onOpenChange,
  onItemClick,
  title,
}) => {
  const [isListVisible, setIsListVisible] = useState(false);

  const { searchType } = useHistoryStore();

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
          marginBottom: "env(safe-area-inset-bottom, 0px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        }}
      >
        <SheetHeader
          className="px-4 py-3 border-b cursor-pointer flex items-center justify-between"
          onClick={handleHeaderClick}
        >
          <SheetTitle className="text-left text-lg">{title}</SheetTitle>
          <motion.div animate={{ rotate: isListVisible ? 0 : 180 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </SheetHeader>
        
        <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
          <AnimatePresence>
            {isListVisible && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {id === "search" ? (
                  <HistorySearch />
                ) : id === "rent" ? (
                  <HistoryRentList onItemClick={onItemClick} />
                ) : (
                  <HistoryCarList onItemClick={onItemClick} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistorySheet;
