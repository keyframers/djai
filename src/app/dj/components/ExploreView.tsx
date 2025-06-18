import { songService } from "@/app/songService";
import { ContentBox } from "@/components/ContentBox";
import { useQuery } from "@tanstack/react-query";

import styles from "./ExploreView.module.css";

interface ExploreViewProps {
  prompt: string;
  onSelectSong: (songId: string) => void;
}

console.log({ styles });

export function ExploreView({ prompt, onSelectSong }: ExploreViewProps) {
  const { data: suggestedSongs, isLoading } = useQuery({
    queryKey: ["songs", "search", prompt],
    queryFn: () => songService.searchSongs(prompt),
  });

  return (
    <ContentBox className={styles.exploreView}>
      <h2>Exploring: {prompt}</h2>
      {isLoading ? (
        <div className={styles.loading}>Loading suggestions...</div>
      ) : (
        <div className={styles.songsGrid}>
          {suggestedSongs?.map((song) => (
            <ContentBox
              key={song.id}
              className={styles.songCard}
              onClick={() => onSelectSong(song.id)}
            >
              <h3>{song.title}</h3>
              <p className={styles.artist}>{song.artist}</p>
              {song.album && <p className={styles.album}>{song.album}</p>}
              {song.genre && <p className={styles.genre}>{song.genre}</p>}
            </ContentBox>
          ))}
        </div>
      )}
    </ContentBox>
  );
}
