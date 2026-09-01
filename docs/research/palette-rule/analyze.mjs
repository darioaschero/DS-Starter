import {
  CANDIDATES,
  FAMILY_DATA,
  PROFILE_ANCHORS,
  PROFILES,
  average,
  contrastRatio,
  familyCurveTable,
  gateReport,
  generateFromGroundTruth,
  hexToOklch,
  validateFamily,
} from "./palette-engine.mjs";

const round = (value, digits = 4) => Number(value.toFixed(digits));
const circularDelta = (from, to) => ((to - from + 540) % 360) - 180;
const names = Object.keys(FAMILY_DATA);
const fittedChromatic = names.filter((name) => FAMILY_DATA[name].set === "fitted" && FAMILY_DATA[name].kind === "chromatic");
const fittedNeutral = names.filter((name) => FAMILY_DATA[name].set === "fitted" && FAMILY_DATA[name].kind === "neutral");

function rangesByStep(families, scheme, getter) {
  return Array.from({ length: 12 }, (_, index) => {
    const values = families.map((name) => getter(familyCurveTable(name, scheme), index));
    return { mean: average(values), min: Math.min(...values), max: Math.max(...values), range: Math.max(...values) - Math.min(...values) };
  });
}

function normalizedLightness(ramp, scheme, index) {
  const seedL = ramp[8].L;
  if (scheme === "light") return index <= 8 ? (1 - ramp[index].L) / (1 - seedL) : ramp[index].L / seedL;
  return index <= 8 ? ramp[index].L / seedL : (ramp[index].L - seedL) / (1 - seedL);
}

function familyMetrics(name, candidate, hueDrift) {
  const validation = validateFamily(name, candidate, hueDrift);
  const generated = validation.generated;
  const neutralName = FAMILY_DATA[name].kind === "neutral" ? name : FAMILY_DATA[name].neutral;
  const neutral = generateFromGroundTruth(neutralName, candidate, hueDrift);
  const gates = gateReport(generated, neutral);
  const neutralFamily = FAMILY_DATA[name].kind === "neutral";
  return {
    family: name,
    set: FAMILY_DATA[name].set,
    lightMean: round(validation.light.mean),
    lightMax: round(validation.light.max),
    darkMean: round(validation.dark.mean),
    darkMax: round(validation.dark.max),
    combinedMean: round(validation.mean),
    combinedMax: round(validation.max),
    onSolid: neutralFamily ? "n/a" : `${gates.onSolid.hex} ${gates.onSolid.minimum.toFixed(2)}${gates.onSolid.pass ? " pass" : " FAIL"}`,
    link: neutralFamily ? "n/a" : `${gates.link.step} ${gates.link.minimum.toFixed(2)}${gates.link.pass ? " pass" : " FAIL"}`,
    focus: neutralFamily ? "n/a" : `${gates.focus.step} ${gates.focus.minimum.toFixed(2)}${gates.focus.pass ? " pass" : " FAIL"}`,
    clamps: [...generated.light, ...generated.dark].filter((step) => step.clamped).length,
  };
}

function markdownTable(rows) {
  const columns = Object.keys(rows[0]);
  const header = `| ${columns.join(" | ")} |`;
  const divider = `|${columns.map(() => "---").join("|")}|`;
  return [header, divider, ...rows.map((row) => `| ${columns.map((column) => row[column]).join(" | ")} |`)].join("\n");
}

const output = {
  generatedAt: new Date().toISOString(),
  anchors: Object.fromEntries(Object.entries(PROFILE_ANCHORS).map(([kind, anchors]) => [kind, anchors.map(({ label, families, hue }) => ({ label, families, hue: round(hue, 2) }))])),
  profiles: Object.fromEntries(Object.entries(PROFILES).map(([kind, schemes]) => [kind, Object.fromEntries(Object.entries(schemes).map(([scheme, axes]) => [scheme, Object.fromEntries(Object.entries(axes).map(([axis, values]) => [axis, values.map((value) => round(value, axis === "hue" ? 2 : 4))]))]))])),
  curveRanges: {},
  hueDrift: {},
  peaks: {},
  mirror: {},
  validation: {},
};

