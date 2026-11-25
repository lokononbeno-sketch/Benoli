import { useEffect, useState } from 'react';
import { createClient, type Session } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fjeqhqlmjagrknupgvyu.supabase.co',
  'sb_publishable_gisDyt1z22eLMUwmK2Dvxg_azkS7Pte'
);

const SITE = 'https://lokononbeno-sketch.github.io/Benoli/';

type Mode = 'login' | 'signup' | 'forgot' | 'newpass';

export default function AuthButton() {
  const [session, setSession] = useState<Session | null>(null);
  const [pseudo, setPseudo] = useState('');
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudonym, setPseudonym] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Profil lecteur : on le lit, et on le crée s'il n'existe pas encore
  async function chargerProfil(s: Session | null) {
    if (!s) { setPseudo(''); return; }
    const { data } = await supabase
      .from('reader_profiles').select('pseudonym').eq('id', s.user.id).maybeSingle();
    if (data?.pseudonym) { setPseudo(data.pseudonym); return; }
    const voulu = String(s.user.user_metadata?.pseudonym || '').trim();
    if (voulu.length >= 2) {
      const { error } = await supabase
        .from('reader_profiles').insert({ id: s.user.id, pseudonym: voulu });
      if (!error) setPseudo(voulu);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      chargerProfil(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY') { setMode('newpass'); setOpen(true); }
      setTimeout(() => chargerProfil(s), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  function fermer() { setOpen(false); setMsg(null); setPassword(''); }

  async function envoyer(e: React.MouseEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        fermer();
      } else if (mode === 'signup') {
        if (pseudonym.trim().length < 2) throw new Error('Choisis un pseudonyme (2 caractères minimum).');
        if (password.length < 6) throw new Error('Le mot de passe doit avoir au moins 6 caractères.');
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { pseudonym: pseudonym.trim() }, emailRedirectTo: SITE },
        });
        if (error) throw error;
        if (data.session) fermer();
        else setMsg({ type: 'ok', text: 'Compte créé ! Ouvre le message envoyé à ton e-mail et clique sur le lien pour confirmer, puis connecte-toi.' });
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: SITE,
        });
        if (error) throw error;
        setMsg({ type: 'ok', text: 'Si cet e-mail existe, un lien pour changer ton mot de passe vient d’être envoyé.' });
      } else if (mode === 'newpass') {
        if (password.length < 6) throw new Error('Le mot de passe doit avoir au moins 6 caractères.');
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMsg({ type: 'ok', text: 'Mot de passe changé. Tu es connecté.' });
        setPassword('');
      }
    } catch (err) {
      const m = err instanceof Error ? err.message : 'Erreur inconnue';
      setMsg({
        type: 'err',
        text: /Invalid login/i.test(m) ? 'E-mail ou mot de passe incorrect.'
          : /already registered/i.test(m) ? 'Cet e-mail a déjà un compte. Connecte-toi.'
          : /Email not confirmed/i.test(m) ? 'Confirme d’abord ton e-mail (lien reçu dans ta boîte).'
          : m,
      });
    } finally {
      setBusy(false);
    }
  }

  async function deconnexion() {
    await supabase.auth.signOut();
    setSession(null);
    setPseudo('');
    fermer();
  }

  const champ = 'w-full rounded-xl bg-slate-950/70 border border-amber-500/20 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400';
  const titre = { login: 'Connexion', signup: 'Créer un compte', forgot: 'Mot de passe oublié', newpass: 'Nouveau mot de passe' }[mode];

  return (
    <>
      <button
        onClick={() => { setMode('login'); setOpen(true); }}
        className="fixed left-4 bottom-4 z-50 rounded-full bg-slate-900/90 backdrop-blur border border-amber-500/40 text-amber-200 text-sm font-semibold px-4 py-2.5 shadow-lg hover:bg-slate-800"
      >
        {session ? `👤 ${pseudo || 'Mon compte'}` : '🔐 Se connecter'}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" onClick={fermer}>
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-amber-500/30 p-5 text-slate-100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-amber-300">{session && mode !== 'newpass' ? 'Mon compte' : titre}</h2>
              <button onClick={fermer} className="text-slate-400 hover:text-white text-xl leading-none" aria-label="Fermer">✕</button>
            </div>

            {session && mode !== 'newpass' ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">Connecté en tant que <b className="text-amber-200">{pseudo || session.user.email}</b></p>
                <p className="text-xs text-slate-500">{session.user.email}</p>
                <button onClick={deconnexion} className="w-full rounded-xl bg-amber-500 text-slate-950 font-bold py-2.5">Se déconnecter</button>
              </div>
            ) : (
              <div className="space-y-3">
                {mode === 'signup' && (
                  <input className={champ} placeholder="Pseudonyme" value={pseudonym} onChange={(e) => setPseudonym(e.target.value)} maxLength={40} />
                )}
                {mode !== 'newpass' && (
                  <input className={champ} type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                )}
                {mode !== 'forgot' && (
                  <input className={champ} type="password" placeholder={mode === 'newpass' ? 'Nouveau mot de passe' : 'Mot de passe'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                )}
                {msg && (
                  <p className={`text-sm rounded-lg px-3 py-2 ${msg.type === 'ok' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}>{msg.text}</p>
                )}
                <button onClick={envoyer} disabled={busy} className="w-full rounded-xl bg-amber-500 text-slate-950 font-bold py-2.5 disabled:opacity-60">
                  {busy ? '…' : mode === 'login' ? 'Se connecter' : mode === 'signup' ? 'Créer mon compte' : mode === 'forgot' ? 'Envoyer le lien' : 'Enregistrer'}
                </button>
                {mode === 'login' && (
                  <div className="flex justify-between text-xs text-amber-200/80 pt-1">
                    <button onClick={() => { setMode('signup'); setMsg(null); }}>Créer un compte</button>
                    <button onClick={() => { setMode('forgot'); setMsg(null); }}>Mot de passe oublié ?</button>
                  </div>
                )}
                {(mode === 'signup' || mode === 'forgot') && (
                  <button onClick={() => { setMode('login'); setMsg(null); }} className="text-xs text-amber-200/80">← Retour à la connexion</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
