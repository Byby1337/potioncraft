import { usePrivy } from '@privy-io/react-auth';

export default function WalletView() {
  const { user, login, logout } = usePrivy();

  // Кошелёк НЕ подключён
  if (!user || !user.wallet) {
    return (
      <button
        onClick={login}
        className="wallet-button connect"
      >
        Connect Wallet
      </button>
    );
  }

  // Кошелёк подключён → берём address
  const address = user.wallet.address;

  return (
    <div className="wallet-container">
      <p className="wallet-address">
        Wallet connected:
        <strong>{address}</strong>
      </p>

      <button
        onClick={logout}
        className="wallet-button disconnect"
      >
        Disconnect
      </button>
    </div>
  );
}
