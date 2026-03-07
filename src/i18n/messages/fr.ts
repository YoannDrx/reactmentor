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
  onboarding: {
    badge: "Setup de premier lancement",
    title: "Donne a React Mentor assez de contexte pour vraiment te coacher.",
    description:
      "Ce setup court evite un dashboard generique et aligne les prochains modules, reviews et mocks sur ton objectif reel.",
    steps: {
      goal: "Objectif",
      tracks: "Tracks",
      cadence: "Cadence",
    },
    stepDescriptions: {
      goal: "Definis le role et le niveau que tu prepares vraiment.",
      tracks: "Choisis les stacks qui doivent dominer les recommandations.",
      cadence: "Regle l'intensite hebdo et la posture de la boucle d'entrainement.",
    },
    panelTitle: "Ce setup va piloter",
    panelDescription:
      "React Mentor utilise ces signaux pour classer les modules, programmer les reviews et decider a quel point le produit doit etre agressif pendant une courte fenetre de preparation.",
    panelItems: [
      "l'ordre par defaut des modules recommandes",
      "la cadence des reviews espacees et des rappels de faibles signaux",
      "le ton et la densite des futurs mock interviews",
      "la meilleure prochaine action remontee dans le dashboard",
    ],
    actions: {
      back: "Retour",
      next: "Continuer",
      finish: "Ouvrir le dashboard",
      finishing: "Finalisation...",
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
      session: {
        title: "Session live",
        description:
          "Repondre, valider et avancer dans une vraie sequence d'entrainement avec feedback immediat.",
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
      todayFocusFallback:
        "Regle ton workspace et ouvre un module pour lancer la prochaine boucle d'entrainement.",
      todayFocusReview:
        "{count} cards dues doivent etre nettoyees avant d'ouvrir de nouveaux drills.",
      todayFocusModule: {
        start: "Commence par {module} pour aligner la journee avec ton track actif.",
        grow:
          "Pousse {module} maintenant ; c'est la zone avec le plus de levier sur ton parcours actuel.",
        reinforce:
          "Renforce {module} avant d'elargir davantage la surface de travail.",
      },
      dueReviews: "{count} révisions à faire",
      activeTargetLabel: "Cible active",
      activeTargetValue: "React Mid / Frontend Product",
      readiness: "{value} readiness",
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
      recommendedTitle: "Prochaine action recommandee",
      recommendedReviewTitle: "Nettoyer la queue de review avant qu'elle ne se fige",
      recommendedDueLabel: "Dues maintenant",
      recommendedSessionSizeLabel: "Taille de review conseillee",
      recommendedTrackLabel: "Track prioritaire",
      recommendedProgressLabel: "Progression actuelle",
      recommendedModuleAction: "Ouvrir le module recommande",
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
      statChanges: {
        readiness: "signal de readiness en direct",
        mastered: "{count} sur {total} questions suivies",
        dueActive: "la file de spacing est active",
        dueClear: "rien a revoir pour l'instant",
        mocks: "{count} sessions chronometrees completees",
        noMocks: "aucune session chronometree pour l'instant",
      },
      weeklyMomentumTitle: "Momentum hebdomadaire",
      weeklyMomentumDescription:
        "Observer comment la qualité de réponse évolue, pas seulement le volume de questions traitées.",
      skillReadinessTitle: "Readiness par skill",
      skillReadinessDescription:
        "Les compétences qui résistent déjà sous pression et celles qui réclament encore du travail.",
      dueTitle: "À revoir aujourd'hui",
      dueDescription:
        "La file des questions à reprendre avant qu'une mauvaise intuition ne se fixe.",
      startReviewAction: "Lancer une session review",
      openReviewAction: "Ouvrir le review lab",
      recentTitle: "Sessions récentes",
      recentDescription:
        "Un historique court pour rester orienté feedback et décisions utiles.",
      nextMockTitle: "Prochain mock recommandé",
      nextMockDescription:
        "Une session suggérée en fonction de la zone de fragilité actuelle.",
      launchMockAction: "Lancer ce mock",
      mockUnavailable:
        "Ce mock n'est pas encore disponible car aucune question jouable ne correspond a ce preset.",
      urgencyLabels: {
        critical: "A revoir maintenant",
        high: "A revoir aujourd'hui",
        normal: "Programmee",
      },
      reasonLabels: {
        overdue:
          "Cette card est en retard de review et doit revenir avant que l'intuition ne se degrade davantage.",
        failedRecently:
          "Ce sujet reste instable et a besoin d'une boucle de feedback courte.",
        scheduled:
          "Cette question revient pour verifier que le mecanisme a vraiment tenu dans le temps.",
      },
      emptyDueTitle: "Aucune card de review n'est due pour l'instant",
      emptyDueDescription:
        "La queue est vide pour le moment. Le meilleur prochain move est de lancer une nouvelle session practice ou un mock chronometre.",
      sessionModes: {
        PRACTICE: "Session practice",
        REVIEW: "Session review",
        MOCK_INTERVIEW: "Mock interview",
      },
      recentSessionDuration: "{count} min",
      recentSessionSummary: "{count} reponses enregistrees dans {mode}.",
      emptyRecentTitle: "Aucune session terminee pour l'instant",
      emptyRecentDescription:
        "Des que tu termines une session practice, review ou mock, l'activite recente apparaitra ici.",
    },
    recommendation: {
      moduleTitle: "Se concentrer ensuite sur {module}",
      reviewDescription:
        "{count} cards de review sont deja dues. Une boucle courte de review protege les concepts que tu as deja touches.",
      moduleDescriptions: {
        start:
          "Ce module correspond a ton track actif et n'a pas encore ete attaque. C'est le meilleur point d'entree immediat.",
        grow:
          "Ce module garde la plus grosse marge de progression sur ton track actif, avec assez de surface pour recreer du momentum rapidement.",
        reinforce:
          "Ce module est deja en mouvement et reste le meilleur endroit a renforcer avant d'elargir la surface.",
      },
    },
    modules: {
      recommendedTitle: "Parcours module recommande",
      recommendedReviewTitle: "La review doit passer avant l'ouverture d'un nouveau module",
      recommendedDueLabel: "Cards dues",
      recommendedSessionSizeLabel: "Taille de review conseillee",
      recommendedTrackLabel: "Track prioritaire",
      recommendedProgressLabel: "Progression actuelle",
      recommendedModuleAction: "Ouvrir le module recommande",
      recommendedReviewAction: "Ouvrir le review lab",
      recommendedBadge: "Recommande",
      completionLabel: "Progression du module",
      attemptedSummary: "{count} tentées",
      masteredSummary: "{count} acquises",
      questionsSummary:
        "{count} questions actuellement actives, avec explications détaillées et points à verbaliser en entretien.",
      stats: {
        activeTracksLabel: "Parcours actifs",
        activeTracksDetail: "deja representes dans la bibliotheque de contenu",
        questionCountLabel: "Questions en bibliotheque",
        questionCountDetail: "deja modelisees dans le seed courant",
        skillCountLabel: "Skills en bibliotheque",
        skillCountDetail: "deja disponibles comme briques localisees",
      },
      openModule: "Ouvrir le module",
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
    trackLabels: {
      REACT: "React",
      REACT_NATIVE: "React Native",
      TYPESCRIPT: "TypeScript",
      FRONTEND_SYSTEMS: "Systemes Frontend",
    },
    moduleDetail: {
      backToLibrary: "Retour a la bibliotheque",
      summaryFallback:
        "Ce module est deja structure dans la couche data et pret a alimenter sessions, progression et review.",
      questionCountLabel: "Questions du module",
      skillCountLabel: "Skills couvertes",
      launchPractice: "Lancer une session practice",
      practiceUnavailable:
        "Aucune question single-choice exploitable n'est encore disponible pour ce module.",
      skillsTitle: "Skills couvertes",
      skillsDescription:
        "Chaque skill doit ensuite alimenter les sessions practice, la programmation des reviews et les analytics de faiblesse.",
      positioningTitle: "Angle entretien",
      positioningDescription:
        "Ce module doit preparer l'utilisateur a expliquer le mecanisme, le piege et le tradeoff, pas seulement a reciter une API.",
      positioningItems: [
        "un cluster de sujet clair avec des signaux d'entretien explicites",
        "des skills mappees avant de grossir le volume de questions",
        "une base prevue pour les futures sessions, reviews et mocks",
      ],
      nextBuildTitle: "Prochaines couches a livrer",
      nextBuildDescription:
        "La page module est maintenant reliee a de vraies donnees. L'etape suivante consiste a brancher sessions, progression et recommandations dessus.",
      nextBuildItems: [
        "practice mode lance depuis le module",
        "review sessions scopees au module",
        "templates de mock specifiques au module",
        "insights de faiblesse relies aux skills couvertes",
      ],
    },
    session: {
      progressLabel: "Question {current} / {total}",
      submitAnswer: "Valider la reponse",
      retryAnswer: "Reessayer l'enregistrement",
      submitting: "Verification...",
      nextQuestion: "Question suivante",
      finishSession: "Voir le resultat",
      loadingNextQuestion: "Chargement de la question suivante...",
      loadingSessionResult: "Chargement du resultat...",
      selectionRequired: "Selectionne une reponse avant de valider.",
      correctState: "Correct",
      incorrectState: "Incorrect",
      keyboardHint: "Utilise les touches 1-{count} pour choisir puis Entree pour valider.",
      explanationTitle: "Mecanisme",
      takeawaysTitle: "A retenir",
      recoveryTitle: "La reponse n'est pas encore enregistree",
      recoveryHint:
        "Ta selection est conservee. Reessaie l'enregistrement ou ajuste ta reponse avant de valider a nouveau.",
      timerLabel: "Timer mock",
      timeRemainingLabel: "Temps restant",
      timeBudgetLabel: "Budget temps",
      timeSpentLabel: "Temps utilise",
      timedModeBadge: "Simulation chronometree",
      timerExpiredToast: "Le temps est ecoule. Le mock est en train d'etre cloture.",
      completedBadge: "Session terminee",
      completedTitle: "Session terminee",
      mockReportTitle: "Rapport de mock",
      mockReportDescription:
        "Un premier signal de pression pour verifier si la qualite de reponse tient sous la contrainte du template.",
      mockPressureLabel: "Lecture de pression",
      mockSkillsTitle: "Skills testees dans ce mock",
      mockSkillsSummary: "{correct} bonnes reponses sur {total} questions pour cette skill.",
      mockRiskTitle: "Principales chutes a revoir",
      mockRiskStates: {
        incorrect: "Reponse incorrecte",
        unanswered: "Question laissee sous pression",
      },
      mockRiskEmpty:
        "Aucune chute majeure n'a ete detectee dans ce mock. Garde quand meme les points a verbaliser ci-dessous pour la prochaine passe.",
      mockVerbalizeTitle: "Points a verbaliser la prochaine fois",
      mockPressureStates: {
        controlled: "Rythme maitrise",
        tight: "Tendu mais acceptable",
        overrun: "La pression casse encore la reponse",
      },
      mockPressureDescriptions: {
        controlled:
          "Le mock est reste sous controle: score, completion et budget temps sont restes dans une zone solide.",
        tight:
          "Le mock reste defendable, mais la marge est plus faible. Il faut encore affuter la vitesse et la structure verbale.",
        overrun:
          "Le timing ou la qualite de reponse s'effondre encore sous pression. Relance une boucle ciblee avant de faire confiance au signal.",
      },
      backToDashboard: "Retour au dashboard",
      backToModules: "Retour aux modules",
      correctAnswersLabel: "Bonnes reponses",
      questionsAnsweredLabel: "Questions traitees",
      minutesShort: "{count} min",
      errors: {
        unauthorized: "Ta session a expire. Reconnecte-toi.",
        invalid: "Cet item de session n'est plus valide.",
        expired: "Cette session chronometree est deja terminee.",
        unknown: "Impossible d'enregistrer cette reponse pour l'instant.",
      },
      modeLabels: {
        PRACTICE: "Session practice",
        REVIEW: "Session review",
        MOCK_INTERVIEW: "Mock interview",
      },
    },
    progress: {
      masteryMapTitle: "Carte de maîtrise",
      masteryMapDescription:
        "Les compétences les plus robustes et les poches de doute encore visibles.",
      emptyModuleAction: "Ouvrir le module recommande",
      emptyReviewAction: "Ouvrir le review lab",
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
      emptyTitle: "Aucun signal d'apprentissage pour l'instant",
      emptyDescription:
        "Les graphiques de progression deviendront utiles apres tes premieres vraies tentatives. Commence par un module pour generer les premiers points de donnees.",
    },
    mockInterviews: {
      timedMode: "mode chronométré",
      launchTemplate: "Lancer le template",
      templateUnavailable:
        "Aucune question single-choice exploitable n'est encore disponible pour ce preset.",
      overviewTitle: "Lecture de performance mock",
      overviewDescription:
        "Un signal compact pour voir si les derniers runs chronométrés améliorent vraiment la readiness entretien.",
      completedMocksLabel: "Mocks termines",
      averageScoreLabel: "Score moyen",
      bestScoreLabel: "Meilleur score",
      latestMomentumLabel: "Momentum recent",
      noTrendYet:
        "Il faut au moins un deuxieme mock termine avant que la tendance devienne utile.",
      momentumStates: {
        up: "En progression",
        down: "En retrait",
        steady: "Stable",
      },
      momentumDescriptions: {
        up: "{count} pts au-dessus de la moyenne des mocks precedents.",
        down: "{count} pts en dessous de la moyenne des mocks precedents.",
        steady: "Dans une zone de {count} pts autour de la moyenne des mocks precedents.",
      },
      templateSignalsTitle: "Signaux par template",
      templateSignalsDescription:
        "Les presets qui tiennent deja sous pression et ceux qui demandent encore une passe.",
      strongestTemplateLabel: "Template le plus stable",
      needsWorkTemplateLabel: "Template a retravailler",
      templateSessionsSummary: "{count} mocks termines",
      latestScoreLabel: "Dernier score",
      averagePaceLabel: "Rythme moyen",
      historyTitle: "Historique des mocks",
      historyDescription:
        "Ce qui a été exécuté récemment et les gains à réinjecter dans les prochaines sessions.",
      historyEmptyTitle: "Aucun mock termine pour l'instant",
      historyEmptyDescription:
        "Des que tu termines une session chronometree, l'historique reel des mocks apparaitra ici.",
      fallbackSessionTitle: "Mock interview",
      completedAtLabel: "Termine le",
      recentSessionDuration: "{count} min",
      recentSessionSummary: "{count} reponses enregistrees dans ce mock.",
      openReport: "Ouvrir le rapport",
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
      launchTitle: "Transformer les cartes dues en session de review",
      launchDescription:
        "Lance une boucle de review ciblée avant que les intuitions fragiles ne se dégradent davantage. Le moteur priorise d'abord les cartes les plus en retard et les plus instables.",
      launchAction: "Lancer une session review",
      launchUnavailable:
        "Aucune session review n'est disponible pour l'instant car aucune carte n'est encore due.",
      dueNowLabel: "Cartes dues maintenant",
      nextSessionSizeLabel: "Cartes dans la prochaine session",
      urgencyLabels: {
        critical: "A revoir maintenant",
        high: "A revoir aujourd'hui",
        normal: "Programmee",
      },
      reasonLabels: {
        overdue:
          "Cette card est en retard de review et doit revenir avant que l'intuition ne se degrade davantage.",
        failedRecently:
          "Ce sujet reste instable et a besoin d'une boucle de feedback courte.",
        scheduled:
          "Cette question revient pour verifier que le mecanisme a vraiment tenu dans le temps.",
      },
      emptyTitle: "Aucune review n'est due pour l'instant",
      emptyDescription:
        "Cette queue se remplira automatiquement quand des questions redeviendront dues via le systeme de review espacee.",
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
      introBadge: "Personnalise ta boucle d'entrainement",
      introTitle:
        "Transforme le workspace en plan de preparation aligne avec tes entretiens.",
      introDescription:
        "Ces preferences pilotent la priorisation, le rythme et les futures recommandations. Garde-les alignees avec le role que tu vises vraiment.",
      targetRoleLabel: "Role cible",
      targetRoleHint:
        "Decris le role, le contexte entreprise ou le scope d'entretien que le produit doit optimiser.",
      targetRolePlaceholder: "Frontend Product Engineer · React / Next.js",
      targetLevelTitle: "Niveau vise",
      targetLevelDescription:
        "La profondeur des explications, le mix de questions et l'intensite des mocks s'aligneront sur ce niveau.",
      preferredTracksTitle: "Tracks prioritaires",
      preferredTracksDescription:
        "Selectionne les tracks qui doivent dominer les prochaines recommandations et sessions.",
      weeklyGoalTitle: "Cadence hebdomadaire",
      weeklyGoalDescription:
        "Definis le volume d'effort que le moteur doit vraiment planifier autour de toi.",
      weeklyGoalLabel: "Objectif de questions",
      weeklyGoalHint:
        "Entre 5 et 150 questions par semaine. Regle-le sur le temps que tu peux vraiment proteger.",
      weeklyGoalPresetsLabel: "Presets rapides",
      focusModeTitle: "Posture d'entrainement",
      focusModeDescription:
        "Ce reglage ajuste a quel point la plateforme doit etre agressive dans le choix des drills et des reviews.",
      summaryTitle: "Profil operationnel actuel",
      summaryDescription:
        "Une lecture compacte de la maniere dont React Mentor va structurer le prochain cycle de travail.",
      summaryTargetLabel: "Cible active",
      summaryWeeklyGoalLabel: "Volume hebdo",
      summaryFocusModeLabel: "Mode de focus",
      summaryTracksLabel: "Couverture tracks",
      summaryEmptyTargetRole: "Role cible non defini pour l'instant",
      summaryConfigured:
        "Ton workspace est personnalise et pret a guider les prochaines sessions.",
      summaryNotConfigured:
        "Definis un role cible pour debloquer de meilleures recommandations dans le dashboard.",
      weeklyGoalUnit: "questions / semaine",
      actions: {
        save: "Enregistrer les reglages",
        saving: "Enregistrement...",
      },
      errors: {
        targetRoleRequired: "Definis le role que React Mentor doit vraiment optimiser",
        targetRoleTooLong: "Garde le role cible sous 120 caracteres",
        weeklyGoalTooSmall: "Definis un objectif d'au moins 5 questions",
        weeklyGoalTooBig: "Garde l'objectif a 150 questions maximum",
        preferredTracksRequired: "Selectionne au moins un track prioritaire",
        invalidSelection: "Cette valeur de reglage est invalide",
        unauthorized: "Ta session a expire. Reconnecte-toi pour sauvegarder.",
        unknown: "Impossible d'enregistrer tes preferences pour l'instant.",
      },
      toasts: {
        saved: "Preferences mises a jour",
      },
      focusModes: {
        balanced: {
          label: "Progression equilibree",
          description:
            "Melange largeur de couverture et repetition pour avancer sans perdre les fondamentaux.",
        },
        deep_dive: {
          label: "Deep dive sur les faiblesses",
          description:
            "Pousse la file vers les concepts fragiles, les explications plus denses et les boucles de correction concentrees.",
        },
        interview_cram: {
          label: "Sprint entretien",
          description:
            "Compresse le rythme pour une courte fenetre de preparation avec plus de mocks et une cadence plus dense.",
        },
      },
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
      new: "Nouveau",
      learning: "En apprentissage",
      reviewing: "En review",
      mastered: "Acquis",
      inProgress: "En cours",
      review: "À revoir",
    },
  },
} as const;

export default fr;
