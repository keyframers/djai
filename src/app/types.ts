interface BaseNode {
  id: string;
}

interface WelcomeNode extends BaseNode {
  view: 'welcome';
}

interface ExploreNode extends BaseNode {
  view: 'explore';
  prompt: string;
}

interface SongNode extends BaseNode {
  view: 'song';
  songId: string;
}

export type TimelineNode = WelcomeNode | ExploreNode | SongNode;

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
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
