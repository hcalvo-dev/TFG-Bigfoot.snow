import { BrowserRouter } from 'react-router-dom';
import AccountLink from './AccountLink';
import AccountLink_lateral from './AccountLink_lateral';

type Props = {
  session: string;
};

export function AccountLinkWrapper({ session }: Props) {
  return (
    <BrowserRouter>
      <AccountLink session={session} />
    </BrowserRouter>
  );
}

export function AccountLinkWrapper_lateral({ session }: Props) {
  return (
    <BrowserRouter>
      <AccountLink_lateral session={session} />
    </BrowserRouter>
  );
}
