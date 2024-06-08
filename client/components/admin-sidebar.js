import Link from 'next/link';
import { useRouter } from 'next/router';

const AdminSidebar = () => {
  const router = useRouter();

  return (
    <div className="flex">
      <div className="container overflow-y-auto h-[65vh] bg-transparent border-r-2 border-gray-300 w-64 p-4">
        <h2 className="text-lg font-semibold mb-4">Панель адміністратора</h2>
        <Link
          href="/admin"
          className={`mb-4 flex items-center ${
            router.pathname === '/admin'
              ? 'text-orange-600 font-bold'
              : 'text-primary-500'
          } hover:text-primary-600`}
        >
          <i className="ri-bar-chart-line text-2xl mr-2"></i>
          <span className="text-base">Загальна статистика</span>
        </Link>
        <Link
          href="/admin/detailed-stat"
          className={`mb-4 flex items-center ${
            router.pathname === '/admin/detailed-stat'
              ? 'text-orange-600 font-bold'
              : 'text-primary-500'
          } hover:text-primary-600`}
        >
          <i className="ri-pie-chart-line text-2xl mr-2"></i>
          <span className="text-base">Детальна статистика</span>
        </Link>
        <Link
          href="/admin/delete-songs"
          className={`mb-4 flex items-center ${
            router.pathname === '/admin/delete-songs'
              ? 'text-orange-600 font-bold'
              : 'text-primary-500'
          } hover:text-primary-600`}
        >
          <i className="ri-delete-bin-line text-2xl mr-2"></i>
          <span className="text-base">Видалення файлів</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
