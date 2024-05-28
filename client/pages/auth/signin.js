import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import Link from 'next/link';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { doRequest } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div className="flex items-center justify-center py-8">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white p-8 rounded shadow-md border border-orange-400"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-500">
          Авторизація
        </h1>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Електронна пошта
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введіть вашу електронну пошту"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Пароль
          </label>
          <div htmlFor="password" className="relative">
            <input
              id="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 focus:outline-none"
              style={{ top: '40%', transform: 'translateY(-50%)' }}
            >
              {showPassword ? (
                <i className="ri-eye-2-line"></i>
              ) : (
                <i className="ri-eye-close-line"></i>
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Авторизуватись
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Ще не маєте акаунту?{' '}
            <Link
              href="/auth/signup"
              className="text-orange-500 hover:underline"
            >
              Зареєструватись
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

Signin.excludePlayer = true;
export default Signin;
