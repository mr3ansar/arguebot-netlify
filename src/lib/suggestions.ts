export interface Suggestion {
  text: string
  category: string
  emoji: string
}

export const SUGGESTIONS: Suggestion[] = [
  { emoji: '🍕', category: 'Food',      text: 'Pineapple absolutely belongs on pizza' },
  { emoji: '🧠', category: 'Science',   text: 'We only use 10% of our brain at any time' },
  { emoji: '☕', category: 'Health',    text: 'Coffee is better than tea for productivity' },
  { emoji: '🌍', category: 'Climate',   text: 'Individual actions don\'t matter for climate change' },
  { emoji: '😴', category: 'Health',    text: 'You can catch up on lost sleep on weekends' },
  { emoji: '🤖', category: 'Tech',      text: 'AI will take over most jobs within 10 years' },
  { emoji: '🥗', category: 'Food',      text: 'Veganism is the healthiest diet for humans' },
  { emoji: '🎮', category: 'Culture',   text: 'Video games cause violent behavior in kids' },
  { emoji: '💊', category: 'Health',    text: 'Vitamin C prevents you from getting colds' },
  { emoji: '🚀', category: 'Space',     text: 'We will colonize Mars within 20 years' },
  { emoji: '📱', category: 'Tech',      text: 'Social media is making people more lonely' },
  { emoji: '🧬', category: 'Science',   text: 'GMO foods are dangerous to human health' },
]

export function getRandomSuggestions(count = 3): Suggestion[] {
  const shuffled = [...SUGGESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
