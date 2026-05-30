export interface ScoreContext {
  label: string
  sublabel: string
  color: string
}

export function getScoreContext(score: number): ScoreContext {
  if (score >= 90) return {
    label:    'Impressively right',
    sublabel: 'Most people get this wrong',
    color:    '#4CAF50',
  }
  if (score >= 75) return {
    label:    'Mostly on point',
    sublabel: 'You\'re ahead of the curve',
    color:    '#8BC34A',
  }
  if (score >= 60) return {
    label:    'Half right, half not',
    sublabel: 'A common misconception',
    color:    '#FF9800',
  }
  if (score >= 40) return {
    label:    'More wrong than right',
    sublabel: 'Don\'t worry, most people think this',
    color:    '#FF5722',
  }
  if (score >= 20) return {
    label:    'Quite far off',
    sublabel: 'The internet has misled you',
    color:    '#F44336',
  }
  return {
    label:    'Confidently incorrect',
    sublabel: 'Bold of you to argue this one',
    color:    '#E8251A',
  }
}
