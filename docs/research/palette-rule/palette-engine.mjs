const FIT_SOURCE = "@radix-ui/colors 3.0.0 sRGB";

export const FAMILY_DATA = {
  Slate: {
    kind: "neutral",
    set: "fitted",
    source: FIT_SOURCE,
    light: ["#fcfcfd", "#f9f9fb", "#f0f0f3", "#e8e8ec", "#e0e1e6", "#d9d9e0", "#cdced6", "#b9bbc6", "#8b8d98", "#80838d", "#60646c", "#1c2024"],
    dark: ["#111113", "#18191b", "#212225", "#272a2d", "#2e3135", "#363a3f", "#43484e", "#5a6169", "#696e77", "#777b84", "#b0b4ba", "#edeef0"],
  },
  Sand: {
    kind: "neutral",
    set: "fitted",
    source: FIT_SOURCE,
    light: ["#fdfdfc", "#f9f9f8", "#f1f0ef", "#e9e8e6", "#e2e1de", "#dad9d6", "#cfceca", "#bcbbb5", "#8d8d86", "#82827c", "#63635e", "#21201c"],
    dark: ["#111110", "#191918", "#222221", "#2a2a28", "#31312e", "#3b3a37", "#494844", "#62605b", "#6f6d66", "#7c7b74", "#b5b3ad", "#eeeeec"],
  },
  Blue: {
    kind: "chromatic",
    set: "fitted",
    source: FIT_SOURCE,
    neutral: "Slate",
    light: ["#fbfdff", "#f4faff", "#e6f4fe", "#d5efff", "#c2e5ff", "#acd8fc", "#8ec8f6", "#5eb1ef", "#0090ff", "#0588f0", "#0d74ce", "#113264"],
    dark: ["#0d1520", "#111927", "#0d2847", "#003362", "#004074", "#104d87", "#205d9e", "#2870bd", "#0090ff", "#3b9eff", "#70b8ff", "#c2e6ff"],
  },
  Red: {
    kind: "chromatic",
    set: "fitted",
    source: FIT_SOURCE,
    neutral: "Slate",
    light: ["#fffcfc", "#fff7f7", "#feebec", "#ffdbdc", "#ffcdce", "#fdbdbe", "#f4a9aa", "#eb8e90", "#e5484d", "#dc3e42", "#ce2c31", "#641723"],
    dark: ["#191111", "#201314", "#3b1219", "#500f1c", "#611623", "#72232d", "#8c333a", "#b54548", "#e5484d", "#ec5d5e", "#ff9592", "#ffd1d9"],
  },
  Amber: {
    kind: "chromatic",
    set: "fitted",
    source: FIT_SOURCE,
    neutral: "Sand",
    light: ["#fefdfb", "#fefbe9", "#fff7c2", "#ffee9c", "#fbe577", "#f3d673", "#e9c162", "#e2a336", "#ffc53d", "#ffba18", "#ab6400", "#4f3422"],
    dark: ["#16120c", "#1d180f", "#302008", "#3f2700", "#4d3000", "#5c3d05", "#714f19", "#8f6424", "#ffc53d", "#ffd60a", "#ffca16", "#ffe7b3"],
  },
  Tomato: {
    kind: "chromatic",
    set: "fitted",
    source: FIT_SOURCE,
    neutral: "Sand",
    light: ["#fffcfc", "#fff8f7", "#feebe7", "#ffdcd3", "#ffcdc2", "#fdbdaf", "#f5a898", "#ec8e7b", "#e54d2e", "#dd4425", "#d13415", "#5c271f"],
    dark: ["#181111", "#1f1513", "#391714", "#4e1511", "#5e1c16", "#6e2920", "#853a2d", "#ac4d39", "#e54d2e", "#ec6142", "#ff977d", "#fbd3cb"],
  },
  Green: {
    kind: "chromatic",
    set: "held-out",
    source: FIT_SOURCE,
    neutral: "Slate",
    light: ["#fbfefc", "#f4fbf6", "#e6f6eb", "#d6f1df", "#c4e8d1", "#adddc0", "#8eceaa", "#5bb98b", "#30a46c", "#2b9a66", "#218358", "#193b2d"],
    dark: ["#0e1512", "#121b17", "#132d21", "#113b29", "#174933", "#20573e", "#28684a", "#2f7c57", "#30a46c", "#33b074", "#3dd68c", "#b1f1cb"],
  },
  Violet: {
    kind: "chromatic",
    set: "held-out",
    source: FIT_SOURCE,
    neutral: "Slate",
    light: ["#fdfcfe", "#faf8ff", "#f4f0fe", "#ebe4ff", "#e1d9ff", "#d4cafe", "#c2b5f5", "#aa99ec", "#6e56cf", "#654dc4", "#6550b9", "#2f265f"],
    dark: ["#14121f", "#1b1525", "#291f43", "#33255b", "#3c2e69", "#473876", "#56468b", "#6958ad", "#6e56cf", "#7d66d9", "#baa7ff", "#e2ddfe"],
  },
  Cyan: {
    kind: "chromatic",
    set: "held-out",
    source: FIT_SOURCE,
    neutral: "Slate",
    light: ["#fafdfe", "#f2fafb", "#def7f9", "#caf1f6", "#b5e9f0", "#9ddde7", "#7dcedc", "#3db9cf", "#00a2c7", "#0797b9", "#107d98", "#0d3c48"],
    dark: ["#0b161a", "#101b20", "#082c36", "#003848", "#004558", "#045468", "#12677e", "#11809c", "#00a2c7", "#23afd0", "#4ccce6", "#b6ecf7"],
  },
  Yellow: {
    kind: "chromatic",
    set: "held-out",
    source: FIT_SOURCE,
    neutral: "Sand",
    light: ["#fdfdf9", "#fefce9", "#fffab8", "#fff394", "#ffe770", "#f3d768", "#e4c767", "#d5ae39", "#ffe629", "#ffdc00", "#9e6c00", "#473b1f"],
    dark: ["#14120b", "#1b180f", "#2d2305", "#362b00", "#433500", "#524202", "#665417", "#836a21", "#ffe629", "#ffff57", "#f5e147", "#f6eeb4"],
  },
};

