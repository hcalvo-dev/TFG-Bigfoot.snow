import { Toaster } from 'react-hot-toast';

export default function NotificacionGlobal() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        className: 'toast-custom',
        style: {
          background: '#0f172a',
          color: 'white',
          borderRadius: '12px',
          padding: '14px 20px',
          fontFamily: 'BlowBrush, sans-serif',
          letterSpacing: '1.5px',
          overflow: 'hidden', 
          position: 'relative',
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
