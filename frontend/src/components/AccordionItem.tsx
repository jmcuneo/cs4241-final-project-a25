// AccordionItem.tsx
import { useState } from 'react';
import type { FC, ReactNode } from 'react';

type AccordionItemProps = {
  title: string;
  children: ReactNode;
};

const AccordionItem: FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 px-6 text-left hover:bg-gray-100 focus:outline-none"
      >
        <span className="text-lg font-medium">{title}</span>
        <span className="text-gray-500 text-xl ml-4">
          {isOpen ? '-' : '+'}
        </span>
      </button>
      <div
        className={`px-6 pb-4 transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionItem;