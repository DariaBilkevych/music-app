import React, { useEffect, useRef, useContext } from 'react';
import { PlayerContext } from './player-context';
import axios from 'axios';

const Player = () => {
  const audioRef = useRef();
  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    volume,
    setVolume,
    content,
  } = useContext(PlayerContext);

  const recordPlayback = async (audioFileId) => {
    try {
      await axios.post('/api/statistics/playback', { audioFileId });
    } catch (error) {
      console.error('Error recording playback:', error);
    }
  };

  useEffect(() => {
    if (currentSong && audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play();
      recordPlayback(currentSong.id); // Record playback when a new song starts
    }
  }, [currentSong, setIsPlaying]);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      setIsPlaying(true);
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
    }
  };

  const handleSkip = (direction) => {
    const currentIndex = content.findIndex(
      (song) => song.id === currentSong?.id
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

  const handleEnded = () => {
    const currentIndex = content.findIndex(
      (song) => song.id === currentSong?.id
    );
    const nextIndex = (currentIndex + 1) % content.length;
    setCurrentSong(content[nextIndex]);
  };

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 p-5 shadow-lg bg-white ${
        !currentSong && 'pointer-events-none opacity-50'
      }`}
    >
      <div className="flex justify-between items-center border rounded-md p-2">
        <div className="flex items-center w-1/3">
          <div>
            <h5 className="text-lg font-medium mb-1">
              {currentSong ? currentSong.title : '--.--'}
            </h5>
            <p className="text-sm">
              {currentSong
                ? `${currentSong.artist}, ${currentSong.year}`
                : '--.--'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3">
          <audio
            src={currentSong?.src}
            ref={audioRef}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onEnded={handleEnded}
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
                {Math.floor(currentTime / 60)}:
                {Math.floor(currentTime % 60)
                  .toString()
                  .padStart(2, '0')}
              </p>
            </div>
            <input
              type="range"
              className="w-full range pr-6 accent-orange-600"
              min={0}
              max={currentSong?.duration * 60 || 0}
              value={currentTime}
              onChange={(e) => {
                audioRef.current.currentTime = e.target.value;
                setCurrentTime(e.target.value);
              }}
            />
            <div className="flex items-center">
              <p className="text-base font-medium text-gray-500">
                {currentSong ? currentSong.duration : '-.-'}
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
