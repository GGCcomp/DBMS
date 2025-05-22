'use client';

import { useEffect } from 'react';
import socket from '@/lib/socket-client';

export default function SocketProvider({ children }) {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('✅ Connected to socket:', socket.id);
    });

    // Example listener
    socket.on('message', (data) => {
      console.log('📩 Message from server:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <>{children}</>;
}
