import { songService } from "@/app/songService";
import Button from "@/components/Button";
import { ContentBox } from "@/components/ContentBox";
import { useQuery } from "@tanstack/react-query";

interface SongViewProps {
  songId: string;
  onExploreMore: () => void;
}

export function SongView({ songId, onExploreMore }: SongViewProps) {
  const { data: song, isLoading } = useQuery({
    queryKey: ["songs", songId],
    queryFn: () => songService.getSongById(songId),
  });

  if (isLoading) {
    return <div className="loading">Loading song...</div>;
  }

  if (!song) {
    return <div className="error">Song not found</div>;
  }

  return (
    <ContentBox className="song-view">
      <div className="now-playing">
        <div className="album-art" />
        <h2>{song.title}</h2>
        <p className="artist">{song.artist}</p>
        {song.album && <p className="album">{song.album}</p>}
        {song.genre && <p className="genre">{song.genre}</p>}
      </div>

      <Button onClick={onExploreMore}>Explore Similar Songs</Button>

      <style jsx>{`
        .song-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          max-width: 400px;
          margin: 0 auto;
        }
        .loading,
        .error {
          text-align: center;
          opacity: 0.7;
        }
        .now-playing {
          text-align: center;
        }
        .album-art {
          width: 300px;
          height: 300px;
          background: #333;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        h2 {
          margin: 0;
          font-size: 1.5rem;
        }
        p {
          margin: 0.25rem 0 0;
        }
        .artist {
          opacity: 0.9;
          font-size: 1.1rem;
        }
        .album {
          opacity: 0.7;
          font-style: italic;
        }
        .genre {
          opacity: 0.6;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        .explore-more {
          padding: 0.75rem 2rem;
          font-size: 1rem;
          border-radius: 8px;
          border: 1px solid #333;
          background: transparent;
          color: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }
        .explore-more:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </ContentBox>
  );
}
