import React from 'react';
import '../css/UserAvatar.css';

interface UserAvatarProps {
  pictureUrl?: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  pictureUrl, 
  email, 
  size = 'md', 
  className = '' 
}) => {
  const sizeMap = {
    sm: { width: '24px', height: '24px' },
    md: { width: '32px', height: '32px' },
    lg: { width: '40px', height: '40px' }
  };

  const avatarStyle = {
    ...sizeMap[size],
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '2px solid #0A0593',
    backgroundColor: '#f0f0f0'
  };

  const fallbackUrl = `https://placehold.co/250?text=${encodeURIComponent(email || 'User')}`;
  const imageUrl = pictureUrl || fallbackUrl;

  return (
    <img 
      src={imageUrl}
      alt={`${email || 'User'} profile`}
      style={avatarStyle}
      className={`user-avatar ${className}`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== fallbackUrl) {
          target.src = fallbackUrl;
        }
      }}
    />
  );
};

export default UserAvatar;