export const CANDIDATES = {
  shared: {
    label: "Shared tables",
    short: "Shared",
    description: "One measured role-position lightness table and chroma envelope per scheme and neutral/chromatic flag.",
  },
  adaptive: {
    label: "Hue-neighbour tables",
    short: "Hue-neighbour",
    description: "Interpolate three fitted chromatic profile anchors (warm, amber, blue), or two neutral tint anchors, from the seed hue.",
  },
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const radians = (degrees) => (degrees * Math.PI) / 180;
const degrees = (radiansValue) => (radiansValue * 180) / Math.PI;
const wrapHue = (hue) => ((hue % 360) + 360) % 360;
const signedHueDelta = (from, to) => ((to - from + 540) % 360) - 180;

function srgbToLinear(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel) {
  return channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
}

export function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const expanded = value.length === 3 ? value.split("").map((part) => part + part).join("") : value;
  const integer = Number.parseInt(expanded, 16);
  return [(integer >> 16) & 255, (integer >> 8) & 255, integer & 255].map((part) => part / 255);
}

export function rgbToHex(rgb) {
  return `#${rgb.map((channel) => Math.round(clamp(channel) * 255).toString(16).padStart(2, "0")).join("")}`;
}

export function rgbToOklab(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);
  return {
    L: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot,
  };
}

