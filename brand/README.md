# Algorythmos brand kit

Everything here is generated from one file, [`source/master.svg`](source/master.svg).
Do not edit exports by hand: change the master, then run `npm run brand:build`.

## The logo

The mark is the original Algorythmos "a" with the dot that turns it into "ai". It was redrawn
in October 2026 as clean vector curves from the 2025 artwork: the outline, dot, notch and stem
are unchanged; the counter (the hole) is smaller, so the letter is heavier. The wordmark is
`algorythmos` in lowercase Inter ExtraBold, converted to outlines.

Lowercase is the logo's styling only. In running text the name is "Algorythmos", and the
legal name is "ALGORYTHMOS PTY LTD.".

## Which file to use

| Need | Folder | Notes |
|---|---|---|
| Logo with name, wide spaces (headers, email signatures, banners) | `logo/horizontal/` | First choice |
| Logo with name, square or tall spaces (posters, covers, slides) | `logo/stacked/` | |
| Symbol alone (avatars, app icons, favicons, watermarks) | `logo/mark/` | |
| Name alone | `logo/wordmark/` | Only where the mark already appears nearby |
| App and browser icons | `icon/` | White mark on the brand gradient |
| Profile pictures, channel banners, link-share card | `social/` | Sized per platform, in the file name |
| Advert backgrounds with the logo placed | `ads/` | Gradient, dark and light |
| Printers and sign-writers | `print/` (PDF) or any `.svg` | Vector; scales to any size |

File names: `algorythmos-<lockup>-<colour>[-<size>].<ext>`. Sizes are pixels (height for the
mark, width for the others). Use SVG wherever it is accepted; use PNG otherwise.

## Colour versions

| Name | Use on |
|---|---|
| `color` | White or very light backgrounds. Indigo with the gradient dot. **Primary.** |
| `indigo` | Light backgrounds where a gradient cannot be reproduced (embroidery, single-ink print) |
| `white` | The brand gradient, indigo, dark backgrounds and photographs |
| `black` | One-colour print, fax, stamps, engraving |

On dark backgrounds always use `white`: indigo on near-black is too low in contrast.

## Colours

| | Hex | RGB |
|---|---|---|
| Indigo (logo) | `#3715E0` | 55, 21, 224 |
| Violet (gradient end) | `#6D00FF` | 109, 0, 255 |
| Dot gradient | `#4315E4` → `#6D1DF5` | bottom-left to top-right |
| Background gradient | `#3715E0` → `#6D00FF` | bottom-left to top-right |
| Ink | `#08080C` | 8, 8, 12 |
| Paper | `#FFFFFF` | 255, 255, 255 |

Print: the violet is outside the CMYK range and will look duller in four-colour print. For
offset or screen printing use the `indigo` or `black` version and agree a spot colour with
the printer against a proof.

## Rules

- **Clear space:** keep an empty margin of one dot diameter on every side.
- **Minimum size:** mark 16 px (5 mm in print); horizontal logo 96 px wide (25 mm).
- **Below 32 px** use the files in `icon/`; they use a cut drawn for small sizes.
- Do not recolour, stretch, rotate, outline, add shadows or effects, or rebuild the logo in
  another typeface.
- Do not place the `color` or `indigo` version on dark, saturated or busy backgrounds.
- Do not use the old spaced-capitals "A L G O R Y T H M O S" artwork; it is in `archive/2025/`
  for reference only.

## Rebuilding

```bash
npm run brand:build              # regenerate brand/
npm run brand:build -- --site    # also regenerate the website's logo files in public/
npm run brand:check              # verify committed files still match the master (runs in CI)
```

The build renders into a temporary folder, checks every file (size, format, not blank) and only
then copies the results into place, so a failed build leaves the existing files untouched.
`source/manifest.json` lists every generated file. Tests are in `source/brand.test.mjs`.

## Construction (for reference)

Master units are 10 per pixel of the original 218 × 258 artwork: mark 2180 × 2580, dot radius
315, notch radius 487.5, stem 640 wide. The counter is reduced by 70 units per side from the
original. Wordmark: Inter ExtraBold (SIL Open Font License), tracking −0.022 em, with manual
kerning on the `r y`, `y t`, `o r` and `t h` pairs.

`archive/2025/` holds the previous logo files exactly as they were on the website.
