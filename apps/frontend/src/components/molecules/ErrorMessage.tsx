import type React from 'react';
import StickyMessage from '../atoms/StickyMessage';

interface ErrorMessageProps {
  id: string;
  message: string;
  onClose: (id: string) => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ id, message, onClose }) => {
  return (
    <StickyMessage
      id={id}
      message={message}
      type="error"
      onClose={onClose}
      className="bg-red-50 border-red-200 text-red-800"
    />
  );
};

export default ErrorMessage;
