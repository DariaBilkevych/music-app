import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import axios from 'axios';
import Router from 'next/router';

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
    console.log(file);
  };

  return (
    <div>
      <h1>Завантаження власного файлу</h1>
      <form>
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
        <button className="btn btn-primary">Завантажити</button>
      </form>
    </div>
  );
};

export default NewAudioFile;
