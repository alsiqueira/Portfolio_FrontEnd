import React, { createContext, useCallback, useContext, useState } from 'react';

import { v4 as uuid } from 'uuid';

import ToastContainer from '../components/ToastContainer';

export interface IToustMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface IToastContextData {
  addToast(message: Omit<IToustMessage, 'id'>): void;
  removeToast(id: string): void;
}
const ToastContext = createContext<IToastContextData>({} as IToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<IToustMessage[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<IToustMessage, 'id'>) => {
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };
      setMessages(oldMessages => [...oldMessages, toast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setMessages(oldMessages =>
      oldMessages.filter(message => message.id !== id),
    );
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

function useToast(): IToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { ToastProvider, useToast };
