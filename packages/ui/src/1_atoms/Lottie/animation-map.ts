export const animationMap = {
  spaceScene: import('./animations/space-scene.json').then(m => m.default),
  error404: import('./animations/error-404.json').then(m => m.default),
} as const;
