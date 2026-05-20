# Banner Generator Parameter Mapping

This document maps all UI controls from `generator/index.html` to Toolskin CSS variables, utility classes, and JS configuration options.

## Typography Parameters

| Generator Control | Toolskin CSS Variable | Toolskin Utility Class | JS Config | Default |
|-------------------|----------------------|------------------------|-----------|---------|
| Title Text | `--ts-title-text` | `.ts-title-text` | `title.text` | `"TOOLSKIN"` |
| Title Font Family | `--ts-title-font-family` | `.ts-title-font-{name}` | `title.fontFamily` | `"Space Grotesk"` |
| Title Font Weight | `--ts-title-font-weight` | `.ts-title-weight-{value}` | `title.fontWeight` | `700` |
| Title Font Size | `--ts-title-font-size` | `.ts-title-size-{value}` | `title.fontSize` | `180px` |
| Title Color | `--ts-title-color` | `.ts-title-color` | `title.color` | `#ffffff` |
| Title Text Wrap | `--ts-title-wrap` | `.ts-title-wrap` | `title.wrap` | `false` |
| Title Gradient Enabled | `--ts-title-gradient` | `.ts-title-gradient` | `title.gradient.enabled` | `false` |
| Title Gradient Color A | `--ts-title-gradient-start` | - | `title.gradient.start` | `#ff5500` |
| Title Gradient Color B | `--ts-title-gradient-end` | - | `title.gradient.end` | `#ffffff` |
| Title Gradient Angle | `--ts-title-gradient-angle` | - | `title.gradient.angle` | `135deg` |
| Tagline Text | `--ts-tagline-text` | `.ts-tagline-text` | `tagline.text` | `"FRAMEWORK FOR CREATORS"` |
| Tagline Font Size | `--ts-tagline-font-size` | `.ts-tagline-size-{value}` | `tagline.fontSize` | `17px` |
| Version/Badge Text | `--ts-badge-text` | `.ts-badge-text` | `badge.text` | `"v1.2.0"` |
| Badge Font Size | `--ts-badge-font-size` | `.ts-badge-size-{value}` | `badge.fontSize` | `15px` |

## Color Parameters

| Generator Control | Toolskin CSS Variable | Toolskin Utility Class | JS Config | Default |
|-------------------|----------------------|------------------------|-----------|---------|
| Global Accent Color | `--ts-accent` | `.ts-accent-{color}` | `accent.color` | `#ff5500` |
| Title Color | `--ts-title-color` | `.ts-title-color` | `title.color` | `#ffffff` |
| Tagline Color | `--ts-tagline-color` | `.ts-tagline-color` | `tagline.color` | `accent` |
| Badge Text Color | `--ts-badge-text-color` | `.ts-badge-color` | `badge.textColor` | `#ffffff` |
| Icon Color | `--ts-icon-color` | `.ts-icon-color` | `icon.color` | `accent` |

## Background Parameters

| Generator Control | Toolskin CSS Variable | Toolskin Utility Class | JS Config | Default |
|-------------------|----------------------|------------------------|-----------|---------|
| Background Mode | `--ts-bg-mode` | `.ts-bg-{mode}` | `background.mode` | `"radial"` |
| Background Color 1 | `--ts-bg-color-1` | - | `background.color1` | `#141414` |
| Background Color 2 | `--ts-bg-color-2` | - | `background.color2` | `#080808` |
| Background Strength | `--ts-bg-strength` | - | `background.strength` | `60%` |
| Background Gradient Position | `--ts-bg-gradient-position` | - | `background.gradientPosition` | `"30% 50%"` |
| Background Gradient Angle | `--ts-bg-gradient-angle` | - | `background.gradientAngle` | `135deg` |
| Background Image | `--ts-bg-image` | `.ts-bg-image` | `background.image` | `null` |
| Background Overlay Color | `--ts-bg-overlay-color` | - | `background.overlay.color` | `#000000` |
| Background Overlay Opacity | `--ts-bg-overlay-opacity` | - | `background.overlay.opacity` | `50%` |
| Background Backdrop Blur | `--ts-bg-backdrop-blur` | - | `background.backdropBlur` | `0px` |

## Noise/Grain Parameters

