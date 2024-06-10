import { useState } from 'react';
import Modal from 'react-modal';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';
import Loader from '../../components/loader';
import { Genre } from '@dbmusicapp/common';
import * as mm from 'music-metadata-browser';

const NewAudioFile = () => {
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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

  const convertDurationToFormat = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}.${formattedSeconds}`;
  };

  const handleChange = async (file) => {
    try {
      const metadata = await mm.parseBlob(file);
      const durationInSeconds = metadata.format.duration;
      const formattedDuration = convertDurationToFormat(durationInSeconds);
      setSong({
        ...song,
        duration: formattedDuration,
        file: file,
        fileName: file.name,
      });
    } catch (error) {
      console.error('Помилка отримання метаданих:', error.message);
    }
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
    if (!acceptedTerms) {
      toast.error('Ви повинні прийняти умови використання, щоб продовжити.');
      return;
    }
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
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Файл (MP3)
          </label>
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            className="border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-orange-500 text-white"
          />
          {song.fileName && (
            <p className="text-sm text-gray-500 mt-2">{song.fileName}</p>
          )}
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
            readOnly
            placeholder={song.duration ? `${song.duration}` : ''}
            onChange={(e) => setSong({ ...song, duration: e.target.value })}
            className="w-full appearance-none border rounded py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div className="p-4 border border-gray-300 rounded bg-gray-50">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="form-checkbox text-orange-600"
            />
            <span className="ml-2 text-gray-700">
              Приймаю{' '}
              <button
                type="button"
                onClick={() => setModalIsOpen(true)}
                className="text-orange-600 underline"
              >
                умови використання
              </button>
            </span>
          </label>
        </div>
        <div className="flex">
          <button
            type="submit"
            className={
              'bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline'
            }
          >
            Завантажити
          </button>
        </div>
      </form>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Умови використання"
        className="bg-white rounded-lg p-8 max-w-2xl mx-auto my-20 shadow-lg"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Умови використання</h2>
        <p className="text-gray-700 mb-4">
          Завантажуючи музичні файли на наш сервіс, ви підтверджуєте, що маєте
          всі необхідні права та дозволи на розповсюдження цього контенту. Ви
          несете повну відповідальність за дотримання авторських прав і
          погоджуєтеся, що наш сервіс не несе відповідальності за будь-які
          порушення авторських прав, пов'язані з вашим завантаженням.
        </p>
        <p className="text-gray-700 mb-4">
          Ви також погоджуєтеся, що ваш контент не містить будь-яких матеріалів,
          які порушують права інтелектуальної власності третіх осіб, включаючи,
          але не обмежуючись, авторськими правами, торговими марками або правами
          на комерційну таємницю.
        </p>
        <p className="text-gray-700 mb-4">
          Ви підтверджуєте, що у випадку пред'явлення претензій з боку третіх
          осіб щодо вашого контенту, ви зобов'язуєтеся врегулювати такі
          претензії за свій рахунок і компенсувати всі збитки, які можуть бути
          завдані нашому сервісу у зв'язку з такими претензіями.
        </p>
        <button
          onClick={() => setModalIsOpen(false)}
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
        >
          Закрити
        </button>
      </Modal>
    </div>
  );
};

NewAudioFile.excludePlayer = true;
export default NewAudioFile;
