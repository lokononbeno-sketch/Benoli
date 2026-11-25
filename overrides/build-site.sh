#!/usr/bin/env bash
# Lancé depuis la racine du dépôt : décompresse le zip, applique les corrections,
# branche Supabase + installation (apply.sh), construit le site et l'assemble dans _site/
set -e
ROOT="$(pwd)"
rm -rf /tmp/proj _site
mkdir -p /tmp/proj
unzip -q agon-agent_1-cb502f4b.zip -d /tmp/proj
PROJ="$(find /tmp/proj -maxdepth 2 -name package.json -not -path '*/node_modules/*' | head -1 | xargs dirname)"

cd "$PROJ"
python3 - <<'PY'
import re, glob
m = {
  "/covers/checo.png": "./Ch%C3%A9co.png",
  "/covers/cobi.png": "./Cobi.png",
  "/covers/je-ne-suis-pas.png": "./Je-ne-suis-pas-ce-qu'ils-ont-fait-de-moi.png",
  "/covers/ce-que-tu-mas-coute.jpg": "./Ce-que-tu-m'as-co%C3%BBt%C3%A9.jpg",
  "/covers/elle-choisit-mal.jpg": "./Elle-choisi-mal-mais-c'est-ta-faute.jpg",
  "/covers/la-maison-den-face-1.png": "./La-maison-d'en-face.png",
  "/covers/fridaous.jpg": "./Le-coeur-de-Fridaous.jpg",
  "/covers/trop-tard.webp": "./J-ai-appris-a-t-aimer-trop-tard.webp",
  "/audio/maison-t1.mp3": "./audio/Screenrecorder-2026-10-26-19-29-27-868_20261026_193345.mp3",
  "/audio/checo.mp3": "./audio/Screenrecorder-2026-10-26-19-49-56-813_20261026_195322.mp3",
  "/audio/je-ne-suis-pas.mp3": "./audio/Screenrecorder-2026-10-26-20-02-25-196_20261026_200549.mp3",
  "/audio/maison-t2.mp3": "./audio/Screenrecorder-2026-10-26-20-07-55-169_20261026_201002.mp3",
  "/audio/maison-t3.mp3": "./audio/Screenrecorder-2026-10-26-20-20-27-633_20261026_202339.mp3",
  '"/auteur.jpg"': '"./auteur.jpg"',
}
for f in glob.glob('src/**/*.ts*', recursive=True):
    s = open(f, encoding='utf-8').read(); o = s
    for k, v in m.items():
        s = s.replace(k, v)
    if s != o:
        open(f, 'w', encoding='utf-8').write(s)
s = open('index.html', encoding='utf-8').read()
s = re.sub(r'<script data-arena-[a-z]+="true">.*?</script>', '', s, flags=re.S)
s = s.replace('href="/favicon.svg"', 'href="./favicon.svg"')
open('index.html', 'w', encoding='utf-8').write(s)
PY
bash "$ROOT/overrides/apply.sh"
npx vite build --base=./

cd "$ROOT"
mkdir -p _site
cp -r "$PROJ/dist/." _site/
find . -maxdepth 1 -type f \( -name '*.png' -o -name '*.jpg' -o -name '*.webp' \) \
  ! -name 'icon-*' ! -name 'maskable-*' -exec cp {} _site/ \;
mkdir -p _site/audio && cp audio/*.mp3 _site/audio/
touch _site/.nojekyll
