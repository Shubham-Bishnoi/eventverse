import wedding from '@/assets/wedding-universe.jpg';
import palace from '@/assets/palace-venue.jpg';
import mandap from '@/assets/floral-mandap.jpg';
import baraat from '@/assets/baraat-celebration.jpg';

export const chapters = [
  { id: 'beginning', label: 'The beginning', image: wedding },
  { id: 'details', label: 'Every detail', image: wedding },
  { id: 'team', label: 'Your people', image: baraat },
  { id: 'rituals', label: 'The rituals', image: baraat },
  { id: 'wedding', label: 'The big day', image: mandap },
  { id: 'universe', label: 'Your universe', image: palace },
] as const;
export const venues = [
  { name: 'Udaipur', title: 'A lakeside love story', description: 'Still waters. Royal palaces. A little magic.', image: palace, category: 'LAKESIDE PALACES' },
  { name: 'Jaipur', title: 'Your own royal chapter', description: 'Rose-coloured courtyards and timeless celebrations.', image: mandap, category: 'ROYAL COURTYARDS' },
  { name: 'Goa', title: 'Forever, by the water', description: 'An open sky, a gentle breeze, and your favourite people.', image: palace, category: 'WATERSIDE CELEBRATIONS' },
  { name: 'Delhi NCR', title: 'A grand celebration', description: 'Beautiful gardens, floral mandaps, unforgettable nights.', image: mandap, category: 'GARDEN CELEBRATIONS' },
] as const;
export const rituals = [
  { name: 'Mehndi', title: 'Love, written in henna.', description: 'Intricate patterns, secret initials, and an afternoon full of laughter.', time: 'THE FIRST CELEBRATION', image: wedding },
  { name: 'Haldi', title: 'A little sunshine. A lot of love.', description: 'Turmeric, flowers, and blessings from everyone who matters.', time: 'BLESSINGS & NEW BEGINNINGS', image: mandap },
  { name: 'Sangeet', title: 'Let your love take the stage.', description: 'The family performances. The happy tears. The one-more-song moments.', time: 'A NIGHT TO REMEMBER', image: baraat },
  { name: 'Baraat', title: 'Here comes the celebration.', description: 'Dhol beats, dancing feet, and an entrance like no other.', time: 'THE GRAND ARRIVAL', image: baraat },
  { name: 'Varmala', title: 'Two hearts. One beautiful yes.', description: 'An exchange of garlands. The beginning of your forever.', time: 'THE MOMENT YOU MEET', image: wedding },
  { name: 'Pheras', title: 'Seven steps. A lifetime together.', description: 'Sacred vows around the fire, with your loved ones by your side.', time: 'YOUR PROMISE OF FOREVER', image: mandap },
  { name: 'Vidaai', title: 'A goodbye. A new beginning.', description: 'Hold the memories close as a beautiful new chapter begins.', time: 'LOVE THAT GOES WITH YOU', image: palace },
] as const;