import Link from 'next/link';
import { UserRoles } from '@dbmusicapp/common';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Реєстрація', href: '/auth/signup' },
    !currentUser && { label: 'Авторизація', href: '/auth/signin' },
    currentUser &&
      currentUser.role === UserRoles.User && {
        label: 'Мої плейлисти',
        href: '/playlists/all',
      },
    currentUser &&
      currentUser.role === UserRoles.User && {
        label: 'Особистий кабінет',
        href: '/user/profile',
      },
    currentUser && { label: 'Вихід', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link
            className="nav-link text-gray-700 hover:text-orange-500"
            href={href}
          >
            {label}
          </Link>
        </li>
      );
    });

  return (
    <nav className="bg-neutral-100 flex justify-between items-center px-4 py-2">
      <Link
        className="flex items-center"
        href={
          currentUser && currentUser.role === UserRoles.Admin ? '/admin' : '/'
        }
      >
        <span className="text-xl font-bold mr-2">Меломан</span>
        <i className="ri-music-2-line text-2xl"></i>
      </Link>
      <ul className="nav flex space-x-4">{links}</ul>
    </nav>
  );
};
