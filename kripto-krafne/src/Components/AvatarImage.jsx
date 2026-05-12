import { getAvatar } from '../assets/avatars';

export default function AvatarImage({ avatarKey, size = 40, style = {} }) {
    return (
        <img
            src={getAvatar(avatarKey)}
            alt="Avatar"
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
                ...style,
            }}
        />
    );
}
