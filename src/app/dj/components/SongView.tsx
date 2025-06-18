import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/Button';
import { ContentBox } from '@/components/ContentBox';
import { Song } from '@/app/types';

interface SongViewProps {
  song: Song;
  onExploreMore: () => void;
}

export function SongView({ song, onExploreMore }: SongViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  if (!song) {
    return <div className="error">Song not found</div>;
  }

  return (
    <ContentBox
      className="song-view"
      style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        color: 'white',
        borderRadius: '20px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
      }}
    >
      {/* Hidden audio element */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {song.title}
        </h2>
        <p
          style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            margin: '0',
            fontWeight: '300',
          }}
        >
          {song.artist}
        </p>
        {song.album && (
          <p
            style={{
              fontSize: '1rem',
              opacity: 0.7,
              margin: '0.5rem 0 0 0',
              fontStyle: 'italic',
            }}
          >
            {song.album}
          </p>
        )}
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div
          style={{
            width: '100%',
            maxWidth: '300px',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'width 0.1s ease',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              opacity: 0.7,
            }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Big Play/Pause Button */}
      <button
        onClick={togglePlay}
        disabled={!audioUrl}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#333',
          fontSize: '2.5rem',
          cursor: audioUrl ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          opacity: audioUrl ? 1 : 0.5,
        }}
        onMouseEnter={(e) => {
          if (audioUrl) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
        }}
      >
        {isPlaying ? '❚❚' : '▶'}
      </button>
    </ContentBox>
  );
}
