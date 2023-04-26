export const animationMap = {
  spaceScene: import('./animations/space-scene.json').then(m => m.default),
  error404: import('./animations/error-404.json').then(m => m.default),
  progressDots: import('./animations/progress-dots-blue.json').then(
    m => m.default,
  ),
  bugHunting: import('./animations/bug-hunting.json').then(m => m.default),
  error: import('./animations/error.json').then(m => m.default),
  loading: import('./animations/loading.json').then(m => m.default),
} as const;
