import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePrivy } from '@privy-io/react-auth';
import NFTList from '../components/NFTList';
import ProfileHeader from "../components/ProfileHeader";


export default function ProfilePage() {
  const { authenticated, user, ready } = usePrivy();
const router = useRouter();

useEffect(() => {
    if(!ready) return;


if(!authenticated){
    router.replace('/');
}
}, [authenticated, ready, router]);

if(!authenticated){
 return null;
}

  return (
    <div className="nft-page">
      <ProfileHeader wallet={user?.wallet?.address} />
      <NFTList />
    </div>
  );
}
