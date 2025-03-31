import React from 'react';

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';  
  bold?: boolean;
  color?: string; // Tailwind CSS color
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  size = 'xl',
  bold = true,
  color = 'text-black',
}) => {
  let textSize = '';
  switch (size) {
    case 'sm':
      textSize = 'text-sm';
      break;
    case 'base':
      textSize = 'text-base';
      break;
    case 'lg':
      textSize = 'text-lg';
      break;
    case '2xl':
      textSize = 'text-2xl';
      break;
    case '3xl':
      textSize = 'text-3xl';
      break;
    case '4xl':
      textSize = 'text-4xl';
      break;

    default:
      textSize = 'text-xl';
      break;
  }

  const fontWeight = bold ? 'font-semibold' : 'font-normal';

  return (
    <div className="flex items-center justify-between mb-6">
      <div className={`flex items-center space-x-2 ${textSize} ${fontWeight} ${color}`}>
        {icon && <div className="text-blue-600">{icon}</div>}
        <span>{title}</span>
      </div>
    </div>
  );
};

export default PageHeader;
