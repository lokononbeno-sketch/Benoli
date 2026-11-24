# Migration du nouveau Bénoli Littéraire — audit de préparation

Branche de travail : `integration/nouveau-benoli-react`
Branche de production à préserver : `main`

## Décision d'intégration

Le ZIP `agon-agent_1-cb502f4b.zip` est une nouvelle interface React + TypeScript + Vite. Il ne contient pas de client Supabase ni d'authentification Supabase. Plusieurs données de démonstration (notamment communauté, favoris et XP) sont stockées localement ou codées en dur.

Le remplacement ne doit donc pas consister à copier le ZIP sur la racine de production sans adaptation.

## Éléments Benoli/Supabase à préserver

- `supabase-config.js` : configuration et durcissement du client Supabase, dont la protection de `reader_profiles`.
- `recuperation.js` : parcours de récupération du mot de passe.
- `profil.js` : lecture et mise à jour des profils publics/privés.
- Les tables, buckets, politiques RLS et données existantes du projet Supabase : aucune migration destructive ni suppression de données n'est autorisée dans cette intégration.
- Les liens de vente Chariow, les prix et les contenus éditoriaux déjà publiés doivent être comparés au catalogue du ZIP avant toute substitution.

## Éléments du ZIP à intégrer

- `src/App.tsx` et `src/main.tsx`
- `src/data/benoliData.ts` et `src/data/translations.ts`
- Les composants `src/components/*` : arbre d'accueil, navigation, catalogue, liseuse, musique, quiz, personnages, communauté, citations, récompenses, Salomé, aide et pied de page.
- Les médias de `public/covers/*`, `public/audio/*` et le portrait auteur.

## Points bloquants à traiter avant publication

1. Ajouter un service Supabase partagé pour l'authentification et la session, sans exposer de clé secrète côté client.
2. Remplacer les données de démonstration de la communauté et les XP/favoris locaux par des lectures/écritures Supabase uniquement après confirmation des schémas et politiques existants. Ne pas inventer de tables.
3. Supprimer les deux scripts d'instrumentation DesignArena présents dans le `index.html` du ZIP (`data-arena-recording` et `data-arena-views`).
4. Corriger les chemins des couvertures et des fichiers audio pour un déploiement GitHub Pages sous le sous-chemin `/Benoli/`.
5. Vérifier que les liens d'achat et les prix correspondent à la source éditoriale de production.
6. Mettre en place un cache hors connexion explicite pour l'application, les couvertures essentielles et les textes d'extraits. Les achats, l'authentification et la synchronisation restent dépendants d'Internet.
7. Optimiser les images sans remplacer les originaux éditoriaux. Garder les fichiers audio en téléchargement à la demande plutôt que les embarquer tous dans le cache initial.
8. Adapter le workflow Android : installer les dépendances React/Vite, construire `dist/`, copier le résultat dans Capacitor, puis construire l'APK. La compilation actuelle copie directement les fichiers statiques et ne construit pas React.

## Validation obligatoire

- Vérifier le build TypeScript/Vite.
- Tester les chemins de navigation et les fiches de romans.
- Tester la liseuse et les extraits hors connexion après un premier chargement.
- Tester l'authentification, la persistance de session et la récupération de mot de passe avec le projet Supabase existant.
- Vérifier les profils, les données privées et les règles RLS sans afficher le numéro WhatsApp dans le profil public.
- Vérifier que le mode hors connexion ne présente pas les actions serveur comme réussies lorsqu'elles n'ont pas été synchronisées.
- Construire et installer une APK de test avant toute fusion dans `main`.

## Règle de sécurité

Aucun fichier Supabase, table, bucket, compte, profil, contenu de roman ou règle de sécurité ne doit être supprimé ou remplacé dans le cadre de cette refonte. La fusion dans `main` ne se fera qu'après validation du build et des tests.

## Schéma Supabase de production vérifié (lecture seule)

Le projet Supabase actuellement référencé par `supabase-config.js` est actif et possède notamment les tables suivantes, toutes avec RLS activé :

- `reader_profiles` : pseudonyme et genre, lié à `auth.users`.
- `reader_private_profiles` : prénom, nom, WhatsApp, Facebook, résidence et chemin d'avatar.
- `community_admins` : droits d'administration de la communauté.
- `reader_stories` : récits publiés/soumis avec modération.
- `story_reactions` : réactions des lecteurs.
- `private_story_replies` : réponses privées aux récits.
- `private_conversations` et `private_messages` : conversations et messages privés, dont audio.
- `friend_requests` : demandes d'amitié.

Aucune modification de schéma n'a été faite. Les composants du ZIP qui affichent un faux fil communautaire ou des valeurs XP/favoris codées localement ne doivent pas être présentés comme synchronisés. Le raccordement doit utiliser les tables existantes uniquement si leurs colonnes et politiques RLS autorisent précisément l'opération.

## Compatibilité de déploiement

Le dépôt actuel est un site statique Capacitor : son workflow copie directement les fichiers racine vers `www/` et ne lance pas de build Vite. Le ZIP, lui, requiert un build React/Vite. Le workflow doit donc être réécrit et testé avant de basculer l'entrée de production. Le préfixe de déploiement GitHub Pages `/Benoli/` doit aussi être configuré pour Vite et Capacitor.

Le changelog récent de `supabase-js` (2.119.2, 19 novembre 2026) ne signale pas de changement bloquant pour l'authentification navigateur utilisée ici ; aucune mise à jour de schéma Supabase n'est requise pour préparer l'interface. 
