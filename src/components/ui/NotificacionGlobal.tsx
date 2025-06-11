import { Toaster } from 'react-hot-toast';

export default function NotificacionGlobal() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        className: 'toast-con-barra',
        style: {
          background: '#0f172a',
          color: 'white',
          borderRadius: '12px',
          padding: '14px 20px',
          fontFamily: 'BlowBrush, sans-serif',
          letterSpacing: '0.1em',
          overflow: 'hidden', 
          position: 'relative',
          minWidth: '300px',
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
