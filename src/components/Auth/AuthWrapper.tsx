// src/components/AuthWrapper.tsx
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './loginForm'; // o AuthForm si ese es su nombre real

export default function AuthWrapper() {
  return (
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
}
