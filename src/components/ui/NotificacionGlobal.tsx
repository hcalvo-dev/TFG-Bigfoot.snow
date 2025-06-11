import { Toaster, type Toast } from 'react-hot-toast';

export default function NotificacionGlobal() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#0f172a',
          color: 'white',
          borderRadius: '12px',
          padding: '14px 20px',
          fontFamily: 'BlowBrush, sans-serif',
          letterSpacing: '0.05em',
          overflow: 'hidden',
          position: 'relative',
          minWidth: '400px',
        },
        success: {
          className: 'toast-con-barra', 
          iconTheme: {
            primary: '#22c55e',
            secondary: '#1e293b',
          },
        },
        error: {
          className: 'toast-con-barra',
        },
      }}
    />
  );
}
