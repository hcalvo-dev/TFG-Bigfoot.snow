import { Toaster } from 'react-hot-toast';

export default function NotificacionGlobal() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0f172a', // dark bg
          color: '#facc15', // amarillo neón Bigfoot
          borderRadius: '12px',
          padding: '12px 16px',
          fontFamily: 'BlowBrush, sans-serif',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#1e293b',
          },
        },
      }}
    />
  );
}