export function oklabToLinearRgb({ L, a, b }) {
  const lRoot = L + 0.3963377774 * a + 0.2158037573 * b;
  const mRoot = L - 0.1055613458 * a - 0.0638541728 * b;
  const sRoot = L - 0.0894841775 * a - 1.291485548 * b;
  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export function oklabToOklch({ L, a, b }, fallbackHue = 0) {
  const C = Math.hypot(a, b);
  return { L, C, h: C < 1e-7 ? fallbackHue : wrapHue(degrees(Math.atan2(b, a))) };
}

export function oklchToOklab({ L, C, h }) {
  return { L, a: C * Math.cos(radians(h)), b: C * Math.sin(radians(h)) };
}

export function hexToOklch(hex, fallbackHue = 0) {
  return oklabToOklch(rgbToOklab(hexToRgb(hex)), fallbackHue);
}

export function oklchToHex(oklch) {
  const linear = oklabToLinearRgb(oklchToOklab(oklch));
  return rgbToHex(linear.map(linearToSrgb));
}

export function inSrgbGamut(oklch) {
  return oklabToLinearRgb(oklchToOklab(oklch)).every((channel) => channel >= -1e-7 && channel <= 1.0000001);
}

export function gamutMap(oklch) {
  const desired = { L: clamp(oklch.L), C: Math.max(0, oklch.C), h: wrapHue(oklch.h) };
  let used = desired;
  let clamped = desired.L !== oklch.L || !inSrgbGamut(desired);
  if (!inSrgbGamut(desired)) {
    let low = 0;
    let high = desired.C;
    for (let iteration = 0; iteration < 26; iteration += 1) {
      const middle = (low + high) / 2;
      if (inSrgbGamut({ ...desired, C: middle })) low = middle;
      else high = middle;
    }
    used = { ...desired, C: low };
  }
  const hex = oklchToHex(used);
  return {
    desired,
    used,
    hex,
    lab: rgbToOklab(hexToRgb(hex)),
    oklch: hexToOklch(hex, used.h),
    clamped,
    chromaLoss: desired.C > 0 ? Math.max(0, 1 - used.C / desired.C) : 0,
  };
}

export function deltaE(first, second) {
  const a = typeof first === "string" ? rgbToOklab(hexToRgb(first)) : first;
  const b = typeof second === "string" ? rgbToOklab(hexToRgb(second)) : second;
  return Math.hypot(a.L - b.L, a.a - b.a, a.b - b.b);
}

export function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function familyOklch(name, scheme) {
  return FAMILY_DATA[name][scheme].map((hex) => hexToOklch(hex));
}

function buildLightnessProfile(names, scheme) {
  const ramps = names.map((name) => familyOklch(name, scheme));
  return Array.from({ length: 12 }, (_, index) => {
    const values = ramps.map((ramp) => {
      const seedL = ramp[8].L;
      if (scheme === "light") {
        return index <= 8 ? (1 - ramp[index].L) / (1 - seedL) : ramp[index].L / seedL;
      }
      return index <= 8 ? ramp[index].L / seedL : (ramp[index].L - seedL) / (1 - seedL);
    });
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  });
}

function buildChromaProfile(names, scheme) {
  const ramps = names.map((name) => familyOklch(name, scheme));
  return Array.from({ length: 12 }, (_, index) => {
    const values = ramps.map((ramp) => ramp[index].C / Math.max(ramp[8].C, 1e-5));
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  });
}

function buildAbsoluteLightnessProfile(names, scheme) {
  const ramps = names.map((name) => familyOklch(name, scheme));
  return Array.from({ length: 12 }, (_, index) => average(ramps.map((ramp) => ramp[index].L)));
}

function buildHueProfile(names, scheme) {
  const ramps = names.map((name) => familyOklch(name, scheme));
  return Array.from({ length: 12 }, (_, index) => {
    if (index === 8) return 0;
    let weightedTotal = 0;
    let totalWeight = 0;
    ramps.forEach((ramp) => {
      const weight = Math.max(ramp[index].C, 0.002);
      weightedTotal += signedHueDelta(ramp[8].h, ramp[index].h) * weight;
      totalWeight += weight;
    });
    return weightedTotal / totalWeight;
  });
}

const FITTED_CHROMATIC = Object.keys(FAMILY_DATA).filter((name) => FAMILY_DATA[name].set === "fitted" && FAMILY_DATA[name].kind === "chromatic");
const FITTED_NEUTRAL = Object.keys(FAMILY_DATA).filter((name) => FAMILY_DATA[name].set === "fitted" && FAMILY_DATA[name].kind === "neutral");

export const NEUTRAL_DARK_SEED_MAP = (() => {
  const pairs = FITTED_NEUTRAL.map((name) => ({
    light: hexToOklch(FAMILY_DATA[name].light[8]),
    dark: hexToOklch(FAMILY_DATA[name].dark[8]),
  }));
  return {
    lightnessRatio: pairs.reduce((sum, pair) => sum + pair.dark.L / pair.light.L, 0) / pairs.length,
    chromaRatio: pairs.reduce((sum, pair) => sum + pair.dark.C / pair.light.C, 0) / pairs.length,
    hueOffset: pairs.reduce((sum, pair) => sum + signedHueDelta(pair.light.h, pair.dark.h), 0) / pairs.length,
  };
})();

export const PROFILES = Object.fromEntries(["chromatic", "neutral"].map((kind) => {
  const names = kind === "chromatic" ? FITTED_CHROMATIC : FITTED_NEUTRAL;
  return [kind, Object.fromEntries(["light", "dark"].map((scheme) => [scheme, {
    absoluteLightness: buildAbsoluteLightnessProfile(names, scheme),
    lightness: buildLightnessProfile(names, scheme),
    chroma: buildChromaProfile(names, scheme),
    hue: buildHueProfile(names, scheme),
  }]))];
}));

function averageProfiles(profiles) {
  return Object.fromEntries(["absoluteLightness", "lightness", "chroma", "hue"].map((axis) => [
    axis,
    Array.from({ length: 12 }, (_, index) => average(profiles.map((profile) => profile[axis][index]))),
  ]));
}

function fittedProfile(names, scheme) {
  return {
    absoluteLightness: buildAbsoluteLightnessProfile(names, scheme),
    lightness: buildLightnessProfile(names, scheme),
    chroma: buildChromaProfile(names, scheme),
    hue: buildHueProfile(names, scheme),
  };
}

function meanSeedHue(names) {
  const points = names.map((name) => hexToOklch(FAMILY_DATA[name].light[8]).h);
  const x = average(points.map((hue) => Math.cos(radians(hue))));
  const y = average(points.map((hue) => Math.sin(radians(hue))));
  return wrapHue(degrees(Math.atan2(y, x)));
}

export const PROFILE_ANCHORS = {
  chromatic: [
    { label: "warm", families: ["Red", "Tomato"] },
    { label: "amber", families: ["Amber"] },
    { label: "blue", families: ["Blue"] },
  ].map((anchor) => ({
    ...anchor,
    hue: meanSeedHue(anchor.families),
    light: fittedProfile(anchor.families, "light"),
    dark: fittedProfile(anchor.families, "dark"),
  })).sort((first, second) => first.hue - second.hue),
  neutral: ["Slate", "Sand"].map((name) => ({
    label: name.toLowerCase(),
    families: [name],
    hue: meanSeedHue([name]),
    light: fittedProfile([name], "light"),
    dark: fittedProfile([name], "dark"),
  })),
};

function blendProfiles(first, second, amount) {
  return Object.fromEntries(["absoluteLightness", "lightness", "chroma", "hue"].map((axis) => [
    axis,
    first[axis].map((value, index) => value + (second[axis][index] - value) * amount),
  ]));
}

function chromaticNeighbourProfile(scheme, hue) {
  const anchors = PROFILE_ANCHORS.chromatic;
  const extended = [...anchors, { ...anchors[0], hue: anchors[0].hue + 360 }];
  const adjustedHue = hue < anchors[0].hue ? hue + 360 : hue;
  const leftIndex = extended.findIndex((anchor, index) => index < extended.length - 1 && adjustedHue >= anchor.hue && adjustedHue <= extended[index + 1].hue);
  const left = extended[Math.max(0, leftIndex)];
  const right = extended[Math.max(0, leftIndex) + 1];
  const amount = (adjustedHue - left.hue) / (right.hue - left.hue);
  return blendProfiles(left[scheme], right[scheme], amount);
}

function neutralNeighbourProfile(scheme, hue) {
  const weighted = PROFILE_ANCHORS.neutral.map((anchor) => ({
    profile: anchor[scheme],
    weight: Math.exp(3 * Math.cos(radians(signedHueDelta(hue, anchor.hue)))),
  }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  return Object.fromEntries(["absoluteLightness", "lightness", "chroma", "hue"].map((axis) => [
    axis,
    Array.from({ length: 12 }, (_, index) => weighted.reduce((sum, item) => sum + item.profile[axis][index] * item.weight, 0) / total),
  ]));
}

function resolveProfile(kind, scheme, candidate, hue) {
  if (candidate === "shared") return PROFILES[kind][scheme];
  return kind === "chromatic" ? chromaticNeighbourProfile(scheme, hue) : neutralNeighbourProfile(scheme, hue);
}

function targetLightness(profile, seedL, scheme, index, kind) {
  if (kind === "chromatic" && index !== 8 && index !== 9) return profile.absoluteLightness[index];
  const position = profile.lightness[index];
  if (scheme === "light") {
    return index <= 8 ? 1 - (1 - seedL) * position : seedL * position;
  }
  return index <= 8 ? seedL * position : seedL + (1 - seedL) * position;
}

export function seedDiagnostics(seed, kind) {
  const warnings = [];
  if (kind === "chromatic" && seed.C < 0.04) warnings.push("Very desaturated chromatic seed: the ramp cannot create brand chroma that is absent from step 9.");
  if (seed.L < 0.35) warnings.push("Very dark step-9 seed: the fixed role tables no longer connect smoothly to the solid; inspect the step 8→9→10 sequence even when contrast passes.");
  if (seed.L > 0.9) warnings.push("Very light step-9 seed: a dark on-solid foreground is likely and the step 8→9→10 sequence needs visual review.");
  if (kind === "neutral" && seed.C > 0.05) warnings.push("Chromatic seed in neutral mode: the tint control caps the cast; seed chroma is not copied literally.");
  return warnings;
}

export function generateFamily({ seedHex, seedOklch, kind = "chromatic", candidate = "shared", hueDrift = false, tintHue, tintChroma }) {
  const parsedSeed = seedOklch ?? hexToOklch(seedHex);
  const seed = {
    L: clamp(parsedSeed.L),
    C: kind === "neutral" ? clamp(tintChroma ?? parsedSeed.C, 0, 0.05) : Math.max(0, parsedSeed.C),
    h: wrapHue(kind === "neutral" ? (tintHue ?? parsedSeed.h) : parsedSeed.h),
  };
  const result = { seed, kind, candidate, hueDrift, light: [], dark: [], warnings: seedDiagnostics(parsedSeed, kind) };
  ["light", "dark"].forEach((scheme) => {
    const profile = resolveProfile(kind, scheme, candidate, seed.h);
    const schemeSeed = kind === "neutral" && scheme === "dark" ? {
      L: seed.L * NEUTRAL_DARK_SEED_MAP.lightnessRatio,
      C: seed.C * NEUTRAL_DARK_SEED_MAP.chromaRatio,
      h: seed.h + (hueDrift ? NEUTRAL_DARK_SEED_MAP.hueOffset : 0),
    } : seed;
    result[scheme] = Array.from({ length: 12 }, (_, index) => {
      const desired = {
        L: targetLightness(profile, schemeSeed.L, scheme, index, kind),
        C: schemeSeed.C * profile.chroma[index],
        h: schemeSeed.h + (hueDrift ? profile.hue[index] : 0),
      };
      return { step: index + 1, ...gamutMap(desired) };
    });
  });
  const clampCount = [...result.light, ...result.dark].filter((step) => step.clamped).length;
  const worstClamp = Math.max(0, ...[...result.light, ...result.dark].map((step) => step.chromaLoss));
  if (clampCount) result.warnings.push(`${clampCount}/24 targets needed sRGB chroma reduction; worst chroma loss ${Math.round(worstClamp * 100)}%.`);
  return result;
}

export function generateFromGroundTruth(name, candidate = "shared", hueDrift = false) {
  const family = FAMILY_DATA[name];
  const seed = hexToOklch(family.light[8]);
  return generateFamily({
    seedHex: family.light[8],
    kind: family.kind,
    candidate,
    hueDrift,
    tintHue: seed.h,
    tintChroma: seed.C,
  });
}

export function validateFamily(name, candidate = "shared", hueDrift = false) {
  const generated = generateFromGroundTruth(name, candidate, hueDrift);
  const byScheme = {};
  ["light", "dark"].forEach((scheme) => {
    const values = generated[scheme].map((step, index) => deltaE(step.lab, FAMILY_DATA[name][scheme][index]));
    byScheme[scheme] = {
      steps: values,
      mean: values.reduce((sum, value) => sum + value, 0) / values.length,
      max: Math.max(...values),
      maxStep: values.indexOf(Math.max(...values)) + 1,
    };
  });
  const all = [...byScheme.light.steps, ...byScheme.dark.steps];
  return {
    name,
    candidate,
    hueDrift,
    generated,
    light: byScheme.light,
    dark: byScheme.dark,
    mean: all.reduce((sum, value) => sum + value, 0) / all.length,
    max: Math.max(...all),
  };
}

function bestCandidateStep(generated, background, indexes, minimum, extraBackground) {
  const reports = indexes.map((index) => {
    const ratios = ["light", "dark"].flatMap((scheme) => {
      const foreground = generated[scheme][index - 1].hex;
      const values = [contrastRatio(foreground, background[scheme])];
      if (extraBackground) values.push(contrastRatio(foreground, extraBackground[scheme]));
      return values;
    });
    return { step: index, ratios, minimum: Math.min(...ratios), pass: ratios.every((ratio) => ratio >= minimum) };
  });
  return reports.find((report) => report.pass) ?? reports.sort((a, b) => b.minimum - a.minimum)[0];
}

export function gateReport(generated, neutralGenerated) {
  const neutral = neutralGenerated ?? generateFamily({ seedHex: "#8b8d98", kind: "neutral", candidate: generated.candidate, hueDrift: generated.hueDrift, tintHue: 260, tintChroma: 0.018 });
  const canvas = { light: neutral.light[0].hex, dark: neutral.dark[0].hex };
  const subtle = { light: neutral.light[1].hex, dark: neutral.dark[1].hex };
  const solid = { light: generated.light[8].hex, dark: generated.dark[8].hex };
  const foregrounds = ["#ffffff", "#111111"].map((hex) => {
    const ratios = [contrastRatio(hex, solid.light), contrastRatio(hex, solid.dark)];
    return { hex, ratios, minimum: Math.min(...ratios) };
  }).sort((a, b) => b.minimum - a.minimum);
  const onSolid = { ...foregrounds[0], pass: foregrounds[0].minimum >= 4.5, alternatives: foregrounds };
  const link = bestCandidateStep(generated, canvas, [11, 12], 4.5, subtle);
  const focus = bestCandidateStep(generated, canvas, [8, 9, 10, 11, 12], 3);
  return { canvas, subtle, solid, onSolid, link, focus };
}

export function formatOklch(value, digits = 3) {
  return `${value.L.toFixed(digits)} ${value.C.toFixed(digits)} ${value.h.toFixed(1)}°`;
}

export function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function familyCurveTable(name, scheme) {
  return familyOklch(name, scheme);
}

export const SOURCE_URLS = {
  package: "https://www.npmjs.com/package/@radix-ui/colors/v/3.0.0",
  repository: "https://github.com/radix-ui/colors",
};
