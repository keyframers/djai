import { songService } from '@/app/songService';
import { useQuery } from '@tanstack/react-query';

interface ExploreViewProps {
  prompt: string;
  onSelectSong: (songId: string) => void;
}

export function ExploreView({ prompt, onSelectSong }: ExploreViewProps) {
  const { data: suggestedSongs, isLoading } = useQuery({
    queryKey: ['songs', 'search', prompt],
    queryFn: () => songService.searchSongs(prompt),
  });

  return (
    <div className="explore-view">
      <h2>Exploring: {prompt}</h2>
      {isLoading ? (
        <div className="loading">Loading suggestions...</div>
      ) : (
        <div className="songs-grid">
          {suggestedSongs?.map((song) => (
            <button
              key={song.id}
              className="song-card"
              onClick={() => onSelectSong(song.id)}
            >
              <h3>{song.title}</h3>
              <p className="artist">{song.artist}</p>
              {song.album && <p className="album">{song.album}</p>}
              {song.genre && <p className="genre">{song.genre}</p>}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .explore-view {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        .loading {
          text-align: center;
          margin-top: 2rem;
          opacity: 0.7;
        }
        .songs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        .song-card {
          padding: 1.5rem;
          border: 1px solid #333;
          border-radius: 8px;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        .song-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        .song-card h3 {
          margin: 0;
          font-size: 1.1rem;
        }
        .song-card p {
          margin: 0.25rem 0 0;
          font-size: 0.9rem;
        }
        .artist {
          opacity: 0.9;
        }
        .album {
          opacity: 0.7;
          font-style: italic;
        }
        .genre {
          opacity: 0.6;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
