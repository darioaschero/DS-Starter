/**
 * T16 adapter for the exact, bundled Radix custom-color generator.
 *
 * Adaptation boundary:
 * - The upstream algorithm and dependencies are unchanged inside
 *   ./radix-generator.bundle.mjs; provenance is under ./vendor/.
 * - This file only supplies the two appearance-specific calls used by the
 *   Radix page, converts returned sRGB hex values to T15's specimen shape,
 *   derives comparison defaults, and computes validation annotations.
 * - T15's Candidate A/B implementation in palette-engine.mjs is not changed.
 */

import { generateRadixColors } from "./radix-generator.bundle.mjs";
import {
  FAMILY_DATA,
  contrastRatio,
  deltaE,
  gamutMap,
  gateReport,
  hexToOklch,
  hexToRgb,
  relativeLuminance,
  rgbToOklab,
} from "./palette-engine.mjs";

export const RADIX_SOURCE = {
  repository: "https://github.com/radix-ui/website",
  sourcePath: "components/generate-radix-colors.tsx",
  commit: "bb424082fd33fadc244a6dd276d3ced55caa6234",
  fetched: "2026-09-01",
  dependencies: {
    "@radix-ui/colors": "3.0.0",
    "colorjs.io": "0.5.2",
    "bezier-easing": "2.1.0",
  },
};