for (const scheme of ["light", "dark"]) {
  output.curveRanges[scheme] = {
    rawLightness: rangesByStep(fittedChromatic, scheme, (ramp, index) => ramp[index].L).map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, round(value)]))),
    normalizedLightness: rangesByStep(fittedChromatic, scheme, (ramp, index) => normalizedLightness(ramp, scheme, index)).map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, round(value)]))),
    chromaRatio: rangesByStep(fittedChromatic, scheme, (ramp, index) => ramp[index].C / ramp[8].C).map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, round(value)]))),
  };
}

for (const name of [...fittedChromatic, ...fittedNeutral]) {
  output.hueDrift[name] = {};
  output.peaks[name] = {};
  for (const scheme of ["light", "dark"]) {
    const ramp = familyCurveTable(name, scheme);
    const seedHue = ramp[8].h;
    const visible = ramp.map((step, index) => ({ index, C: step.C, drift: circularDelta(seedHue, step.h) })).filter((step) => step.C >= 0.02);
    output.hueDrift[name][scheme] = {
      maxVisible: visible.length ? round(Math.max(...visible.map((step) => Math.abs(step.drift))), 1) : null,
      step11: round(circularDelta(seedHue, ramp[10].h), 1),
      step12: round(circularDelta(seedHue, ramp[11].h), 1),
    };
    const maxC = Math.max(...ramp.map((step) => step.C));
    output.peaks[name][scheme] = { step: ramp.findIndex((step) => step.C === maxC) + 1, C: round(maxC), ratioTo9: round(maxC / ramp[8].C) };
  }
}

for (const name of fittedChromatic) {
  const light = familyCurveTable(name, "light");
  const dark = familyCurveTable(name, "dark");
  const residuals = light.map((step, index) => Math.abs(dark[index].L - (1 - step.L)));
  output.mirror[name] = { meanAbsoluteResidual: round(average(residuals)), maxAbsoluteResidual: round(Math.max(...residuals)), step9Residual: round(residuals[8]) };
}

for (const candidate of Object.keys(CANDIDATES)) {
  for (const hueDrift of [false, true]) {
    output.validation[`${candidate}-${hueDrift ? "drift" : "locked"}`] = names.map((name) => familyMetrics(name, candidate, hueDrift));
  }
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(output, null, 2));
} else {
  console.log("CHROMATIC SHARED PROFILE");
  for (const scheme of ["light", "dark"]) {
    console.log(`\n${scheme.toUpperCase()}`);
    console.log(markdownTable(PROFILES.chromatic[scheme].absoluteLightness.map((lightness, index) => ({
      step: index + 1,
      L_table: index === 8 ? "seed" : index === 9 ? (scheme === "light" ? "seed×0.9630" : "seed+(1−seed)×0.1314") : lightness.toFixed(4),
      C_ratio: PROFILES.chromatic[scheme].chroma[index].toFixed(4),
      hue_offset: `${PROFILES.chromatic[scheme].hue[index].toFixed(1)}°`,
    }))));
  }
  for (const [configuration, rows] of Object.entries(output.validation)) {
    console.log(`\nVALIDATION ${configuration}`);
    console.log(markdownTable(rows));
  }
  console.log("\nMIRROR RESIDUALS");
  console.log(markdownTable(Object.entries(output.mirror).map(([family, values]) => ({ family, ...values }))));
  console.log("\nHUE DRIFT");
  console.log(markdownTable(Object.entries(output.hueDrift).flatMap(([family, schemes]) => Object.entries(schemes).map(([scheme, values]) => ({ family, scheme, ...values })))));
  console.log("\nCHROMA PEAKS");
  console.log(markdownTable(Object.entries(output.peaks).flatMap(([family, schemes]) => Object.entries(schemes).map(([scheme, values]) => ({ family, scheme, ...values })))));
}
