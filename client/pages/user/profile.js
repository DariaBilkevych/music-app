import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-avataaars-sprites';
import useRequest from '../../hooks/use-request';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Loader from '../../components/loader';
import TopArtistsChart from '../../components/user-charts/top-artist-chart';
import UserListeningChart from '../../components/user-charts/user-listening-chart';
import NotificationModal from '../../components/notification-modal';

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [songs, setSongs] = useState([]);
  const [messages, setMessages] = useState([]);

  const { doRequest: updateProfileRequest } = useRequest({
    url: `/api/users/${currentUser?.id}`,
    method: 'put',
    body: { name, email },
    onSuccess: (data) => {
      setCurrentUser(data);
      updateAvatar(data.name);
      toast.success('Дані успішно оновлено!');
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

  useEffect(() => {
    if (currentUser) {
      fetchUserSongs();
      fetchUserMessages();
    }
  }, [currentUser]);

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

  const fetchUserSongs = async () => {
    try {
      const { data } = await axios.get('/api/content/user-content');
      setSongs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserMessages = async () => {
    try {
      if (!currentUser) return;
      const { data } = await axios.get(`/api/users/messages`, {
        params: { userId: currentUser.id },
      });
      setMessages(data.messages);
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

  const handleDeleteSong = async (songId) => {
    try {
      await axios.delete(`/api/content/${songId}`);
      fetchUserSongs();
      toast.success('Пісню успішно видалено!');
    } catch (error) {
      console.error(error);
      toast.error('Помилка при видаленні пісні.');
    }
  };

  if (!currentUser) {
    return <Loader />;
  }

  return (
    <div className="py-8 min-h-screen">
      <div className="container mx-auto px-4 flex flex-wrap">
        <div className="bg-white shadow-lg rounded-lg mx-auto p-4 w-full lg:w-2/3">
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
            <div className="ml-auto">
              <NotificationModal
                messages={messages}
                fetchMessages={fetchUserMessages}
              />
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
          <div className="p-4">
            <form onSubmit={handleSubmit}>
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
          </div>
        </div>
        {songs.length > 0 && (
          <div className="w-full lg:w-1/3 lg:pl-4 mt-8 lg:mt-0">
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                Мої завантажені треки
              </h3>
              <ul>
                {songs.map((song) => (
                  <li
                    key={song.id}
                    className="mb-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{song.title}</p>
                      <p className="text-gray-600">
                        {song.artist} ({song.genre.join(', ')})
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href="/content/[audioFileId]"
                        as={`/content/${song.id}`}
                      >
                        <i className="ri-edit-box-line text-gray-600 hover:text-gray-800" />
                      </Link>
                      <button onClick={() => handleDeleteSong(song.id)}>
                        <i className="ri-delete-bin-line text-gray-600 hover:text-gray-800" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div
          className={`container mx-auto px-4 flex flex-wrap justify-${
            songs.length > 0 ? 'between' : 'center'
          } mt-8`}
        >
          <div className="w-full lg:w-1/3 p-2 flex flex-col min-h-full">
            <div className="flex-grow">
              <TopArtistsChart />
            </div>
          </div>
          {songs.length > 0 && (
            <div className="w-full lg:w-2/3 p-2 flex flex-col min-h-full">
              <div className="flex-grow">
                <UserListeningChart />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

UserProfile.excludePlayer = true;
export default UserProfile;
