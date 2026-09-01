# T16 vendored Radix generator sources

Fetched on 2026-09-01 for the offline T16 research specimen. All files are MIT licensed. Each source and license file carries its own provenance header; the hashes below cover the upstream bytes before those headers were added.

| Local file | Upstream source | Revision | Upstream SHA-256 |
|---|---|---|---|
| `radix-ui-website/generate-radix-colors.tsx` | `radix-ui/website/components/generate-radix-colors.tsx` | `bb424082fd33fadc244a6dd276d3ced55caa6234` | `12cca4466d89f6383ca8189b4417ee627b0567a086f7d77aeb9c46df74e56adf` |
| `npm/radix-ui-colors/index.mjs` | npm `@radix-ui/colors@3.0.0/index.mjs` | published gitHead `c4d0e50006c71ec51c4d6ff349062ab261b57e67` | `35560544c86ca2c2fa79e5fdfba40d18312e11e21fd81d52af524b94c117294d` |
| `npm/colorjs.io/color.js` | npm `colorjs.io@0.5.2/dist/color.js` | published gitHead `c3dce07d4d3f3163182c24b2ceed99096b9c4d5a` | `995bc908408c42ee5f633aacd13c0672761174a16dd271f208e7a1a7b1ec08c9` |
| `npm/bezier-easing/bezier-easing.js` | npm `bezier-easing@2.1.0/dist/bezier-easing.js` | tag `v2.1.0`, commit `b9f7a8b623c00ecdbf304c2d542adfa9e5c63872` | `abfb33395d9ec3b49f9f7ee4eff66ac56b957e1cb284b8f3c6a076dfa0fd3bbb` |

The runnable `../radix-generator.bundle.mjs` was produced from these exact versions with:

```sh
esbuild generate-radix-colors.tsx \
  --bundle --format=esm --platform=browser --target=es2022 \
  --outfile=radix-generator.bundle.mjs
```

The generated unheaded bundle SHA-256 is `7514cc35d6b5bc477cf8e24d6e70f7233a738fdff94f60e848e8831b727c239b`. The bundle is checked in only to make the static specimen run with no package install and no runtime network access; it does not replace the readable, attributed upstream sources in this directory.
