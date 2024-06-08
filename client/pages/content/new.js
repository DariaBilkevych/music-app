import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';
import Loader from '../../components/loader';
import { Genre } from '@dbmusicapp/common';

const NewAudioFile = () => {
  const [loading, setLoading] = useState(false);
  const [song, setSong] = useState({
    title: '',
    artist: '',
    genre: [],
    year: '',
    duration: '',
    file: '',
  });

  const router = useRouter();

  const fileTypes = ['MP3'];
  const handleChange = (file) => {
    setSong({ ...song, file: file });
  };

  const { doRequest, errors } = useRequest({
    url: '/api/content',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    onSuccess: () => {
      setLoading(false);
      toast.success('Файл успішно завантажено!');
      router.push('/');
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', song.title);
    formData.append('artist', song.artist);
    formData.append('year', song.year);
    formData.append('duration', song.duration);

    song.genre.forEach((genre, index) => {
      formData.append(`genre[${index}]`, genre);
    });

    if (song.file) {
      formData.append('file', song.file);
    }

    doRequest(formData);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-8 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Завантажити власний трек
      </h1>
      {!errors && loading && <Loader />}
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
            htmlFor="genre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Жанр (можна обрати декілька)
          </label>
          <select
            id="genre"
            multiple
            value={song.genre}
            onChange={(e) =>
              setSong({
                ...song,
                genre: [...e.target.selectedOptions].map(
                  (option) => option.value
                ),
              })
            }
            className="w-full appearance-none border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            {Object.values(Genre).map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
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
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Файл (MP3)
          </label>
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            className="border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div className="flex">
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline"
          >
            Завантажити
          </button>
        </div>
      </form>
    </div>
  );
};

NewAudioFile.excludePlayer = true;
export default NewAudioFile;
