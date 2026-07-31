import poemsJson from './poems.json';

export type Poem = {
  id: number;
  roman: string;
  title: string;
  firstLine: string;
  text: string;
  epigraph?: string;
  year?: string;
  place?: string;
  note?: string;
};

export const poems: Poem[] = poemsJson;

export function getPoemById(id: number): Poem | undefined {
  return poems.find((poem) => poem.id === id);
}
