import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../../components/loader';
import useRequest from '../../hooks/use-request';

const UpdateSong = () => {
  const router = useRouter();
  const { audioFileId } = router.query;
  const [loading, setLoading] = useState(true);
  const [song, setSong] = useState({
    title: '',
    artist: '',
    album: '',
    year: '',
    duration: '',
    src: '',
  });

  useEffect(() => {
    if (audioFileId) {
      fetchSong(audioFileId);
    }
  }, [audioFileId]);

  const fetchSong = async (audioFileId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/content/${audioFileId}`);
      setSong({
        title: data.title,
        artist: data.artist,
        album: data.album,
        year: data.year,
        duration: data.duration,
        src: data.src,
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Помилка завантаження даних треку');
      setLoading(false);
    }
  };

  const { doRequest } = useRequest({
    url: `/api/content/${audioFileId}`,
    method: 'put',
    onSuccess: () => {
      setLoading(false);
      toast.success('Дані успішно оновлено!');
      router.push('/user/profile');
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', song.title);
    formData.append('artist', song.artist);
    formData.append('album', song.album);
    formData.append('year', song.year);
    formData.append('duration', song.duration);

    try {
      doRequest(formData);
    } catch (error) {
      console.error(error);
      toast.error('Помилка оновлення треку');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-8 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Редагувати трек
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Назва пісні
          </label>
          <input
            type="text"
            id="title"
            value={song.title}
            onChange={(e) => setSong({ ...song, title: e.target.value })}
            className="w-full appearance-none border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label
            htmlFor="artist"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Виконавець
          </label>
          <input
            type="text"
            id="artist"
            value={song.artist}
            onChange={(e) => setSong({ ...song, artist: e.target.value })}
            className="w-full appearance-none border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label
            htmlFor="album"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Альбом
          </label>
          <input
            type="text"
            id="album"
            value={song.album}
            onChange={(e) => setSong({ ...song, album: e.target.value })}
            className="w-full appearance-none border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Рік випуску
          </label>
          <input
            type="text"
            id="year"
            value={song.year}
            onChange={(e) => setSong({ ...song, year: e.target.value })}
            className="w-full appearance-none border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Тривалість (у форматі 0.00)
          </label>
          <input
            type="text"
            id="duration"
            value={song.duration}
            onChange={(e) => setSong({ ...song, duration: e.target.value })}
            className="w-full appearance-none border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label
            htmlFor="src"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Посилання на файл
          </label>
          <input
            type="text"
            id="src"
            value={song.src}
            readOnly
            className="w-full appearance-none border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-gray-100"
          />
        </div>
        <div className="flex">
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline"
          >
            Оновити
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSong;
