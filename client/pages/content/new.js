import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import axios from 'axios';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewAudioFile = () => {
  const [song, setSong] = useState({
    title: '',
    artist: '',
    album: '',
    year: '',
    duration: '',
    file: '',
  });

  const fileTypes = ['MP3'];
  const handleChange = (file) => {
    setSong({ ...song, file: file });
  };

  const { doRequest, errors } = useRequest({
    url: '/api/content',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', song.title);
    formData.append('artist', song.artist);
    formData.append('album', song.album);
    formData.append('year', song.year);
    formData.append('duration', song.duration);

    if (song.file) {
      formData.append('file', song.file);
    }

    try {
      const response = await axios.post('/api/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Song upload successful:', response.data);
      Router.push('/');
    } catch (error) {
      console.error('Error uploading song:', error);
    }
  };

  return (
    <div>
      <h1>Завантаження власного файлу</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Назва</label>
          <input
            value={song.title}
            onChange={(e) => setSong({ ...song, title: e.target.value })}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Виконавець</label>
          <input
            value={song.artist}
            onChange={(e) => setSong({ ...song, artist: e.target.value })}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Альбом</label>
          <input
            value={song.album}
            onChange={(e) => setSong({ ...song, album: e.target.value })}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Рік випуску</label>
          <input
            value={song.year}
            onChange={(e) => setSong({ ...song, year: e.target.value })}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Тривалість</label>
          <input
            value={song.duration}
            onChange={(e) => setSong({ ...song, duration: e.target.value })}
            className="form-control"
          />
        </div>
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
        />
        {errors && <div className="alert alert-danger">{errors}</div>}
        <button className="btn btn-primary">Завантажити</button>
      </form>
    </div>
  );
};

export default NewAudioFile;