| Generator Control | Toolskin CSS Variable | Toolskin Utility Class | JS Config | Default |
|-------------------|----------------------|------------------------|-----------|---------|
| Noise Enabled | `--ts-noise-enabled` | `.ts-noise` | `noise.enabled` | `true` |
| Noise Blend Mode | `--ts-noise-blend-mode` | `.ts-noise-blend-{mode}` | `noise.blendMode` | `"soft-light"` |
| Noise Intensity/Opacity | `--ts-noise-opacity` | - | `noise.opacity` | `25%` |
| Noise Scale (Tile Size) | `--ts-noise-scale` | - | `noise.scale` | `300px` |
| Noise Frequency | `--ts-noise-frequency` | - | `noise.frequency` | `0.65` |

## Glow Parameters

| Generator Control | Toolskin CSS Variable | Toolskin Utility Class | JS Config | Default |
|-------------------|----------------------|------------------------|-----------|---------|
| Glow Enabled | `--ts-glow-enabled` | `.ts-glow` | `glow.enabled` | `true` |
| Glow Strength | `--ts-glow-strength` | - | `glow.strength` | `12%` |
| Glow Position | `--ts-glow-position` | `.ts-glow-{position}` | `glow.position` | `"top-right"` |

## Element Parameters

| Generator Control | Toolskin CSS Variable | Toolskin Utility Class | JS Config | Default |
|-------------------|----------------------|------------------------|-----------|---------|
| Tagline Visible | `--ts-tagline-visible` | `.ts-tagline-visible` | `tagline.visible` | `true` |
| Tagline Border | `--ts-tagline-border` | `.ts-tagline-border` | `tagline.border` | `true` |
| Tagline Order | `--ts-tagline-order` | `.ts-tagline-order-{n}` | `tagline.order` | `0` |
| Badge Visible | `--ts-badge-visible` | `.ts-badge-visible` | `badge.visible` | `true` |
| Badge Style | `--ts-badge-style` | `.ts-badge-{style}` | `badge.style` | `"gradient"` |
| Badge Radius | `--ts-badge-radius` | `.ts-badge-radius-{value}` | `badge.radius` | `7px` |
| Badge Opacity | `--ts-badge-opacity` | - | `badge.opacity` | `100%` |

## Icon Parameters

| Generator Control | Toolskin CSS Variable | Toolskin Utility Class | JS Config | Default |
|-------------------|----------------------|------------------------|-----------|---------|
| Icon Name | `--ts-icon-name` | - | `icon.name` | `null` |
| Icon Outline Style | `--ts-icon-outline` | `.ts-icon-outline` | `icon.outline` | `false` |
| Icon Size | `--ts-icon-size` | `.ts-icon-size-{value}` | `icon.size` | `60px` |
| Icon Color | `--ts-icon-color` | `.ts-icon-color` | `icon.color` | `accent` |
| Icon Position X | `--ts-icon-x` | - | `icon.x` | `0px` |
| Icon Position Y | `--ts-icon-y` | - | `icon.y` | `0px` |

## Canvas Parameters

| Generator Control | Toolskin CSS Variable | Toolskin Utility Class | JS Config | Default |
|-------------------|----------------------|------------------------|-----------|---------|
| Canvas Width | `--ts-canvas-width` | - | `canvas.width` | `1200px` |
| Canvas Height | `--ts-canvas-height` | - | `canvas.height` | `630px` |
| Canvas Padding H | `--ts-canvas-pad-h` | - | `canvas.paddingH` | `100px` |
| Canvas Padding V | `--ts-canvas-pad-v` | - | `canvas.paddingV` | `80px` |
| JPEG Quality | `--ts-jpeg-quality` | - | `export.jpegQuality` | `92%` |

## Implementation Notes

All these parameters should be:
1. **CSS Variables** - Primary configuration layer, can be set inline or in stylesheets
2. **Utility Classes** - Convenient presets (e.g., `.ts-title-weight-700`, `.ts-badge-gradient`)
3. **Data Attributes** - HTML-based configuration (e.g., `data-ts-title="TOOLSKIN"`)
4. **JavaScript Config** - Programmatic control via `Toolskin.init({ ... })`

The goal is that any design created in the generator can be reproduced using Toolskin components and variables alone.
