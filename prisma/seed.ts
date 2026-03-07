import {
  ContentLocale,
  Prisma,
  PrismaClient,
  QuestionFormat,
  QuestionLevel,
  Track,
  TranslationStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const reactModule = await prisma.learningModule.upsert({
    where: { slug: "react-rendering-systems" },
    update: {
      track: Track.REACT,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "react-rendering-systems",
      order: 1,
      track: Track.REACT,
      level: QuestionLevel.MID,
    },
  });

  await upsertModuleTranslations(reactModule.id, {
    en: {
      title: "React Rendering Systems",
      description:
        "Rendering, reconciliation, identity and derived state interview drills.",
      summary:
        "The module that sharpens how you explain rerenders, keys and prop stability.",
    },
    fr: {
      title: "Systemes de rendu React",
      description:
        "Exercices d'entretien sur le rendu, la reconciliation, l'identite et le derived state.",
      summary:
        "Le module qui nettoie les reponses vagues sur les rerenders, les keys et la stabilite des props.",
    },
  });

  const effectsModule = await prisma.learningModule.upsert({
    where: { slug: "effects-without-superstition" },
    update: {
      track: Track.REACT,
      level: QuestionLevel.SENIOR,
    },
    create: {
      slug: "effects-without-superstition",
      order: 2,
      track: Track.REACT,
      level: QuestionLevel.SENIOR,
    },
  });

  await upsertModuleTranslations(effectsModule.id, {
    en: {
      title: "Effects Without Superstition",
      description:
        "A deeper layer on effects, synchronization and stale closures.",
      summary:
        "Built to remove cargo-cult answers around useEffect, dependency arrays and synchronization.",
    },
    fr: {
      title: "Les effets sans superstition",
      description:
        "Une couche plus profonde sur les effets, la synchronisation et les closures obsoletes.",
      summary:
        "Pense pour casser les reponses automatiques autour de useEffect et des deps arrays.",
    },
  });

  const typeScriptModule = await prisma.learningModule.upsert({
    where: { slug: "typescript-for-components" },
    update: {
      track: Track.TYPESCRIPT,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "typescript-for-components",
      order: 3,
      track: Track.TYPESCRIPT,
      level: QuestionLevel.MID,
    },
  });

  await upsertModuleTranslations(typeScriptModule.id, {
    en: {
      title: "TypeScript for Components",
      description:
        "Typing props, generics, polymorphic APIs and component contracts for interviews.",
      summary:
        "The module focused on TypeScript answers that stay precise in React interviews.",
    },
    fr: {
      title: "TypeScript pour les composants",
      description:
        "Typage des props, generics, APIs polymorphes et contrats de composants pour les entretiens.",
      summary:
        "Le module centre sur les reponses TypeScript qui restent precises en entretien React.",
    },
  });

  const reactNativeModule = await prisma.learningModule.upsert({
    where: { slug: "react-native-interview-cases" },
    update: {
      track: Track.REACT_NATIVE,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "react-native-interview-cases",
      order: 4,
      track: Track.REACT_NATIVE,
      level: QuestionLevel.MID,
    },
  });

  await upsertModuleTranslations(reactNativeModule.id, {
    en: {
      title: "React Native Interview Cases",
      description:
        "Layout, navigation, lists and platform tradeoffs for React Native interviews.",
      summary:
        "The module for mobile-specific answers that go beyond generic React knowledge.",
    },
    fr: {
      title: "Cas d'entretien React Native",
      description:
        "Layout, navigation, listes et compromis plateforme pour les entretiens React Native.",
      summary:
        "Le module pour les reponses mobile qui vont au-dela des generalites React.",
    },
  });

  const renderingSkill = await prisma.skill.upsert({
    where: { slug: "rendering-and-identity" },
    update: {
      moduleId: reactModule.id,
    },
    create: {
      slug: "rendering-and-identity",
      moduleId: reactModule.id,
    },
  });

  await upsertSkillTranslations(renderingSkill.id, {
    en: {
      title: "Rendering and Identity",
      description:
        "How React decides to re-render and why referential equality changes the outcome.",
    },
    fr: {
      title: "Rendu et identite",
      description:
        "Comment React decide de re-render et pourquoi l'egalite de reference change le resultat.",
    },
  });

  const effectSkill = await prisma.skill.upsert({
    where: { slug: "effect-mental-model" },
    update: {
      moduleId: effectsModule.id,
    },
    create: {
      slug: "effect-mental-model",
      moduleId: effectsModule.id,
    },
  });

  await upsertSkillTranslations(effectSkill.id, {
    en: {
      title: "Effect Mental Model",
      description:
        "Synchronization, cleanup, dependency arrays and stale closures.",
    },
    fr: {
      title: "Modele mental des effets",
      description:
        "Synchronisation, cleanup, dependency arrays et closures obsoletes.",
    },
  });

  const tsSkill = await prisma.skill.upsert({
    where: { slug: "generic-components" },
    update: {
      moduleId: typeScriptModule.id,
    },
    create: {
      slug: "generic-components",
      moduleId: typeScriptModule.id,
    },
  });

  await upsertSkillTranslations(tsSkill.id, {
    en: {
      title: "Generic Components",
      description:
        "How to design and explain generic component APIs without losing inference.",
    },
    fr: {
      title: "Composants generiques",
      description:
        "Comment concevoir et expliquer des APIs de composants generiques sans perdre l'inference.",
    },
  });

  const rnSkill = await prisma.skill.upsert({
    where: { slug: "rn-lists-and-flatlist" },
    update: {
      moduleId: reactNativeModule.id,
    },
    create: {
      slug: "rn-lists-and-flatlist",
      moduleId: reactNativeModule.id,
    },
  });

  await upsertSkillTranslations(rnSkill.id, {
    en: {
      title: "RN Lists and FlatList",
      description:
        "How to reason about list rendering and performance on React Native.",
    },
    fr: {
      title: "Listes RN et FlatList",
      description:
        "Comment raisonner sur le rendu de listes et la performance en React Native.",
    },
  });

  await prisma.question.upsert({
    where: { slug: "keys-do-not-force-rerender" },
    update: {
      moduleId: reactModule.id,
      primarySkillId: renderingSkill.id,
      format: QuestionFormat.SINGLE_CHOICE,
      difficulty: 3,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "keys-do-not-force-rerender",
      moduleId: reactModule.id,
      primarySkillId: renderingSkill.id,
      format: QuestionFormat.SINGLE_CHOICE,
      difficulty: 3,
      level: QuestionLevel.MID,
      options: {
        create: [
          {
            order: 1,
            isCorrect: false,
          },
          {
            order: 2,
            isCorrect: true,
          },
          {
            order: 3,
            isCorrect: false,
          },
        ],
      },
    },
  });

  const keysQuestion = await prisma.question.findUniqueOrThrow({
    where: { slug: "keys-do-not-force-rerender" },
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  await upsertQuestionTranslations(keysQuestion.id, {
    en: {
      prompt: "Does changing a key always force a standard React rerender?",
      explanation:
        "Changing a key replaces the previous instance. This is a targeted remount, not a generic rerender strategy.",
      takeaways: [
        "A key expresses identity, especially in lists.",
        "Changing the key remounts the targeted component instance.",
        "It is not a general-purpose rerender hack.",
      ],
      verbalizePoints: [
        "Explain the difference between rerender and remount.",
        "Say that keys are identity hints for reconciliation.",
      ],
    },
    fr: {
      prompt:
        "Une key differente force-t-elle toujours un rerender classique d'un element React ?",
      explanation:
        "Changer la key remplace l'instance precedente. C'est un remount cible, pas une strategie generique de rerender.",
      takeaways: [
        "Une key sert a exprimer une identite, surtout dans une liste.",
        "Changer la key remonte l'instance du composant concerne.",
        "Ce n'est pas un hack generique pour forcer un rerender.",
      ],
      verbalizePoints: [
        "Expliquer la difference entre rerender et remount.",
        "Dire que les keys guident la reconciliation via l'identite.",
      ],
    },
  });

  await upsertOptionTranslations(keysQuestion.options, {
    en: [
      {
        label: "Yes, it always forces a standard rerender.",
        explanation:
          "That reading is inaccurate. React replaces the instance instead of doing a normal rerender path on the same instance.",
      },
      {
        label: "No, it forces a remount of the identified element.",
        explanation:
          "That is the right reading: the identity changes, so React replaces the previous instance.",
      },
      {
        label: "No, keys have no impact outside lists.",
        explanation:
          "Keys still affect React identity whenever they are present, not only in visible array maps.",
      },
    ],
    fr: [
      {
        label: "Oui, cela force toujours un rerender classique.",
        explanation:
          "Cette lecture est fausse. React remplace l'instance au lieu de rerendre la meme instance.",
      },
      {
        label: "Non, cela force un remount de l'element identifie.",
        explanation:
          "C'est la bonne lecture: l'identite change, donc React remplace l'instance precedente.",
      },
      {
        label: "Non, les keys n'ont aucun impact hors des listes.",
        explanation:
          "Les keys influencent toujours l'identite React quand elles sont presentes, pas seulement dans un map visible.",
      },
    ],
  });

  await prisma.question.upsert({
    where: { slug: "effect-array-reference" },
    update: {
      moduleId: effectsModule.id,
      primarySkillId: effectSkill.id,
      format: QuestionFormat.SINGLE_CHOICE,
      difficulty: 4,
      level: QuestionLevel.SENIOR,
    },
    create: {
      slug: "effect-array-reference",
      moduleId: effectsModule.id,
      primarySkillId: effectSkill.id,
      format: QuestionFormat.SINGLE_CHOICE,
      difficulty: 4,
      level: QuestionLevel.SENIOR,
      options: {
        create: [
          {
            order: 1,
            isCorrect: false,
          },
          {
            order: 2,
            isCorrect: true,
          },
          {
            order: 3,
            isCorrect: false,
          },
        ],
      },
    },
  });

  const effectQuestion = await prisma.question.findUniqueOrThrow({
    where: { slug: "effect-array-reference" },
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  await upsertQuestionTranslations(effectQuestion.id, {
    en: {
      prompt:
        "Why does an array recreated on every render retrigger an effect when it is listed in the dependency array?",
      explanation:
        "React does not deep-compare dependencies. If the array reference changes, React treats that dependency as changed.",
      takeaways: [
        "Dependencies are compared by reference.",
        "Inline arrays and objects get a new identity on each render.",
        "Stabilizing identity often requires a refactor, not reflexive memoization.",
      ],
      verbalizePoints: [
        "Say that React compares dependency identities, not deep content.",
        "Connect the answer to stale closures and synchronization strategy when relevant.",
      ],
    },
    fr: {
      prompt:
        "Pourquoi un tableau recree a chaque render relance-t-il un effet lorsqu'il apparait dans le tableau de dependances ?",
      explanation:
        "React ne fait pas de deep compare des dependances. Si la reference du tableau change, React considere que la dependance a change.",
      takeaways: [
        "Les dependances sont comparees par reference.",
        "Un tableau ou objet inline a une nouvelle identite a chaque render.",
        "Stabiliser l'identite demande souvent un refactor, pas un useMemo reflexe.",
      ],
      verbalizePoints: [
        "Dire que React compare les identites des deps, pas leur contenu profond.",
        "Relier la reponse a la synchronisation et aux stale closures si pertinent.",
      ],
    },
  });

  await upsertOptionTranslations(effectQuestion.options, {
    en: [
      {
        label:
          "Because React compares the array content and sees that it is similar.",
        explanation:
          "React does not perform deep equality on hook dependencies.",
      },
      {
        label:
          "Because the array reference changes on every render.",
        explanation:
          "That is the main reason the effect retriggers.",
      },
      {
        label:
          "Because useEffect always reruns whenever a component rerenders.",
        explanation:
          "That is not the general rule. Stable dependencies prevent reruns unless a listed dependency changes identity or value.",
      },
    ],
    fr: [
      {
        label:
          "Parce que React compare le contenu du tableau et voit qu'il est similaire.",
        explanation:
          "React ne fait pas de deep equality sur les dependances des hooks.",
      },
      {
        label:
          "Parce que la reference du tableau change a chaque render.",
        explanation:
          "Oui, c'est la raison principale du redeclenchement.",
      },
      {
        label:
          "Parce que useEffect relance toujours quand un composant rerender.",
        explanation:
          "Ce n'est pas la regle generale. Des dependances stables evitent le rerun tant qu'aucune dependance listee ne change.",
      },
    ],
  });

  await prisma.question.upsert({
    where: { slug: "generic-component-inference-signals" },
    update: {
      moduleId: typeScriptModule.id,
      primarySkillId: tsSkill.id,
      format: QuestionFormat.MULTIPLE_CHOICE,
      difficulty: 3,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "generic-component-inference-signals",
      moduleId: typeScriptModule.id,
      primarySkillId: tsSkill.id,
      format: QuestionFormat.MULTIPLE_CHOICE,
      difficulty: 3,
      level: QuestionLevel.MID,
      options: {
        create: [
          {
            order: 1,
            isCorrect: true,
          },
          {
            order: 2,
            isCorrect: false,
          },
          {
            order: 3,
            isCorrect: true,
          },
          {
            order: 4,
            isCorrect: false,
          },
        ],
      },
    },
  });

  const tsInferenceQuestion = await prisma.question.findUniqueOrThrow({
    where: { slug: "generic-component-inference-signals" },
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  await upsertQuestionTranslations(tsInferenceQuestion.id, {
    en: {
      prompt:
        "Which decisions help a generic React component preserve type inference for its items?",
      explanation:
        "Inference stays strong when the same generic parameter flows through multiple related props instead of being broken by broad types.",
      takeaways: [
        "A generic component should connect several props through the same type parameter T.",
        "Broad types such as any break inference instead of helping it.",
        "Typed callbacks are a strong way to propagate T to callers.",
      ],
      verbalizePoints: [
        "Explain how items, callbacks and keys can share the same generic parameter.",
        "Say that any and broad casts remove useful constraints instead of improving API design.",
      ],
    },
    fr: {
      prompt:
        "Quelles decisions aident un composant React generique a preserver l'inference de type pour ses items ?",
      explanation:
        "L'inference reste forte quand le meme parametre generique traverse plusieurs props liees, au lieu d'etre casse par des types trop larges.",
      takeaways: [
        "Un composant generique doit relier plusieurs props au meme parametre T.",
        "Des types trop larges comme any cassent l'inference au lieu de l'aider.",
        "Les callbacks bien typees sont un bon moyen de faire circuler T jusqu'au code appelant.",
      ],
      verbalizePoints: [
        "Expliquer comment items, callbacks et cles peuvent partager le meme parametre generique.",
        "Dire que any et les casts larges suppriment des contraintes utiles au lieu d'ameliorer l'API.",
      ],
    },
  });

  await upsertOptionTranslations(tsInferenceQuestion.options, {
    en: [
      {
        label:
          "Let T flow through a callback such as renderItem: (item: T) => ReactNode.",
        explanation:
          "Yes. A well-typed callback helps TypeScript propagate T all the way to the call site.",
      },
      {
        label:
          "Replace the complex props with any to avoid inference friction.",
        explanation:
          "No. any cuts off the type information instead of improving inference.",
      },
      {
        label:
          "Connect items: T[] and getKey: (item: T) => string through the same generic parameter.",
        explanation:
          "Yes. Multiple props tied to the same T strengthen the component's inference.",
      },
      {
        label:
          "Cast the exported component to a broad union afterward to make it more flexible.",
        explanation:
          "No. That kind of cast hides useful constraints and degrades inference.",
      },
    ],
    fr: [
      {
        label:
          "Faire passer T dans une callback comme renderItem: (item: T) => ReactNode.",
        explanation:
          "Oui. Une callback bien typee aide TypeScript a propager T jusqu'au code appelant.",
      },
      {
        label:
          "Remplacer les props complexes par any pour eviter les frictions d'inference.",
        explanation:
          "Non. any coupe l'information de type au lieu de l'ameliorer.",
      },
      {
        label:
          "Relier items: T[] et getKey: (item: T) => string au meme parametre generique.",
        explanation:
          "Oui. Plusieurs props reliees au meme T renforcent l'inference du composant.",
      },
      {
        label:
          "Caster le composant exporte en union large apres coup pour le rendre plus flexible.",
        explanation:
          "Non. Ce genre de cast masque les contraintes utiles et degrade l'inference.",
      },
    ],
  });

  const answerDefenseModule = await prisma.learningModule.upsert({
    where: { slug: "react-answer-defense" },
    update: {
      track: Track.REACT,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "react-answer-defense",
      order: 5,
      track: Track.REACT,
      level: QuestionLevel.MID,
    },
  });

  await upsertModuleTranslations(answerDefenseModule.id, {
    en: {
      title: "Answer Defense Lab",
      description:
        "Open-answer and code-defense drills for practice sessions that need more than option picking.",
      summary:
        "A small practice module to train written defense before the richer mock runtime exists.",
    },
    fr: {
      title: "Laboratoire de defense de reponse",
      description:
        "Des drills de reponse ouverte et de code pour les sessions practice qui demandent plus qu'un simple choix d'option.",
      summary:
        "Un petit module practice pour travailler la defense ecrite avant l'arrivee du runtime mock enrichi.",
    },
  });

  const answerDefenseSkill = await prisma.skill.upsert({
    where: { slug: "answer-defense-and-code-sketches" },
    update: {
      moduleId: answerDefenseModule.id,
    },
    create: {
      slug: "answer-defense-and-code-sketches",
      moduleId: answerDefenseModule.id,
    },
  });

  await upsertSkillTranslations(answerDefenseSkill.id, {
    en: {
      title: "Answer Defense and Code Sketches",
      description:
        "How to defend a React decision in prose and back it up with a short code sketch.",
    },
    fr: {
      title: "Defense de reponse et sketchs de code",
      description:
        "Comment defendre une decision React a l'ecrit et l'appuyer avec un court sketch de code.",
    },
  });

  await prisma.question.upsert({
    where: { slug: "derived-state-pushback-open-answer" },
    update: {
      moduleId: answerDefenseModule.id,
      primarySkillId: answerDefenseSkill.id,
      format: QuestionFormat.OPEN_ENDED,
      difficulty: 3,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "derived-state-pushback-open-answer",
      moduleId: answerDefenseModule.id,
      primarySkillId: answerDefenseSkill.id,
      format: QuestionFormat.OPEN_ENDED,
      difficulty: 3,
      level: QuestionLevel.MID,
    },
  });

  const derivedStateOpenQuestion = await prisma.question.findUniqueOrThrow({
    where: { slug: "derived-state-pushback-open-answer" },
  });

  await upsertQuestionTranslations(derivedStateOpenQuestion.id, {
    en: {
      prompt:
        "A teammate wants to mirror a filtered prop into local state so the component can stay in sync. When do you push back on derived state, and what would you do instead?",
      explanation:
        "You push back when the local copy becomes a second source of truth. If the value can be derived from props or other state during render, keep it derived and store only the real user-owned state.",
      takeaways: [
        "Derived state creates drift when props and local state can diverge.",
        "If a value can be recomputed during render, it usually should not be copied into state.",
        "Store the source of truth, not a cached interpretation of it.",
      ],
      verbalizePoints: [
        "Name the risk of creating two sources of truth.",
        "Propose deriving the value during render or lifting the real state higher.",
      ],
    },
    fr: {
      prompt:
        "Un equipier veut recopier une prop filtree dans un state local pour que le composant reste synchronise. Quand est-ce que tu t'opposes a ce derived state, et que proposes-tu a la place ?",
      explanation:
        "Tu t'y opposes quand la copie locale devient une seconde source de verite. Si la valeur peut etre derivee depuis les props ou un autre state pendant le render, il faut la laisser derivee et ne stocker que le vrai state possede par l'utilisateur.",
      takeaways: [
        "Le derived state cree de la derive quand props et state local peuvent diverger.",
        "Si une valeur peut etre recalculee au render, elle ne doit souvent pas etre copiee dans le state.",
        "Il faut stocker la source de verite, pas une interpretation mise en cache.",
      ],
      verbalizePoints: [
        "Nommer le risque des deux sources de verite.",
        "Proposer de deriver la valeur au render ou de remonter le vrai state.",
      ],
    },
  });

  await prisma.question.upsert({
    where: { slug: "stable-callback-code-sketch" },
    update: {
      moduleId: answerDefenseModule.id,
      primarySkillId: answerDefenseSkill.id,
      format: QuestionFormat.CODE_OUTPUT,
      difficulty: 4,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "stable-callback-code-sketch",
      moduleId: answerDefenseModule.id,
      primarySkillId: answerDefenseSkill.id,
      format: QuestionFormat.CODE_OUTPUT,
      difficulty: 4,
      level: QuestionLevel.MID,
    },
  });

  const stableCallbackCodeQuestion = await prisma.question.findUniqueOrThrow({
    where: { slug: "stable-callback-code-sketch" },
  });

  await upsertQuestionTranslations(stableCallbackCodeQuestion.id, {
    en: {
      prompt:
        "Write a small React snippet that gives a child component a stable callback without hiding the real dependencies. Keep it explicit rather than clever.",
      explanation:
        "A stable callback is useful only when the dependency story stays honest. The code should either keep the changing dependency in the callback array or move the logic so the callback no longer needs that changing value.",
      takeaways: [
        "A stable callback is not valuable if it hides a stale dependency.",
        "The simplest fix is often to move changing logic closer to where the data lives.",
        "Prefer explicit dependencies over clever indirection in interview code.",
      ],
      verbalizePoints: [
        "Say why a stable reference matters for child memoization boundaries.",
        "Say why removing a dependency blindly creates stale logic.",
      ],
    },
    fr: {
      prompt:
        "Ecris un petit snippet React qui donne a un composant enfant une callback stable sans masquer les vraies dependances. Reste explicite plutot que malin.",
      explanation:
        "Une callback stable n'a de valeur que si l'histoire des dependances reste honnete. Le code doit soit garder la dependance variable dans le tableau, soit deplacer la logique pour que la callback n'en ait plus besoin.",
      takeaways: [
        "Une callback stable ne sert a rien si elle masque une dependance obsolete.",
        "Le fix le plus simple consiste souvent a rapprocher la logique de la source de donnees.",
        "En entretien, il vaut mieux montrer des dependances explicites qu'une indirection trop maligne.",
      ],
      verbalizePoints: [
        "Dire pourquoi une reference stable aide les frontieres de memoization chez l'enfant.",
        "Dire pourquoi retirer une dependance au hasard cree de la logique obsolete.",
      ],
    },
  });

  const bugHuntModule = await prisma.learningModule.upsert({
    where: { slug: "react-bug-hunt-lab" },
    update: {
      track: Track.REACT,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "react-bug-hunt-lab",
      order: 6,
      track: Track.REACT,
      level: QuestionLevel.MID,
    },
  });

  await upsertModuleTranslations(bugHuntModule.id, {
    en: {
      title: "React Bug Hunt Lab",
      description:
        "Short bug-hunt drills where you must isolate the suspicious lines and explain the fix.",
      summary:
        "A dedicated practice surface for code-reading and bug explanation before richer mock scoring exists.",
    },
    fr: {
      title: "Laboratoire React Bug Hunt",
      description:
        "Des drills courts de bug hunt ou il faut isoler les lignes suspectes et expliquer le correctif.",
      summary:
        "Une surface practice dediee a la lecture de code et a l'explication de bug avant un scoring mock plus riche.",
    },
  });

  const bugHuntSkill = await prisma.skill.upsert({
    where: { slug: "react-bug-reading" },
    update: {
      moduleId: bugHuntModule.id,
    },
    create: {
      slug: "react-bug-reading",
      moduleId: bugHuntModule.id,
    },
  });

  await upsertSkillTranslations(bugHuntSkill.id, {
    en: {
      title: "React Bug Reading",
      description:
        "How to read a short React snippet, isolate the fragile lines, and propose the fix clearly.",
    },
    fr: {
      title: "Lecture de bugs React",
      description:
        "Comment lire un petit snippet React, isoler les lignes fragiles et proposer le correctif clairement.",
    },
  });

  await prisma.question.upsert({
    where: { slug: "effect-cleanup-bug-hunt" },
    update: {
      moduleId: bugHuntModule.id,
      primarySkillId: bugHuntSkill.id,
      format: QuestionFormat.BUG_HUNT,
      difficulty: 4,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "effect-cleanup-bug-hunt",
      moduleId: bugHuntModule.id,
      primarySkillId: bugHuntSkill.id,
      format: QuestionFormat.BUG_HUNT,
      difficulty: 4,
      level: QuestionLevel.MID,
    },
  });

  const effectCleanupBugHuntQuestion = await prisma.question.findUniqueOrThrow({
    where: { slug: "effect-cleanup-bug-hunt" },
  });

  await upsertQuestionTranslations(effectCleanupBugHuntQuestion.id, {
    en: {
      prompt:
        "Read the snippet, pick the suspicious lines, then explain the bug and the fix you would defend in an interview.",
      explanation:
        "The cleanup is returned from inside the async function, so React never uses it as the effect cleanup. The timeout can survive unmount, which creates a leak and stale setState risk. The fix is to create the timer in the effect scope and return the cleanup directly from the effect.",
      takeaways: [
        "An effect cleanup must be returned by the effect itself, not by an inner async function.",
        "Async wrappers often hide lifecycle bugs in effects.",
        "The fix should preserve the real dependency story while moving the cleanup to the effect boundary.",
      ],
      contextData: {
        kind: "bug_hunt",
        language: "tsx",
        snippetTitle: "SearchBox debounce effect",
        suggestedLineNumbers: [4, 5],
        code: `function SearchBox({ query }: { query: string }) {
  useEffect(() => {
    async function syncAnalytics() {
      const timer = window.setTimeout(() => {
        console.log("sync", query);
      }, 300);

      return () => {
        window.clearTimeout(timer);
      };
    }

    void syncAnalytics();
  }, [query]);

  return null;
}`,
      },
      verbalizePoints: [
        "Say that React only treats the function returned by useEffect as cleanup.",
        "Name the leak risk and the stale callback risk if the timer survives longer than intended.",
      ],
    },
    fr: {
      prompt:
        "Lis le snippet, choisis les lignes suspectes, puis explique le bug et le correctif que tu defendrais en entretien.",
      explanation:
        "Le cleanup est retourne depuis la fonction async interne, donc React ne l'utilise jamais comme cleanup de l'effet. Le timeout peut survivre au unmount, ce qui cree un risque de fuite et de setState obsolete. Le correctif consiste a creer le timer dans la portee de l'effet et a retourner le cleanup directement depuis l'effet.",
      takeaways: [
        "Le cleanup d'un effet doit etre retourne par l'effet lui-meme, pas par une fonction async interne.",
        "Les wrappers async masquent souvent des bugs de cycle de vie dans les effets.",
        "Le correctif doit garder une histoire de dependances honnete tout en ramenant le cleanup a la frontiere de l'effet.",
      ],
      contextData: {
        kind: "bug_hunt",
        language: "tsx",
        snippetTitle: "Effet de debounce SearchBox",
        suggestedLineNumbers: [4, 5],
        code: `function SearchBox({ query }: { query: string }) {
  useEffect(() => {
    async function syncAnalytics() {
      const timer = window.setTimeout(() => {
        console.log("sync", query);
      }, 300);

      return () => {
        window.clearTimeout(timer);
      };
    }

    void syncAnalytics();
  }, [query]);

  return null;
}`,
      },
      verbalizePoints: [
        "Dire que React ne traite comme cleanup que la fonction retournee par useEffect.",
        "Nommer le risque de fuite et le risque de callback obsolete si le timer vit trop longtemps.",
      ],
    },
  });

  const identityPitfallTag = await upsertPitfallTag({
    slug: "identity-vs-rerender",
    title: "Identity vs rerender confusion",
    description:
      "The learner mixes up rerendering the same instance with remounting a new instance after an identity change.",
  });
  const rerenderHackPitfallTag = await upsertPitfallTag({
    slug: "rerender-hack-thinking",
    title: "Rerender hack thinking",
    description:
      "The learner reaches for force-rerender tricks instead of explaining the rendering mechanism.",
  });
  const dependencyIdentityPitfallTag = await upsertPitfallTag({
    slug: "dependency-identity-blind-spot",
    title: "Dependency identity blind spot",
    description:
      "The learner forgets that hook dependencies are compared by identity, not by deep content.",
  });
  const deepComparePitfallTag = await upsertPitfallTag({
    slug: "imagined-deep-compare",
    title: "Imagined deep compare",
    description:
      "The learner assumes React deep-compares dependency arrays when it only compares references.",
  });

  await syncQuestionPitfallTags(keysQuestion.id, [
    identityPitfallTag.slug,
    rerenderHackPitfallTag.slug,
  ]);
  await syncQuestionPitfallTags(effectQuestion.id, [
    dependencyIdentityPitfallTag.slug,
    deepComparePitfallTag.slug,
  ]);

  console.log("React Mentor seed complete");
}

async function upsertModuleTranslations(
  moduleId: string,
  values: Record<
    "en" | "fr",
    {
      title: string;
      description: string;
      summary?: string;
    }
  >,
) {
  await Promise.all([
    prisma.learningModuleTranslation.upsert({
      where: {
        moduleId_locale: {
          moduleId,
          locale: ContentLocale.EN,
        },
      },
      update: {
        status: TranslationStatus.READY,
        ...values.en,
      },
      create: {
        moduleId,
        locale: ContentLocale.EN,
        status: TranslationStatus.READY,
        ...values.en,
      },
    }),
    prisma.learningModuleTranslation.upsert({
      where: {
        moduleId_locale: {
          moduleId,
          locale: ContentLocale.FR,
        },
      },
      update: {
        status: TranslationStatus.READY,
        ...values.fr,
      },
      create: {
        moduleId,
        locale: ContentLocale.FR,
        status: TranslationStatus.READY,
        ...values.fr,
      },
    }),
  ]);
}

async function upsertSkillTranslations(
  skillId: string,
  values: Record<
    "en" | "fr",
    {
      title: string;
      description: string;
    }
  >,
) {
  await Promise.all([
    prisma.skillTranslation.upsert({
      where: {
        skillId_locale: {
          skillId,
          locale: ContentLocale.EN,
        },
      },
      update: {
        status: TranslationStatus.READY,
        ...values.en,
      },
      create: {
        skillId,
        locale: ContentLocale.EN,
        status: TranslationStatus.READY,
        ...values.en,
      },
    }),
    prisma.skillTranslation.upsert({
      where: {
        skillId_locale: {
          skillId,
          locale: ContentLocale.FR,
        },
      },
      update: {
        status: TranslationStatus.READY,
        ...values.fr,
      },
      create: {
        skillId,
        locale: ContentLocale.FR,
        status: TranslationStatus.READY,
        ...values.fr,
      },
    }),
  ]);
}

async function upsertQuestionTranslations(
  questionId: string,
  values: Record<
    "en" | "fr",
    {
      prompt: string;
      explanation: string;
      takeaways: string[];
      contextData?: Prisma.InputJsonValue;
      verbalizePoints: string[];
    }
  >,
) {
  await Promise.all([
    prisma.questionTranslation.upsert({
      where: {
        questionId_locale: {
          questionId,
          locale: ContentLocale.EN,
        },
      },
      update: {
        status: TranslationStatus.READY,
        prompt: values.en.prompt,
        explanation: values.en.explanation,
        takeaways: values.en.takeaways,
        contextData: values.en.contextData,
        verbalizePoints: values.en.verbalizePoints,
      },
      create: {
        questionId,
        locale: ContentLocale.EN,
        status: TranslationStatus.READY,
        prompt: values.en.prompt,
        explanation: values.en.explanation,
        takeaways: values.en.takeaways,
        contextData: values.en.contextData,
        verbalizePoints: values.en.verbalizePoints,
      },
    }),
    prisma.questionTranslation.upsert({
      where: {
        questionId_locale: {
          questionId,
          locale: ContentLocale.FR,
        },
      },
      update: {
        status: TranslationStatus.READY,
        prompt: values.fr.prompt,
        explanation: values.fr.explanation,
        takeaways: values.fr.takeaways,
        contextData: values.fr.contextData,
        verbalizePoints: values.fr.verbalizePoints,
      },
      create: {
        questionId,
        locale: ContentLocale.FR,
        status: TranslationStatus.READY,
        prompt: values.fr.prompt,
        explanation: values.fr.explanation,
        takeaways: values.fr.takeaways,
        contextData: values.fr.contextData,
        verbalizePoints: values.fr.verbalizePoints,
      },
    }),
  ]);
}

async function upsertOptionTranslations(
  options: Array<{ id: string }>,
  values: Record<
    "en" | "fr",
    Array<{
      label: string;
      explanation: string;
    }>
  >,
) {
  await Promise.all(
    options.flatMap((option, index) => [
      prisma.questionOptionTranslation.upsert({
        where: {
          optionId_locale: {
            optionId: option.id,
            locale: ContentLocale.EN,
          },
        },
        update: {
          status: TranslationStatus.READY,
          ...values.en[index],
        },
        create: {
          optionId: option.id,
          locale: ContentLocale.EN,
          status: TranslationStatus.READY,
          ...values.en[index],
        },
      }),
      prisma.questionOptionTranslation.upsert({
        where: {
          optionId_locale: {
            optionId: option.id,
            locale: ContentLocale.FR,
          },
        },
        update: {
          status: TranslationStatus.READY,
          ...values.fr[index],
        },
        create: {
          optionId: option.id,
          locale: ContentLocale.FR,
          status: TranslationStatus.READY,
          ...values.fr[index],
        },
      }),
    ]),
  );
}

async function upsertPitfallTag(input: {
  slug: string;
  title: string;
  description: string;
}) {
  return prisma.pitfallTag.upsert({
    where: {
      slug: input.slug,
    },
    update: {
      title: input.title,
      description: input.description,
    },
    create: input,
  });
}

async function syncQuestionPitfallTags(questionId: string, pitfallTagSlugs: string[]) {
  const pitfallTags = await prisma.pitfallTag.findMany({
    where: {
      slug: {
        in: pitfallTagSlugs,
      },
    },
  });

  await prisma.questionPitfallTag.deleteMany({
    where: {
      questionId,
    },
  });

  if (pitfallTags.length === 0) {
    return;
  }

  await prisma.questionPitfallTag.createMany({
    data: pitfallTags.map((pitfallTag) => ({
      questionId,
      pitfallTagId: pitfallTag.id,
    })),
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