export const RADIX_BRANCH = {
  label: "Radix algorithm",
  short: "Radix",
  description: "Pinned Radix custom-color engine: nearest P3 reference-scale blend, source hue/chroma remap, canvas lightness transposition, and APCA-based contrast token.",
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function oklchCss({ L, C, h }) {
  return `oklch(${clamp(L) * 100}% ${Math.max(0, C)} ${h})`;
}

function outputStep(hex, index) {
  return {
    step: index + 1,
    hex,
    lab: rgbToOklab(hexToRgb(hex)),
    oklch: hexToOklch(hex),
    clamped: false,
    chromaLoss: 0,
  };
}

function generatedNeutral(lightResult, darkResult) {
  return {
    candidate: "radix",
    hueDrift: true,
    light: lightResult.grayScale.map(outputStep),
    dark: darkResult.grayScale.map(outputStep),
  };
}

function associatedNeutralName(name) {
  const family = FAMILY_DATA[name];
  return family.kind === "neutral" ? name : family.neutral;
}

/**
 * Family presets use their recorded Slate/Sand seeds. Arbitrary inputs get a
 * low-chroma gray tint derived from the accent hue and scheme-appropriate
 * canvases. The user can override every derived value in the specimen.
 */
export function deriveRadixInputs({ seedHex, seedOklch, kind = "chromatic", familyName } = {}) {
  if (familyName && FAMILY_DATA[familyName]) {
    const neutral = FAMILY_DATA[associatedNeutralName(familyName)];
    return {
      grayLight: neutral.light[8],
      grayDark: neutral.dark[8],
      backgroundLight: "#ffffff",
      backgroundDark: neutral.dark[0],
    };
  }

  const seed = seedOklch ?? hexToOklch(seedHex ?? "#0090ff");
  const tintC = Math.min(0.02, seed.C * (kind === "neutral" ? 1 : 0.12));
  return {
    grayLight: gamutMap({ L: 0.645, C: tintC, h: seed.h }).hex,
    grayDark: gamutMap({ L: 0.54, C: tintC * 0.92, h: seed.h }).hex,
    backgroundLight: gamutMap({ L: 1, C: tintC * 0.04, h: seed.h }).hex,
    backgroundDark: gamutMap({ L: 0.18, C: tintC * 0.24, h: seed.h }).hex,
  };
}

export function generateRadixBranch({
  seedHex,
  seedOklch,
  kind = "chromatic",
  familyName,
  grayLight,
  grayDark,
  backgroundLight,
  backgroundDark,
} = {}) {
  const defaults = deriveRadixInputs({ seedHex, seedOklch, kind, familyName });
  const inputs = {
    accent: seedOklch ? oklchCss(seedOklch) : seedHex,
    grayLight: grayLight ?? defaults.grayLight,
    grayDark: grayDark ?? defaults.grayDark,
    backgroundLight: backgroundLight ?? defaults.backgroundLight,
    backgroundDark: backgroundDark ?? defaults.backgroundDark,
  };

  const lightResult = generateRadixColors({
    appearance: "light",
    accent: inputs.accent,
    gray: inputs.grayLight,
    background: inputs.backgroundLight,
  });
  const darkResult = generateRadixColors({
    appearance: "dark",
    accent: inputs.accent,
    gray: inputs.grayDark,
    background: inputs.backgroundDark,
  });

  const lightHex = kind === "neutral" ? lightResult.grayScale : lightResult.accentScale;
  const darkHex = kind === "neutral" ? darkResult.grayScale : darkResult.accentScale;
  const parsedSeed = seedOklch ?? hexToOklch(seedHex);
  const warnings = [];
  if (kind === "neutral") warnings.push("Radix neutral mode shown here is the engine’s gray-scale output; its accent scale is intentionally omitted from the strip.");

  const generated = {
    seed: parsedSeed,
    kind,
    candidate: "radix",
    hueDrift: true,
    light: lightHex.map(outputStep),
    dark: darkHex.map(outputStep),
    warnings,
    radix: {
      inputs,
      lightResult,
      darkResult,
      neutral: generatedNeutral(lightResult, darkResult),
    },
  };
  generated.radix.gates = gateReport(generated, generated.radix.neutral);
  generated.radix.contrastComparison = kind === "neutral" ? null : radixContrastComparison(generated);
  return generated;
}

export function validateRadixFamily(name) {
  const family = FAMILY_DATA[name];
  const generated = generateRadixBranch({
    seedHex: family.light[8],
    kind: family.kind,
    familyName: name,
  });
  const byScheme = {};
  for (const scheme of ["light", "dark"]) {
    const steps = generated[scheme].map((step, index) => deltaE(step.lab, family[scheme][index]));
    const max = Math.max(...steps);
    byScheme[scheme] = {
      steps,
      mean: steps.reduce((sum, value) => sum + value, 0) / steps.length,
      max,
      maxStep: steps.indexOf(max) + 1,
    };
  }
  const all = [...byScheme.light.steps, ...byScheme.dark.steps];
  return {
    name,
    candidate: "radix",
    hueDrift: true,
    generated,
    light: byScheme.light,
    dark: byScheme.dark,
    mean: all.reduce((sum, value) => sum + value, 0) / all.length,
    max: Math.max(...all),
  };
}

function computedForeground(solid) {
  return ["#ffffff", "#111111"]
    .map((hex) => ({ hex, ratio: contrastRatio(hex, solid) }))
    .sort((a, b) => b.ratio - a.ratio)[0];
}

function polarity(hex) {
  return relativeLuminance(hex) > 0.5 ? "light" : "dark";
}

export function radixContrastComparison(generated) {
  return Object.fromEntries(["light", "dark"].map((scheme) => {
    const result = generated.radix[`${scheme}Result`];
    const solid = generated[scheme][8].hex;
    const computed = computedForeground(solid);
    const radixHex = result.accentContrast;
    const radixRatio = contrastRatio(radixHex, solid);
    return [scheme, {
      solid,
      radixHex,
      radixRatio,
      radixPass: radixRatio >= 4.5,
      radixPolarity: polarity(radixHex),
      computedHex: computed.hex,
      computedRatio: computed.ratio,
      computedPass: computed.ratio >= 4.5,
      computedPolarity: polarity(computed.hex),
      agrees: polarity(radixHex) === polarity(computed.hex),
    }];
  }));
}

export function radixGateReport(generated) {
  return generated.radix?.gates ?? gateReport(generated);
}
