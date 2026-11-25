#!/usr/bin/env bash
# Appelé par le workflow, dans le dossier du projet React : branche Supabase (connexion des lecteurs).
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
cp -r "$HERE/src/." src/
npm install @supabase/supabase-js --no-audit --no-fund
python3 - <<'PY'
p = 'src/main.tsx'
s = open(p, encoding='utf-8').read()
if 'AuthButton' not in s:
    s = s.replace("import App from './App.tsx'", "import App from './App.tsx'\nimport AuthButton from './components/AuthButton.tsx'")
    s = s.replace("<App />", "<App />\n    <AuthButton />")
    open(p, 'w', encoding='utf-8').write(s)
PY
