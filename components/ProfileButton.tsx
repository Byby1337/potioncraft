import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';

export default function ProfileButton() {
  const { authenticated } = usePrivy();
  const router = useRouter();

  if (!authenticated) return null;

  return (
    <button
      className="button blue"
      onClick={() => router.push('/profile')}
    >
      Profile
    </button>
  );
}
