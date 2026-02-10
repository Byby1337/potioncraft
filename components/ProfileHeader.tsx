import React from 'react';

type ProfileHeaderProps = {
  wallet?: string;
};

const ProfileHeader = ({ wallet }: ProfileHeaderProps) => {
  return (
    <div>
      <p>Wallet: {wallet ?? 'Not connected'}</p>
    </div>
  );
};

export default ProfileHeader;
