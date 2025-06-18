import { ContentBox } from '@/components/ContentBox';
import { useQuery } from '@tanstack/react-query';

import styles from './ExploreView.module.css';
import { Song } from '@/app/types';

interface ExploreViewProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
}

export function ExploreView({ songs, onSelectSong }: ExploreViewProps) {
  // const { data: suggestedSongs, isLoading } = useQuery({
  //   queryKey: ['songs', 'suggest', prompt],
  //   queryFn: async (): Promise<Song[]> => {
  //     const response = await fetch('/api/suggest', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ prompt }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch suggestions');
  //     }

  //     const data = await response.json();
  //     return data.suggestions;
  //   },
  // });
  const suggestedSongs = songs;

  return (
    <ContentBox className={styles.exploreView}>
      <div className={styles.songsGrid}>
        {suggestedSongs?.map((song: Song, index: number) => (
          <ContentBox
            key={`${song.title}-${song.artist}-${index}`}
            className={styles.songCard}
            onClick={() => onSelectSong(song)}
          >
            <h3>{song.title}</h3>
            <p className={styles.artist}>{song.artist}</p>
            {/* <p className={styles.genre}>{song.genre}</p> */}
            {/* <p className={styles.similarity}>{song.similarity}</p> */}
          </ContentBox>
        ))}
      </div>
    </ContentBox>
  );
}
