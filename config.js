/*
 * StoryMap Embed Configuration
 *
 * The Adobe Fonts <link> in index.html loads the font files (it generates
 * @font-face rules automatically). This config tells the StoryMap embed
 * engine which font families to use for title and body text.
 *
 * The fontFamily strings MUST match the font-family names in the Adobe Fonts
 * CSS. Verified from https://use.typekit.net/oib6sky.css:
 *   - "alwyn-new-rounded-web" (Alwyn New Rounded)
 *   - "museo-sans-rounded" (Museo Sans Rounded)
 */

window.storyMapsEmbedConfig = {
  storyId: '00a24cce226141b6a21e03339b633c96',

  // Both rootSelector (samples repo) and rootNode (official docs) set for compatibility.
  rootSelector: '.storymaps-root',
  rootNode: '.storymaps-root',

  font: {
    // font-family name and weights verified from the Adobe Fonts CSS.
    // Available normal weights: 200, 300, 400, 600, 700.
    title: {
      fontFamily: 'alwyn-new-rounded-web',
      weight: {
        normal: 400,
        bold: 700
      }
    },
    // font-family name and weights verified from the Adobe Fonts CSS.
    // Weight 400 is NOT available in this family — using 500 (medium) as
    // the nearest normal weight. Available normal weights: 100, 300, 500, 700, 800, 900.
    body: {
      fontFamily: 'museo-sans-rounded',
      weight: {
        normal: 500,
        bold: 700
      }
    }
  }
};