import type React from 'react';
import StickyMessage from '../atoms/StickyMessage';

interface SuccessMessageProps {
  id: string;
  message: string;
  onClose: (id: string) => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ id, message, onClose }) => {
  return (
    <StickyMessage
      id={id}
      message={message}
      type="success"
      onClose={onClose}
      className="bg-green-50 border-green-200 text-green-800"
    />
  );
};

export default SuccessMessage;
