import {
  ContentLocale,
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
      title: "React Rendering Systems",
      description:
        "Rendering, reconciliation, identity and derived state interview drills.",
      summary:
        "The module that sharpens how you explain rerenders, keys and prop stability.",
      track: Track.REACT,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "react-rendering-systems",
      title: "React Rendering Systems",
      description:
        "Rendering, reconciliation, identity and derived state interview drills.",
      summary:
        "Le module qui nettoie les réponses vagues sur les rerenders, les keys et la stabilité des props.",
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
      title: "Effects Without Superstition",
      description:
        "A deeper layer on effects, synchronization and stale closures.",
      summary:
        "Built to remove cargo-cult answers around useEffect, dependency arrays and synchronization.",
      track: Track.REACT,
      level: QuestionLevel.SENIOR,
    },
    create: {
      slug: "effects-without-superstition",
      title: "Effects Without Superstition",
      description:
        "A deeper layer on effects, synchronization and stale closures.",
      summary:
        "Pensé pour casser les réponses automatiques autour de useEffect et des deps arrays.",
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
      title: "TypeScript for Components",
      description:
        "Typing props, generics, polymorphic APIs and component contracts for interviews.",
      summary:
        "The module focused on TypeScript answers that stay precise in React interviews.",
      track: Track.TYPESCRIPT,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "typescript-for-components",
      title: "TypeScript for Components",
      description:
        "Typing props, generics, polymorphic APIs and component contracts for interviews.",
      summary:
        "The module focused on TypeScript answers that stay precise in React interviews.",
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
      title: "React Native Interview Cases",
      description:
        "Layout, navigation, lists and platform tradeoffs for React Native interviews.",
      summary:
        "The module for mobile-specific answers that go beyond generic React knowledge.",
      track: Track.REACT_NATIVE,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "react-native-interview-cases",
      title: "React Native Interview Cases",
      description:
        "Layout, navigation, lists and platform tradeoffs for React Native interviews.",
      summary:
        "The module for mobile-specific answers that go beyond generic React knowledge.",
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
      title: "Rendering and Identity",
      description:
        "How React decides to re-render and why referential equality changes the outcome.",
      moduleId: reactModule.id,
    },
    create: {
      slug: "rendering-and-identity",
      title: "Rendering and Identity",
      description:
        "How React decides to re-render and why referential equality changes the outcome.",
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
      title: "Effect Mental Model",
      description:
        "Synchronization, cleanup, dependency arrays and stale closures.",
      moduleId: effectsModule.id,
    },
    create: {
      slug: "effect-mental-model",
      title: "Effect Mental Model",
      description:
        "Synchronisation, cleanup, dependency arrays and stale closures.",
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
      title: "Generic Components",
      description:
        "How to design and explain generic component APIs without losing inference.",
      moduleId: typeScriptModule.id,
    },
    create: {
      slug: "generic-components",
      title: "Generic Components",
      description:
        "How to design and explain generic component APIs without losing inference.",
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
      title: "RN Lists and FlatList",
      description:
        "How to reason about list rendering and performance on React Native.",
      moduleId: reactNativeModule.id,
    },
    create: {
      slug: "rn-lists-and-flatlist",
      title: "RN Lists and FlatList",
      description:
        "How to reason about list rendering and performance on React Native.",
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
      prompt:
        "Une key différente force-t-elle toujours le rerender d'un élément React ?",
      explanation:
        "Changer la key force un remount du noeud concerné, mais ne doit pas être utilisé comme hack de rerender global.",
      format: QuestionFormat.SINGLE_CHOICE,
      difficulty: 3,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "keys-do-not-force-rerender",
      moduleId: reactModule.id,
      primarySkillId: renderingSkill.id,
      prompt:
        "Une key différente force-t-elle toujours le rerender d'un élément React ?",
      explanation:
        "Changer la key remplace l'instance précédente. C'est un remount ciblé, pas une stratégie de rendu à utiliser à l'aveugle.",
      format: QuestionFormat.SINGLE_CHOICE,
      difficulty: 3,
      level: QuestionLevel.MID,
      takeaways: [
        "Une key sert à l'identité dans une liste",
        "Changer la key remonte le composant concerné",
        "Ce n'est pas une solution générique aux rerenders",
      ],
      options: {
        create: [
          {
            order: 1,
            label: "Oui, cela force toujours un rerender classique.",
            explanation:
              "Ce n'est pas un rerender classique. React jette l'instance et en recrée une.",
            isCorrect: false,
          },
          {
            order: 2,
            label: "Non, cela force un remount de l'élément identifié.",
            explanation:
              "C'est la bonne lecture : l'identité change, donc l'instance est remplacée.",
            isCorrect: true,
          },
          {
            order: 3,
            label: "Non, les keys n'ont aucun impact hors des listes.",
            explanation:
              "Les keys influencent toujours l'identité React quand elles sont présentes.",
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
      prompt:
        "Pourquoi un tableau recréé à chaque render dans les deps relance-t-il l'effet ?",
      explanation:
        "Parce que React compare les références. Un nouveau tableau signifie une nouvelle identité.",
      format: QuestionFormat.SINGLE_CHOICE,
      difficulty: 4,
      level: QuestionLevel.SENIOR,
    },
    create: {
      slug: "effect-array-reference",
      moduleId: effectsModule.id,
      primarySkillId: effectSkill.id,
      prompt:
        "Pourquoi un tableau recréé à chaque render dans les deps relance-t-il l'effet ?",
      explanation:
        "React ne fait pas un deep compare. Si la référence change, il considère la dépendance comme modifiée.",
      format: QuestionFormat.SINGLE_CHOICE,
      difficulty: 4,
      level: QuestionLevel.SENIOR,
      takeaways: [
        "les deps sont comparées par référence",
        "un tableau ou objet inline change à chaque render",
        "stabiliser l'identité peut nécessiter refactor, pas forcément useMemo partout",
      ],
      options: {
        create: [
          {
            order: 1,
            label: "Parce que React compare le contenu du tableau et voit qu'il est similaire.",
            explanation:
              "React ne fait pas de deep equality sur les deps du hook.",
            isCorrect: false,
          },
          {
            order: 2,
            label: "Parce que la référence du tableau change à chaque render.",
            explanation:
              "Oui, c'est la raison principale du redéclenchement.",
            isCorrect: true,
          },
          {
            order: 3,
            label: "Parce que useEffect relance toujours quand un composant rerender.",
            explanation:
              "Sans deps ou avec deps instables, oui. Mais ce n'est pas la règle générale avec un tableau de deps stable.",
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
        verbalizePoints: values.en.verbalizePoints,
      },
      create: {
        questionId,
        locale: ContentLocale.EN,
        status: TranslationStatus.READY,
        prompt: values.en.prompt,
        explanation: values.en.explanation,
        takeaways: values.en.takeaways,
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
        verbalizePoints: values.fr.verbalizePoints,
      },
      create: {
        questionId,
        locale: ContentLocale.FR,
        status: TranslationStatus.READY,
        prompt: values.fr.prompt,
        explanation: values.fr.explanation,
        takeaways: values.fr.takeaways,
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

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
