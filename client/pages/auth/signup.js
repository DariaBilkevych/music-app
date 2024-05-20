import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { doRequest } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      name,
      email,
      password,
    },
    onSuccess: () => {
      Router.push('/');
    },
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
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-400">
          Реєстрація
        </h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Ім’я
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Введіть ваше ім’я"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Електронна пошта
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Введіть вашу електронну пошту"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Пароль
          </label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
            Зареєструватись
          </button>
        </div>
      </form>
    </div>
  );
}
