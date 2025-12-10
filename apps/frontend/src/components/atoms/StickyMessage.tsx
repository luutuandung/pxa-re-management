import type React from 'react';

interface StickyMessageProps {
  id: string;
  message: string;
  type: 'error' | 'success';
  onClose: (id: string) => void;
  className?: string;
}

const StickyMessage: React.FC<StickyMessageProps> = ({ id, message, type, onClose, className = '' }) => {
  const handleClose = () => {
    onClose(id);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={`relative p-4 rounded-lg border shadow-md transition-all duration-300 ${getTypeStyles()} ${className}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium flex-1 pr-4">{message}</p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
          aria-label="メッセージを閉じる"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>閉じる</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StickyMessage;
