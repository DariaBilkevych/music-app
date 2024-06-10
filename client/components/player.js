import React, { useEffect, useRef, useContext, useState } from 'react';
import { PlayerContext } from './player-context';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserRoles } from '@dbmusicapp/common';

const Player = ({ isVisible, currentUser }) => {
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
    setContent,
  } = useContext(PlayerContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritePlaylistId, setFavoritePlaylistId] = useState(null);

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
    const fetchAndCheckFavoritePlaylist = async () => {
      if (!currentSong || !currentUser) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await axios.get('/api/playlists');
        if (response.data) {
          const favoritePlaylist = response.data.find(
            (playlist) => playlist.title === 'Улюблене'
          );
          if (favoritePlaylist) {
            setFavoritePlaylistId(favoritePlaylist.id);

            const favoritePlaylistAudioFiles = favoritePlaylist.audioFiles;
            const isCurrentSongInFavorites = favoritePlaylistAudioFiles.some(
              (audioFile) => audioFile.id === currentSong.id
            );
            setIsFavorite(isCurrentSongInFavorites);
          }
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchAndCheckFavoritePlaylist();
  }, [currentSong, currentUser]);

  const handleFavoriteToggle = async () => {
    if (isFavorite) {
      await axios.delete(
        `/api/playlists/${favoritePlaylistId}/${currentSong.id}`
      );
      setIsFavorite(false);
      toast.success('Успішно видалено з "Улюбене"');
      setContent(content.filter((song) => song.id !== currentSong.id));
    } else {
      await axios.post(`/api/playlists/${favoritePlaylistId}/add-audio`, {
        audioFileId: currentSong.id,
      });
      setIsFavorite(true);
      toast.success('Успішно додано до "Улюбене"');
      setContent([...content, currentSong]);
    }
  };

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 p-5 shadow-lg bg-white ${
        !currentSong && 'pointer-events-none opacity-50'
      } ${!isVisible ? 'hidden' : ''}`}
    >
      <div className="flex items-center border rounded-md p-2">
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
          {currentUser && currentUser.role === UserRoles.User && (
            <div className="ml-7">
              {isFavorite ? (
                <i
                  className="ri-heart-3-fill text-2xl text-orange-500 cursor-pointer"
                  onClick={handleFavoriteToggle}
                />
              ) : (
                <i
                  className="ri-heart-3-line text-2xl cursor-pointer hover:text-gray-500"
                  onClick={handleFavoriteToggle}
                />
              )}
            </div>
          )}
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
                {Math.floor(currentTime / 60)}.
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
