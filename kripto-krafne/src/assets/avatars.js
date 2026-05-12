import cowboy     from './img/avatars/avatar_cowboy.png';
import driver     from './img/avatars/avatar_driver.png';
import explorer   from './img/avatars/avatar_explorer.png';
import flower     from './img/avatars/avatar_flower.png';
import glasses    from './img/avatars/avatar_glasses.png';
import headphones from './img/avatars/avatar_headphones.png';
import kitty      from './img/avatars/avatar_kitty.png';
import mr         from './img/avatars/avatar_mr.png';
import muscle     from './img/avatars/avatar_muscle.png';
import sleepy     from './img/avatars/avatar_sleepy.png';
import fallback   from './img/krafna.png';

export const AVATARS = { cowboy, driver, explorer, flower, glasses, headphones, kitty, mr, muscle, sleepy };
export const DEFAULT_AVATAR = fallback;
export const getAvatar = (key) => (key && AVATARS[key]) ? AVATARS[key] : fallback;
