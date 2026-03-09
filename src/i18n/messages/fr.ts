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
      openDashboard: "Ouvrir le dashboard",
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
      learn: "Learn",
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
          highlights: [
            "keys",
            "derived state",
            "closures",
            "context boundaries",
          ],
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
          highlights: [
            "generics",
            "narrowing",
            "React typing",
            "conditional types",
          ],
        },
        {
          eyebrow: "Terrain mobile",
          title: "React Native",
          summary:
            "Flexbox, navigation, lists performantes, gestures, platform specifics et architecture d'écran.",
          highlights: [
            "FlatList",
            "navigation",
            "performance",
            "platform APIs",
          ],
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
          description: "Pour valider le format et poser un diagnostic rapide.",
          features: [
            "2 modules publies",
            "1 mock chronometre / mois",
            "workspace practice et review",
          ],
        },
        {
          title: "Mentor Pro",
          price: "€24",
          description:
            "Le coeur du produit pour préparer des entretiens React de manière sérieuse.",
          features: [
            "tous les modules publies",
            "mocks chronometres illimites",
            "analytics avancees et playlists ciblees",
          ],
        },
        {
          title: "Hiring Sprint",
          price: "€59",
          description:
            "Pour la fenetre courte avant entretien, quand la boucle de prep doit passer sur la voie la plus agressive.",
          features: [
            "tout Mentor Pro",
            "mode sprint active",
            "voie de prep la plus intensive",
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
      title: "Construis des réponses qui résistent aux questions de relance.",
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
      cadence:
        "Regle l'intensite hebdo et la posture de la boucle d'entrainement.",
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
      learn: {
        title: "Workspace learn",
        description:
          "Des cours detailles, des sequences guidees et la boucle lecture-vers-practice directement dans ton espace.",
      },
      bookmarks: {
        title: "Questions sauvegardees",
        description:
          "Garder sous la main les prompts a rehearser avant le prochain round d'entretien.",
      },
      notes: {
        title: "Notes personnelles",
        description:
          "Capturer ton propre langage d'entretien, les pieges et les rappels directement sur les questions importantes.",
      },
      playlists: {
        title: "Playlists ciblees",
        description:
          "Des piles auto-generees a partir des reviews dues, des frictions mock et de ta curation sauvegardee.",
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
      admin: {
        title: "Admin contenu",
        description:
          "Un back-office minimal pour creer, auditer et publier la bibliotheque d'entrainement sans quitter le dashboard.",
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
        start:
          "Commence par {module} pour aligner la journee avec ton track actif.",
        grow: "Pousse {module} maintenant ; c'est la zone avec le plus de levier sur ton parcours actuel.",
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
        learn: {
          label: "Learn",
          description: "Cours detailles et bibliotheque guidee",
        },
        bookmarks: {
          label: "Bookmarks",
          description: "Prompts sauvegardes et points a revisiter",
        },
        notes: {
          label: "Notes",
          description: "Rappels perso et formulations d'entretien",
        },
        playlists: {
          label: "Playlists",
          description: "Piles generees pour les boucles de rattrapage courtes",
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
        admin: {
          label: "Admin contenu",
          description: "Inventaire editorial, creation et controle des statuts",
        },
        settings: {
          label: "Settings",
          description: "Workspace, objectifs et rythme d'entraînement",
        },
      },
    },
    overview: {
      recommendedTitle: "Prochaine action recommandee",
      recommendedReviewTitle:
        "Nettoyer la queue de review avant qu'elle ne se fige",
      recommendedDueLabel: "Dues maintenant",
      recommendedSessionSizeLabel: "Taille de review conseillee",
      recommendedTrackLabel: "Track prioritaire",
      recommendedProgressLabel: "Progression actuelle",
      recommendedModuleAction: "Ouvrir le module recommande",
      openLearnLibraryAction: "Ouvrir la bibliotheque learn",
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
      learnLoopTitle: "Statut de la boucle learn",
      learnLoopDescription:
        "Les cours deja vus, verifies, ou encore en attente de conversion en pratique et review utiles.",
      learnTrackedLabel: "Cours suivis",
      learnCheckpointReadyLabel: "Checkpoint valide",
      learnNeedsPracticeLabel: "Sans practice",
      learnReviewQueuedLabel: "Envoyes en review",
      learnQueueTitle: "Prochains suivis de cours",
      learnQueueDescription:
        "Des actions courtes tirees des cours vus, des checkpoints manquants et des signaux de review issus de learn.",
      learnQueueEmptyTitle: "Les suivis de cours sont sous controle",
      learnQueueEmptyDescription:
        "Les cours vus sont deja verifies ou programmes. Ouvre la page progress pour voir le workspace learn complet.",
      openProgressAction: "Ouvrir progress",
      startFocusedPracticeAction: "Lancer une practice ciblee",
      lessonViewsLabel: "Lectures",
      checkpointAttemptsLabel: "Checkpoints",
      learnSignalBadge: "Signal learn",
      learnNoPracticeBadge: "Pas encore de practice",
      checkpointFailedBadge: "Checkpoint echoue",
      learnReasonLabels: {
        reviewDue:
          "Ce cours alimente deja la queue de review et doit revenir avant que l'explication ne derive.",
        needsCheckpoint:
          "Le cours a ete vu mais n'a pas encore ete verifie avec un checkpoint rapide.",
        checkpointFailed:
          "Le checkpoint a echoue, donc l'explication doit etre rejouee avant d'elargir la practice.",
        needsPractice:
          "Le checkpoint est valide, mais ce cours demande encore une question ciblee pour devenir un vrai rappel utile.",
      },
      startReviewAction: "Lancer une session review",
      openReviewAction: "Ouvrir le review lab",
      openLessonAction: "Lire le cours",
      openModuleAction: "Ouvrir le module",
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
        weakSkill:
          "Le skill parent reste fragile ou peu fiable, donc cette question aide a consolider le signal.",
        mockFallout:
          "Cette question a cede en mode mock et doit revenir vite avant le prochain round sous pression.",
        lessonQueued:
          "Ce cours a ete vu dans learn mais n'a pas encore ete transforme en pratique espacee stable.",
        checkpointFailed:
          "Le checkpoint de cours a echoue, donc cette card doit revenir avant que la mauvaise explication ne durcisse.",
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
        grow: "Ce module garde la plus grosse marge de progression sur ton track actif, avec assez de surface pour recreer du momentum rapidement.",
        reinforce:
          "Ce module est deja en mouvement et reste le meilleur endroit a renforcer avant d'elargir la surface.",
      },
    },
    entitlements: {
      summaryBadge: "Acces plan",
      summaryTitle: "Billing et entitlements",
      summaryDescription:
        "Cette couche decide jusqu'ou le workspace peut aller maintenant : acces modules, mocks chronometres, profondeur d'analyse et workflows premium de rattrapage.",
      currentPlanLabel: "Plan actuel",
      billingStatusLabel: "Statut billing",
      moduleAccessLabel: "Acces modules",
      mockQuotaLabel: "Quota de mocks chronometres",
      analyticsDepthLabel: "Profondeur d'analyse",
      nextResetLabel: "Prochain reset",
      moduleAccessValues: {
        unlimited: "Tous les modules publies sont ouverts",
        limited: "Modules publies ouverts : {count}",
      },
      mockQuotaValues: {
        unlimited: "Lancements mock illimites",
        available: "Lancements mock restants : {count}",
        exhausted: "Le quota mock de ce mois est consomme",
      },
      analysisDepthLabels: {
        CORE: "Analyse coeur",
        ADVANCED: "Analyse avancee",
      },
      featureAvailabilityTitle: "Fonctionnalites disponibles",
      featureAvailabilityDescription:
        "Les plans superieurs elargissent la boucle de rattrapage au-dela de la surface starter.",
      featureNames: {
        playlists: "Playlists ciblees",
        advancedAnalytics: "Analytics avancees",
        sprintMode: "Mode sprint",
      },
      featureStates: {
        enabled: "Actif",
        locked: "Verrouille",
      },
      managementTitle: "Plans et acces abonnement",
      managementDescription:
        "La surface pricing est maintenant reliee au checkout Stripe et au portail billing. Starter reste gratuit, tandis que les plans premium ouvrent la boucle de rattrapage la plus large.",
      currentPlanBadge: "Plan actuel",
      currentPlanAction: "Plan actuel",
      openPortalAction: "Ouvrir le portail billing",
      checkoutUnavailable: "Checkout Stripe indisponible",
      notices: {
        success:
          "Le checkout est termine. Le workspace a ete resynchronise depuis Stripe et devrait maintenant refléter le dernier plan.",
        canceled:
          "Le checkout a ete annule. Aucun changement billing n'a ete applique.",
        portalReturn:
          "Retour du portail billing. Les resynchronisations Stripe garderont le workspace aligne.",
        notConfigured:
          "Stripe n'est pas encore configure dans cet environnement. Ajoute les cles Stripe et les price ids pour activer le checkout.",
        invalidPlan: "Ce plan billing n'est pas valide pour le checkout.",
        portalUnavailable:
          "Aucun customer Stripe n'est encore rattache a ce workspace, donc le portail billing reste indisponible.",
      },
      manageAction: "Ouvrir les reglages",
      planLabels: {
        STARTER: "Starter",
        MENTOR_PRO: "Mentor Pro",
        HIRING_SPRINT: "Hiring Sprint",
      },
      statusLabels: {
        FREE: "Gratuit",
        ACTIVE: "Actif",
        TRIALING: "Essai",
        PAST_DUE: "Paiement en retard",
        CANCELED: "Annule",
        EXPIRED: "Expire",
      },
      gates: {
        modules: {
          badge: "Acces modules",
          title: "Certains modules restent hors du plan Starter",
          description:
            "Starter ouvre les {count} premiers modules publies. Passe sur un plan superieur pour elargir la bibliotheque et garder des recommandations utiles.",
          limitHint:
            "{locked} modules publies restent actuellement hors de ton plan.",
          cardBadge: "Verrouille",
          cardHint: "Disponible sur Mentor Pro et Hiring Sprint.",
          previewNote:
            "L'aperçu reste visible ici, mais les lancements practice et la bibliotheque de questions restent verrouilles tant que le plan n'est pas elargi.",
          action: "Voir l'acces plan",
        },
        mockInterviews: {
          badge: "Quota mock chronometre",
          title: "Capacite des mock interviews",
          description:
            "Les mocks chronometres sont volontairement limites sur Starter, donc le quota restant doit rester visible avant chaque lancement.",
          available:
            "Lancements mock restants dans la fenetre mensuelle courante : {count}.",
          exhausted:
            "Le quota mock de ce mois est epuise. Les boucles practice, review et recovery restent disponibles.",
          action: "Voir l'acces plan",
        },
        playlists: {
          badge: "Workflow premium",
          title: "Les playlists restent reservees aux plans premium",
          description:
            "Les playlists generees et sauvegardees s'ouvrent quand le compte passe sur Mentor Pro ou Hiring Sprint.",
          action: "Voir l'acces plan",
        },
      },
    },
    modules: {
      recommendedTitle: "Parcours module recommande",
      recommendedReviewTitle:
        "La review doit passer avant l'ouverture d'un nouveau module",
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
        "Aucune question exploitable n'est encore disponible pour ce module.",
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
      questionLibraryTitle: "Bibliotheque de questions",
      questionLibraryDescription:
        "Chaque question devient maintenant aussi un point d'entree vers un cours detaille et une pratique ciblee.",
      readLesson: "Lire le cours",
      focusedPractice: "Pratiquer cette question",
      questionLibraryEmpty:
        "Aucune question publiee n'est encore disponible dans ce module.",
    },
    bookmarks: {
      title: "Questions sauvegardees",
      description:
        "Conserve les prompts que tu veux rehearser, puis relance une boucle practice ciblee quand tu veux.",
      savedCountLabel: "Sauvegardees",
      dueCountLabel: "Dues parmi elles",
      pendingCountLabel: "En review",
      listTitle: "Queue de bookmarks",
      listDescription:
        "Une vue compacte des questions a revisiter, entre cartes dues, reponses ouvertes en attente et references stables.",
      saveAction: "Sauvegarder",
      removeAction: "Retirer",
      openLessonAction: "Lire le cours",
      openModuleAction: "Ouvrir le module",
      launchPracticeAction: "Lancer une practice",
      savedAtLabel: "Sauvegardee le",
      emptyTitle: "Aucune question sauvegardee pour l'instant",
      emptyDescription:
        "Sauvegarde une question depuis une session live, une carte de review ou un rapport de mock pour la garder a portee.",
      statusLabels: {
        saved: "Sauvegardee",
        due: "Due maintenant",
        pendingReview: "En review",
        stable: "Reference stable",
      },
    },
    notes: {
      title: "Notes personnelles",
      description:
        "Garde ton propre langage d'entretien au plus pres des questions que tu veux mieux defendre la prochaine fois.",
      noteCountLabel: "Notes sauvegardees",
      dueCountLabel: "Dues parmi les notes",
      pendingCountLabel: "En review",
      listTitle: "Notes recentes",
      listDescription:
        "Une recap compacte des questions sur lesquelles tu as note ta propre correction ou ton angle d'entretien.",
      editorTitle: "Note personnelle",
      editorPlaceholder:
        "Ecris le mecanisme, le piege ou la formulation exacte que tu veux retenir.",
      updatedAtLabel: "Mise a jour",
      saveAction: "Enregistrer la note",
      clearAction: "Effacer la note",
      openLessonAction: "Lire le cours",
      openModuleAction: "Ouvrir le module",
      launchPracticeAction: "Lancer une practice",
      emptyTitle: "Aucune note personnelle pour l'instant",
      emptyDescription:
        "Enregistre une note depuis la review, les bookmarks ou le feedback mock pour construire ton propre langage d'entretien.",
      statusLabels: {
        saved: "Sauvegardee",
        due: "Due maintenant",
        pendingReview: "En review",
        stable: "Reference stable",
      },
    },
    playlists: {
      title: "Playlists ciblees",
      description:
        "Des piles courtes generees a partir des vrais signaux du produit pour transformer le prochain clic en session utile.",
      savedTitle: "Playlists sauvegardees",
      savedDescription:
        "Les playlists que tu as choisi de conserver, renommer ou raccourcir pour une prochaine relance ciblee.",
      savedEmptyTitle: "Aucune playlist sauvegardee pour l'instant",
      savedEmptyDescription:
        "Sauvegarde d'abord une pile generee, puis affine-la question par question depuis sa page dediee.",
      savedDescriptionFallback:
        "Une pile de session reutilisable que tu as gardee pour une prochaine repetition ciblee.",
      emptyTitle: "Aucune playlist prete pour l'instant",
      emptyDescription:
        "Des que des reviews dues, des questions sauvegardees ou des prompts de rattrapage mock s'accumulent, React Mentor les assemblera ici.",
      questionCountLabel: "Questions",
      focusSkillsLabel: "Skills cibles",
      focusSkillsEmpty: "Aucun skill cible extrait pour l'instant.",
      updatedAtLabel: "Mise a jour",
      sourceLabel: "Source",
      modeLabels: {
        PRACTICE: "Bloc practice",
        REVIEW: "Bloc review",
        MOCK_INTERVIEW: "Mock interview",
      },
      kindLabels: {
        MANUAL: "Manuelle",
        GENERATED: "Generee",
      },
      launchAction: "Lancer la playlist",
      saveAction: "Sauvegarder la playlist",
      editAction: "Editer la playlist",
      backAction: "Retour aux playlists",
      saveChangesAction: "Enregistrer les changements",
      removeQuestionAction: "Retirer la question",
      readLessonAction: "Lire le cours",
      deleteAction: "Supprimer la playlist",
      openModuleAction: "Ouvrir le module",
      nameLabel: "Nom de la playlist",
      modeLabel: "Mode de session",
      descriptionLabel: "Description",
      manageTitle: "Gerer la playlist",
      manageDescription:
        "Renomme la pile, ajuste son angle et transforme progressivement une recommandation generee en parcours manuel reutilisable.",
      launchSavedTitle: "Lancer cette pile sauvegardee",
      launchSavedDescription:
        "L'ordre actuel des questions est conserve lors de la creation de la prochaine session.",
      dangerTitle: "Supprimer cette playlist",
      dangerDescription:
        "A utiliser seulement si cette pile n'a plus de valeur. Les questions sous-jacentes restent dans la bibliotheque.",
      questionsTitle: "Questions de la playlist",
      questionsDescription:
        "Une sequence ciblee que tu peux raccourcir si certains prompts ne meritent plus leur place dans la boucle.",
      questionOrderLabel: "Question {count}",
      questionDifficultyLabel: "Difficulte",
      questionTimeLabel: "Temps",
      emptyDetailTitle: "Cette playlist est maintenant vide",
      emptyDetailDescription:
        "Tu peux la supprimer, ou la garder comme placeholder en attendant des outils de curation plus complets.",
      types: {
        lessonFollowUp: {
          label: "Suivi de cours",
          description:
            "Les cours deja touches dans learn mais qui demandent encore verification, relance ou replay via un bloc court et cible.",
        },
        recoveryReview: {
          label: "Rattrapage review",
          description:
            "Des cartes dues regroupees autour des signaux les plus fragiles pour stabiliser rapidement la prochaine passe de review.",
        },
        mockRecovery: {
          label: "Retombee mock",
          description:
            "Des questions a recycler parce que la pression chronometree et les verdicts de rubric ne sont pas encore alignes avec ta readiness.",
        },
        bookmarks: {
          label: "Pile sauvegardee",
          description:
            "Les prompts bookmarkes regroupes pour relancer rapidement un bloc de practice court.",
        },
        notes: {
          label: "Relance notes",
          description:
            "Les questions qui portent deja ton propre langage d'entretien, pretes pour une nouvelle passe ciblee.",
        },
      },
    },
    admin: {
      title: "Admin contenu",
      description:
        "Creer les prochains modules, garder la qualite bilingue visible et empecher le contenu publie de s'ecarter du contrat editorial.",
      totalLabel: "Total",
      stats: {
        modulesLabel: "Modules",
        skillsLabel: "Skills",
        questionsLabel: "Questions",
        publishableLabel: "Questions publiables",
        translationGapLabel: "Ecarts de traduction",
        pitfallTagsLabel: "Tags de pieges",
      },
      createModuleTitle: "Creer un module",
      createModuleDescription:
        "Ajoute un socle de module bilingue avec track, niveau et statut editorial.",
      createSkillTitle: "Creer une skill",
      createSkillDescription:
        "Rattache une nouvelle skill a un module avec les libelles FR et EN des le depart.",
      createQuestionTitle: "Creer une question",
      createQuestionDescription:
        "Ouvre une nouvelle question bilingue en une passe, sur formats fermes comme sur formats a prompt libre.",
      createPitfallTagTitle: "Creer un tag de piege",
      createPitfallTagDescription:
        "Ajoute un tag reutilisable pour capturer une confusion recurrente et la rattacher ensuite aux questions.",
      inventoryTitle: "Inventaire editorial recent",
      inventoryDescription:
        "Une vue compacte de ce qui a bouge recemment et de ce qui bloque encore la publication.",
      qualityTitle: "Qualite editoriale",
      qualityDescription:
        "Des signaux rapides sur la dette de traduction, le risque de doublon, la fraicheur des cours publies, la couverture taxonomique vide et les modules encore trop maigres.",
      qualityTranslationGapsLabel: "Questions avec ecarts de traduction",
      qualityUntaggedQuestionsLabel: "Questions sans tag de piege",
      qualityThinModulesLabel: "Modules trop maigres",
      qualityFreshnessReviewLabel: "Questions publiees a relire pour fraicheur",
      qualityDuplicateCandidatesLabel: "Candidats doublons de prompt",
      qualityCoverageLabel: "Photo de couverture",
      qualityNoThinModules: "Aucun module trop maigre detecte.",
      qualityFreshnessTitle: "Queue de freshness review",
      qualityFreshnessDescription:
        "Les cours publies plus vieux que la fenetre de fraicheur, pour les relire avant que la bibliotheque learn ne derive du contrat actuel.",
      qualityFreshnessEmpty:
        "Aucun cours publie n attend de freshness review pour l instant.",
      qualityFreshnessWindowLabel: "Fenetre review de {count}j",
      qualityFreshnessAgeLabel: "{count} jours depuis la derniere mise a jour",
      qualityIssuesCountLabel: "{count} points de checklist",
      qualityIssuesCountZero: "Aucun point de checklist",
      qualityJumpToQuestionAction: "Aller a la question",
      qualityDuplicateTitle: "Veille doublons de prompt",
      qualityDuplicateDescription:
        "Les collisions exactes de prompt remontent ici pour fusionner, archiver ou recadrer le contenu avant que le benchmark ne grossisse.",
      qualityDuplicateEmpty: "Aucun doublon exact de prompt detecte.",
      qualityDuplicateCountLabel: "{count} questions dans le cluster",
      qualitySourceFallback: "Source non renseignee",
      pitfallTagsListTitle: "Tags de pieges recents",
      pitfallTagsListDescription:
        "Garde le vocabulaire des confusions propre et visible avant qu'il ne se propage dans le reporting.",
      filtersTitle: "Filtres questions",
      modulesListTitle: "Modules recents",
      skillsListTitle: "Skills recentes",
      questionsListTitle: "Questions recentes",
      checklistTitle: "Checklist de publication",
      slugLabel: "Slug",
      trackLabel: "Track",
      levelLabel: "Niveau",
      orderLabel: "Ordre",
      statusLabel: "Statut",
      moduleLabel: "Module",
      skillLabel: "Skill principale",
      formatLabel: "Format",
      difficultyLabel: "Difficulte",
      estimatedTimeSecLabel: "Temps estime (sec)",
      sourceTypeLabel: "Type de source",
      pitfallTagTitleLabel: "Titre du tag de piege",
      pitfallTagDescriptionLabel: "Description du tag de piege",
      pitfallTagSelectionLabel: "Tags de pieges",
      correctOptionIndexesLabel:
        "Indexes des bonnes options (exemple: 2 ou 1,3)",
      optionLabelsFrLabel: "Libelles options FR",
      optionExplanationsFrLabel: "Explications options FR",
      optionLabelsEnLabel: "Libelles options EN",
      optionExplanationsEnLabel: "Explications options EN",
      titleFrLabel: "Titre FR",
      titleEnLabel: "Titre EN",
      descriptionFrLabel: "Description FR",
      descriptionEnLabel: "Description EN",
      summaryFrLabel: "Resume FR",
      summaryEnLabel: "Resume EN",
      promptFrLabel: "Prompt FR",
      promptEnLabel: "Prompt EN",
      explanationFrLabel: "Explication FR",
      explanationEnLabel: "Explication EN",
      takeawaysFrLabel: "Takeaways FR",
      takeawaysEnLabel: "Takeaways EN",
      takeawaysHint: "Un takeaway par ligne.",
      createModuleAction: "Creer le module",
      createSkillAction: "Creer la skill",
      createQuestionAction: "Creer la question",
      createPitfallTagAction: "Creer le tag de piege",
      editAction: "Editer les details",
      saveChangesAction: "Enregistrer les changements",
      exportAction: "Exporter le JSON",
      importTitle: "Importer un JSON",
      importDescription:
        "Importe un fichier ou colle le contrat d'export pour upserter modules, skills, tags de pieges et questions sans supprimer les lignes absentes.",
      importPayloadPlaceholder: "Colle ici le payload JSON admin contenu.",
      importAction: "Importer le contenu",
      updateStatusAction: "Mettre a jour le statut",
      openAction: "Ouvrir",
      applyFiltersAction: "Appliquer les filtres",
      clearFiltersAction: "Effacer les filtres",
      allStatusesOption: "Tous les statuts",
      allFormatsOption: "Tous les formats",
      updatedAtLabel: "Mise a jour",
      optionsCountLabel: "Options",
      attemptsCountLabel: "Tentatives",
      questionLinksCountLabel: "Questions liees",
      publishableState: "Prete a publier",
      blockedState: "Bloquee",
      emptyInventory: "Aucun contenu trouve pour l'instant.",
      pitfallTagSelectionHint:
        "Rattache les confusions les plus probables pour garder les plans de recovery et les exports coherents.",
      noPitfallTagsHint:
        "Aucun tag de piege pour l'instant. Cree-en un avant de le rattacher aux questions.",
      formatScopeHint:
        "Les questions fermees attendent des libelles/explications bilingues et la liste des indexes corrects.",
      optionEditorHint:
        "Pour les formats fermes, mets une option par ligne et garde le meme nombre de lignes entre libelles et explications.",
      correctOptionIndexesHint:
        "Les indexes sont 1-based et separent par des virgules. Le single-choice attend exactement un index correct.",
      optionsLockedHint:
        "Les options sont verrouillees des qu'une question fermee a deja des tentatives, pour ne pas casser l'historique des reponses.",
      telemetry: {
        title: "Telemetry produit et operations",
        description:
          "Une lecture compacte du funnel reel, des activations utiles et des incidents recents sur les endpoints critiques.",
        analyticsWindowLabel: "Derniers {count} jours",
        operationalWindowLabel: "Derniers {count} jours",
        totalEventsLabel: "Evenements produits",
        activeUsersLabel: "Utilisateurs actifs",
        onboardingCompletedLabel: "Onboardings completes",
        mockCompletedLabel: "Mocks completes",
        questionAnsweredLabel: "Questions repondues",
        subscriptionStartedLabel: "Abonnements demarres",
        checkoutCompletedLabel: "Checkouts completes",
        errorCountLabel: "Erreurs",
        warningCountLabel: "Warnings",
        infoCountLabel: "Infos",
        billingWebhookLabel: "Events billing webhook",
        contentImportLabel: "Imports contenu",
        lifecycleEmailsLabel: "Emails lifecycle",
        lifecycleEmailFailuresLabel: "Echecs email",
        reviewReminderJobsLabel: "Jobs review reminder",
        funnelTitle: "Funnel activation",
        funnelDescription:
          "Du compte cree au premier mock, pour voir ou la boucle d'apprentissage se casse vraiment.",
        conversionLabel: "Conversion",
        recentProductEventsTitle: "Evenements produit recents",
        recentOperationalEventsTitle: "Evenements operationnels recents",
        topSourcesTitle: "Sources les plus bruyantes",
        emptyProductEvents:
          "Aucun evenement produit capture dans la fenetre actuelle.",
        emptyOperationalEvents:
          "Aucun evenement operationnel capture dans la fenetre actuelle.",
        emptySources: "Aucune source operationnelle a remonter pour l'instant.",
        notAvailableLabel: "n/a",
        funnelStepLabels: {
          signup: "Signup",
          onboarding: "Onboarding",
          firstPractice: "Premier practice",
          repeatPractice: "Deuxieme practice",
          firstMock: "Premier mock",
        },
        levelLabels: {
          INFO: "Info",
          WARN: "Warning",
          ERROR: "Erreur",
        },
        eventLabels: {
          ACCOUNT_CREATED: "Compte cree",
          ONBOARDING_COMPLETED: "Onboarding complete",
          SESSION_STARTED: "Session demarree",
          SESSION_COMPLETED: "Session terminee",
          REVIEW_LAUNCHED: "Review lancee",
          QUESTION_ANSWERED: "Question repondue",
          LESSON_VIEWED: "Cours consulte",
          LESSON_CHECKPOINT_COMPLETED: "Checkpoint de cours complete",
          LESSON_REVIEW_QUEUED: "Cours ajoute a la review",
          BOOKMARK_CREATED: "Bookmark cree",
          NOTE_CREATED: "Note creee",
          UPGRADE_CLICKED: "Upgrade clique",
          CHECKOUT_COMPLETED: "Checkout complete",
          SUBSCRIPTION_STARTED: "Abonnement demarre",
          MOCK_COMPLETED: "Mock termine",
        },
      },
      statusLabels: {
        DRAFT: "Brouillon",
        IN_REVIEW: "En review",
        PUBLISHED: "Publie",
        ARCHIVED: "Archive",
      },
      translationStatusLabels: {
        MISSING: "Manquante",
        IN_PROGRESS: "En cours",
        REVIEW: "En review",
        READY: "Prete",
      },
      issueLabels: {
        missingFrCore: "Prompt ou explication FR manquant",
        missingEnCore: "Prompt ou explication EN manquant",
        missingFrTakeaways: "Takeaways FR manquants",
        missingEnTakeaways: "Takeaways EN manquants",
        missingClosedOptions:
          "La question fermee demande au moins deux options",
        missingClosedCorrectOption:
          "La configuration des bonnes options est invalide",
        missingClosedDistractors:
          "La question fermee doit garder au moins un distracteur",
        missingClosedFrOptions:
          "Des libelles ou explications FR manquent sur les options",
        missingClosedEnOptions:
          "Des libelles ou explications EN manquent sur les options",
      },
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
      selectionRequired: "Selectionne au moins une reponse avant de valider.",
      responseRequired: "Ecris une reponse avant de valider.",
      correctState: "Correct",
      incorrectState: "Incorrect",
      pendingReviewState: "Enregistree pour review",
      pendingReviewHint:
        "Cette reponse est bien enregistree, mais elle n'influence pas encore le score car elle demande une review manuelle.",
      answerModeLabelSingle: "Reponse unique",
      answerModeLabelMultiple: "Reponses multiples",
      answerModeLabelOpen: "Reponse ouverte",
      openAnswerHint:
        "Ecris ta reponse, puis valide pour l'enregistrer et continuer.",
      bugHuntHint:
        "Selectionne les lignes suspectes, explique le bug, puis valide pour enregistrer l'analyse.",
      keyboardHintSingle:
        "Utilise les touches 1-{count} pour choisir puis Entree pour valider.",
      keyboardHintMultiple:
        "Utilise les touches 1-{count} pour activer ou retirer des reponses, puis Entree pour valider.",
      explanationTitle: "Mecanisme",
      takeawaysTitle: "A retenir",
      openResponseLabel: "Ta reponse",
      openResponsePlaceholder:
        "Donne le mecanisme, le compromis et la formulation que tu defendrais en entretien.",
      codeResponseLabel: "Ton code ou snippet",
      codeResponsePlaceholder:
        "Ecris le code ou pseudo-code que tu defendrais pendant l'entretien.",
      codeLanguageLabel: "Langage",
      codeLanguagePlaceholder: "tsx",
      bugHuntSnippetLabel: "Snippet a analyser",
      bugHuntSummaryLabel: "Ton analyse du bug",
      bugHuntSummaryPlaceholder:
        "Explique ce qui casse, pourquoi c'est risque et quel changement tu ferais.",
      bugHuntSelectedLinesLabel: "Lignes selectionnees",
      recoveryTitle: "La reponse n'est pas encore enregistree",
      recoveryHint:
        "Ta selection est conservee. Reessaie l'enregistrement ou ajuste ta reponse avant de valider a nouveau.",
      timerLabel: "Timer mock",
      timeRemainingLabel: "Temps restant",
      timeBudgetLabel: "Budget temps",
      timeSpentLabel: "Temps utilise",
      timedModeBadge: "Simulation chronometree",
      timerExpiredToast:
        "Le temps est ecoule. Le mock est en train d'etre cloture.",
      completedBadge: "Session terminee",
      completedTitle: "Session terminee",
      mockReportTitle: "Rapport de mock",
      mockReportDescription:
        "Un premier signal de pression pour verifier si la qualite de reponse tient sous la contrainte du template.",
      mockPressureLabel: "Lecture de pression",
      mockSkillsTitle: "Skills testees dans ce mock",
      mockSkillsSummary:
        "{correct} bonnes reponses sur {total} questions pour cette skill.",
      mockSkillsPendingSummary:
        "{correct} bonnes reponses sur {graded} auto-corrigees, {pending} en attente de review sur cette skill.",
      mockRiskTitle: "Principales chutes a revoir",
      mockRiskStates: {
        incorrect: "Reponse incorrecte",
        pendingReview: "Verdict manuel en attente",
        unanswered: "Question laissee sous pression",
      },
      mockRiskEmpty:
        "Aucune chute majeure n'a ete detectee dans ce mock. Garde quand meme les points a verbaliser ci-dessous pour la prochaine passe.",
      mockRubricTitle: "Grille de lecture",
      mockRubricFocusTitle: "Points a recuperer",
      rubricCriteriaLabels: {
        accuracy: "exactitude technique",
        mechanism: "mecanisme explique",
        tradeoffs: "tradeoffs et limites",
        clarity: "clarte du sketch",
        rootCause: "cause racine",
        evidence: "preuves dans le snippet",
        repair: "fix propose",
      },
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
      gradedAnswersLabel: "Reponses notees",
      pendingReviewCountLabel: "En review",
      questionsAnsweredLabel: "Questions traitees",
      scorePendingLabel: "En review",
      minutesShort: "{count} min",
      errors: {
        unauthorized: "Ta session a expire. Reconnecte-toi.",
        invalid: "Cet item de session n'est plus valide.",
        unsupported:
          "Ce format de question n'est pas encore pris en charge dans le player live.",
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
      lessonSignalsTitle: "Boucle de signal learn",
      lessonSignalsDescription:
        "Ce que tu as deja etudie dans learn, ce qui manque encore de verification et ce qui doit nourrir la prochaine relance ciblee.",
      lessonQueueTitle: "Cours a relancer maintenant",
      lessonQueueDescription:
        "Une queue courte construite depuis les cours vus, les checkpoints manquants et les signaux de review issus de learn.",
      lessonTrackedLabel: "Cours suivis",
      lessonReviewDueLabel: "A revoir",
      lessonUnverifiedLabel: "Encore non verifies",
      lessonCheckpointReadyLabel: "Checkpoint valide",
      lessonViewsLabel: "Lectures",
      lessonCheckpointCountLabel: "Checkpoints",
      lessonOpenAction: "Ouvrir le cours",
      lessonPracticeAction: "Lancer une practice ciblee",
      lessonStatusLabels: {
        reviewDue: "A revoir",
        unverified: "Pas encore verifie",
        checkpointReady: "Checkpoint valide",
        lessonViewed: "Cours vu",
        studied: "Etudie",
      },
      emptyModuleAction: "Ouvrir le module recommande",
      emptyReviewAction: "Ouvrir le review lab",
      emptyLearnAction: "Ouvrir la bibliotheque learn",
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
      signalStates: {
        high: "signal solide",
        medium: "signal moyen",
        low: "signal mince",
      },
      masteryCapLabel: "Cap actuel {score}/100",
      confidenceLabel: "Confiance {score}/100",
      recentAttemptsLabel: "Attempts recentes: {count}",
      questionsCoveredLabel: "Questions couvertes: {count}",
      recentFailuresLabel: "Echecs recents: {count}",
      lastSignalLabel: "Dernier signal: {date}",
      weightedAccuracyLabel: "Precision ponderee: {score}",
      boostScoreLabel: "Boosts actuels: +{score}",
      penaltyScoreLabel: "Penalites actuelles: -{score}",
      freshnessCapDetailLabel:
        "Cap de fraicheur: {score}/100 apres {days} jours",
      confidenceDriversLabel:
        "Confiance construite via couverture {coverage}, largeur {breadth}, fraicheur {freshness}",
      actions: {
        startRecoveryReview: "Lancer une review ciblee",
        openPendingReview: "Ouvrir les reviews en attente",
        openRecoveryModule: "Ouvrir le module",
      },
      recoveryReasons: {
        dueNow: "{count} cartes dues attendent deja sur ce skill.",
        pendingReview:
          "{count} reponses ouvertes demandent encore un verdict avant de fiabiliser le signal.",
        weakSignal:
          "La couverture reste trop mince ou trop recente pour faire confiance a ce skill sous pression.",
      },
      recoveryQuestionsLabel: "Questions de rattrapage",
      emptyTitle: "Aucun signal d'apprentissage pour l'instant",
      emptyDescription:
        "Les graphiques de progression deviendront utiles apres tes premieres vraies tentatives. Commence par un module pour generer les premiers points de donnees.",
    },
    mockInterviews: {
      timedMode: "mode chronométré",
      launchTemplate: "Lancer le template",
      templateUnavailable:
        "Aucune question exploitable n'est encore disponible pour ce preset.",
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
        steady:
          "Dans une zone de {count} pts autour de la moyenne des mocks precedents.",
      },
      templateSignalsTitle: "Signaux par template",
      templateSignalsDescription:
        "Les presets qui tiennent deja sous pression et ceux qui demandent encore une passe.",
      criterionSignalsTitle: "Carte de friction par critere",
      criterionSignalsDescription:
        "Une lecture transverse des criteres qui cassent encore le plus souvent lors des reviews manuelles.",
      criterionReviewCountLabel: "Reponses reviewees",
      criterionMissingLabel: "Verdicts manquants",
      criterionPartialLabel: "Verdicts partiels",
      recommendedTemplateTitle: "Prochain mock recommande",
      recommendedTemplateDescription:
        "Le preset chronometre suivant derive du template le plus fragile et des frictions actuellement detectees.",
      recommendedTemplateReasons: {
        repeatWeakest:
          "Refais le template qui casse encore le plus souvent avant que le pattern d'echec ne se fixe.",
        trackRecovery:
          "Remets le track le plus fragile sous pression avec un round de rattrapage plus court.",
        defenseRecovery:
          "Remonte sous pression l'explication de code, l'analyse de bug et la defense des tradeoffs.",
        coreRecovery:
          "Reconstruis le socle React coeur avant d'elargir de nouveau la surface.",
      },
      launchRecommendedTemplate: "Lancer le mock recommande",
      weaknessTitle: "Carte de faiblesse transverse",
      weaknessDescription:
        "Les zones fragiles ou les verdicts mock, les reviews dues et la curation personnelle pointent encore ensemble.",
      weaknessAverageLabel: "Score moyen",
      weaknessDueLabel: "Cartes dues",
      weaknessBookmarksLabel: "Bookmarks",
      weaknessNotesLabel: "Notes",
      weaknessCriterionLabel: "Critere sous pression",
      weaknessPromptLabel: "Questions a recycler",
      openWeaknessModuleAction: "Ouvrir le module",
      openLessonAction: "Lire le cours",
      recoveryTitle: "Prompts de rattrapage a relancer maintenant",
      recoveryDescription:
        "Les questions qui doivent alimenter la prochaine boucle de correction parce que la pression mock et le reste du workspace convergent dessus.",
      recoveryStatusLabels: {
        due: "due maintenant",
        saved: "signal sauvegarde",
      },
      launchRecoveryReviewAction: "Lancer la review ciblee",
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
      pendingTitle: "Reviews manuelles en attente",
      pendingDescription:
        "Les attempts ouvertes demandent un verdict manuel avant d'impacter la readiness et les scores.",
      launchTitle: "Transformer les cartes dues en session de review",
      launchDescription:
        "Lance une boucle de review ciblée avant que les intuitions fragiles ne se dégradent davantage. Le moteur priorise d'abord les cartes les plus en retard et les plus instables.",
      launchAction: "Lancer une session review",
      launchUnavailable:
        "Aucune session review n'est disponible pour l'instant car aucune carte n'est encore due.",
      dueNowLabel: "Cartes dues maintenant",
      nextSessionSizeLabel: "Cartes dans la prochaine session",
      pendingCountLabel: "Verdicts en attente",
      yourAnswerLabel: "Ta reponse",
      referenceLabel: "Correction de reference",
      selectedLinesLabel: "Lignes selectionnees",
      rubricVerdictsTitle: "Verdict par critere",
      reviewSummaryLabel: "Synthese de review",
      reviewSummaryPlaceholder:
        "Note le trou principal, l'argument qui manque ou la formulation a rehearser.",
      saveRubricAction: "Enregistrer la review",
      rubricVerdictLabels: {
        solid: "solide",
        partial: "partiel",
        missing: "manquant",
      },
      rubricTitle: "Rubric de review",
      rubricFocusTitle: "Points a entendre ou verifier",
      openLessonAction: "Lire le cours",
      rubricCriteriaLabels: {
        accuracy: "exactitude technique",
        mechanism: "mecanisme explique",
        tradeoffs: "tradeoffs et limites",
        clarity: "clarte du sketch",
        rootCause: "cause racine",
        evidence: "preuves dans le snippet",
        repair: "fix propose",
      },
      markCorrectAction: "Marquer solide",
      markIncorrectAction: "Marquer fragile",
      emptyPendingTitle: "Aucune review manuelle en attente",
      emptyPendingDescription:
        "Des qu'une question ouverte ou un bug hunt est termine, il apparait ici jusqu'a ce que tu lui donnes un verdict.",
      urgencyLabels: {
        critical: "A revoir maintenant",
        high: "A revoir aujourd'hui",
        normal: "Programmee",
      },
      responseLabels: {
        text_response: "Reponse ecrite",
        code_response: "Sketch de code",
        bug_hunt_response: "Analyse de bug",
      },
      reasonLabels: {
        overdue:
          "Cette card est en retard de review et doit revenir avant que l'intuition ne se degrade davantage.",
        failedRecently:
          "Ce sujet reste instable et a besoin d'une boucle de feedback courte.",
        weakSkill:
          "Le skill parent reste fragile ou peu fiable, donc cette question aide a consolider le signal.",
        mockFallout:
          "Cette question a cede en mode mock et doit revenir vite avant le prochain round sous pression.",
        lessonQueued:
          "Ce cours a ete vu dans learn mais n'a pas encore ete transforme en pratique espacee stable.",
        checkpointFailed:
          "Le checkpoint de cours a echoue, donc cette card doit revenir avant que la mauvaise explication ne durcisse.",
        scheduled:
          "Cette question revient pour verifier que le mecanisme a vraiment tenu dans le temps.",
      },
      lessonSignalBadge: "Signal learn",
      lessonNoPracticeBadge: "Pas encore de practice",
      lessonCheckpointFailedBadge: "Checkpoint echoue",
      lessonViewsLabel: "Lectures",
      checkpointAttemptsLabel: "Checkpoints",
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
      shortcutTitle: "Raccourcis de rattrapage",
      shortcutDescription:
        "Va directement vers les cartes et verdicts qui bloquent encore les signaux les plus fragiles.",
      shortcutReasons: {
        dueNow: "{count} cartes dues s'accumulent deja sur ce skill.",
        pendingReview:
          "{count} reponses ouvertes attendent encore un verdict manuel sur ce skill.",
        weakSignal:
          "Ce skill demande encore une passe avant que le signal devienne fiable.",
      },
      shortcutActions: {
        startRecoveryReview: "Lancer la review skill",
        openPendingReview: "Ouvrir l'attente",
        openModule: "Ouvrir le module",
      },
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
      lifecycleEmailsTitle: "Emails lifecycle",
      lifecycleEmailsDescription:
        "Garde la main sur les rappels utiles sans transformer la preparation en bruit de notification.",
      lifecycleEmailsLabel: "Recevoir les emails utiles de progression",
      lifecycleEmailsHint:
        "Welcome email, rappels review due et futurs resumes utiles. Tu pourras le couper a tout moment.",
      summaryTitle: "Profil operationnel actuel",
      summaryDescription:
        "Une lecture compacte de la maniere dont React Mentor va structurer le prochain cycle de travail.",
      summaryTargetLabel: "Cible active",
      summaryWeeklyGoalLabel: "Volume hebdo",
      summaryFocusModeLabel: "Mode de focus",
      summaryTracksLabel: "Couverture tracks",
      summaryEmailsLabel: "Emails lifecycle",
      summaryEmailsEnabled: "Actifs",
      summaryEmailsDisabled: "Desactives",
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
        targetRoleRequired:
          "Definis le role que React Mentor doit vraiment optimiser",
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
        focus: [
          "reconciliation",
          "keys",
          "referential equality",
          "derived state",
        ],
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
        summary: "Generics solides, encore trop prudent sur les utility types.",
      },
      {
        title: "Practice Sprint · React Native",
        summary: "Layout correct, perf FlatList encore à muscler.",
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
  learn: {
    formatLabels: {
      SINGLE_CHOICE: "Choix simple",
      MULTIPLE_CHOICE: "Choix multiple",
      CODE_OUTPUT: "Sketch de code",
      BUG_HUNT: "Bug hunt",
      OPEN_ENDED: "Reponse ouverte",
    },
    gating: {
      workspaceTitle: "Transformer la lecture en vraie boucle d entrainement",
      workspaceDescription:
        "L experience learn complete vit dans le workspace : signaux de cours, checkpoints, practice ciblee et renvoi en review.",
      highlights: [
        "suivre les cours vus et les resultats de checkpoint",
        "lancer une practice ciblee directement depuis un cours",
        "renvoyer les cours en review espacee",
      ],
      collectionPreviewTitle: "Apercu de la collection",
      collectionPreviewDescription:
        "Tu peux inspecter ici la sequence et la couverture des sujets. La boucle guidee complete reste dans le workspace dashboard.",
      questionPreviewTitle: "Apercu du cours",
      questionPreviewDescription:
        "Cette page publique garde le prompt et le cadrage entretien visibles, mais le cours complet vit dans dashboard learn.",
    },
    index: {
      badge: "Bibliotheque learn",
      title: "Des cours d'entretien detailles, relies a la pratique.",
      description:
        "Une bibliotheque structuree de questions d'entretien, d'explications plus profondes et de boucles de pratique pensees pour rester tres pedagogiques pour les debutants sans devenir superficielles.",
      collectionsTitle: "Collections editoriales",
      collectionsDescription:
        "Des series curiees qui regroupent les questions par cluster de skill, pas seulement par frontiere de module.",
      questionCountLabel: "Questions",
      previewQuestionsLabel: "Apercu des questions",
      openCollection: "Ouvrir la collection",
      emptyTitle: "Aucune collection publiee pour l'instant",
      emptyDescription:
        "Au fur et a mesure que la bibliotheque editoriale grandit, les collections publiees apparaitront ici avec leurs cours et leurs pratiques ciblees.",
    },
    collection: {
      backToLibrary: "Retour a la bibliotheque learn",
      questionCountLabel: "Questions dans la collection",
      openQuestion: "Ouvrir le cours",
      focusedPractice: "Pratiquer cette question",
      startCollectionPractice: "Lancer une practice de collection",
      practiceCardTitle: "Boucle de pratique ciblee",
      practiceCardDescription:
        "Passe directement de la lecture a une courte pile de pratique construite depuis cette collection.",
      emptyTitle:
        "Aucune question publiee n'est encore disponible dans cette collection",
      emptyDescription:
        "La collection est prete a etre curationnee, mais il lui manque encore du contenu de question publie.",
    },
    question: {
      backToLibrary: "Retour a la bibliotheque learn",
      relatedCollectionsTitle: "Apparait aussi dans",
      tlDrTitle: "TL;DR",
      shortAnswerTitle: "Reponse prete pour entretien",
      lessonTitle: "Explication detaillee",
      exampleTitleFallback: "Exemple commente",
      commonMistakesTitle: "Erreurs frequentes",
      takeawaysTitle: "A retenir",
      optionBreakdownTitle: "Lecture des options",
      bugHuntSnippetTitle: "Snippet a relire",
      verbalizePointsTitle: "Ce qu'il faut verbaliser en entretien",
      learningLoopTitle: "Transformer ce cours en signal utile",
      learningLoopDescription:
        "Marque le cours comme etudie, valide si tu sais deja l'expliquer, ou pousse-le dans ta review avant d'ouvrir une practice ciblee.",
      learningStateEmpty:
        "Aucun signal encore sur ce cours. Commence par le marquer comme etudie ou utilise un checkpoint rapide.",
      learningStateLabels: {
        viewed: "Cours vu",
        checkpointReady: "Checkpoint valide",
        reviewDue: "A revoir",
      },
      lessonViewsLabel: "Lectures",
      checkpointAttemptsLabel: "Checkpoints",
      checkpointPassCountLabel: "Validations",
      markLessonViewedAction: "Marquer comme etudie",
      checkpointCard: {
        title: "Mini-checkpoint",
        description:
          "Teste le mecanisme avant de t appuyer sur la lecture detaillee. Si tu es connecte, le resultat met aussi a jour ton signal de cours.",
        singleChoiceHint: "Choisis la reponse la plus solide.",
        multipleChoiceHint: "Choisis toutes les reponses qui doivent etre vraies.",
        validateAction: "Verifier ma reponse",
        resetAction: "Reinitialiser",
        selectionRequired: "Selectionne au moins une option d abord.",
        passedTitle: "Checkpoint valide",
        passedDescription:
          "Bien. Ce cours peut maintenant passer en practice ciblee ou en review espacee.",
        failedTitle: "Checkpoint manque",
        failedDescription:
          "Rejoue l explication, puis ajoute ce cours a la review ou retente le checkpoint.",
        correctAnswerLabel: "Bonne reponse",
      },
      manualCheckpointTitle: "Checkpoint manuel",
      manualCheckpointDescription:
        "Ce format de cours ne supporte pas encore d auto-correction. Utilise les boutons d auto-evaluation pour enregistrer si tu sais deja expliquer le mecanisme.",
      checkpointReadyAction: "Je peux l'expliquer",
      checkpointReviewAction: "Je dois le revoir",
      addToReviewAction: "Ajouter a la review",
      signInToTrackTitle: "Connecte-toi pour garder une trace de ce cours",
      signInToTrackDescription:
        "Ton espace peut memoriser les cours lus, les checkpoints reussis et les notions a revoir pour relancer la bonne practice ensuite.",
      focusedPracticeTitle: "Transformer ce cours en pratique",
      focusedPracticeDescription:
        "Lance une session d'une seule question pour consolider l'explication tout de suite.",
      focusedPracticeAction: "Lancer une practice ciblee",
      openModuleAction: "Ouvrir le module",
      relatedQuestionsTitle: "Continuer avec des questions liees",
      relatedQuestionsDescription:
        "Ces cours restent proches du meme skill ou du meme module pour transformer la lecture en repetition utile.",
      openRelatedLessonAction: "Ouvrir le cours lie",
      startRelatedPracticeAction: "Pratiquer cette question",
      continueCollectionTitle: "Continuer dans cette collection",
      previousQuestionAction: "Question precedente",
      nextQuestionAction: "Question suivante",
      openCollectionAction: "Ouvrir la sequence",
      collectionProgressLabel: "{current} / {total}",
      startOfCollectionLabel: "Tu es au debut de cette collection.",
      endOfCollectionLabel: "Tu es a la fin de cette collection.",
      estimatedReadMinutesLabel: "{count} min de lecture",
      moduleLabel: "Module",
      skillLabel: "Skill principale",
      collectionLabel: "Collection",
    },
  },
} as const;

export default fr;
