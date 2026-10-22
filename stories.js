
/* ==================================================
   STORIES LOCALES — BENOLI LITTÉRAIRE
   Stockage sur l'appareil utilisé, sans serveur.
   Expiration automatique après 24 heures.
   ================================================== */
(function () {
  "use strict";

  const CLE = "benoli_stories_locales_v1";
  const DUREE = 24 * 60 * 60 * 1000;
  const EMOJIS = ["❤️", "😍", "😂", "👏", "🔥"];

  const $ = id => document.getElementById(id);
  const liste = $("storiesListe");
  const formulaire = $("storyFormulaire");
  const fenetre = $("storyFenetre");

  if (!liste || !formulaire || !fenetre) return;

  let stories = [];
  let storyActive = null;
  let photoPreparee = "";

  function charger() {
    try {
      stories = JSON.parse(localStorage.getItem(CLE) || "[]");
      if (!Array.isArray(stories)) stories = [];
    } catch (_) {
      stories = [];
    }

    const maintenant = Date.now();
    stories = stories.filter(s =>
      s && s.date && maintenant - s.date < DUREE
    );

    sauvegarder();
  }

  function sauvegarder() {
    try {
      localStorage.setItem(CLE, JSON.stringify(stories));
    } catch (_) {
      alert("Le stockage est plein. Essaie une photo plus petite.");
    }
  }

  function tempsRestant(date) {
    const restant = Math.max(0, DUREE - (Date.now() - date));
    const heures = Math.floor(restant / 3600000);
    const minutes = Math.floor((restant % 3600000) / 60000);
    return heures ? heures + " h restantes" : minutes + " min restantes";
  }

  function creerBouton(texte, action) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = texte;
    b.addEventListener("click", action);
    return b;
  }

  function afficherListe() {
    liste.replaceChildren();

    if (!stories.length) {
      const message = document.createElement("p");
      message.textContent = "Aucune story pour le moment. Ajoute la première !";
      message.style.color = "var(--doux)";
      liste.appendChild(message);
      return;
    }

    stories.slice().reverse().forEach(story => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "story-bulle";
      b.setAttribute("aria-label", "Lire la story de " + story.auteur);

      const cercle = document.createElement("span");
      cercle.className = "story-cercle";

      if (story.photo) {
        const img = document.createElement("img");
        img.src = story.photo;
        img.alt = "";
        cercle.appendChild(img);
      } else {
        cercle.textContent = "✨";
      }

      const nom = document.createElement("span");
      nom.textContent = story.auteur || "Benoli";

      b.append(cercle, nom);
      b.addEventListener("click", () => ouvrirStory(story.id));
      liste.appendChild(b);
    });
  }

  function ouvrirStory(id) {
    storyActive = stories.find(s => s.id === id);
    if (!storyActive) return;

    $("storyAuteur").textContent = storyActive.auteur || "Benoli";
    $("storyTemps").textContent = tempsRestant(storyActive.date);

    const contenu = $("storyContenu");
    contenu.replaceChildren();

    if (storyActive.photo) {
      const img = document.createElement("img");
      img.src = storyActive.photo;
      img.alt = "Photo de la story";
      contenu.appendChild(img);
    }

    if (storyActive.texte) {
      const p = document.createElement("p");
      p.textContent = storyActive.texte;
      p.style.marginTop = "12px";
      contenu.appendChild(p);
    }

    const reactions = $("storyReactions");
    reactions.replaceChildren();

    EMOJIS.forEach(emoji => {
      const nombre = (storyActive.reactions || {})[emoji] || 0;
      reactions.appendChild(creerBouton(
        emoji + " " + nombre,
        () => reagir(storyActive.id, emoji)
      ));
    });

    reactions.appendChild(creerBouton("🗑️ Supprimer", () => {
      if (!confirm("Supprimer cette story de cet appareil ?")) return;
      stories = stories.filter(s => s.id !== storyActive.id);
      sauvegarder();
      fermerStory();
      afficherListe();
    }));

    fenetre.classList.add("ouverte");
  }

  function reagir(id, emoji) {
    const story = stories.find(s => s.id === id);
    if (!story) return;

    if (!story.reactions) story.reactions = {};
    story.reactions[emoji] = (story.reactions[emoji] || 0) + 1;

    sauvegarder();
    ouvrirStory(id);
  }

  function fermerStory() {
    fenetre.classList.remove("ouverte");
    storyActive = null;
  }

  function ouvrirFormulaire() {
    $("storyTexte").value = "";
    $("storyPhoto").value = "";
    photoPreparee = "";
    formulaire.classList.add("ouverte");
  }

  function fermerFormulaire() {
    formulaire.classList.remove("ouverte");
    photoPreparee = "";
  }

  /* Réduit les photos pour limiter l'espace utilisé. */
  $("storyPhoto").addEventListener("change", function () {
    const fichier = this.files && this.files[0];
    photoPreparee = "";

    if (!fichier) return;

    if (!fichier.type.startsWith("image/")) {
      alert("Choisis un fichier image.");
      this.value = "";
      return;
    }

    if (fichier.size > 12 * 1024 * 1024) {
      alert("Cette image est trop lourde. Choisis une image de moins de 12 Mo.");
      this.value = "";
      return;
    }

    const lecteur = new FileReader();

    lecteur.onload = function () {
      const img = new Image();

      img.onload = function () {
        const max = 1000;
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");

        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        photoPreparee = canvas.toDataURL("image/jpeg", 0.78);
      };

      img.onerror = function () {
        alert("Impossible de lire cette image.");
      };

      img.src = lecteur.result;
    };

    lecteur.readAsDataURL(fichier);
  });

  $("storyAjouter").addEventListener("click", ouvrirFormulaire);
  $("storyAnnuler").addEventListener("click", fermerFormulaire);
  $("storyFermer").addEventListener("click", fermerStory);

  $("storyPublier").addEventListener("click", function () {
    const texte = $("storyTexte").value.trim();

    if (!texte && !photoPreparee) {
      alert("Ajoute une photo ou écris un message avant de publier.");
      return;
    }

    const story = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      auteur: "Benoli",
      texte: texte,
      photo: photoPreparee,
      date: Date.now(),
      reactions: {}
    };

    stories.push(story);

    try {
      localStorage.setItem(CLE, JSON.stringify(stories));
    } catch (_) {
      stories.pop();
      alert("Espace de stockage insuffisant. Essaie une photo plus petite.");
      return;
    }

    fermerFormulaire();
    afficherListe();
    ouvrirStory(story.id);
  });

  /* Nettoie les stories expirées quand l'application est ouverte. */
  charger();
  afficherListe();

  setInterval(function () {
    const avant = stories.length;
    charger();
    if (stories.length !== avant) afficherListe();

    if (storyActive && !stories.some(s => s.id === storyActive.id)) {
      fermerStory();
    }
  }, 60000);
})();
 
