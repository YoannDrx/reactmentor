const fr = {
  metadata: {
    title: "React Mentor",
    description:
      "Le cockpit d'entraînement pour préparer les entretiens React, React Native et TypeScript avec un dashboard premium et des explications profondes.",
  },
  common: {
    language: "Langue",
    brandTagline: "Système d'entraînement aux entretiens",
    locales: {
      fr: "FR",
      en: "EN",
    },
    a11y: {
      toggleSidebar: "Basculer la sidebar",
      closeSidebar: "Fermer la sidebar",
      closeMobileSidebar: "Fermer la sidebar mobile",
      openSidebar: "Ouvrir la sidebar",
    },
    levels: {
      junior: "Junior",
      mid: "Intermédiaire",
      senior: "Senior",
    },
    actions: {
      logIn: "Connexion",
      startTraining: "Commencer",
      seeProduct: "Voir le produit",
      createWorkspace: "Créer mon espace",
      openReviewQueue: "Ouvrir la file de révision",
      alreadyHaveAccount: "J’ai déjà un compte",
    },
    days: {
      mon: "Lun",
      tue: "Mar",
      wed: "Mer",
      thu: "Jeu",
      fri: "Ven",
      sat: "Sam",
      sun: "Dim",
    },
  },
  landing: {
    nav: {
      tracks: "Parcours",
      product: "Produit",
      pricing: "Tarifs",
    },
    hero: {
      badge:
        "Une plateforme d'entraînement pensée pour les profils React qui veulent de la profondeur, pas du trivia.",
      titleLead: "Arrête de deviner en entretien.",
      titleAccent: "Construis des réponses React que tu peux défendre.",
      description:
        "React Mentor transforme tes lacunes en plan de progression : modules ciblés, feedback argumenté, révisions intelligentes et cockpit de préparation.",
      stats: [
        {
          value: "240+",
          label: "questions argumentées",
          detail: "avec réfutation des distracteurs",
        },
        {
          value: "18",
          label: "skills cartographiés",
          detail: "React, RN, TS et architecture",
        },
        {
          value: "3 modes",
          label: "practice, review, mock",
          detail: "pour entraîner reconnaissance et restitution",
        },
      ],
      dashboardLabel: "Dashboard React Mentor",
      dashboardSubLabel: "Préparation React Mid · 81/100",
      nextReview: "prochaine révision dans 42 min",
      weaknessTitle: "Radar des fragilités",
      weaknessDescription:
        "Les effects et le testing manquent encore de stabilité.",
      sessionPulseTitle: "Pulse de session",
      sessionPulseRange: "tendance 7j",
      misconceptionTitle: "Confusion dominante",
      misconceptionPriority: "priorité",
      misconceptionPrompt:
        "« Mettre un tableau dans les deps suffit à stabiliser un effet. »",
      misconceptionExplanation:
        "React compare les références, pas le contenu. Sans stabilité d'identité, l'effet repart.",
    },
    product: {
      principleBadge: "Principe produit",
      principleTitle: "Une boucle, trois mouvements.",
      principleDescription:
        "React Mentor est pensé comme un système d'apprentissage, pas comme une banque de questions.",
      loops: [
        {
          title: "Practice",
          description:
            "Feedback immédiat, snippets courts et ancrage des bons modèles mentaux.",
        },
        {
          title: "Review",
          description:
            "Réviser ce qui doit vraiment être consolidé, avec priorité sur les erreurs récurrentes.",
        },
        {
          title: "Mock Interview",
          description:
            "Sessions chronométrées avec rapport, score et points à verbaliser devant un recruteur.",
        },
      ],
      pillars: [
        {
          title: "Corriger la pensée, pas juste la réponse",
          description:
            "Chaque correction explique le mécanisme interne, les erreurs de raisonnement et les points à citer en entretien.",
        },
        {
          title: "Piloter la progression par compétence",
          description:
            "Le dashboard met en avant les skills faibles, les modules consolidés et les révisions dues aujourd'hui.",
        },
        {
          title: "Passer du quiz à la simulation d'entretien",
          description:
            "Les parcours passent du drill rapide à la session chronométrée, jusqu'à la défense d'une réponse en contexte.",
        },
      ],
      experienceTitle: "Ce que l’utilisateur ressent",
      experienceDescription:
        "Une expérience de préparation propre, dense et motivante, sans bruit inutile.",
      experienceBadge: "dashboard, review queue, mock interviews",
      experienceItems: [
        {
          title: "Voir où ça casse",
          text: "Les skills faibles et les erreurs répétées remontent avant le vanity tracking.",
        },
        {
          title: "Réviser au bon moment",
          text: "Les questions ratées repartent dans une file claire au lieu de disparaître dans l'historique.",
        },
        {
          title: "Parler comme en entretien",
          text: "Le mode mock force à justifier, pas seulement à reconnaître la bonne option.",
        },
      ],
    },
    tracks: {
      badge: "Architecture de compétences",
      title: "Des parcours conçus autour des signaux d’entretien.",
      description:
        "On organise le produit par compétences, pas par chapitres scolaires. Le but est de faire émerger ce qu'un recruteur va vraiment tester.",
      items: [
        {
          eyebrow: "Mental models",
          title: "React Core",
          summary:
            "Rendering, state, identity, reconciliation, forms, events et causes de rerenders.",
          highlights: ["keys", "derived state", "closures", "context boundaries"],
        },
        {
          eyebrow: "Pièges fréquents",
          title: "Hooks & Effects",
          summary:
            "Deps arrays, stale closures, refs, custom hooks, useLayoutEffect et stratégies de memoization.",
          highlights: ["useEffect", "useRef", "memoization", "custom hooks"],
        },
        {
          eyebrow: "Signal fort en entretien",
          title: "TypeScript for React",
          summary:
            "Generics, inference, utility types, typing de composants, API polymorphes et constraints.",
          highlights: ["generics", "narrowing", "React typing", "conditional types"],
        },
        {
          eyebrow: "Terrain mobile",
          title: "React Native",
          summary:
            "Flexbox, navigation, lists performantes, gestures, platform specifics et architecture d'écran.",
          highlights: ["FlatList", "navigation", "performance", "platform APIs"],
        },
      ],
      liveModuleTitle: "Aperçu des modules",
      liveModuleDescription:
        "Ce que verrait un utilisateur une fois connecté dans son dashboard de progression.",
      reviewTitle: "Aperçu de la review queue",
      reviewDescription:
        "La vraie valeur du produit se joue ici : savoir quoi revoir et pourquoi.",
    },
    trainingFlow: {
      mockBadge: "Mode mock interview",
      mockTitle: "Des simulations qui entraînent le rappel sous pression.",
      mockDescription:
        "Pas seulement des choix multiples. Il faut défendre sa réponse, citer les risques et expliquer les compromis.",
      templatesTitle: "Templates d’entretien",
      templatesDescription:
        "Des sessions prêtes à l'emploi pour se projeter rapidement sur un niveau donné.",
      premiumTitle: "Pensé pour un niveau de détail premium",
      premiumDescription:
        "Le produit assume une posture SaaS : marque, navigation, workspace personnel et système de design cohérent.",
      premiumItems: [
        "landing et dashboard reliés par la même identité visuelle",
        "sidebar rétractable pensée pour les sessions longues",
        "cartographie par skill au lieu d'un simple taux de complétion",
        "architecture prête pour Neon, Better Auth et Prisma",
      ],
    },
    pricing: {
      badge: "Monétisation prête pour un SaaS",
      title:
        "Un produit qui peut démarrer comme ton outil perso et devenir un vrai business.",
      description:
        "Le positionnement est déjà propre : un free tier utile, un coeur payant crédible et un sprint premium avant candidature.",
      monthlySuffix: " / mois",
      choosePlan: "Choisir {plan}",
      plans: [
        {
          title: "Starter",
          price: "Free",
          description:
            "Pour valider le format et poser un diagnostic rapide.",
          features: [
            "2 modules actifs",
            "dashboard personnel",
            "practice mode",
          ],
        },
        {
          title: "Mentor Pro",
          price: "€24",
          description:
            "Le coeur du produit pour préparer des entretiens React de manière sérieuse.",
          features: [
            "tous les modules",
            "mock interviews illimitées",
            "review queue et analytics de lacunes",
          ],
        },
        {
          title: "Hiring Sprint",
          price: "€59",
          description:
            "Pour les deux semaines avant candidature, avec un mode intensif plus offensif.",
          features: [
            "playlists intensives",
            "rapports d'argumentation",
            "plan de révision par rôle visé",
          ],
        },
      ],
    },
    final: {
      badge:
        "React Mentor est prêt à devenir une vraie base SaaS orientée apprentissage.",
      title: "Entraîne-toi comme si l’entretien comptait vraiment.",
      description:
        "Le produit a maintenant une direction claire : une landing premium, un système de progression et un espace authentifié cohérent pour transformer la préparation en vrai actif.",
    },
  },
  auth: {
    layout: {
      badge: "Workspace d'entraînement premium",
      title:
        "Construis des réponses qui résistent aux questions de relance.",
      description:
        "Entre dans un workspace pensé pour mesurer la maîtrise réelle, pas juste les bonnes cases cochées.",
    },
    signIn: {
      badge: "Connecte-toi pour ouvrir ton dashboard",
      title: "Bon retour",
      description:
        "Reviens sur tes modules, tes simulations d'entretien et ta file de révision du jour.",
      helper:
        "Après connexion, tu arrives directement dans ton cockpit de progression avec sidebar rétractable, modules, mock interviews et révisions programmées.",
      footer: "Nouveau ici ? Créer ton espace",
    },
    signUp: {
      badge: "Construis ton workspace React Mentor",
      title: "Créer ton compte React Mentor",
      description:
        "Commence avec un dashboard complet, des modules prêts à enrichir et une base technique alignée sur Next 16, Tailwind, Better Auth et Prisma.",
      helper:
        "Tu crées un workspace personnel avec dashboard, progression par skill, modules et files de révision. Le contenu est prêt à être branché à Neon et Prisma côté données réelles.",
      footerLead: "Déjà inscrit ?",
      footerAction: "Se connecter",
    },
    fields: {
      name: "Nom",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmation",
    },
    placeholders: {
      name: "Yoann",
      email: "vous@reactmentor.dev",
      password: "••••••••",
    },
    actions: {
      accessDashboard: "Accéder au dashboard",
      createAccount: "Créer mon compte",
      needAccount: "Besoin d’un compte ?",
      createInstead: "Créer un compte à la place",
      alreadyRegistered: "Déjà inscrit ?",
    },
    social: {
      readyTitle:
        "La connexion sociale s’active dès que les providers sont configurés.",
      readyDescription:
        "GitHub et Google apparaissent automatiquement dès que les clés OAuth sont présentes dans l’environnement.",
      or: "ou",
      continueWithGithub: "Continuer avec GitHub",
      continueWithGoogle: "Continuer avec Google",
    },
    errors: {
      emailInvalid: "Entre une adresse email valide",
      passwordMin: "Le mot de passe doit contenir au moins 8 caractères",
      nameMin: "Entre ton nom",
      confirmPasswordMin: "Confirme ton mot de passe",
      passwordsMismatch: "Les mots de passe ne correspondent pas",
    },
    toasts: {
      welcomeBack: "Bon retour",
      workspaceCreated: "Espace créé",
      signInError: "Connexion impossible",
      signUpError: "Création du compte impossible",
      socialError: "Connexion impossible",
    },
  },
  dashboard: {
    pages: {
      overview: {
        title: "Cockpit de préparation",
        description:
          "Une vue claire de ton niveau, de tes fragilités et des prochains leviers à actionner.",
      },
      modules: {
        title: "Bibliothèque d'entraînement",
        description:
          "Des modules organisés autour des skills qui comptent vraiment en entretien React.",
      },
      progress: {
        title: "Progression par skill",
        description:
          "Suivre la maîtrise par sujet plutôt que célébrer des pourcentages de complétion vides.",
      },
      mockInterviews: {
        title: "Simulations d'entretien",
        description:
          "Lancer des sessions chronométrées et s'entraîner à défendre son raisonnement technique.",
      },
      review: {
        title: "Review lab",
        description:
          "Se concentrer sur ce qui a glissé récemment et ce qui reste fragile sous pression.",
      },
      settings: {
        title: "Paramètres du workspace",
        description:
          "Régler ton niveau cible, ton rythme et tes zones de focus avant d'intensifier les sessions.",
      },
    },
    sidebar: {
      appLabel: "interview workspace",
      todayFocusLabel: "Focus du jour",
      todayFocusText:
        "Revoir les effects, finir le mock React Mid et pousser TypeScript au-dessus de 80%.",
      dueReviews: "{count} révisions à faire",
      activeTargetLabel: "Cible active",
      activeTargetValue: "React Mid / Frontend Product",
      readiness: "{value} readiness",
      nextMock: "Prochain mock dans 02:15",
      nav: {
        overview: {
          label: "Vue d’ensemble",
          description: "Readiness globale et prochaines actions",
        },
        modules: {
          label: "Modules",
          description: "Parcours, drills et banque de questions",
        },
        progress: {
          label: "Progression",
          description: "Maîtrise par skill et momentum de session",
        },
        mockInterviews: {
          label: "Mock Interviews",
          description: "Sessions chronométrées et rounds de défense",
        },
        review: {
          label: "Review Lab",
          description: "Cards dues, points faibles et explications",
        },
        settings: {
          label: "Settings",
          description: "Workspace, objectifs et rythme d'entraînement",
        },
      },
    },
    overview: {
      stats: [
        {
          label: "Score de préparation",
          value: "81/100",
          change: "+9 cette semaine",
        },
        {
          label: "Questions maîtrisées",
          value: "124",
          change: "sur 240 en base active",
        },
        {
          label: "Révisions dues aujourd'hui",
          value: "18",
          change: "spacing actif",
        },
        {
          label: "Mocks terminés",
          value: "7",
          change: "dernière note 84%",
        },
      ],
      weeklyMomentumTitle: "Momentum hebdomadaire",
      weeklyMomentumDescription:
        "Observer comment la qualité de réponse évolue, pas seulement le volume de questions traitées.",
      skillReadinessTitle: "Readiness par skill",
      skillReadinessDescription:
        "Les compétences qui résistent déjà sous pression et celles qui réclament encore du travail.",
      dueTitle: "À revoir aujourd'hui",
      dueDescription:
        "La file des questions à reprendre avant qu'une mauvaise intuition ne se fixe.",
      recentTitle: "Sessions récentes",
      recentDescription:
        "Un historique court pour rester orienté feedback et décisions utiles.",
      nextMockTitle: "Prochain mock recommandé",
      nextMockDescription:
        "Une session suggérée en fonction de la zone de fragilité actuelle.",
    },
    modules: {
      completionLabel: "Progression du module",
      questionsSummary:
        "{count} questions actuellement actives, avec explications détaillées et points à verbaliser en entretien.",
      metrics: [
        {
          label: "Parcours actifs",
          value: "4",
          detail: "React, hooks, TS, RN",
        },
        {
          label: "Questions en rotation",
          value: "154",
          detail: "mix practice et review",
        },
        {
          label: "Bottleneck actuel",
          value: "Effects",
          detail: "deps et synchronisation",
        },
      ],
      architectureTitle: "Architecture des modules",
      architectureDescription:
        "Le système est prêt pour aller plus loin : modules, skills, questions, progression et sessions sont déjà pensés côté data.",
      architectureItems: [
        "un module = un enjeu de compétence clair",
        "une question = un skill principal + des pièges secondaires",
        "une session = practice, review ou mock interview",
        "la maîtrise dépend de la qualité et de la répétition, pas juste du volume",
      ],
      nextBuildOutTitle: "Prochaines couches produit",
      nextBuildOutDescription:
        "Les prochaines couches produit peuvent s'empiler sans casser le socle actuel.",
      nextBuildOutItems: [
        "éditeur admin de questions",
        "open answers avec rubrics",
        "playlists par rôle visé",
        "recommandations pilotées par erreurs récurrentes",
      ],
    },
    progress: {
      masteryMapTitle: "Carte de maîtrise",
      masteryMapDescription:
        "Les compétences les plus robustes et les poches de doute encore visibles.",
      distributionTitle: "Répartition de maîtrise",
      distributionDescription:
        "Acquis, en cours et questions à revoir immédiatement.",
      signalTitle: "Qualité du signal dans le temps",
      signalDescription:
        "L'évolution de la qualité de réponse sur les dernières sessions structurées.",
      skillBySkillTitle: "Lecture skill par skill",
      skillBySkillDescription:
        "Une vue plus tactique pour choisir le prochain module à attaquer.",
      notes: {
        stable: "stable sous relance",
        medium: "bonne base, langage encore à affûter",
        fragile: "encore fragile en condition d'entretien",
      },
    },
    mockInterviews: {
      timedMode: "mode chronométré",
      historyTitle: "Historique des mocks",
      historyDescription:
        "Ce qui a été exécuté récemment et les gains à réinjecter dans les prochaines sessions.",
      philosophyTitle: "Philosophie de scoring",
      philosophyDescription:
        "Le score final ne doit pas flatter. Il doit t'aider à savoir si ta réponse va tenir devant un recruteur exigeant.",
      philosophyItems: [
        "exactitude technique de la réponse",
        "capacité à expliquer le mécanisme, pas seulement l'API",
        "gestion des distracteurs et edge cases",
        "qualité de l'argumentation en conditions chronométrées",
      ],
      templateBadges: {
        pace: "timing strict et rythme de réponse",
        defense: "points de défense remontés dans le rapport",
      },
    },
    review: {
      queueTitle: "Review queue",
      queueDescription:
        "Les cartes à reprendre maintenant pour éviter que les mauvaises intuitions deviennent des habitudes.",
      howTitle: "Comment la review doit fonctionner",
      howDescription:
        "Le but n'est pas de refaire les mêmes questions en boucle. C'est de corriger une confusion identifiée, puis de laisser le temps tester la stabilité.",
      howItems: [
        "pattern d'erreur identifié",
        "correction expliquée avec mécanisme et edge cases",
        "question reprogrammée après un intervalle de spacing",
      ],
    },
    settings: {
      targetTitle: "Réglage de la cible",
      targetDescription:
        "Ce que le moteur doit optimiser quand il prépare tes sessions et recommandations.",
      targetItems: [
        { label: "Niveau visé", value: "React Mid / Frontend Product" },
        { label: "Stack principale", value: "React, TypeScript, React Native" },
        { label: "Objectif hebdo", value: "30 questions + 2 mocks" },
      ],
      postureTitle: "Posture d'apprentissage",
      postureDescription:
        "Les réglages que le futur produit peut utiliser pour nuancer le feedback et la cadence de révision.",
      postureItems: [
        "feedback immédiat activé",
        "sessions mock le mardi et le vendredi",
        "priorité aux erreurs sur hooks et effects",
        "review automatique des questions marquées fragiles",
      ],
    },
    modulesCatalog: [
      {
        track: "React Core",
        title: "React Rendering Systems",
        summary:
          "Comprendre comment React décide de re-render, diff et réconcilie les arbres pour répondre sans folklore.",
        focus: ["reconciliation", "keys", "referential equality", "derived state"],
      },
      {
        track: "Hooks",
        title: "Effects Without Superstition",
        summary:
          "Nettoyer les confusions autour de useEffect, des closures obsolètes et des stratégies de synchronisation.",
        focus: ["dependencies", "cleanup", "stale closures", "refs"],
      },
      {
        track: "TypeScript",
        title: "TypeScript for Components",
        summary:
          "Typage de props, composants polymorphes, generics et APIs robustes pour éviter le 'ça compile chez moi'.",
        focus: ["generics", "unions", "children", "inference"],
      },
      {
        track: "React Native",
        title: "React Native Interview Cases",
        summary:
          "Préparer les questions produit et perf sur les listes, la navigation, le layout et les contraintes plateforme.",
        focus: ["FlatList", "navigation", "layout", "native bridge"],
      },
    ],
    reviewQueue: [
      {
        title:
          "Pourquoi un tableau recréé à chaque render dans les deps relance-t-il l'effet ?",
        skill: "Hooks",
        urgency: "À revoir aujourd'hui",
        reason: "2 erreurs sur 3 tentatives",
      },
      {
        title: "Quand `React.memo` ne sert presque à rien ?",
        skill: "Performance",
        urgency: "Encore frais",
        reason: "bonne réponse sans justification encore solide",
      },
      {
        title: "Comment typer un composant polymorphe avec `as` ?",
        skill: "TypeScript",
        urgency: "Bloquant entretien senior",
        reason: "temps de réponse très élevé",
      },
    ],
    recentSessions: [
      {
        title: "Mock Interview · React Mid",
        summary:
          "Bonne structure, faiblesse persistante sur effects et cleanup.",
      },
      {
        title: "Review Drill · TypeScript",
        summary:
          "Generics solides, encore trop prudent sur les utility types.",
      },
      {
        title: "Practice Sprint · React Native",
        summary:
          "Layout correct, perf FlatList encore à muscler.",
      },
    ],
    mockTemplates: [
      {
        title: "React Mid · 30 minutes",
        description:
          "10 questions ciblées hooks, rendering, state et argumentation d'architecture.",
        composition: "6 QCM · 2 code outputs · 2 open prompts",
      },
      {
        title: "Frontend Senior · Defend your answer",
        description:
          "Simulation orientée justification technique, compromis et edge cases en conditions réelles.",
        composition: "5 deep dives · 1 architecture case",
      },
      {
        title: "React Native Sprint",
        description:
          "Session courte pour flexbox, navigation, gestures et perf list rendering.",
        composition: "8 questions · 20 minutes",
      },
    ],
    skillLabels: {
      rendering: "Rendering",
      effects: "Effects",
      typescript: "TypeScript",
      testing: "Testing",
      performance: "Performance",
      rn: "React Native",
    },
    masteryLabels: {
      mastered: "Acquis",
      inProgress: "En cours",
      review: "À revoir",
    },
  },
} as const;

export default fr;
