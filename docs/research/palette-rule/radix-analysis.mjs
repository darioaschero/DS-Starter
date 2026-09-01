/** Reproduce the numerical T16 tables from the pinned offline engine. */

import {
  CANDIDATES,
  FAMILY_DATA,
  generateFamily,
  gateReport,
  validateFamily,
  deltaE,
} from "./palette-engine.mjs";
import {
  generateRadixBranch,
  radixGateReport,
  validateRadixFamily,
} from "./radix-branch.mjs";

const round = (value, digits = 5) => Number(value.toFixed(digits));
const familyNames = Object.keys(FAMILY_DATA);

const branches = {
  A: {
    label: CANDIDATES.shared.label + " · hue locked",
    validate: (name) => validateFamily(name, "shared", false),
  },
  B: {
    label: CANDIDATES.adaptive.label + " · fitted drift",
    validate: (name) => validateFamily(name, "adaptive", true),
  },
  Radix: {
    label: "Radix algorithm",
    validate: validateRadixFamily,
  },
};

const validations = Object.fromEntries(Object.entries(branches).map(([key, branch]) => [
  key,
  Object.fromEntries(familyNames.map((name) => [name, branch.validate(name)])),
]));

function compact(validation) {
  return {
    lightMean: round(validation.light.mean),
    lightMax: round(validation.light.max),
    lightMaxStep: validation.light.maxStep,
    darkMean: round(validation.dark.mean),
    darkMax: round(validation.dark.max),
    darkMaxStep: validation.dark.maxStep,
    mean: round(validation.mean),
    max: round(validation.max),
  };
}

function aggregate(branch, set) {
  const selected = familyNames.filter((name) => FAMILY_DATA[name].set === set);
  const light = selected.flatMap((name) => validations[branch][name].light.steps);
  const dark = selected.flatMap((name) => validations[branch][name].dark.steps);
  const both = [...light, ...dark];
  return {
    families: selected.length,
    lightMean: round(light.reduce((sum, value) => sum + value, 0) / light.length),
    lightMax: round(Math.max(...light)),
    darkMean: round(dark.reduce((sum, value) => sum + value, 0) / dark.length),
    darkMax: round(Math.max(...dark)),
    mean: round(both.reduce((sum, value) => sum + value, 0) / both.length),
    max: round(Math.max(...both)),
  };
}

const selfBlue = validations.Radix.Blue;
const exact = (scheme) => selfBlue.generated[scheme].filter((step, index) => step.hex.toLowerCase() === FAMILY_DATA.Blue[scheme][index].toLowerCase()).length;

const contrast = familyNames
  .filter((name) => FAMILY_DATA[name].kind === "chromatic")
  .map((name) => {
    const generated = validations.Radix[name].generated;
    const comparison = generated.radix.contrastComparison;
    return {
      family: name,
      light: comparison.light,
      dark: comparison.dark,
    };
  });

const backgroundCases = [
  { name: "reference", light: "#ffffff", dark: "#111113" },
  { name: "warm", light: "#fff5e8", dark: "#1d1610" },
  { name: "cool", light: "#eaf4ff", dark: "#0b1825" },
];
const backgroundRuns = backgroundCases.map((item) => ({
  item,
  generated: generateRadixBranch({
    seedHex: "#0090ff",
    kind: "chromatic",
    grayLight: "#8b8d98",
    grayDark: "#696e77",
    backgroundLight: item.light,
    backgroundDark: item.dark,
  }),
}));
const backgroundBaseline = backgroundRuns[0].generated;
const backgrounds = backgroundRuns.map(({ item, generated }) => ({
  ...item,
  lightStep1: generated.light[0].hex,
  darkStep1: generated.dark[0].hex,
  lightSurface: generated.radix.lightResult.accentSurface,
  darkSurface: generated.radix.darkResult.accentSurface,
  lightMeanShift: round(generated.light.reduce((sum, step, index) => sum + deltaE(step.lab, backgroundBaseline.light[index].lab), 0) / 12),
  darkMeanShift: round(generated.dark.reduce((sum, step, index) => sum + deltaE(step.lab, backgroundBaseline.dark[index].lab), 0) / 12),
}));

const failureCases = [
  { name: "yellow", seedHex: "#ffe629" },
  { name: "srgb-edge-green", seedHex: "#00ff66" },
  { name: "out-of-gamut-oklch", seedHex: "#00c963", seedOklch: { L: 0.72, C: 0.34, h: 150 } },
  { name: "desaturated", seedHex: "#777b84" },
  { name: "very-dark", seedHex: "#351b48" },
];

function stressResult(item, branch) {
  const generated = branch === "Radix"
    ? generateRadixBranch({ ...item, kind: "chromatic" })
    : generateFamily({ ...item, kind: "chromatic", candidate: branch === "A" ? "shared" : "adaptive", hueDrift: branch === "B" });
  const gates = branch === "Radix" ? radixGateReport(generated) : gateReport(generated);
  const clamps = branch === "Radix" ? [] : [...generated.light, ...generated.dark].filter((step) => step.clamped);
  return {
    light9: generated.light[8].hex,
    light10: generated.light[9].hex,
    dark9: generated.dark[8].hex,
    dark10: generated.dark[9].hex,
    clampCount: branch === "Radix" ? null : clamps.length,
    worstChromaLoss: branch === "Radix" ? null : round(Math.max(0, ...clamps.map((step) => step.chromaLoss))),
    computedOnSolid: gates.onSolid.hex,
    computedOnSolidMinimum: round(gates.onSolid.minimum),
    computedOnSolidPass: gates.onSolid.pass,
    warnings: generated.warnings,
  };
}

const output = {
  provenance: {
    radixWebsiteCommit: "bb424082fd33fadc244a6dd276d3ced55caa6234",
    radixColors: "3.0.0",
    colorjs: "0.5.2",
    bezierEasing: "2.1.0",
  },
  selfConsistency: {
    inputs: selfBlue.generated.radix.inputs,
    light: { exactSteps: exact("light"), mean: round(selfBlue.light.mean), max: round(selfBlue.light.max), maxStep: selfBlue.light.maxStep },
    dark: { exactSteps: exact("dark"), mean: round(selfBlue.dark.mean), max: round(selfBlue.dark.max), maxStep: selfBlue.dark.maxStep },
    combined: compact(selfBlue),
  },
  familyTable: familyNames.map((name) => ({
    family: name,
    set: FAMILY_DATA[name].set,
    kind: FAMILY_DATA[name].kind,
    A: compact(validations.A[name]),
    B: compact(validations.B[name]),
    Radix: compact(validations.Radix[name]),
  })),
  aggregate: Object.fromEntries(Object.keys(branches).map((branch) => [branch, {
    fitted: aggregate(branch, "fitted"),
    heldOut: aggregate(branch, "held-out"),
  }])),
  contrast,
  backgrounds,
  failures: failureCases.map((item) => ({
    case: item.name,
    A: stressResult(item, "A"),
    B: stressResult(item, "B"),
    Radix: stressResult(item, "Radix"),
  })),
};

console.log(JSON.stringify(output, null, 2));
