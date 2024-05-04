import React, { useEffect, useState, useContext, createRef } from 'react';
import { PlayerContext } from './context';

const Player = ({ content, selectedSong }) => {
  const [currentSong, setCurrentSong] = useState(content[0] || {});
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = createRef();
  const { setCurrentSong: contextSetCurrentSong } = useContext(PlayerContext);

  useEffect(() => {
    if (selectedSong) {
      setCurrentSong(selectedSong);
    }
  }, [selectedSong]);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSkip = (direction) => {
    const currentIndex = content.findIndex(
      (song) => song.id === currentSong.id
    );
    const nextIndex =
      direction === 'prev'
        ? currentIndex === 0
          ? content.length - 1
          : currentIndex - 1
        : currentIndex === content.length - 1
        ? 0
        : currentIndex + 1;

    setCurrentSong(content[nextIndex]);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
      contextSetCurrentSong(currentSong);
    }
  }, [isPlaying, currentSong]);

  return (
    <div className="fixed-bottom w-100 p-5 shadow-lg bg-white">
      <div className="d-flex justify-content-between align-items-center border rounded p-2 border-success">
        <div className="d-flex align-items-center mr-4">
          <div>
            <h5 className="mb-1">{currentSong?.title}</h5>
            <p className="mb-0">
              {currentSong?.artist} , {currentSong?.album} , {currentSong?.year}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <audio
            src={currentSong?.src}
            ref={audioRef}
            onTimeUpdate={(e) => {
              setCurrentTime(e.target.currentTime);
            }}
          ></audio>
          <div className="d-flex justify-content-center">
            {' '}
            <i
              className="ri-skip-back-line ri-2x"
              onClick={() => handleSkip('prev')}
            ></i>
            <i
              className={`ri-${isPlaying ? 'pause' : 'play'}-line ri-2x`}
              onClick={handlePlayPause}
            ></i>
            <i
              className="ri-skip-forward-line ri-2x"
              onClick={() => handleSkip('next')}
            ></i>
          </div>
          <div className="row d-flex justify-content-between align-items-center">
            <div className="col-lg-2 d-flex align-items-center">
              <p className="m-0 me-2 text-muted">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60)}
              </p>
            </div>
            <input
              type="range"
              className="col-lg-8 form-control-range"
              min={0}
              max={Number(currentSong?.duration) * 60}
              value={currentTime}
              onChange={(e) => {
                audioRef.current.currentTime = e.target.value;
                setCurrentTime(e.target.value);
              }}
            />
            <div className="col-lg-2 d-flex align-items-center">
              <p className="m-0 text-muted">{currentSong?.duration}</p>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <i
            className="ri-volume-mute-line"
            style={{ fontSize: '24px' }}
            onClick={() => {
              setVolume(0);
              audioRef.current.volume = 0;
            }}
          ></i>
          <input
            type="range"
            className="form-control-range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={(e) => {
              audioRef.current.volume = e.target.value;
              setVolume(e.target.value);
            }}
          />
          <i
            className="ri-volume-down-line"
            style={{ fontSize: '24px' }}
            onClick={() => {
              setVolume(1);
              audioRef.current.volume = 1;
            }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Player;
