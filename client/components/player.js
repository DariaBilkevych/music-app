import React, { useEffect, useState, useContext, createRef } from 'react';
import { PlayerContext } from './player-context';

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

  useEffect(() => {
    if (!content.some((song) => song.id === currentSong.id)) {
      setIsPlaying(false);
    }
  }, [content, currentSong]);

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
    <div className="absolute bottom-0 left-0 right-0 p-5 shadow-lg bg-white">
      <div className="flex justify-between items-center border rounded-md p-2">
        <div className="flex items-center w-1/3">
          <div>
            <h5 className="text-lg font-medium mb-1">{currentSong?.title}</h5>
            <p className="text-sm">
              {currentSong?.artist} , {currentSong?.album} , {currentSong?.year}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3">
          <audio
            src={currentSong?.src}
            ref={audioRef}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          />
          <div className="flex justify-center gap-7">
            <i
              className="ri-skip-back-line ri-2x cursor-pointer hover:text-gray-500"
              onClick={() => handleSkip('prev')}
            />
            <i
              className={`ri-${
                isPlaying ? 'pause' : 'play'
              }-line ri-2x cursor-pointer hover:text-gray-500`}
              onClick={handlePlayPause}
            />
            <i
              className="ri-skip-forward-line ri-2x cursor-pointer hover:text-gray-500"
              onClick={() => handleSkip('next')}
            />
          </div>
          <div className="flex justify-between items-center w-full gap-3">
            <div className="flex items-center">
              <p className="text-base font-medium text-gray-500">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60)}
              </p>
            </div>
            <input
              type="range"
              className="w-full range pr-6 accent-orange-600"
              min={0}
              max={Number(currentSong?.duration) * 60}
              value={currentTime}
              onChange={(e) => {
                audioRef.current.currentTime = e.target.value;
                setCurrentTime(e.target.value);
              }}
            />
            <div className="flex items-center">
              <p className="text-base font-medium text-gray-500">
                {currentSong?.duration}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center justify-end w-1/3">
          <i
            className="ri-volume-mute-line text-2xl cursor-pointer hover:text-gray-500"
            onClick={() => {
              setVolume(0);
              audioRef.current.volume = 0;
            }}
          />
          <input
            type="range"
            className="pr-6 accent-orange-600"
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
            className="ri-volume-down-line text-2xl cursor-pointer hover:text-gray-500"
            onClick={() => {
              setVolume(1);
              audioRef.current.volume = 1;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
