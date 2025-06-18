interface BaseNode {
  id: string;
}

interface WelcomeNode extends BaseNode {
  view: 'welcome';
}

interface ExploreNode extends BaseNode {
  view: 'explore';
  songs: Song[];
}

interface SongNode extends BaseNode {
  view: 'song';
  song: Song;
}

export type TimelineNode = WelcomeNode | ExploreNode | SongNode;

export interface Song {
  title: string;
  artist: string;
  lyrics?: string;
  album: string | null;
  // year?: number;
  // genre?: string;
  tags: string[];
}

export interface TimelineEdge {
  id: string;
  source: string;
  target: string;
}

export interface TimelineGraph {
  initialNodeId: string;
  nodes: TimelineNode[];
  edges: TimelineEdge[];
}
