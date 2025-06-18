import { Song } from './types';

const songDatabase: Song[] = [
  {
    id: 'song_001',
    title: 'Autumn Leaves',
    artist: 'Bill Evans',
    album: 'Portrait in Jazz',
    year: 1959,
    genre: 'Jazz',
    tags: ['jazz', 'chill', 'acoustic'],
  },
  {
    id: 'song_002',
    title: 'Take Five',
    artist: 'Dave Brubeck',
    album: 'Time Out',
    year: 1959,
    genre: 'Jazz',
    tags: ['jazz', 'chill', 'acoustic'],
  },
  {
    id: 'song_003',
    title: 'Girl from Ipanema',
    artist: 'Stan Getz & Astrud Gilberto',
    album: 'Getz/Gilberto',
    year: 1964,
    genre: 'Bossa Nova',
    tags: ['bossa nova', 'chill', 'acoustic'],
  },
  {
    id: 'song_004',
    title: 'So What',
    artist: 'Miles Davis',
    album: 'Kind of Blue',
    year: 1959,
    genre: 'Jazz',
    tags: ['jazz', 'chill', 'acoustic'],
  },
  {
    id: 'song_005',
    title: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    album: 'It Might as Well Be Swing',
    year: 1964,
    genre: 'Jazz',
    tags: ['jazz', 'chill', 'acoustic'],
  },
];

// Mock delay to simulate API call
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const songService = {
  async getSongById(id: string): Promise<Song | undefined> {
    await delay(100); // Simulate network delay
    return songDatabase.find((song) => song.id === id);
  },

  async searchSongs(query: string): Promise<Song[]> {
    await delay(300); // Simulate network delay
    const lowerQuery = query.toLowerCase();
    return songDatabase;
    // return songDatabase.filter(
    //   (song) =>
    //     song.title.toLowerCase().includes(lowerQuery) ||
    //     song.artist.toLowerCase().includes(lowerQuery) ||
    //     song.genre?.toLowerCase().includes(lowerQuery)
    // );
  },

  async getSimilarSongs(songId: string): Promise<Song[]> {
    await delay(200); // Simulate network delay
    const song = await this.getSongById(songId);
    if (!song) return [];

    // Mock similarity by genre
    return songDatabase;
    // return songDatabase.filter(
    //   (s) => s.id !== songId && s.genre === song.genre
    // );
  },
};
