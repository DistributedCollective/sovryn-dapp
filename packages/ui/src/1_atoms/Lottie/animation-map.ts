export const animationMap = {
  spaceScene: import('./animations/space-scene.json').then(m => m.default),
  error404: import('./animations/error-404.json').then(m => m.default),
  progressDots: import('./animations/progress-dots-blue.json').then(
    m => m.default,
  ),
} as const;
