import { Word } from '@/types/game';

export const WORD_BANK: Word[] = [
  // Easy words (1 point)
  { id: 'e1', word: 'casa', category: 'easy', points: 1 },
  { id: 'e2', word: 'perro', category: 'easy', points: 1 },
  { id: 'e3', word: 'sol', category: 'easy', points: 1 },
  { id: 'e4', word: 'árbol', category: 'easy', points: 1 },
  { id: 'e5', word: 'coche', category: 'easy', points: 1 },
  { id: 'e6', word: 'gato', category: 'easy', points: 1 },
  { id: 'e7', word: 'flor', category: 'easy', points: 1 },
  { id: 'e8', word: 'mesa', category: 'easy', points: 1 },
  { id: 'e9', word: 'luna', category: 'easy', points: 1 },
  { id: 'e10', word: 'agua', category: 'easy', points: 1 },
  { id: 'e11', word: 'libro', category: 'easy', points: 1 },
  { id: 'e12', word: 'pelota', category: 'easy', points: 1 },
  { id: 'e13', word: 'silla', category: 'easy', points: 1 },
  { id: 'e14', word: 'pan', category: 'easy', points: 1 },
  { id: 'e15', word: 'ojo', category: 'easy', points: 1 },

  // Medium words (2 points)
  { id: 'm1', word: 'computadora', category: 'medium', points: 2 },
  { id: 'm2', word: 'elefante', category: 'medium', points: 2 },
  { id: 'm3', word: 'montaña', category: 'medium', points: 2 },
  { id: 'm4', word: 'guitarra', category: 'medium', points: 2 },
  { id: 'm5', word: 'hospital', category: 'medium', points: 2 },
  { id: 'm6', word: 'mariposa', category: 'medium', points: 2 },
  { id: 'm7', word: 'astronauta', category: 'medium', points: 2 },
  { id: 'm8', word: 'helicóptero', category: 'medium', points: 2 },
  { id: 'm9', word: 'pirámide', category: 'medium', points: 2 },
  { id: 'm10', word: 'dinosaurio', category: 'medium', points: 2 },
  { id: 'm11', word: 'laboratorio', category: 'medium', points: 2 },
  { id: 'm12', word: 'telescopio', category: 'medium', points: 2 },
  { id: 'm13', word: 'pingüino', category: 'medium', points: 2 },
  { id: 'm14', word: 'castillo', category: 'medium', points: 2 },
  { id: 'm15', word: 'submarino', category: 'medium', points: 2 },

  // Hard words (3 points)
  { id: 'h1', word: 'democracia', category: 'hard', points: 3 },
  { id: 'h2', word: 'metamorfosis', category: 'hard', points: 3 },
  { id: 'h3', word: 'claustrofobia', category: 'hard', points: 3 },
  { id: 'h4', word: 'arqueología', category: 'hard', points: 3 },
  { id: 'h5', word: 'fotosíntesis', category: 'hard', points: 3 },
  { id: 'h6', word: 'procrastinación', category: 'hard', points: 3 },
  { id: 'h7', word: 'sostenibilidad', category: 'hard', points: 3 },
  { id: 'h8', word: 'biodiversidad', category: 'hard', points: 3 },
  { id: 'h9', word: 'globalización', category: 'hard', points: 3 },
  { id: 'h10', word: 'innovación', category: 'hard', points: 3 },
  { id: 'h11', word: 'algoritmo', category: 'hard', points: 3 },
  { id: 'h12', word: 'holografía', category: 'hard', points: 3 },
  { id: 'h13', word: 'telepátia', category: 'hard', points: 3 },
  { id: 'h14', word: 'revolución', category: 'hard', points: 3 },
  { id: 'h15', word: 'filosofía', category: 'hard', points: 3 },
];

export const getRandomWord = (category?: 'easy' | 'medium' | 'hard'): Word => {
  const filteredWords = category 
    ? WORD_BANK.filter(word => word.category === category)
    : WORD_BANK;
  
  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex];
};

export const getWordsByCategory = (category: 'easy' | 'medium' | 'hard'): Word[] => {
  return WORD_BANK.filter(word => word.category === category);
};