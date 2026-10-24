param([Parameter(Mandatory=$true)][string]$SourceDirectory)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$videoDestination = Join-Path $projectRoot 'public/videos'
$posterDestination = Join-Path $projectRoot 'public/images/demos'
New-Item -ItemType Directory -Force -Path $videoDestination,$posterDestination | Out-Null
foreach ($side in @('buy','sell')) {
  $sourceVideo = Join-Path $SourceDirectory "$side video_prob3.mp4"
  if (-not (Test-Path -LiteralPath $sourceVideo)) { throw "Missing source: $sourceVideo" }
  $outputVideo = Join-Path $videoDestination "$side-demo.mp4"
  $outputPoster = Join-Path $posterDestination "$side-poster.jpg"
  & ffmpeg -y -hide_banner -loglevel error -i $sourceVideo -map_metadata -1 -vf 'scale=1440:-2' -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart $outputVideo
  if ($LASTEXITCODE -ne 0) { throw "Video conversion failed: $side" }
  $posterTime = if ($side -eq 'buy') { '5' } else { '7' }
  & ffmpeg -y -hide_banner -loglevel error -ss $posterTime -i $outputVideo -frames:v 1 -q:v 2 $outputPoster
  if ($LASTEXITCODE -ne 0) { throw "Poster conversion failed: $side" }
  $outputGif = Join-Path $posterDestination "$side-demo.gif"
  $gifTrimArgs = if ($side -eq 'sell') { @('-t', '9') } else { @() }
  & ffmpeg -y -hide_banner -loglevel error @gifTrimArgs -i $outputVideo -vf 'fps=15,scale=1080:-2:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=sierra2_4a' -loop 0 $outputGif
  if ($LASTEXITCODE -ne 0) { throw "GIF conversion failed: $side" }
}
Write-Output 'Processed both supplied demonstration clips, looping GIFs and posters.'
