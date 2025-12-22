import { atom, useAtomValue, useSetAtom } from 'jotai';
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useImperativeHandle
} from 'react';

export interface StickyMessage {
  id: string;
  message: string;
  type: 'error' | 'success';
  timestamp: number;
  duration: number; // ミリ秒
}

// タイマー管理のためのマップ
const timers = new Map<string, number>();

const stickyMessagesAtom = atom<StickyMessage[]>([]);

export const useStickyMessageActions = () => {
  const setStickyMessages = useSetAtom(stickyMessagesAtom);
  const currentMessages = useAtomValue(stickyMessagesAtom);

  // IDを生成するヘルパー関数
  const generateId = useCallback(() => {
    return `sticky-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // メッセージを削除する内部関数
  const removeMessageById = useCallback(
    (id: string) => {
      setStickyMessages((prev) => prev.filter((msg) => msg.id !== id));

      // タイマーをクリア
      const timer = timers.get(id);
      if (timer) {
        clearTimeout(timer);
        timers.delete(id);
      }
    },
    [setStickyMessages]
  );

  // 自動削除タイマーを設定
  const setAutoRemoveTimer = useCallback(
    (id: string, duration: number) => {
      const timer = setTimeout(() => {
        removeMessageById(id);
      }, duration);

      timers.set(id, timer as any);
    },
    [removeMessageById]
  );

  // エラーメッセージを追加
  const addErrorMessage = useCallback(
    (message: string, duration: number = 30000) => {
      const id = generateId();
      const newMessage: StickyMessage = {
        id,
        message,
        type: 'error',
        timestamp: Date.now(),
        duration,
      };

      setStickyMessages((prev) => [...prev, newMessage]);
      setAutoRemoveTimer(id, duration);
    },
    [generateId, setStickyMessages, setAutoRemoveTimer]
  );

  // 成功メッセージを追加
  const addSuccessMessage = useCallback(
    (message: string, duration: number = 30000) => {
      const id = generateId();
      const newMessage: StickyMessage = {
        id,
        message,
        type: 'success',
        timestamp: Date.now(),
        duration,
      };

      setStickyMessages((prev) => [...prev, newMessage]);
      setAutoRemoveTimer(id, duration);
    },
    [generateId, setStickyMessages, setAutoRemoveTimer]
  );

  // 手動でメッセージを削除
  const removeMessage = useCallback(
    (id: string) => {
      removeMessageById(id);
    },
    [removeMessageById]
  );

  // 全てのメッセージを削除
  const clearAllMessages = useCallback(() => {
    // 全てのタイマーをクリア
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();

    setStickyMessages([]);
  }, [setStickyMessages]);

  // 特定のタイプのメッセージを削除
  const clearMessagesByType = useCallback(
    (type: 'error' | 'success') => {
      const messagesToRemove = currentMessages.filter((msg) => msg.type === type);
      messagesToRemove.forEach((msg) => {
        const timer = timers.get(msg.id);
        if (timer) {
          clearTimeout(timer);
          timers.delete(msg.id);
        }
      });

      setStickyMessages((prev) => prev.filter((msg) => msg.type !== type));
    },
    [currentMessages, setStickyMessages]
  );

  return {
    addErrorMessage,
    addSuccessMessage,
    removeMessage,
    clearAllMessages,
    clearMessagesByType,
  };
};

export const useStickyMessageSelectors = () => {
  const stickyMessages = useAtomValue(stickyMessagesAtom);

  const errorMessages = stickyMessages.filter((msg) => msg.type === 'error');
  const successMessages = stickyMessages.filter((msg) => msg.type === 'success');

  return {
    stickyMessages,
    errorMessages,
    successMessages,
  };
};


export function StickyMessageAtomClassComponentAdapter(
  { adapterReference }: StickyMessageAtomClassComponentAdapter.Props
): ReactNode {

  const { addErrorMessage, addSuccessMessage } = useStickyMessageActions();

  useImperativeHandle(
    adapterReference,
    (): StickyMessageAtomClassComponentAdapter.API =>
        ({
          addErrorMessage: ({ text, customDuration }: StickyMessageAtomClassComponentAdapter.API.Options): void => {
            addErrorMessage(text, customDuration);
          },
          addSuccessMessage: ({ text, customDuration }: StickyMessageAtomClassComponentAdapter.API.Options): void => {
            addSuccessMessage(text, customDuration);
          }
        })
  );

  return null;

}


export namespace StickyMessageAtomClassComponentAdapter {

  export type Props = Readonly<{
    adapterReference: RefObject<API | null>;
  }>;

  export type API = Readonly<{
    addErrorMessage: (options: StickyMessageAtomClassComponentAdapter.API.Options) => void;
    addSuccessMessage: (options: StickyMessageAtomClassComponentAdapter.API.Options) => void;
  }>;

  export namespace API {
    export type Options = Readonly<{
      text: string;
      customDuration?: number;
    }>;
  }

}
