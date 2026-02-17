/**
 * PixelRenderer.js
 * Utility for rendering pixel art from matrix data into Phaser textures.
 * Each matrix is a 2D array of palette indices where 0 = transparent.
 */

/**
 * Creates a Phaser texture from a 2D array of palette indices.
 * @param {Phaser.Scene} scene - The Phaser scene to add the texture to.
 * @param {string} key - Texture key name.
 * @param {number[][]} matrix - 2D array of palette indices (0 = transparent).
 * @param {Object} palette - Map of palette index to hex color string.
 * @param {number} pixelSize - Size of each pixel in canvas pixels.
 * @returns {string} The texture key.
 */
export function renderPixelArt(scene, key, matrix, palette, pixelSize = 2) {
  const height = matrix.length;
  const width = matrix[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = width * pixelSize;
  canvas.height = height * pixelSize;
  const ctx = canvas.getContext('2d');

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const colorIndex = matrix[y][x];
      if (colorIndex === 0) continue;
      ctx.fillStyle = palette[colorIndex] || '#ff00ff';
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }

  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
  return key;
}

/**
 * Creates a Phaser spritesheet texture from an array of frame matrices.
 * Frames are laid out horizontally in the resulting texture.
 * @param {Phaser.Scene} scene - The Phaser scene.
 * @param {string} key - Texture key name.
 * @param {number[][][]} frames - Array of 2D matrices (one per frame).
 * @param {Object} palette - Map of palette index to hex color string.
 * @param {number} pixelSize - Size of each pixel in canvas pixels.
 * @returns {string} The texture key.
 */
export function renderSpriteSheet(scene, key, frames, palette, pixelSize = 2) {
  const frameH = frames[0].length;
  const frameW = frames[0][0].length;
  const fW = frameW * pixelSize;
  const fH = frameH * pixelSize;
  const canvas = document.createElement('canvas');
  canvas.width = fW * frames.length;
  canvas.height = fH;
  const ctx = canvas.getContext('2d');

  frames.forEach((matrix, fi) => {
    const offsetX = fi * fW;
    for (let y = 0; y < frameH; y++) {
      for (let x = 0; x < frameW; x++) {
        const colorIndex = matrix[y][x];
        if (colorIndex === 0) continue;
        ctx.fillStyle = palette[colorIndex] || '#ff00ff';
        ctx.fillRect(offsetX + x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  });

  if (scene.textures.exists(key)) scene.textures.remove(key);
  // Add as a canvas texture, then manually define frames
  const tex = scene.textures.addCanvas(key, canvas);
  frames.forEach((_, fi) => {
    tex.add(fi, 0, fi * fW, 0, fW, fH);
  });
  return key;
}
