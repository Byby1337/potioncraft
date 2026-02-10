import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import ProfileButton from '../components/ProfileButton';
import Link from "next/link"


export default function Navbar() {
  const { user, login, logout } = usePrivy();
  const address = user?.wallet?.address;

  return (
    <nav className="navbar">
      <Link href="/" className='navbar-logo'>
      NFT Market
      </Link>
      {/* Блок с кошельком */}
      <div className="navbar-wallet">
<ProfileButton/>

        {!user || !user.wallet ? (
          <button
            onClick={login}
            className="button blue"
          >
            Connect Wallet
          </button>
        ) : (

            <button
              onClick={logout}
              className="button red"
            >
              Disconnect
            </button>

        )}
      </div>
    </nav>
  );
}
