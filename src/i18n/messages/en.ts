const en = {
  metadata: {
    title: "React Mentor",
    description:
      "The training cockpit to prepare for React, React Native and TypeScript interviews with a premium dashboard and deep explanations.",
  },
  common: {
    language: "Language",
    brandTagline: "Interview Training System",
    locales: {
      fr: "FR",
      en: "EN",
    },
    a11y: {
      toggleSidebar: "Toggle sidebar",
      closeSidebar: "Close sidebar",
      closeMobileSidebar: "Close mobile sidebar",
      openSidebar: "Open sidebar",
    },
    levels: {
      junior: "Junior",
      mid: "Mid",
      senior: "Senior",
    },
    actions: {
      logIn: "Log in",
      startTraining: "Start training",
      seeProduct: "See the product",
      createWorkspace: "Create my workspace",
      openReviewQueue: "Open review queue",
      alreadyHaveAccount: "I already have an account",
    },
    days: {
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      sun: "Sun",
    },
  },
  landing: {
    nav: {
      tracks: "Tracks",
      product: "Product",
      pricing: "Pricing",
    },
    hero: {
      badge:
        "An interview training platform designed for React people who want depth, not trivia.",
      titleLead: "Stop guessing in interviews.",
      titleAccent: "Build React answers you can defend.",
      description:
        "React Mentor turns your gaps into a progression system: focused modules, argumented feedback, smart reviews and a preparation cockpit.",
      stats: [
        {
          value: "240+",
          label: "argumented questions",
          detail: "with distractor rebuttals",
        },
        {
          value: "18",
          label: "mapped skills",
          detail: "React, RN, TS and architecture",
        },
        {
          value: "3 modes",
          label: "practice, review, mock",
          detail: "to train both recognition and recall",
        },
      ],
      dashboardLabel: "React Mentor Dashboard",
      dashboardSubLabel: "React Mid readiness · 81/100",
      nextReview: "next review in 42 min",
      weaknessTitle: "Weakness radar",
      weaknessDescription:
        "Effects and testing still need more stability.",
      sessionPulseTitle: "Session pulse",
      sessionPulseRange: "7d trend",
      misconceptionTitle: "Top misconception",
      misconceptionPriority: "priority",
      misconceptionPrompt:
        "\"Putting an array in the deps is enough to stabilize an effect.\"",
      misconceptionExplanation:
        "React compares references, not deep content. Without identity stability, the effect will rerun.",
    },
    product: {
      principleBadge: "Product principle",
      principleTitle: "One loop, three moves.",
      principleDescription:
        "React Mentor is designed as a learning system, not as a raw question bank.",
      loops: [
        {
          title: "Practice",
          description:
            "Immediate feedback, short snippets and stronger mental models.",
        },
        {
          title: "Review",
          description:
            "Revisit what truly needs reinforcement, with priority on repeated mistakes.",
        },
        {
          title: "Mock Interview",
          description:
            "Timed sessions with a report, a score and the points you must verbalize in an interview.",
        },
      ],
      pillars: [
        {
          title: "Fix the thinking, not only the answer",
          description:
            "Each correction explains the internal mechanism, the reasoning mistake and the points to mention in an interview.",
        },
        {
          title: "Track progress by skill",
          description:
            "The dashboard brings weak skills, solid modules and due reviews forward instead of vanity metrics.",
        },
        {
          title: "Move from quiz mode to interview mode",
          description:
            "The experience goes from fast drills to timed sessions and answer defense in context.",
        },
      ],
      experienceTitle: "What the user actually feels",
      experienceDescription:
        "A preparation experience that is clean, dense and motivating, without empty noise.",
      experienceBadge: "dashboard, review queue, mock interviews",
      experienceItems: [
        {
          title: "See where it breaks",
          text: "Weak skills and repeated mistakes surface before any vanity tracking.",
        },
        {
          title: "Review at the right time",
          text: "Failed questions come back into a clear queue instead of disappearing into history.",
        },
        {
          title: "Speak like it is a real interview",
          text: "Mock mode forces justification, not only recognition of the correct option.",
        },
      ],
    },
    tracks: {
      badge: "Skill architecture",
      title: "Tracks designed around interview signals.",
      description:
        "The product is organized around skills, not school-like chapters. The goal is to expose what recruiters actually test.",
      items: [
        {
          eyebrow: "Mental models",
          title: "React Core",
          summary:
            "Rendering, state, identity, reconciliation, forms, events and rerender causes.",
          highlights: ["keys", "derived state", "closures", "context boundaries"],
        },
        {
          eyebrow: "Frequent traps",
          title: "Hooks & Effects",
          summary:
            "Dependency arrays, stale closures, refs, custom hooks, useLayoutEffect and memoization strategies.",
          highlights: ["useEffect", "useRef", "memoization", "custom hooks"],
        },
        {
          eyebrow: "Strong interview signal",
          title: "TypeScript for React",
          summary:
            "Generics, inference, utility types, component typing, polymorphic APIs and constraints.",
          highlights: ["generics", "narrowing", "React typing", "conditional types"],
        },
        {
          eyebrow: "Mobile reality",
          title: "React Native",
          summary:
            "Flexbox, navigation, performant lists, gestures, platform specifics and screen architecture.",
          highlights: ["FlatList", "navigation", "performance", "platform APIs"],
        },
      ],
      liveModuleTitle: "Live module snapshot",
      liveModuleDescription:
        "What a logged-in user would see inside the progress dashboard.",
      reviewTitle: "Review queue preview",
      reviewDescription:
        "This is where the product earns its value: knowing what to review and why.",
    },
    trainingFlow: {
      mockBadge: "Mock interview mode",
      mockTitle: "Simulations that train recall under pressure.",
      mockDescription:
        "Not only multiple choice. You need to defend the answer, mention risks and explain tradeoffs.",
      templatesTitle: "Interview templates",
      templatesDescription:
        "Ready-to-run sessions to project quickly onto a target level.",
      premiumTitle: "Built for premium details",
      premiumDescription:
        "The product assumes a SaaS posture: brand direction, clean navigation, personal workspace and a coherent design system.",
      premiumItems: [
        "landing and dashboard tied together by the same visual identity",
        "retractable sidebar designed for long sessions",
        "skill mapping instead of empty completion percentages",
        "architecture ready for Neon, Better Auth and Prisma",
      ],
    },
    pricing: {
      badge: "Monetization ready for SaaS",
      title:
        "A product that can start as your own tool and scale into a business.",
      description:
        "The positioning is already clean: a useful free tier, a credible paid core and a premium sprint before applications.",
      monthlySuffix: " / month",
      choosePlan: "Choose {plan}",
      plans: [
        {
          title: "Starter",
          price: "Free",
          description:
            "To validate the format and get an early diagnosis.",
          features: [
            "2 active modules",
            "personal dashboard",
            "practice mode",
          ],
        },
        {
          title: "Mentor Pro",
          price: "€24",
          description:
            "The product core for serious React interview preparation.",
          features: [
            "all modules",
            "unlimited mock interviews",
            "review queue and weakness analytics",
          ],
        },
        {
          title: "Hiring Sprint",
          price: "€59",
          description:
            "For the two weeks before applications, with a more aggressive preparation mode.",
          features: [
            "intensive playlists",
            "argumentation reports",
            "revision plan by target role",
          ],
        },
      ],
    },
    final: {
      badge:
        "React Mentor is ready to become a serious SaaS foundation for learning.",
      title: "Train like the interview truly matters.",
      description:
        "The product now has a clear direction: a premium landing page, a progression system and a coherent authenticated space that turns preparation into a real asset.",
    },
  },
  auth: {
    layout: {
      badge: "Premium training workspace",
      title: "Build answers that survive follow-up questions.",
      description:
        "Step into a workspace designed to measure real mastery, not just the number of correct boxes.",
    },
    signIn: {
      badge: "Sign in to open your dashboard",
      title: "Welcome back",
      description:
        "Return to your modules, interview simulations and today’s review queue.",
      helper:
        "After sign-in, you land directly in your progression cockpit with a retractable sidebar, modules, mock interviews and scheduled reviews.",
      footer: "New here? Create your workspace",
    },
    signUp: {
      badge: "Build your React Mentor workspace",
      title: "Create your React Mentor account",
      description:
        "Start with a complete dashboard, modules ready to grow and a technical foundation aligned with Next 16, Tailwind, Better Auth and Prisma.",
      helper:
        "You create a personal workspace with a dashboard, skill progression, modules and review queues. The content layer is ready to be wired to Neon and Prisma with real data.",
      footerLead: "Already registered?",
      footerAction: "Log in",
    },
    fields: {
      name: "Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm",
    },
    placeholders: {
      name: "Yoann",
      email: "you@reactmentor.dev",
      password: "••••••••",
    },
    actions: {
      accessDashboard: "Access dashboard",
      createAccount: "Create my account",
      needAccount: "Need an account?",
      createInstead: "Create an account instead",
      alreadyRegistered: "Already registered?",
    },
    social: {
      readyTitle:
        "Social login is ready as soon as providers are configured.",
      readyDescription:
        "GitHub and Google automatically appear when OAuth keys are present in the environment.",
      or: "or",
      continueWithGithub: "Continue with GitHub",
      continueWithGoogle: "Continue with Google",
    },
    errors: {
      emailInvalid: "Enter a valid email address",
      passwordMin: "Password must contain at least 8 characters",
      nameMin: "Enter your name",
      confirmPasswordMin: "Confirm your password",
      passwordsMismatch: "Passwords do not match",
    },
    toasts: {
      welcomeBack: "Welcome back",
      workspaceCreated: "Workspace created",
      signInError: "Unable to sign in",
      signUpError: "Unable to create account",
      socialError: "Unable to sign in",
    },
  },
  onboarding: {
    badge: "First-run setup",
    title: "Give React Mentor enough context to coach you properly.",
    description:
      "This short setup prevents a generic dashboard and aligns the next modules, reviews and mock sessions with your actual objective.",
    steps: {
      goal: "Goal",
      tracks: "Tracks",
      cadence: "Cadence",
    },
    stepDescriptions: {
      goal: "Define the role and benchmark you are preparing for.",
      tracks: "Choose the stacks that should dominate recommendations.",
      cadence: "Set the weekly intensity and the posture of the training loop.",
    },
    panelTitle: "This setup will drive",
    panelDescription:
      "React Mentor uses these signals to rank modules, schedule reviews and decide how aggressive the product should be during short preparation windows.",
    panelItems: [
      "the default order of recommended modules",
      "the cadence of spaced reviews and weak-signal reminders",
      "the tone and density of future mock interviews",
      "the next best action surfaced in the dashboard",
    ],
    actions: {
      back: "Back",
      next: "Continue",
      finish: "Open dashboard",
      finishing: "Finishing...",
    },
  },
  dashboard: {
    pages: {
      overview: {
        title: "Preparation cockpit",
        description:
          "A clear picture of your readiness, weak spots and the next high-leverage moves.",
      },
      modules: {
        title: "Training library",
        description:
          "Modules organized around the skills that actually matter in React interviews.",
      },
      bookmarks: {
        title: "Saved questions",
        description:
          "Keep high-value prompts close so you can revisit them before the next interview round.",
      },
      notes: {
        title: "Personal notes",
        description:
          "Capture your own interview language, traps and reminders directly on the questions that matter.",
      },
      progress: {
        title: "Skill progression",
        description:
          "Track mastery by topic instead of celebrating empty completion percentages.",
      },
      mockInterviews: {
        title: "Interview simulations",
        description:
          "Run timed sessions and practice defending your technical reasoning.",
      },
      review: {
        title: "Review lab",
        description:
          "Focus on what slipped recently and what still sounds fragile under pressure.",
      },
      session: {
        title: "Live session",
        description:
          "Answer, validate and move through a real training sequence with immediate feedback.",
      },
      settings: {
        title: "Workspace settings",
        description:
          "Tune your target level, rhythm and focus before turning the training loop up.",
      },
    },
    sidebar: {
      appLabel: "interview workspace",
      todayFocusLabel: "Today focus",
      todayFocusFallback:
        "Tune your workspace and open a module to start shaping the next training loop.",
      todayFocusReview:
        "{count} due cards should be cleared before opening new drills.",
      todayFocusModule: {
        start: "Start {module} to align today with your active track.",
        grow: "Push {module}; it is the biggest growth surface in your current path.",
        reinforce: "Reinforce {module} before widening the surface.",
      },
      dueReviews: "{count} reviews due",
      activeTargetLabel: "Active target",
      activeTargetValue: "React Mid / Frontend Product",
      readiness: "{value} readiness",
      nav: {
        overview: {
          label: "Overview",
          description: "Global readiness and next actions",
        },
        modules: {
          label: "Modules",
          description: "Tracks, drills and question banks",
        },
        bookmarks: {
          label: "Bookmarks",
          description: "Saved prompts and revisit targets",
        },
        notes: {
          label: "Notes",
          description: "Personal reminders and interview phrasing",
        },
        progress: {
          label: "Progress",
          description: "Mastery by skill and session momentum",
        },
        mockInterviews: {
          label: "Mock Interviews",
          description: "Timed sessions and defense rounds",
        },
        review: {
          label: "Review Lab",
          description: "Due cards, weak spots and explanations",
        },
        settings: {
          label: "Settings",
          description: "Workspace, goals and training rhythm",
        },
      },
    },
    overview: {
      recommendedTitle: "Recommended next step",
      recommendedReviewTitle: "Clear the review queue before it hardens",
      recommendedDueLabel: "Due now",
      recommendedSessionSizeLabel: "Suggested review size",
      recommendedTrackLabel: "Priority track",
      recommendedProgressLabel: "Current progress",
      recommendedModuleAction: "Open recommended module",
      stats: [
        {
          label: "Preparation score",
          value: "81/100",
          change: "+9 this week",
        },
        {
          label: "Mastered questions",
          value: "124",
          change: "out of 240 active",
        },
        {
          label: "Reviews due today",
          value: "18",
          change: "spacing is active",
        },
        {
          label: "Mocks completed",
          value: "7",
          change: "latest score 84%",
        },
      ],
      statChanges: {
        readiness: "live readiness signal",
        mastered: "{count} out of {total} tracked questions",
        dueActive: "spacing queue is active",
        dueClear: "nothing due right now",
        mocks: "{count} completed timed sessions",
        noMocks: "no timed session yet",
      },
      weeklyMomentumTitle: "Weekly momentum",
      weeklyMomentumDescription:
        "Observe how answer quality evolves, not just the amount of questions completed.",
      skillReadinessTitle: "Skill readiness",
      skillReadinessDescription:
        "The skills that can already survive pressure and the ones that still need work.",
      dueTitle: "Due today",
      dueDescription:
        "The queue of questions to revisit before a bad intuition settles in.",
      startReviewAction: "Start review session",
      openReviewAction: "Open review lab",
      recentTitle: "Recent sessions",
      recentDescription:
        "A compact history to stay focused on feedback and useful decisions.",
      nextMockTitle: "Next recommended mock",
      nextMockDescription:
        "A suggested session based on your current weak zone.",
      launchMockAction: "Launch this mock",
      mockUnavailable: "This mock is not available yet because no playable question matches the preset.",
      urgencyLabels: {
        critical: "Review now",
        high: "Due today",
        normal: "Scheduled",
      },
      reasonLabels: {
        overdue: "This card is overdue and should come back before the intuition degrades further.",
        failedRecently:
          "This topic is still unstable and needs a short feedback loop.",
        weakSkill:
          "The parent skill is still fragile or low-confidence, so this question helps consolidate the signal.",
        mockFallout:
          "This question broke under mock pressure and should return before the next timed round.",
        scheduled:
          "This question is due again to verify that the mechanism actually stuck.",
      },
      emptyDueTitle: "No review cards due right now",
      emptyDueDescription:
        "The queue is clear for now. The best next move is to start a new practice session or a timed mock.",
      sessionModes: {
        PRACTICE: "Practice session",
        REVIEW: "Review session",
        MOCK_INTERVIEW: "Mock interview",
      },
      recentSessionDuration: "{count} min",
      recentSessionSummary: "{count} answers recorded in {mode}.",
      emptyRecentTitle: "No completed sessions yet",
      emptyRecentDescription:
        "As soon as you finish a practice, review or mock session, the recent activity will appear here.",
    },
    recommendation: {
      moduleTitle: "Focus next on {module}",
      reviewDescription:
        "{count} review cards are already due. A short review loop protects the concepts you already touched.",
      moduleDescriptions: {
        start:
          "This module matches your active track and has not been started yet. It is the cleanest next entry point.",
        grow:
          "This module still has the most room to grow for your active track, with enough surface to create momentum quickly.",
        reinforce:
          "This module is already moving and is the best place to reinforce before you widen the surface area.",
      },
    },
    modules: {
      recommendedTitle: "Recommended module path",
      recommendedReviewTitle: "Review should take priority over opening a new module",
      recommendedDueLabel: "Due cards",
      recommendedSessionSizeLabel: "Suggested review size",
      recommendedTrackLabel: "Priority track",
      recommendedProgressLabel: "Current progress",
      recommendedModuleAction: "Open recommended module",
      recommendedReviewAction: "Open review lab",
      recommendedBadge: "Recommended",
      completionLabel: "Module completion",
      attemptedSummary: "{count} attempted",
      masteredSummary: "{count} mastered",
      questionsSummary:
        "{count} questions currently active, with detailed explanations and interview-ready talking points.",
      stats: {
        activeTracksLabel: "Active tracks",
        activeTracksDetail: "currently represented in the content library",
        questionCountLabel: "Questions in library",
        questionCountDetail: "already modeled in the current seed",
        skillCountLabel: "Skills in library",
        skillCountDetail: "available as localized building blocks",
      },
      openModule: "Open module",
      architectureTitle: "Module architecture",
      architectureDescription:
        "The system is ready to go deeper: modules, skills, questions, progression and sessions are already designed at the data layer.",
      architectureItems: [
        "one module = one clear skill challenge",
        "one question = one primary skill + secondary traps",
        "one session = practice, review or mock interview",
        "mastery depends on quality and repetition, not raw volume",
      ],
      nextBuildOutTitle: "Next product layers",
      nextBuildOutDescription:
        "The next product layers can stack without breaking the current foundation.",
      nextBuildOutItems: [
        "admin editor for questions",
        "open answers with rubrics",
        "playlists by target role",
        "recommendations powered by repeated mistakes",
      ],
    },
    trackLabels: {
      REACT: "React",
      REACT_NATIVE: "React Native",
      TYPESCRIPT: "TypeScript",
      FRONTEND_SYSTEMS: "Frontend Systems",
    },
    moduleDetail: {
      backToLibrary: "Back to library",
      summaryFallback:
        "This module is already structured in the data layer and ready to power sessions, progression and review flows.",
      questionCountLabel: "Questions in module",
      skillCountLabel: "Skills covered",
      launchPractice: "Launch practice session",
      practiceUnavailable: "No playable question is available yet for this module.",
      skillsTitle: "Skills covered",
      skillsDescription:
        "Each skill should later feed practice sessions, review scheduling and weakness analytics.",
      positioningTitle: "Interview angle",
      positioningDescription:
        "This module should prepare the user to explain the mechanism, the trap and the tradeoff instead of reciting an API.",
      positioningItems: [
        "one clear topic cluster with explicit interview signals",
        "skills mapped before question volume grows",
        "designed to connect future sessions, review and mocks",
      ],
      nextBuildTitle: "Next delivery layers",
      nextBuildDescription:
        "The module page is now real data. The next step is to wire sessions, progress and recommendations on top of it.",
      nextBuildItems: [
        "practice mode launched from the module",
        "review sessions scoped to the module",
        "module-specific mock templates",
        "weakness insights tied to the covered skills",
      ],
    },
    bookmarks: {
      title: "Saved questions",
      description:
        "Collect the prompts you want to rehearse again, then jump back into a targeted practice loop.",
      savedCountLabel: "Saved now",
      dueCountLabel: "Due among saved",
      pendingCountLabel: "Pending review",
      listTitle: "Bookmark queue",
      listDescription:
        "A compact revisit list mixing due cards, pending open answers and stable reference prompts.",
      saveAction: "Save question",
      removeAction: "Remove bookmark",
      openModuleAction: "Open module",
      launchPracticeAction: "Start practice",
      savedAtLabel: "Saved",
      emptyTitle: "No saved question yet",
      emptyDescription:
        "Bookmark a question from a live session, review card or mock report to keep it in reach.",
      statusLabels: {
        saved: "Saved",
        due: "Due now",
        pendingReview: "Pending review",
        stable: "Stable reference",
      },
    },
    notes: {
      title: "Personal notes",
      description:
        "Keep your own interview wording close to the questions you want to defend better next time.",
      noteCountLabel: "Notes saved",
      dueCountLabel: "Due among noted",
      pendingCountLabel: "Pending review",
      listTitle: "Recent notes",
      listDescription:
        "A compact recap of the questions where you wrote down your own correction or interview framing.",
      editorTitle: "Personal note",
      editorPlaceholder:
        "Write the mechanism, the trap, or the exact interview wording you want to remember.",
      updatedAtLabel: "Updated",
      saveAction: "Save note",
      clearAction: "Clear note",
      openModuleAction: "Open module",
      launchPracticeAction: "Start practice",
      emptyTitle: "No personal note yet",
      emptyDescription:
        "Save a note from review, bookmarks or mock feedback to build your own interview language.",
      statusLabels: {
        saved: "Saved",
        due: "Due now",
        pendingReview: "Pending review",
        stable: "Stable reference",
      },
    },
    session: {
      progressLabel: "Question {current} / {total}",
      submitAnswer: "Submit answer",
      retryAnswer: "Retry save",
      submitting: "Checking...",
      nextQuestion: "Next question",
      finishSession: "See session result",
      loadingNextQuestion: "Loading next question...",
      loadingSessionResult: "Loading session result...",
      selectionRequired: "Select at least one answer before submitting.",
      responseRequired: "Enter an answer before submitting.",
      correctState: "Correct",
      incorrectState: "Incorrect",
      pendingReviewState: "Saved for review",
      pendingReviewHint:
        "This answer is stored, but it does not affect the score yet because it still needs manual review.",
      answerModeLabelSingle: "Single answer",
      answerModeLabelMultiple: "Multiple answers",
      answerModeLabelOpen: "Open answer",
      openAnswerHint: "Write your answer, then submit to save it and continue.",
      bugHuntHint:
        "Select the suspicious lines, explain the bug, then submit to save the analysis.",
      keyboardHintSingle: "Use keys 1-{count} to choose an answer, then Enter to validate.",
      keyboardHintMultiple:
        "Use keys 1-{count} to toggle answers, then Enter to validate.",
      explanationTitle: "Mechanism",
      takeawaysTitle: "What to retain",
      openResponseLabel: "Your answer",
      openResponsePlaceholder:
        "State the mechanism, the tradeoff, and the interview language you would use.",
      codeResponseLabel: "Your code or snippet",
      codeResponsePlaceholder:
        "Write the code or pseudo-code you would defend in the interview.",
      codeLanguageLabel: "Language",
      codeLanguagePlaceholder: "tsx",
      bugHuntSnippetLabel: "Bug-hunt snippet",
      bugHuntSummaryLabel: "Your bug analysis",
      bugHuntSummaryPlaceholder:
        "Explain what is broken, why it is risky, and what change you would make.",
      bugHuntSelectedLinesLabel: "Selected lines",
      recoveryTitle: "Answer not saved yet",
      recoveryHint:
        "Your selection is still preserved. Retry the save or adjust your answer before submitting again.",
      timerLabel: "Mock timer",
      timeRemainingLabel: "Time left",
      timeBudgetLabel: "Time budget",
      timeSpentLabel: "Time used",
      timedModeBadge: "Timed simulation",
      timerExpiredToast: "Time is up. The mock is being closed.",
      completedBadge: "Session completed",
      completedTitle: "Session completed",
      mockReportTitle: "Mock report",
      mockReportDescription:
        "A first pressure readout to see whether the answer quality held under the template constraints.",
      mockPressureLabel: "Pressure readout",
      mockSkillsTitle: "Skills tested in this mock",
      mockSkillsSummary: "{correct} correct out of {total} questions on this skill.",
      mockSkillsPendingSummary:
        "{correct} correct out of {graded} auto-scored, {pending} still pending review on this skill.",
      mockRiskTitle: "Main slips to revisit",
      mockRiskStates: {
        incorrect: "Incorrect answer",
        pendingReview: "Manual verdict pending",
        unanswered: "Unanswered under pressure",
      },
      mockRiskEmpty:
        "No major slip was detected in this mock. Keep the verbalization points below for the next round.",
      mockRubricTitle: "Review rubric",
      mockRubricFocusTitle: "Points to recover",
      rubricCriteriaLabels: {
        accuracy: "technical accuracy",
        mechanism: "mechanism explained",
        tradeoffs: "tradeoffs and limits",
        clarity: "sketch clarity",
        rootCause: "root cause",
        evidence: "snippet evidence",
        repair: "proposed fix",
      },
      mockVerbalizeTitle: "Points to verbalize next time",
      mockPressureStates: {
        controlled: "Controlled pace",
        tight: "Tight but acceptable",
        overrun: "Pressure still breaks the answer",
      },
      mockPressureDescriptions: {
        controlled:
          "The mock stayed under control: score, completion and time budget all stayed in a strong zone.",
        tight:
          "The mock stayed viable, but the margin is thinner. Keep sharpening speed and verbal structure.",
        overrun:
          "Timing or answer quality still collapses under pressure. Run another targeted loop before trusting this signal.",
      },
      backToDashboard: "Back to dashboard",
      backToModules: "Back to modules",
      correctAnswersLabel: "Correct answers",
      gradedAnswersLabel: "Graded answers",
      pendingReviewCountLabel: "Pending review",
      questionsAnsweredLabel: "Answered",
      scorePendingLabel: "Pending review",
      minutesShort: "{count} min",
      errors: {
        unauthorized: "Your session expired. Sign in again.",
        invalid: "This session item is no longer valid.",
        unsupported: "This question format is not supported yet in the live player.",
        expired: "This timed session has already ended.",
        unknown: "Unable to save this answer right now.",
      },
      modeLabels: {
        PRACTICE: "Practice session",
        REVIEW: "Review session",
        MOCK_INTERVIEW: "Mock interview",
      },
    },
    progress: {
      masteryMapTitle: "Mastery map",
      masteryMapDescription:
        "The strongest skills and the uncertainty pockets that are still visible.",
      emptyModuleAction: "Open recommended module",
      emptyReviewAction: "Open review lab",
      distributionTitle: "Mastery distribution",
      distributionDescription:
        "Mastered, in progress and questions that need immediate review.",
      signalTitle: "Signal quality over time",
      signalDescription:
        "How answer quality changes across the latest structured sessions.",
      skillBySkillTitle: "Skill by skill",
      skillBySkillDescription:
        "A more tactical view to choose the next module to attack.",
      notes: {
        stable: "stable under follow-up",
        medium: "good base, language still needs sharpening",
        fragile: "still fragile in interview conditions",
      },
      signalStates: {
        high: "strong signal",
        medium: "medium signal",
        low: "thin signal",
      },
      confidenceLabel: "Confidence {score}/100",
      questionsCoveredLabel: "Questions covered: {count}",
      recentFailuresLabel: "Recent failures: {count}",
      lastSignalLabel: "Last signal: {date}",
      emptyTitle: "No learning signal yet",
      emptyDescription:
        "Your progression charts will become meaningful after your first real attempts. Start with a module to generate the first data points.",
    },
    mockInterviews: {
      timedMode: "timed mode",
      launchTemplate: "Launch template",
      templateUnavailable: "No playable question is available for this preset yet.",
      overviewTitle: "Mock performance readout",
      overviewDescription:
        "A compact signal on whether the latest timed runs are actually improving your interview readiness.",
      completedMocksLabel: "Completed mocks",
      averageScoreLabel: "Average score",
      bestScoreLabel: "Best score",
      latestMomentumLabel: "Latest momentum",
      noTrendYet: "A second completed mock is needed before trend becomes meaningful.",
      momentumStates: {
        up: "Improving",
        down: "Slipping",
        steady: "Stable",
      },
      momentumDescriptions: {
        up: "{count} pts above the previous mock average.",
        down: "{count} pts below the previous mock average.",
        steady: "Within {count} pts of the previous mock average.",
      },
      templateSignalsTitle: "Template signals",
      templateSignalsDescription:
        "Which mock presets are already holding up and which ones still need another pass.",
      criterionSignalsTitle: "Rubric friction map",
      criterionSignalsDescription:
        "A cross-mock readout of the criteria that still collapse most often during manual review.",
      criterionReviewCountLabel: "Reviewed answers",
      criterionMissingLabel: "Missing verdicts",
      criterionPartialLabel: "Partial verdicts",
      strongestTemplateLabel: "Most stable template",
      needsWorkTemplateLabel: "Needs another pass",
      templateSessionsSummary: "{count} completed runs",
      latestScoreLabel: "Latest score",
      averagePaceLabel: "Average pace",
      historyTitle: "Recent mock history",
      historyDescription:
        "What was executed recently and which gains should feed into the next rounds.",
      historyEmptyTitle: "No completed mock yet",
      historyEmptyDescription:
        "As soon as you finish a timed session, the real mock history will appear here.",
      fallbackSessionTitle: "Mock interview",
      completedAtLabel: "Completed",
      recentSessionDuration: "{count} min",
      recentSessionSummary: "{count} answers recorded in this mock.",
      openReport: "Open report",
      philosophyTitle: "Scoring philosophy",
      philosophyDescription:
        "The final score should not flatter. It should tell you whether the answer can survive in front of a demanding interviewer.",
      philosophyItems: [
        "technical correctness of the answer",
        "ability to explain the mechanism, not only the API",
        "handling of distractors and edge cases",
        "quality of the argument under timing pressure",
      ],
      templateBadges: {
        pace: "strict pacing and answer timing",
        defense: "defense points surfaced in the report",
      },
    },
    review: {
      queueTitle: "Review queue",
      queueDescription:
        "The cards to revisit now so bad intuitions do not become habits.",
      pendingTitle: "Pending manual reviews",
      pendingDescription:
        "Open-answer attempts need a manual verdict before they can affect readiness and scores.",
      launchTitle: "Turn due cards into a live review session",
      launchDescription:
        "Run a focused review loop before weak intuitions decay further. The engine will prioritize the most overdue and most fragile cards first.",
      launchAction: "Start review session",
      launchUnavailable: "No review session is available because nothing is due yet.",
      dueNowLabel: "Cards due now",
      nextSessionSizeLabel: "Cards in next session",
      pendingCountLabel: "Pending verdicts",
      yourAnswerLabel: "Your answer",
      referenceLabel: "Reference correction",
      selectedLinesLabel: "Selected lines",
      rubricVerdictsTitle: "Verdict by criterion",
      reviewSummaryLabel: "Review summary",
      reviewSummaryPlaceholder:
        "Note the main gap, the missing argument, or the interview wording that needs another pass.",
      saveRubricAction: "Save review",
      rubricVerdictLabels: {
        solid: "solid",
        partial: "partial",
        missing: "missing",
      },
      rubricTitle: "Review rubric",
      rubricFocusTitle: "Points to hear or verify",
      rubricCriteriaLabels: {
        accuracy: "technical accuracy",
        mechanism: "mechanism explained",
        tradeoffs: "tradeoffs and limits",
        clarity: "sketch clarity",
        rootCause: "root cause",
        evidence: "snippet evidence",
        repair: "proposed fix",
      },
      markCorrectAction: "Mark solid",
      markIncorrectAction: "Mark needs work",
      emptyPendingTitle: "No manual review is waiting",
      emptyPendingDescription:
        "As soon as you complete an open-answer or bug-hunt question, it will appear here until you give it a verdict.",
      urgencyLabels: {
        critical: "Review now",
        high: "Due today",
        normal: "Scheduled",
      },
      responseLabels: {
        text_response: "Written answer",
        code_response: "Code sketch",
        bug_hunt_response: "Bug analysis",
      },
      reasonLabels: {
        overdue: "This card is overdue and should come back before the intuition degrades further.",
        failedRecently:
          "This topic is still unstable and needs a short feedback loop.",
        weakSkill:
          "The parent skill is still fragile or low-confidence, so this question helps consolidate the signal.",
        mockFallout:
          "This question broke under mock pressure and should return before the next timed round.",
        scheduled:
          "This question is due again to verify that the mechanism actually stuck.",
      },
      emptyTitle: "No reviews are due right now",
      emptyDescription:
        "This queue will fill automatically when questions become due again through the spaced review system.",
      howTitle: "How review is meant to work",
      howDescription:
        "The goal is not to repeat the same questions forever. It is to fix an identified misconception, then let time test the stability.",
      howItems: [
        "error pattern identified",
        "correction explained with mechanism and edge cases",
        "question scheduled again after a spacing interval",
      ],
    },
    settings: {
      introBadge: "Personalize your training loop",
      introTitle:
        "Turn the workspace into a plan that matches your interviews.",
      introDescription:
        "These preferences drive prioritization, pacing and future recommendations. Keep them aligned with the role you are actually targeting.",
      targetRoleLabel: "Target role",
      targetRoleHint:
        "Describe the role, company context or interview scope you want the product to optimize for.",
      targetRolePlaceholder: "Frontend Product Engineer · React / Next.js",
      targetLevelTitle: "Target level",
      targetLevelDescription:
        "Explanation depth, question mix and mock intensity will adapt to this benchmark.",
      preferredTracksTitle: "Priority tracks",
      preferredTracksDescription:
        "Select the tracks that should dominate your next recommendations and sessions.",
      weeklyGoalTitle: "Weekly cadence",
      weeklyGoalDescription:
        "Set the effort level you realistically want the engine to plan around.",
      weeklyGoalLabel: "Questions target",
      weeklyGoalHint:
        "Between 5 and 150 questions per week. Adjust it to the time you can really protect.",
      weeklyGoalPresetsLabel: "Quick presets",
      focusModeTitle: "Training posture",
      focusModeDescription:
        "This setting tunes how aggressive the platform should be when choosing drills and reviews.",
      summaryTitle: "Current operating profile",
      summaryDescription:
        "A compact snapshot of the way React Mentor will shape the next study cycle.",
      summaryTargetLabel: "Active target",
      summaryWeeklyGoalLabel: "Weekly volume",
      summaryFocusModeLabel: "Focus mode",
      summaryTracksLabel: "Track coverage",
      summaryEmptyTargetRole: "Target role not defined yet",
      summaryConfigured:
        "Your workspace is personalized and ready to drive the next sessions.",
      summaryNotConfigured:
        "Define a target role to unlock better recommendations from the dashboard.",
      weeklyGoalUnit: "questions / week",
      actions: {
        save: "Save setup",
        saving: "Saving...",
      },
      errors: {
        targetRoleRequired: "Define the role you want React Mentor to optimize for",
        targetRoleTooLong: "Keep the target role under 120 characters",
        weeklyGoalTooSmall: "Set a weekly goal of at least 5 questions",
        weeklyGoalTooBig: "Keep the weekly goal at 150 questions or less",
        preferredTracksRequired: "Select at least one priority track",
        invalidSelection: "This setting value is not valid",
        unauthorized: "Your session expired. Sign in again to save.",
        unknown: "Unable to save your preferences right now.",
      },
      toasts: {
        saved: "Preferences updated",
      },
      focusModes: {
        balanced: {
          label: "Balanced progression",
          description:
            "Mix breadth and repetition so the product keeps moving without losing the fundamentals.",
        },
        deep_dive: {
          label: "Deep dive on weak spots",
          description:
            "Bias the queue toward fragile concepts, harder explanations and concentrated correction loops.",
        },
        interview_cram: {
          label: "Interview sprint",
          description:
            "Compress the pace for short preparation windows with more mocks and denser weekly goals.",
        },
      },
    },
    modulesCatalog: [
      {
        track: "React Core",
        title: "React Rendering Systems",
        summary:
          "Understand how React decides to rerender, diff and reconcile trees so you can answer without folklore.",
        focus: ["reconciliation", "keys", "referential equality", "derived state"],
      },
      {
        track: "Hooks",
        title: "Effects Without Superstition",
        summary:
          "Clear up the confusion around useEffect, stale closures and synchronization strategies.",
        focus: ["dependencies", "cleanup", "stale closures", "refs"],
      },
      {
        track: "TypeScript",
        title: "TypeScript for Components",
        summary:
          "Prop typing, polymorphic components, generics and stronger APIs so you avoid the classic 'it compiles on my machine'.",
        focus: ["generics", "unions", "children", "inference"],
      },
      {
        track: "React Native",
        title: "React Native Interview Cases",
        summary:
          "Prepare product and performance questions around lists, navigation, layout and platform constraints.",
        focus: ["FlatList", "navigation", "layout", "native bridge"],
      },
    ],
    reviewQueue: [
      {
        title:
          "Why does an array recreated on every render retrigger the effect in the deps array?",
        skill: "Hooks",
        urgency: "Review today",
        reason: "2 mistakes over 3 attempts",
      },
      {
        title: "When is `React.memo` almost useless?",
        skill: "Performance",
        urgency: "Still fresh",
        reason: "correct answer, but justification still weak",
      },
      {
        title: "How do you type a polymorphic component with `as`?",
        skill: "TypeScript",
        urgency: "Senior interview blocker",
        reason: "very high answer time",
      },
    ],
    recentSessions: [
      {
        title: "Mock Interview · React Mid",
        summary:
          "Good structure, but effects and cleanup still feel fragile.",
      },
      {
        title: "Review Drill · TypeScript",
        summary:
          "Solid generics, still too cautious around utility types.",
      },
      {
        title: "Practice Sprint · React Native",
        summary:
          "Layout is fine, FlatList performance still needs work.",
      },
    ],
    mockTemplates: [
      {
        title: "React Mid · 30 minutes",
        description:
          "10 focused questions on hooks, rendering, state and architecture argumentation.",
        composition: "6 MCQ · 2 code outputs · 2 open prompts",
      },
      {
        title: "Frontend Senior · Defend your answer",
        description:
          "A simulation focused on technical justification, tradeoffs and edge cases under real constraints.",
        composition: "5 deep dives · 1 architecture case",
      },
      {
        title: "React Native Sprint",
        description:
          "A short session for flexbox, navigation, gestures and list rendering performance.",
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
      new: "New",
      learning: "Learning",
      reviewing: "Reviewing",
      mastered: "Mastered",
      inProgress: "In progress",
      review: "To review",
    },
  },
} as const;

export default en;
