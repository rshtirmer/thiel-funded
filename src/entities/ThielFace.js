import { THIEL_FACE } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { renderSpriteSheet } from '../core/PixelRenderer.js';
import { PALETTE } from '../sprites/palette.js';
import { THIEL_FRAMES, THIEL_EXPRESSIONS } from '../sprites/thiel.js';

/**
 * ThielFace - Peter Thiel's pixel-art face rendered from sprite matrices.
 * Supports 4 expressions: thinking (default), impressed, neutral, disgusted.
 * Uses PixelRenderer to generate a spritesheet texture at runtime.
 */
export class ThielFace {
  constructor(scene, x, y, scale = 1) {
    this.scene = scene;
    this.x = x || THIEL_FACE.X;
    this.y = y || THIEL_FACE.Y;
    this.scale = scale;
    this.currentExpression = 'thinking';

    // Calculate pixel size so the 32px sprite fills THIEL_FACE.SIZE
    // Each sprite frame is 32 pixels wide; we scale up via pixelSize
    const targetSize = THIEL_FACE.SIZE * scale;
    this.pixelSize = Math.max(1, Math.round(targetSize / 32));

    // Generate the spritesheet texture if not already present
    this._textureKey = 'thiel_faces';
    this._ensureTexture();

    // Create the sprite
    this.sprite = scene.add.sprite(this.x, this.y, this._textureKey);
    this.sprite.setFrame(THIEL_EXPRESSIONS[this.currentExpression]);

    // The texture is pixelSize * 32 wide; scale to match target display size
    const textureFrameWidth = 32 * this.pixelSize;
    const displayScale = targetSize / textureFrameWidth;
    this.sprite.setScale(displayScale);

    // Container for compatibility with existing code that references container
    this.container = scene.add.container(0, 0, [this.sprite]);

    // Listen for reaction events
    this.onReact = (data) => {
      if (data && data.expression) {
        this.setExpression(data.expression);
      }
    };
    eventBus.on(Events.THIEL_REACT, this.onReact);
  }

  /** Generate the spritesheet texture from pixel matrices. */
  _ensureTexture() {
    // Always regenerate to handle scene restarts cleanly
    renderSpriteSheet(this.scene, this._textureKey, THIEL_FRAMES, PALETTE, this.pixelSize);
  }

  setExpression(expression, animated = true) {
    if (expression === this.currentExpression) return;
    const frameIndex = THIEL_EXPRESSIONS[expression];
    if (frameIndex === undefined) return;

    if (animated) {
      // Quick scale bounce during expression change
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: this.sprite.scaleX * 1.08,
        scaleY: this.sprite.scaleY * 1.08,
        duration: 100,
        yoyo: true,
        ease: 'Quad.easeOut',
        onYoyo: () => {
          this.sprite.setFrame(frameIndex);
          this.currentExpression = expression;
        },
      });
    } else {
      this.sprite.setFrame(frameIndex);
      this.currentExpression = expression;
    }
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y);
  }

  setAlpha(alpha) {
    this.sprite.setAlpha(alpha);
    this.container.setAlpha(alpha);
  }

  getContainer() {
    return this.container;
  }

  destroy() {
    eventBus.off(Events.THIEL_REACT, this.onReact);
    if (this.container) {
      this.container.destroy(true);
    }
  }
}
