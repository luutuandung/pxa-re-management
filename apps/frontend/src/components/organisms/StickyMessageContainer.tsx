import type React from 'react';
import { useStickyMessageActions, useStickyMessageSelectors } from '../../store/stickyMessage';
import ErrorMessage from '../molecules/ErrorMessage';
import SuccessMessage from '../molecules/SuccessMessage';

const StickyMessageContainer: React.FC = () => {
  const { stickyMessages } = useStickyMessageSelectors();
  const { removeMessage } = useStickyMessageActions();

  if (stickyMessages.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full">
      {stickyMessages.map((message) => {
        if (message.type === 'error') {
          return <ErrorMessage key={message.id} id={message.id} message={message.message} onClose={removeMessage} />;
        } else if (message.type === 'success') {
          return <SuccessMessage key={message.id} id={message.id} message={message.message} onClose={removeMessage} />;
        }
        return null;
      })}
    </div>
  );
};

export default StickyMessageContainer;
