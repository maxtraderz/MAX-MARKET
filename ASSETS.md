# Asset integration and privacy

Keep original certificates outside this project, its Git repository, public assets, and build/deployment paths.

## Repeatable import
Requires Python 3.10+ and Pillow (`python -m pip install Pillow`).
```sh
python scripts/process_assets.py --source "ABSOLUTE_PRIVATE_ASSET_DIRECTORY"
```
The source must contain certificates (1).png through certificates (9).png and the supplied historical-report screenshot. The script refuses sources inside the project. It processes in memory, removes recipient pixels with opaque design-matched rectangles, creates fresh metadata-free RGB images, and writes only proof-01.webp through proof-09.webp to public/images/certificates. Existing covered areas remain covered. Public filenames, accessibility text, manifest, and source contain no recipient names.

The lossless Agent Jin report goes to public/images/performance/agent-jin-report.webp with its original dimensions and pixels. No manufactured chart is generated.

Masks are normalized coordinates and specific to these nine source images. For replacement sources, review and adjust the rectangles separately. Never reuse a mask without checking the replacement image.

After any reimport, inspect every output at full size and the ignored .local/redaction-review.jpg sheet. Verify no recipient pixels remain; check amounts, dates, categories, issuer branding and aspect ratios. Only then build or publish. The current nine outputs have been visually reviewed.

asset-manifest.json maps each generic source filename to its output, dimensions, normalized mask, and certificate SHA-256. It contains no original image data. Source originals and the reference video are not included in the repository.

The website uses the supplied buy and sell chart videos, not generated product artwork. Optimized clips preserve source aspect ratios and audio, use H.264/AAC with faststart, and have metadata stripped. Posters are taken directly from these clips. Run scripts/process-videos.ps1 to recreate them. No reference-site media is published.
