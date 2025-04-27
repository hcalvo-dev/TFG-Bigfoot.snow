import { BrowserRouter } from 'react-router-dom';
import AccountLink from './AccountLink';
import AccountLink_lateral from './AccountLink_lateral';

export function AccountLinkWrapper() {
  return (
    <BrowserRouter>
      <AccountLink />
    </BrowserRouter>
  );
}

export function AccountLinkWrapper_lateral() {
  return (
    <BrowserRouter>
      <AccountLink_lateral />
    </BrowserRouter>
  );
}
