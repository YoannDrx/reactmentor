import {
  PrismaClient,
  QuestionFormat,
  QuestionLevel,
  Track,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const reactModule = await prisma.learningModule.upsert({
    where: { slug: "react-rendering-systems" },
    update: {
      description:
        "Rendering, reconciliation, identity and derived state interview drills.",
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

  const effectsModule = await prisma.learningModule.upsert({
    where: { slug: "effects-without-superstition" },
    update: {
      description:
        "A deeper layer on effects, synchronization and stale closures.",
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

  const renderingSkill = await prisma.skill.upsert({
    where: { slug: "rendering-and-identity" },
    update: {
      title: "Rendering and Identity",
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

  const effectSkill = await prisma.skill.upsert({
    where: { slug: "effect-mental-model" },
    update: {
      title: "Effect Mental Model",
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

  console.log("React Mentor seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
