import { BrowserRouter } from 'react-router-dom';
import AccountLink from './AccountLink';

export default function AccountLinkWrapper() {
  return (
    <BrowserRouter>
      <AccountLink />
    </BrowserRouter>
  );
}
