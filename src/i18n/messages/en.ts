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
      settings: {
        title: "Workspace settings",
        description:
          "Tune your target level, rhythm and focus before turning the training loop up.",
      },
    },
    sidebar: {
      appLabel: "interview workspace",
      todayFocusLabel: "Today focus",
      todayFocusText:
        "Review effects, finish the React Mid mock and push TypeScript above 80%.",
      dueReviews: "{count} reviews due",
      activeTargetLabel: "Active target",
      activeTargetValue: "React Mid / Frontend Product",
      readiness: "{value} readiness",
      nextMock: "Next mock in 02:15",
      nav: {
        overview: {
          label: "Overview",
          description: "Global readiness and next actions",
        },
        modules: {
          label: "Modules",
          description: "Tracks, drills and question banks",
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
      weeklyMomentumTitle: "Weekly momentum",
      weeklyMomentumDescription:
        "Observe how answer quality evolves, not just the amount of questions completed.",
      skillReadinessTitle: "Skill readiness",
      skillReadinessDescription:
        "The skills that can already survive pressure and the ones that still need work.",
      dueTitle: "Due today",
      dueDescription:
        "The queue of questions to revisit before a bad intuition settles in.",
      recentTitle: "Recent sessions",
      recentDescription:
        "A compact history to stay focused on feedback and useful decisions.",
      nextMockTitle: "Next recommended mock",
      nextMockDescription:
        "A suggested session based on your current weak zone.",
    },
    modules: {
      completionLabel: "Module completion",
      questionsSummary:
        "{count} questions currently active, with detailed explanations and interview-ready talking points.",
      metrics: [
        {
          label: "Active tracks",
          value: "4",
          detail: "React, hooks, TS, RN",
        },
        {
          label: "Questions in rotation",
          value: "154",
          detail: "mixed practice and review",
        },
        {
          label: "Current bottleneck",
          value: "Effects",
          detail: "deps and synchronization",
        },
      ],
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
    progress: {
      masteryMapTitle: "Mastery map",
      masteryMapDescription:
        "The strongest skills and the uncertainty pockets that are still visible.",
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
    },
    mockInterviews: {
      timedMode: "timed mode",
      historyTitle: "Recent mock history",
      historyDescription:
        "What was executed recently and which gains should feed into the next rounds.",
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
      targetTitle: "Target setup",
      targetDescription:
        "What the engine should optimize when it prepares your sessions and recommendations.",
      targetItems: [
        { label: "Target level", value: "React Mid / Frontend Product" },
        { label: "Primary stack", value: "React, TypeScript, React Native" },
        { label: "Weekly goal", value: "30 questions + 2 mocks" },
      ],
      postureTitle: "Learning posture",
      postureDescription:
        "The settings that the future product can use to nuance feedback and review pacing.",
      postureItems: [
        "immediate feedback enabled",
        "mock sessions on Tuesday and Friday",
        "priority on hooks and effects mistakes",
        "automatic review for questions marked fragile",
      ],
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
      mastered: "Mastered",
      inProgress: "In progress",
      review: "To review",
    },
  },
} as const;

export default en;
