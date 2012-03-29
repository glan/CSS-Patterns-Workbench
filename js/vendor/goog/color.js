// Subset of goog/color lib

define('vendor/goog/color', function () {
'use strict';

var goog = {};
goog.color = {};

/**
 * Takes a string a prepends a '#' sign if one doesn't exist.
 * @param {string} str String to check.
 * @return {string} The value passed in, prepended with a '#' if it didn't
 *    already have one.
 * @private
 */
goog.color.prependPoundIfNecessary_ = function(str) {
  return str.charAt(0) == '#' ? str : '#' + str;
};

/**
 * Takes a hex value and prepends a zero if it's a single digit.
 * @param {string} hex Hex value to prepend if single digit.
 * @return {string} hex value prepended with zero if it was single digit,
 *    otherwise the same value that was passed in.
 * @private
 */
goog.color.prependZeroIfNecessary_ = function(hex) {
  return hex.length == 1 ? '0' + hex : hex;
};

/**
 * Converts a color from RGB to hex representation.
 * @param {number} r Amount of red, int between 0 and 255.
 * @param {number} g Amount of green, int between 0 and 255.
 * @param {number} b Amount of blue, int between 0 and 255.
 * @return {string} hex representation of the color.
 */
goog.color.rgbToHex = function(r, g, b) {
  r = Number(r);
  g = Number(g);
  b = Number(b);
  if (isNaN(r) || r < 0 || r > 255 ||
      isNaN(g) || g < 0 || g > 255 ||
      isNaN(b) || b < 0 || b > 255) {
    throw Error('"(' + r + ',' + g + ',' + b + '") is not a valid RGB color');
  }
  var hexR = goog.color.prependZeroIfNecessary_(r.toString(16));
  var hexG = goog.color.prependZeroIfNecessary_(g.toString(16));
  var hexB = goog.color.prependZeroIfNecessary_(b.toString(16));
  return '#' + hexR + hexG + hexB;
};

/**
 * Converts a color from RGB color space to HSL color space.
 * Modified from {@link http://en.wikipedia.org/wiki/HLS_color_space}.
 * @param {number} r Value of red, in [0, 255].
 * @param {number} g Value of green, in [0, 255].
 * @param {number} b Value of blue, in [0, 255].
 * @return {!Array.<number>} [h, s, l] values for the color, with h an int in
 *    [0, 360] and s and l in [0, 1].
 */
goog.color.rgbToHsl = function(r, g, b) {
  // First must normalize r, g, b to be between 0 and 1.
  var normR = r / 255;
  var normG = g / 255;
  var normB = b / 255;
  var max = Math.max(normR, normG, normB);
  var min = Math.min(normR, normG, normB);
  var h = 0;
  var s = 0;

  // Luminosity is the average of the max and min rgb color intensities.
  var l = 0.5 * (max + min);

  // The hue and saturation are dependent on which color intensity is the max.
  // If max and min are equal, the color is gray and h and s should be 0.
  if (max != min) {
    if (max == normR) {
      h = 60 * (normG - normB) / (max - min);
    } else if (max == normG) {
      h = 60 * (normB - normR) / (max - min) + 120;
    } else if (max == normB) {
      h = 60 * (normR - normG) / (max - min) + 240;
    }

    if (0 < l && l <= 0.5) {
      s = (max - min) / (2 * l);
    } else {
      s = (max - min) / (2 - 2 * l);
    }
  }

  // Make sure the hue falls between 0 and 360.
  return [Math.round(h + 360) % 360, s, l];
};


/**
 * Converts a color from RGB color space to HSL color space.
 * @param {Array.<number>} rgb [r, g, b] values for the color, each in [0, 255].
 * @return {!Array.<number>} [h, s, l] values for the color, with h in [0, 360]
 *    and s and l in [0, 1].
 */
goog.color.rgbArrayToHsl = function(rgb) {
  return goog.color.rgbToHsl(rgb[0], rgb[1], rgb[2]);
};


/**
 * Helper for hslToRgb.
 * @param {number} v1 Helper variable 1.
 * @param {number} v2 Helper variable 2.
 * @param {number} vH Helper variable 3.
 * @return {number} Appropriate RGB value, given the above.
 * @private
 */
goog.color.hueToRgb_ = function(v1, v2, vH) {
  if (vH < 0) {
    vH += 1;
  } else if (vH > 1) {
    vH -= 1;
  }
  if ((6 * vH) < 1) {
    return (v1 + (v2 - v1) * 6 * vH);
  } else if (2 * vH < 1) {
    return v2;
  } else if (3 * vH < 2) {
    return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
  }
  return v1;
};


/**
 * Converts a color from HSL color space to RGB color space.
 * Modified from {@link http://www.easyrgb.com/math.html}
 * @param {number} h Hue, in [0, 360].
 * @param {number} s Saturation, in [0, 1].
 * @param {number} l Luminosity, in [0, 1].
 * @return {!Array.<number>} [r, g, b] values for the color, with each an int in
 *    [0, 255].
 */
goog.color.hslToRgb = function(h, s, l) {
  var r = 0;
  var g = 0;
  var b = 0;
  var normH = h / 360; // normalize h to fall in [0, 1]

  if (s == 0) {
    r = g = b = l * 255;
  } else {
    var temp1 = 0;
    var temp2 = 0;
    if (l < 0.5) {
      temp2 = l * (1 + s);
    } else {
      temp2 = l + s - (s * l);
    }
    temp1 = 2 * l - temp2;
    r = 255 * goog.color.hueToRgb_(temp1, temp2, normH + (1 / 3));
    g = 255 * goog.color.hueToRgb_(temp1, temp2, normH);
    b = 255 * goog.color.hueToRgb_(temp1, temp2, normH - (1 / 3));
  }

  return [Math.round(r), Math.round(g), Math.round(b)];
};

return goog;
});