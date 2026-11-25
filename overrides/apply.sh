#!/usr/bin/env bash
# Appelé par le workflow, dans le dossier du projet React :
# 1) branche Supabase (connexion des lecteurs)  2) rend l'application installable (PWA)
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="${GITHUB_WORKSPACE:-$HERE/..}"

cp -r "$HERE/src/." src/
npm install @supabase/supabase-js --no-audit --no-fund

# --- Installation sur téléphone : manifeste, service worker, icônes ---
mkdir -p public
cp "$HERE/public/manifest.json" "$HERE/public/app-sw.js" public/
for item in icon-192:192 icon-512:512 maskable-512:512; do
  n="${item%%:*}"; s="${item##*:}"
  if [ -f "$ROOT/$n.png" ]; then
    if command -v convert >/dev/null 2>&1; then
      convert "$ROOT/$n.png" -resize "${s}x${s}" -background none -gravity center -extent "${s}x${s}" "public/$n.png"
    else
      cp "$ROOT/$n.png" "public/$n.png"
    fi
  fi
done

python3 - <<'PY'
p = 'src/main.tsx'
s = open(p, encoding='utf-8').read()
if 'AuthButton' not in s:
    s = s.replace("import App from './App.tsx'", "import App from './App.tsx'\nimport AuthButton from './components/AuthButton.tsx'")
    s = s.replace("<App />", "<App />\n    <AuthButton />")
    open(p, 'w', encoding='utf-8').write(s)

p = 'index.html'
s = open(p, encoding='utf-8').read()
if 'manifest.json' not in s:
    s = s.replace('</head>', '    <link rel="manifest" href="./manifest.json" />\n    <link rel="apple-touch-icon" href="./icon-192.png" />\n    <meta name="mobile-web-app-capable" content="yes" />\n  </head>', 1)
    s = s.replace('</body>', "    <script>if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('./app-sw.js').catch(function(){});});}</script>\n  </body>", 1)
    open(p, 'w', encoding='utf-8').write(s)
PY
