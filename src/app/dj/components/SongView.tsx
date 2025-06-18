import Button from '@/components/Button';
import { ContentBox } from '@/components/ContentBox';
import { Song } from '@/app/types';

interface SongViewProps {
  song: Song;
  onExploreMore: () => void;
}

export function SongView({ song, onExploreMore }: SongViewProps) {
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
    </ContentBox>
  );
}
