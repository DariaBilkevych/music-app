import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-avataaars-sprites';
import { Accordion, AccordionItem } from 'react-light-accordion';
import 'react-light-accordion/demo/css/index.css';
import useRequest from '../../hooks/use-request';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/router';

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const { doRequest: updateProfileRequest } = useRequest({
    url: `/api/users/${currentUser?.id}`,
    method: 'put',
    body: { name, email },
    onSuccess: (data) => {
      setCurrentUser(data);
      updateAvatar(data.name);
    },
  });

  const { doRequest: resendVerificationRequest } = useRequest({
    url: '/api/users/resend-verification-email',
    method: 'post',
    body: { userId: currentUser?.id },
    onSuccess: () => {
      toast.success('Лист надіслано на вказану пошту!');
    },
  });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await axios.get('/api/users/currentuser');
      setCurrentUser(data.currentUser);
      setName(data.currentUser.name);
      setEmail(data.currentUser.email);
      updateAvatar(data.currentUser.name);
    } catch (error) {
      console.error(error);
    }
  };

  const updateAvatar = (name) => {
    const svg = createAvatar(style, {
      seed: name,
      background: '#f0f0f0',
      color: '#333',
      width: 200,
      height: 200,
      radius: 10,
      padding: 10,
    });
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    setAvatarUrl(dataUri);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateProfileRequest();
  };

  const handleResendVerification = async () => {
    resendVerificationRequest();
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Завантаження...
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto p-4">
          <div className="flex items-center p-4 border-b border-gray-200">
            <img
              src={avatarUrl}
              alt="Аватар користувача"
              className="w-20 h-20 rounded-full mr-4 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {currentUser.name}
              </h2>
              <p className="text-gray-600">{currentUser.email}</p>
              {!currentUser.emailVerified && (
                <p className="text-red-500 text-sm mt-2">
                  Вашу пошту не підтверджено.{' '}
                  <button
                    onClick={handleResendVerification}
                    className="text-blue-500 underline"
                  >
                    Повторно надіслати лист
                  </button>
                </p>
              )}
            </div>
          </div>
          <div className="p-4 border-b border-gray-200">
            <p className="text-gray-600 mt-3 border-l-4 pl-4 border-orange-500">
              Завантажуйте свої треки на наш сервер, щоб надати їм більшу
              доступність та зручність у відтворенні.{' '}
              <Link
                href="/content/new"
                className="text-orange-500 hover:underline"
              >
                Завантажити трек
              </Link>
            </p>
          </div>
          <Accordion atomic={true}>
            <AccordionItem title="Редагувати профіль" className="mt-4">
              <form onSubmit={handleSubmit} className="p-4">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Ім'я
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Електронна пошта
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Зберегти зміни
                  </button>
                </div>
              </form>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
