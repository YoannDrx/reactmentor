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

  const beginnerReactModule = await prisma.learningModule.upsert({
    where: { slug: "react-core-first-steps" },
    update: {
      track: Track.REACT,
      level: QuestionLevel.JUNIOR,
    },
    create: {
      slug: "react-core-first-steps",
      order: 0,
      track: Track.REACT,
      level: QuestionLevel.JUNIOR,
    },
  });

  await upsertModuleTranslations(beginnerReactModule.id, {
    en: {
      title: "React Core First Steps",
      description:
        "Beginner-friendly React questions on JSX, props, data flow and shared state.",
      summary:
        "The module designed to explain core React mental models as clearly as possible before advanced hooks and performance topics.",
    },
    fr: {
      title: "Premiers pas React coeur",
      description:
        "Des questions React accessibles aux debutants sur JSX, les props, le flux de donnees et le state partage.",
      summary:
        "Le module concu pour expliquer les modeles mentaux React les plus utiles avant les sujets avances sur les hooks et la performance.",
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

  const javascriptFoundationsModule = await prisma.learningModule.upsert({
    where: { slug: "frontend-javascript-foundations" },
    update: {
      track: Track.FRONTEND_SYSTEMS,
      level: QuestionLevel.JUNIOR,
    },
    create: {
      slug: "frontend-javascript-foundations",
      order: 7,
      track: Track.FRONTEND_SYSTEMS,
      level: QuestionLevel.JUNIOR,
    },
  });

  await upsertModuleTranslations(javascriptFoundationsModule.id, {
    en: {
      title: "Frontend JavaScript Foundations",
      description:
        "Core JavaScript interview questions on references, async behavior and the language mechanics React developers rely on.",
      summary:
        "The module for learners who need a stronger JavaScript base before advanced React answers become reliable.",
    },
    fr: {
      title: "Fondamentaux JavaScript frontend",
      description:
        "Des questions d'entretien JavaScript sur les references, l'asynchrone et les mecanismes de langage dont les developpeurs React dependent.",
      summary:
        "Le module pour les apprenants qui ont besoin d'une base JavaScript plus solide avant que les reponses React avancees deviennent fiables.",
    },
  });

  const javascriptCodingModule = await prisma.learningModule.upsert({
    where: { slug: "frontend-javascript-coding-patterns" },
    update: {
      track: Track.FRONTEND_SYSTEMS,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "frontend-javascript-coding-patterns",
      order: 8,
      track: Track.FRONTEND_SYSTEMS,
      level: QuestionLevel.MID,
    },
  });

  await upsertModuleTranslations(javascriptCodingModule.id, {
    en: {
      title: "Frontend JavaScript Coding Patterns",
      description:
        "Closures, array transformations and utility patterns that often appear in front-end interviews.",
      summary:
        "A practical module for candidates who need JavaScript reasoning that connects directly to coding rounds.",
    },
    fr: {
      title: "Patterns de code JavaScript frontend",
      description:
        "Closures, transformations de tableaux et patterns utilitaires qui reviennent souvent en entretien front-end.",
      summary:
        "Un module pratique pour les candidats qui ont besoin d'un raisonnement JavaScript directement exploitable en coding round.",
    },
  });

  const htmlCssModule = await prisma.learningModule.upsert({
    where: { slug: "frontend-html-css-essentials" },
    update: {
      track: Track.FRONTEND_SYSTEMS,
      level: QuestionLevel.JUNIOR,
    },
    create: {
      slug: "frontend-html-css-essentials",
      order: 9,
      track: Track.FRONTEND_SYSTEMS,
      level: QuestionLevel.JUNIOR,
    },
  });

  await upsertModuleTranslations(htmlCssModule.id, {
    en: {
      title: "Frontend HTML and CSS Essentials",
      description:
        "Semantics, forms, layout and cascade fundamentals that regularly appear in front-end interviews.",
      summary:
        "The module for learners who need HTML and CSS explanations that stay concrete and beginner-friendly.",
    },
    fr: {
      title: "Essentiels HTML et CSS frontend",
      description:
        "Des fondamentaux de semantique, formulaires, layout et cascade qui reviennent regulierement en entretien front-end.",
      summary:
        "Le module pour les apprenants qui ont besoin d'explications HTML et CSS concretes et accessibles aux debutants.",
    },
  });

  const browserFundamentalsModule = await prisma.learningModule.upsert({
    where: { slug: "frontend-browser-runtime-fundamentals" },
    update: {
      track: Track.FRONTEND_SYSTEMS,
      level: QuestionLevel.JUNIOR,
    },
    create: {
      slug: "frontend-browser-runtime-fundamentals",
      order: 10,
      track: Track.FRONTEND_SYSTEMS,
      level: QuestionLevel.JUNIOR,
    },
  });

  await upsertModuleTranslations(browserFundamentalsModule.id, {
    en: {
      title: "Browser Runtime Fundamentals",
      description:
        "DOM events, script loading and browser storage behavior for front-end interview preparation.",
      summary:
        "A beginner-friendly module for understanding what the browser is doing around your front-end code.",
    },
    fr: {
      title: "Fondamentaux du runtime navigateur",
      description:
        "Des questions sur les evenements DOM, le chargement des scripts et le comportement du stockage navigateur pour les entretiens front-end.",
      summary:
        "Un module accessible aux debutants pour comprendre ce que fait le navigateur autour du code front-end.",
    },
  });

  const reactCodingModule = await prisma.learningModule.upsert({
    where: { slug: "react-ui-coding-patterns" },
    update: {
      track: Track.REACT,
      level: QuestionLevel.MID,
    },
    create: {
      slug: "react-ui-coding-patterns",
      order: 11,
      track: Track.REACT,
      level: QuestionLevel.MID,
    },
  });

  await upsertModuleTranslations(reactCodingModule.id, {
    en: {
      title: "React UI Coding Patterns",
      description:
        "Hands-on React interview patterns around state updates, interactive components and custom hook design.",
      summary:
        "A practical module for learners who need stronger coding-round React answers, not only conceptual definitions.",
    },
    fr: {
      title: "Patterns de code UI React",
      description:
        "Des patterns React pratiques pour entretien autour des mises a jour de state, des composants interactifs et de la conception de custom hooks.",
      summary:
        "Un module pratique pour les apprenants qui ont besoin de meilleures reponses React en coding round, pas seulement de definitions conceptuelles.",
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

  const beginnerDataFlowSkill = await prisma.skill.upsert({
    where: { slug: "jsx-props-and-data-flow" },
    update: {
      moduleId: beginnerReactModule.id,
    },
    create: {
      slug: "jsx-props-and-data-flow",
      moduleId: beginnerReactModule.id,
    },
  });

  await upsertSkillTranslations(beginnerDataFlowSkill.id, {
    en: {
      title: "JSX, Props and Data Flow",
      description:
        "How JSX, props and lifted state work together in beginner React reasoning.",
    },
    fr: {
      title: "JSX, props et flux de donnees",
      description:
        "Comment JSX, les props et le state remonte fonctionnent ensemble dans le raisonnement React debutant.",
    },
  });

  const beginnerStateSkill = await prisma.skill.upsert({
    where: { slug: "state-updates-and-forms" },
    update: {
      moduleId: beginnerReactModule.id,
    },
    create: {
      slug: "state-updates-and-forms",
      moduleId: beginnerReactModule.id,
    },
  });

  await upsertSkillTranslations(beginnerStateSkill.id, {
    en: {
      title: "State Updates and Forms",
      description:
        "How to explain state snapshots, functional updates and controlled inputs to beginners.",
    },
    fr: {
      title: "Mises a jour de state et formulaires",
      description:
        "Comment expliquer les snapshots de state, les functional updates et les inputs controles a des debutants.",
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

  const refsLifecycleSkill = await prisma.skill.upsert({
    where: { slug: "refs-and-effect-lifecycle" },
    update: {
      moduleId: effectsModule.id,
    },
    create: {
      slug: "refs-and-effect-lifecycle",
      moduleId: effectsModule.id,
    },
  });

  await upsertSkillTranslations(refsLifecycleSkill.id, {
    en: {
      title: "Refs and Effect Lifecycle",
      description:
        "How refs persist, when effects run and how to explain the first mount lifecycle clearly.",
    },
    fr: {
      title: "Refs et cycle de vie des effets",
      description:
        "Comment les refs persistent, quand les effets tournent et comment expliquer clairement le premier montage.",
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

  const tsBoundarySkill = await prisma.skill.upsert({
    where: { slug: "typescript-boundary-safety" },
    update: {
      moduleId: typeScriptModule.id,
    },
    create: {
      slug: "typescript-boundary-safety",
      moduleId: typeScriptModule.id,
    },
  });

  await upsertSkillTranslations(tsBoundarySkill.id, {
    en: {
      title: "TypeScript Boundary Safety",
      description:
        "How to keep uncertain data safe with unknown, narrowing and explicit boundaries.",
    },
    fr: {
      title: "Securite aux frontieres TypeScript",
      description:
        "Comment garder des donnees incertaines sous controle avec unknown, du narrowing et des frontieres explicites.",
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

  const jsValuesSkill = await prisma.skill.upsert({
    where: { slug: "js-values-and-references" },
    update: {
      moduleId: javascriptFoundationsModule.id,
    },
    create: {
      slug: "js-values-and-references",
      moduleId: javascriptFoundationsModule.id,
    },
  });

  await upsertSkillTranslations(jsValuesSkill.id, {
    en: {
      title: "JS Values and References",
      description:
        "How equality, copying and nested references really work in JavaScript.",
    },
    fr: {
      title: "Valeurs et references JavaScript",
      description:
        "Comment fonctionnent vraiment l'egalite, la copie et les references imbriquees en JavaScript.",
    },
  });

  const jsAsyncSkill = await prisma.skill.upsert({
    where: { slug: "js-async-and-promises" },
    update: {
      moduleId: javascriptFoundationsModule.id,
    },
    create: {
      slug: "js-async-and-promises",
      moduleId: javascriptFoundationsModule.id,
    },
  });

  await upsertSkillTranslations(jsAsyncSkill.id, {
    en: {
      title: "JS Async and Promises",
      description:
        "How the event loop, promises and async coordination behave in interview questions.",
    },
    fr: {
      title: "Asynchrone JS et promesses",
      description:
        "Comment se comportent l'event loop, les promesses et la coordination asynchrone dans les questions d'entretien.",
    },
  });

  const jsUtilitySkill = await prisma.skill.upsert({
    where: { slug: "js-closures-and-collections" },
    update: {
      moduleId: javascriptCodingModule.id,
    },
    create: {
      slug: "js-closures-and-collections",
      moduleId: javascriptCodingModule.id,
    },
  });

  await upsertSkillTranslations(jsUtilitySkill.id, {
    en: {
      title: "JS Closures and Collections",
      description:
        "How closures, debounce-style utilities and array transformations should be reasoned about.",
    },
    fr: {
      title: "Closures et collections JS",
      description:
        "Comment raisonner sur les closures, les utilitaires de type debounce et les transformations de tableaux.",
    },
  });

  const htmlSemanticSkill = await prisma.skill.upsert({
    where: { slug: "html-semantics-and-forms" },
    update: {
      moduleId: htmlCssModule.id,
    },
    create: {
      slug: "html-semantics-and-forms",
      moduleId: htmlCssModule.id,
    },
  });

  await upsertSkillTranslations(htmlSemanticSkill.id, {
    en: {
      title: "HTML Semantics and Forms",
      description:
        "How semantic elements and correctly linked form labels improve meaning and usability.",
    },
    fr: {
      title: "Semantique HTML et formulaires",
      description:
        "Comment les elements semantiques et les labels de formulaire correctement relies ameliorent le sens et l'utilisabilite.",
    },
  });

  const cssLayoutSkill = await prisma.skill.upsert({
    where: { slug: "css-layout-and-cascade" },
    update: {
      moduleId: htmlCssModule.id,
    },
    create: {
      slug: "css-layout-and-cascade",
      moduleId: htmlCssModule.id,
    },
  });

  await upsertSkillTranslations(cssLayoutSkill.id, {
    en: {
      title: "CSS Layout and Cascade",
      description:
        "How flexbox, specificity, box sizing and positioned elements behave in real UI work.",
    },
    fr: {
      title: "Layout et cascade CSS",
      description:
        "Comment fonctionnent flexbox, la specificite, le box sizing et les elements positionnes dans de vraies interfaces.",
    },
  });

  const browserRuntimeSkill = await prisma.skill.upsert({
    where: { slug: "browser-runtime-and-events" },
    update: {
      moduleId: browserFundamentalsModule.id,
    },
    create: {
      slug: "browser-runtime-and-events",
      moduleId: browserFundamentalsModule.id,
    },
  });

  await upsertSkillTranslations(browserRuntimeSkill.id, {
    en: {
      title: "Browser Runtime and Events",
      description:
        "How scripts load, events propagate and browser-side storage behaves over time.",
    },
    fr: {
      title: "Runtime navigateur et evenements",
      description:
        "Comment les scripts se chargent, comment les evenements se propagent et comment le stockage navigateur se comporte dans le temps.",
    },
  });

  const reactUiCodingSkill = await prisma.skill.upsert({
    where: { slug: "react-stateful-ui-coding" },
    update: {
      moduleId: reactCodingModule.id,
    },
    create: {
      slug: "react-stateful-ui-coding",
      moduleId: reactCodingModule.id,
    },
  });

  await upsertSkillTranslations(reactUiCodingSkill.id, {
    en: {
      title: "React Stateful UI Coding",
      description:
        "How to build and explain interactive React components with clean state ownership.",
    },
    fr: {
      title: "Code UI React avec state",
      description:
        "Comment construire et expliquer des composants React interactifs avec une possession du state claire.",
    },
  });

  const reactInteractionSkill = await prisma.skill.upsert({
    where: { slug: "react-interaction-and-a11y" },
    update: {
      moduleId: reactCodingModule.id,
    },
    create: {
      slug: "react-interaction-and-a11y",
      moduleId: reactCodingModule.id,
    },
  });

  await upsertSkillTranslations(reactInteractionSkill.id, {
    en: {
      title: "React Interaction and Accessibility",
      description:
        "How to reason about keyboard support, focus and robust interactive component behavior.",
    },
    fr: {
      title: "Interaction et accessibilite React",
      description:
        "Comment raisonner sur le support clavier, le focus et le comportement robuste des composants interactifs.",
    },
  });

  await upsertClosedQuestion({
    slug: "jsx-is-a-ui-description",
    moduleId: beginnerReactModule.id,
    primarySkillId: beginnerDataFlowSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 1,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false],
    translations: {
      en: {
        prompt:
          "What is JSX actually giving React before the browser updates the real DOM?",
        explanation:
          "JSX becomes JavaScript calls that describe the UI tree. It is not real DOM and it is not plain HTML.",
        tlDr: "JSX is a syntax for describing React elements, not a direct DOM instruction format.",
        shortAnswer:
          "JSX produces a JavaScript description of the UI, usually via React.createElement or the JSX runtime, and React later turns that description into DOM updates.",
        lessonBody: `A common beginner mistake is to think that JSX is basically HTML inside JavaScript. It looks similar, but React does not treat it as browser HTML.

JSX is first transformed into JavaScript. That transformed code creates React elements, which are small objects describing what the UI should look like.

Only after React has that description does it decide how to update the real DOM. This is why JSX feels declarative: you describe the UI you want, then React figures out the update path.

In interviews, the strong answer is to say that JSX is a UI description format for React. It is not a real DOM node, not a template string, and not a magical browser feature.`,
        commonMistakes: [
          "Saying JSX is just HTML.",
          "Thinking the browser understands JSX directly.",
          "Confusing a React element with a mounted DOM node.",
        ],
        exampleTitle: "What JSX compiles to",
        exampleLanguage: "tsx",
        exampleCode: `const view = <button>Save</button>;`,
        exampleExplanation:
          "This becomes a JavaScript call that describes a button element. The browser still has not created a DOM button at that moment.",
        estimatedReadMinutes: 4,
        takeaways: [
          "JSX is transformed into JavaScript before runtime.",
          "React elements describe UI; they are not DOM nodes.",
          "React uses that description to decide DOM updates later.",
        ],
        verbalizePoints: [
          "Say that JSX is a syntax for building React elements.",
          "Separate the idea of description from the actual DOM update.",
        ],
      },
      fr: {
        prompt:
          "Qu'est-ce que JSX donne vraiment a React avant que le navigateur mette a jour le vrai DOM ?",
        explanation:
          "JSX devient des appels JavaScript qui decrivent l'arbre UI. Ce n'est ni le vrai DOM ni du HTML brut.",
        tlDr: "JSX est une syntaxe pour decrire des elements React, pas un format d'instruction DOM direct.",
        shortAnswer:
          "JSX produit une description JavaScript de l'interface, en general via React.createElement ou le runtime JSX, puis React transforme ensuite cette description en mises a jour du DOM.",
        lessonBody: `Une erreur classique au debut consiste a croire que JSX est simplement du HTML dans du JavaScript. Visuellement c'est proche, mais React ne le traite pas comme du HTML navigateur.

JSX est d'abord transforme en JavaScript. Ce code cree des elements React, c'est-a-dire de petits objets qui decrivent ce que l'interface doit afficher.

Ce n'est qu'ensuite que React decide comment mettre a jour le vrai DOM. C'est pour cela que JSX parait declaratif: tu decris l'UI voulue, puis React choisit le chemin de mise a jour.

En entretien, la bonne reponse consiste a dire que JSX est un format de description d'interface pour React. Ce n'est ni un vrai noeud DOM, ni une simple string HTML, ni une fonctionnalite magique du navigateur.`,
        commonMistakes: [
          "Dire que JSX est juste du HTML.",
          "Penser que le navigateur comprend JSX directement.",
          "Confondre un element React avec un noeud DOM monte.",
        ],
        exampleTitle: "Ce que JSX devient",
        exampleLanguage: "tsx",
        exampleCode: `const view = <button>Save</button>;`,
        exampleExplanation:
          "Cette ligne devient un appel JavaScript qui decrit un bouton. Le navigateur n'a pas encore cree de vrai bouton DOM a ce stade.",
        estimatedReadMinutes: 4,
        takeaways: [
          "JSX est transforme en JavaScript avant l'execution.",
          "Les elements React decrivent l'UI; ce ne sont pas des noeuds DOM.",
          "React utilise ensuite cette description pour mettre a jour le DOM.",
        ],
        verbalizePoints: [
          "Dire que JSX est une syntaxe pour construire des elements React.",
          "Bien separer la description UI de la mise a jour reelle du DOM.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label: "Raw HTML that the browser mounts immediately.",
          explanation:
            "No. JSX is not handed to the browser as HTML for direct mounting.",
        },
        {
          label:
            "A JavaScript description of the UI tree that React can reconcile.",
          explanation:
            "Correct. JSX becomes React element creation calls, which React then uses as input for reconciliation.",
        },
        {
          label: "A fully mounted virtual browser DOM node.",
          explanation:
            "No. React elements describe UI, but they are not mounted nodes themselves.",
        },
      ],
      fr: [
        {
          label: "Du HTML brut que le navigateur monte immediatement.",
          explanation:
            "Non. JSX n'est pas donne au navigateur comme du HTML a monter directement.",
        },
        {
          label:
            "Une description JavaScript de l'arbre UI que React peut reconciler.",
          explanation:
            "Correct. JSX devient des appels de creation d'elements React, que React utilise ensuite pour la reconciliation.",
        },
        {
          label: "Un noeud de DOM virtuel deja entierement monte.",
          explanation:
            "Non. Les elements React decrivent l'UI, mais ce ne sont pas eux-memes des noeuds montes.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "props-are-read-only-inputs",
    moduleId: beginnerReactModule.id,
    primarySkillId: beginnerDataFlowSkill.id,
    format: QuestionFormat.MULTIPLE_CHOICE,
    difficulty: 1,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [true, false, true, false],
    translations: {
      en: {
        prompt:
          "Which statements about React props are correct when you explain them to a beginner?",
        explanation:
          "Props are read-only inputs from the parent. They can carry data or callbacks, but the receiving component should not mutate them.",
        tlDr: "Props are external inputs to a component, not that component's private writable state.",
        shortAnswer:
          "Props come from the parent, can include values and functions, and should be treated as read-only by the child.",
        lessonBody: `Props answer one simple question: what is this component receiving from the outside?

In React, a parent renders a child and passes props into it. Those props can be strings, numbers, objects, arrays, booleans, JSX, or even callback functions.

What matters most is ownership. The child component may read those props, derive UI from them, and call a callback prop, but it should not mutate the prop object to try to change the source value.

For a beginner, the clean mental model is this: props are inputs owned by someone else. State is data owned locally by the component itself.`,
        commonMistakes: [
          "Saying props are the same thing as local state.",
          "Trying to mutate props inside the child to change the parent data.",
          "Forgetting that callback functions are also valid props.",
        ],
        exampleTitle: "Props can include values and callbacks",
        exampleLanguage: "tsx",
        exampleCode: `function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}`,
        exampleExplanation:
          "The child reads value and calls onChange, but it does not own or mutate the prop directly.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Props are inputs coming from the parent.",
          "Props can include callback functions as well as plain data.",
          "A child should treat props as read-only.",
        ],
        verbalizePoints: [
          "Contrast props ownership with local state ownership.",
          "Say that a child changes parent-owned data by calling a callback, not by mutating props.",
        ],
      },
      fr: {
        prompt:
          "Quelles affirmations sur les props React sont correctes quand tu les expliques a un debutant ?",
        explanation:
          "Les props sont des entrees en lecture seule venant du parent. Elles peuvent contenir des donnees ou des callbacks, mais le composant qui les recoit ne doit pas les muter.",
        tlDr: "Les props sont des entrees externes d'un composant, pas son state local modifiable.",
        shortAnswer:
          "Les props viennent du parent, peuvent contenir des valeurs ou des fonctions, et doivent etre traitees comme de la lecture seule par l'enfant.",
        lessonBody: `Les props repondent a une question simple: qu'est-ce que ce composant recoit depuis l'exterieur ?

En React, un parent rend un enfant et lui passe des props. Ces props peuvent etre des strings, nombres, objets, tableaux, booleens, JSX ou meme des fonctions callback.

Le point important est la notion de possession. Le composant enfant peut lire ces props, en deriver l'UI, ou appeler une callback prop, mais il ne doit pas muter l'objet recu pour essayer de changer la valeur d'origine.

Pour un debutant, le bon modele mental est le suivant: les props sont des entrees possedees par quelqu'un d'autre. Le state est une donnee possedee localement par le composant.`,
        commonMistakes: [
          "Dire que props et state local sont la meme chose.",
          "Essayer de muter les props dans l'enfant pour changer la donnee du parent.",
          "Oublier qu'une fonction callback est aussi une prop valide.",
        ],
        exampleTitle: "Les props peuvent contenir une valeur et une callback",
        exampleLanguage: "tsx",
        exampleCode: `function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}`,
        exampleExplanation:
          "L'enfant lit value et appelle onChange, mais il ne possede pas directement cette donnee.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Les props sont des entrees envoyees par le parent.",
          "Une prop peut etre une fonction callback autant qu'une donnee simple.",
          "Un enfant doit traiter ses props comme de la lecture seule.",
        ],
        verbalizePoints: [
          "Opposer la possession des props a la possession du state local.",
          "Dire qu'un enfant modifie une donnee du parent en appelant une callback, pas en mutant la prop.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label: "A parent can pass a new prop value on a later render.",
          explanation:
            "Correct. Props can change whenever the parent renders with new values.",
        },
        {
          label: "A child should mutate props directly to stay in sync.",
          explanation:
            "Incorrect. Mutating props breaks the ownership model and leads to confusing code.",
        },
        {
          label: "A callback function such as onSave can be passed as a prop.",
          explanation:
            "Correct. Passing behavior through callback props is standard React data flow.",
        },
        {
          label: "Props are the component's own private writable state.",
          explanation:
            "Incorrect. Private writable state belongs to state, not props.",
        },
      ],
      fr: [
        {
          label:
            "Un parent peut envoyer une nouvelle prop lors d'un render suivant.",
          explanation:
            "Correct. Les props peuvent changer des que le parent rerender avec de nouvelles valeurs.",
        },
        {
          label:
            "Un enfant doit muter ses props directement pour rester synchronise.",
          explanation:
            "Incorrect. Muter les props casse le modele de possession et rend le code confus.",
        },
        {
          label: "Une callback comme onSave peut etre passee comme prop.",
          explanation:
            "Correct. Passer du comportement via des callbacks props est un pattern standard de React.",
        },
        {
          label:
            "Les props sont le state local prive et modifiable du composant.",
          explanation:
            "Incorrect. Le state local modifiable appartient au state, pas aux props.",
        },
      ],
    },
  });

  await upsertLessonQuestion({
    slug: "lift-state-to-common-parent",
    moduleId: beginnerReactModule.id,
    primarySkillId: beginnerDataFlowSkill.id,
    format: QuestionFormat.OPEN_ENDED,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    translations: {
      en: {
        prompt:
          "Two sibling components must always stay in sync with the same selected value. Why do you lift state to their nearest common parent, and what should still stay local?",
        explanation:
          "You lift the shared value so both siblings read the same source of truth. Only purely local UI details should remain in each child.",
        tlDr: "Lift the state that must be shared; keep only child-specific UI state local.",
        shortAnswer:
          "The shared selection should live in the nearest common parent so both children stay consistent. Keep only local presentation details inside each child.",
        lessonBody: `Lifting state up is really a source-of-truth decision.

If two sibling components both need the same changing value, storing a separate copy in each child creates drift. One child can update first, the other can lag, and now you have synchronization work to do.

By moving the shared state to the nearest common parent, both children receive the same current value through props. One child can request a change by calling a callback, and the parent updates the shared source once.

This does not mean every state variable must go upward. Input focus, hover state, an open tooltip, or other UI details that matter only inside one child should usually remain local.`,
        commonMistakes: [
          "Duplicating the same shared value in multiple siblings.",
          "Lifting every tiny UI flag even when only one child needs it.",
          "Explaining lifting state without naming the source-of-truth benefit.",
        ],
        exampleTitle: "One shared selected value",
        exampleLanguage: "tsx",
        exampleCode: `function Parent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <Sidebar selectedId={selectedId} onSelect={setSelectedId} />
      <Details selectedId={selectedId} />
    </>
  );
}`,
        exampleExplanation:
          "selectedId lives once in the parent, so both children stay aligned.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Lift state when multiple children need the same changing value.",
          "The parent becomes the single source of truth for that shared state.",
          "Keep purely local UI state inside the child that owns it.",
        ],
        verbalizePoints: [
          "Use the phrase single source of truth.",
          "Differentiate shared business state from purely local UI state.",
        ],
      },
      fr: {
        prompt:
          "Deux composants freres doivent toujours rester synchronises autour de la meme valeur selectionnee. Pourquoi remontes-tu le state vers leur parent commun le plus proche, et qu'est-ce qui doit rester local ?",
        explanation:
          "Tu remontes la valeur partagee pour que les deux freres lisent la meme source de verite. Seuls les details purement locaux a chaque enfant doivent rester dans le composant.",
        tlDr: "Il faut remonter le state partage; seuls les details UI propres a un enfant restent locaux.",
        shortAnswer:
          "La valeur selectionnee partagee doit vivre dans le parent commun le plus proche pour garder les deux enfants coherents. Les details d'UI purement locaux peuvent rester dans chaque enfant.",
        lessonBody: `Remonter le state est avant tout une decision de source de verite.

Si deux composants freres ont besoin de la meme valeur qui change, stocker une copie separee dans chaque enfant cree de la derive. L'un peut etre mis a jour avant l'autre, et tu dois ensuite ajouter de la synchronisation.

En deplacant ce state vers le parent commun le plus proche, les deux enfants recoivent la meme valeur courante via les props. L'un peut demander une modification en appelant une callback, puis le parent met a jour cette source partagee une seule fois.

Cela ne veut pas dire qu'il faut tout remonter. Le focus d'un champ, un hover, l'ouverture d'un tooltip ou d'autres details d'UI qui n'interessent qu'un seul enfant doivent en general rester locaux.`,
        commonMistakes: [
          "Dupliquer la meme valeur partagee dans plusieurs composants freres.",
          "Remonter chaque petit drapeau d'UI alors qu'un seul enfant en a besoin.",
          "Expliquer le lifting sans nommer le benefice de la source de verite unique.",
        ],
        exampleTitle: "Une seule valeur selectionnee partagee",
        exampleLanguage: "tsx",
        exampleCode: `function Parent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <Sidebar selectedId={selectedId} onSelect={setSelectedId} />
      <Details selectedId={selectedId} />
    </>
  );
}`,
        exampleExplanation:
          "selectedId vit une seule fois dans le parent, donc les deux enfants restent alignes.",
        estimatedReadMinutes: 5,
        takeaways: [
          "On remonte le state quand plusieurs enfants ont besoin de la meme valeur qui change.",
          "Le parent devient la source de verite unique pour ce state partage.",
          "Le state d'UI purement local doit rester dans l'enfant qui le possede.",
        ],
        verbalizePoints: [
          "Utiliser l'expression source de verite unique.",
          "Distinguer le state partage du petit state d'UI local.",
        ],
      },
    },
  });

  await upsertClosedQuestion({
    slug: "functional-state-update-prevents-stale-count",
    moduleId: beginnerReactModule.id,
    primarySkillId: beginnerStateSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "Why is setCount((current) => current + 1) the safer answer when the next state depends on the previous state?",
        explanation:
          "The functional updater reads the freshest queued value, so it stays correct even when multiple updates are batched together.",
        tlDr: "Use the functional updater when the next value depends on the previous one, because React may batch updates.",
        shortAnswer:
          "The callback form receives the latest queued state snapshot, so it avoids stale reads when multiple updates happen close together.",
        lessonBody: `This question is about state snapshots, not about syntax preference.

During a render, your component reads one snapshot of state. If you call setCount(count + 1) twice in the same event, both calls can read the same old count value from that render.

That is why the callback form exists. React passes the freshest queued value into the updater function, so each update builds on the result of the previous one instead of on an older snapshot.

The beginner-safe explanation in an interview is simple: if your next state is computed from the previous state, use the functional updater so React can apply the updates in the right order.`,
        commonMistakes: [
          "Saying the functional updater makes state synchronous.",
          "Thinking React immediately mutates count inside the current render.",
          "Using the callback form without explaining the stale snapshot problem.",
        ],
        exampleTitle: "Two increments in one event",
        exampleLanguage: "tsx",
        exampleCode: `setCount((current) => current + 1);
setCount((current) => current + 1);`,
        exampleExplanation:
          "Each updater receives the latest queued value, so the count can correctly move by two.",
        estimatedReadMinutes: 5,
        takeaways: [
          "A render reads a snapshot of state, not a live mutable variable.",
          "Multiple state updates can be batched together.",
          "The functional updater is safest when the next value depends on the previous one.",
        ],
        verbalizePoints: [
          "Use the phrase state snapshot.",
          "Say that the updater callback receives the freshest queued value.",
        ],
      },
      fr: {
        prompt:
          "Pourquoi setCount((current) => current + 1) est-il la reponse la plus sure quand le prochain state depend du state precedent ?",
        explanation:
          "La forme fonctionnelle lit la valeur la plus recente dans la file de mises a jour, donc elle reste correcte meme quand plusieurs updates sont batchées ensemble.",
        tlDr: "Il faut utiliser la forme fonctionnelle quand la prochaine valeur depend de la precedente, car React peut batcher les updates.",
        shortAnswer:
          "La callback de mise a jour recoit le snapshot de state le plus recent dans la file, ce qui evite de relire une ancienne valeur quand plusieurs updates arrivent ensemble.",
        lessonBody: `Cette question parle d'abord de snapshots de state, pas d'une simple question de style.

Pendant un render, ton composant lit un snapshot de state. Si tu appelles setCount(count + 1) deux fois dans le meme evenement, les deux appels peuvent relire la meme ancienne valeur de count issue de ce render.

C'est pour cela que la forme fonctionnelle existe. React passe la valeur la plus recente de la file a la callback, donc chaque update se construit sur le resultat du precedent au lieu de repartir d'un ancien snapshot.

L'explication la plus claire en entretien est la suivante: si le prochain state est calcule a partir du state precedent, il faut utiliser la forme fonctionnelle pour que React applique correctement les updates dans l'ordre.`,
        commonMistakes: [
          "Dire que la forme fonctionnelle rend le state synchrone.",
          "Croire que React modifie count immediatement dans le render courant.",
          "Utiliser la callback sans expliquer le probleme de snapshot obsolete.",
        ],
        exampleTitle: "Deux increments dans le meme evenement",
        exampleLanguage: "tsx",
        exampleCode: `setCount((current) => current + 1);
setCount((current) => current + 1);`,
        exampleExplanation:
          "Chaque callback recoit la valeur la plus recente de la file, donc le compteur peut bien avancer de deux.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Un render lit un snapshot de state, pas une variable mutable en direct.",
          "Plusieurs updates peuvent etre batchées ensemble.",
          "La forme fonctionnelle est la plus sure quand la prochaine valeur depend de la precedente.",
        ],
        verbalizePoints: [
          "Utiliser l'expression snapshot de state.",
          "Dire que la callback recoit la valeur la plus recente de la file.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "Because React ignores setCount(count + 1) after the first call in the same event.",
          explanation:
            "Incorrect. The issue is not that React ignores the second call; it is that both calls can read the same old snapshot.",
        },
        {
          label:
            "Because the updater callback receives the freshest queued state value.",
          explanation:
            "Correct. That is why it is safer when the next state depends on the previous one.",
        },
        {
          label:
            "Because it forces React to apply the state update synchronously before rerendering.",
          explanation:
            "Incorrect. It does not change React into a synchronous state system.",
        },
        {
          label:
            "Because React only allows rerenders when the callback form is used.",
          explanation: "Incorrect. Rerenders are not tied to that syntax.",
        },
      ],
      fr: [
        {
          label:
            "Parce que React ignore setCount(count + 1) apres le premier appel dans le meme evenement.",
          explanation:
            "Incorrect. Le vrai probleme n'est pas l'ignorance du second appel, mais le fait que les deux appels peuvent relire le meme ancien snapshot.",
        },
        {
          label:
            "Parce que la callback recoit la valeur de state la plus recente dans la file d'updates.",
          explanation:
            "Correct. C'est pour cela qu'elle est plus sure quand la prochaine valeur depend de la precedente.",
        },
        {
          label:
            "Parce qu'elle force React a appliquer l'update de maniere synchrone avant le rerender.",
          explanation:
            "Incorrect. Elle ne transforme pas React en systeme de state synchrone.",
        },
        {
          label:
            "Parce que React n'autorise les rerenders que quand on utilise la forme callback.",
          explanation:
            "Incorrect. Les rerenders ne dependent pas de cette syntaxe.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "controlled-input-keeps-react-in-charge",
    moduleId: beginnerReactModule.id,
    primarySkillId: beginnerStateSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 1,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [true, false, false, false],
    translations: {
      en: {
        prompt:
          "In a controlled React input, who is the source of truth for the displayed value?",
        explanation:
          "React state is the source of truth because the input value comes from state and every user edit flows back through onChange.",
        tlDr: "A controlled input is controlled by React state, not by the DOM keeping its own independent value.",
        shortAnswer:
          "The displayed value is owned by React state, and the DOM input reflects that state on each render.",
        lessonBody: `Controlled inputs are one of the clearest examples of React's data flow.

When an input is controlled, you pass a value prop into it. That value comes from React state. When the user types, the input fires onChange, and your code updates that state. Then React rerenders with the new value.

This means the DOM input is not the final source of truth. It is a rendered reflection of the state your component owns.

In interviews, the strong beginner answer is: React state owns the value, the input reports user intent through onChange, and the next render sends the updated value back down.`,
        commonMistakes: [
          "Saying the browser DOM is still the real source of truth in a controlled field.",
          "Forgetting that value and onChange work together.",
          "Confusing controlled components with refs-only access.",
        ],
        exampleTitle: "A controlled text field",
        exampleLanguage: "tsx",
        exampleCode: `const [email, setEmail] = useState("");

return (
  <input
    value={email}
    onChange={(event) => setEmail(event.target.value)}
  />
);`,
        exampleExplanation:
          "The input displays email, and typing updates email through onChange.",
        estimatedReadMinutes: 4,
        takeaways: [
          "A controlled input receives its displayed value from React state.",
          "User edits come back through onChange.",
          "The DOM field reflects state rather than owning an independent truth.",
        ],
        verbalizePoints: [
          "Say source of truth explicitly.",
          "Describe the loop value -> user event -> state update -> rerender.",
        ],
      },
      fr: {
        prompt:
          "Dans un input React controle, qui est la source de verite pour la valeur affichee ?",
        explanation:
          "Le state React est la source de verite parce que la valeur de l'input vient du state et que chaque modification utilisateur remonte via onChange.",
        tlDr: "Un input controle est pilote par le state React, pas par un DOM qui garderait sa propre valeur independante.",
        shortAnswer:
          "La valeur affichee appartient au state React, et l'input DOM ne fait que refleter ce state a chaque render.",
        lessonBody: `Les inputs controles sont l'un des exemples les plus clairs du flux de donnees React.

Quand un input est controle, on lui passe une prop value. Cette valeur vient du state React. Quand l'utilisateur tape, l'input declenche onChange et ton code met a jour ce state. React rerender ensuite avec la nouvelle valeur.

Cela signifie que l'input DOM n'est pas la source de verite finale. Il est le reflet rendu par le state que ton composant possede.

En entretien, la bonne reponse debutant est: le state React possede la valeur, l'input remonte l'intention utilisateur via onChange, puis le render suivant renvoie la valeur mise a jour vers le champ.`,
        commonMistakes: [
          "Dire que le DOM navigateur reste la vraie source de verite dans un champ controle.",
          "Oublier que value et onChange vont ensemble.",
          "Confondre composant controle et acces par ref uniquement.",
        ],
        exampleTitle: "Un champ texte controle",
        exampleLanguage: "tsx",
        exampleCode: `const [email, setEmail] = useState("");

return (
  <input
    value={email}
    onChange={(event) => setEmail(event.target.value)}
  />
);`,
        exampleExplanation:
          "L'input affiche email, et la frappe met a jour email via onChange.",
        estimatedReadMinutes: 4,
        takeaways: [
          "Un input controle recoit sa valeur affichee depuis le state React.",
          "Les modifications utilisateur remontent via onChange.",
          "Le champ DOM reflete le state au lieu de posseder une verite independante.",
        ],
        verbalizePoints: [
          "Dire explicitement source de verite.",
          "Decrire la boucle value -> evenement utilisateur -> update state -> rerender.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label: "The React state that is passed into the input's value prop.",
          explanation:
            "Correct. That is the defining property of a controlled input.",
        },
        {
          label:
            "The DOM input element, because browsers always own text values directly.",
          explanation:
            "Incorrect. That describes an uncontrolled input more than a controlled one.",
        },
        {
          label:
            "The ref object, because refs automatically keep the field value in sync.",
          explanation:
            "Incorrect. Refs can read DOM values, but they are not what makes an input controlled.",
        },
        {
          label:
            "The JSX itself, because JSX keeps the latest text between renders.",
          explanation: "Incorrect. JSX only describes the UI to render.",
        },
      ],
      fr: [
        {
          label: "Le state React passe dans la prop value de l'input.",
          explanation:
            "Correct. C'est la propriete definissante d'un input controle.",
        },
        {
          label:
            "L'element DOM input, parce que le navigateur possede toujours directement le texte.",
          explanation:
            "Incorrect. Cela decrit plutot un input uncontrolled qu'un input controle.",
        },
        {
          label:
            "L'objet ref, parce que les refs gardent automatiquement la valeur synchronisee.",
          explanation:
            "Incorrect. Une ref peut lire la valeur DOM, mais ce n'est pas ce qui rend l'input controle.",
        },
        {
          label:
            "Le JSX lui-meme, parce qu'il conserve le dernier texte entre les renders.",
          explanation: "Incorrect. JSX sert seulement a decrire l'UI a rendre.",
        },
      ],
    },
  });

  await upsertLessonQuestion({
    slug: "context-reduces-prop-drilling-not-all-state",
    moduleId: reactModule.id,
    primarySkillId: renderingSkill.id,
    format: QuestionFormat.OPEN_ENDED,
    difficulty: 3,
    level: QuestionLevel.MID,
    translations: {
      en: {
        prompt:
          "When do you introduce React context to reduce prop drilling, and why should you still avoid putting every state value into context by default?",
        explanation:
          "Context is useful when many distant components need the same data or service, but overusing it can widen rerender scope and blur ownership.",
        tlDr: "Use context for truly shared cross-tree concerns, not as a default bucket for every piece of state.",
        shortAnswer:
          "Introduce context when a value is needed by many descendants across the tree. Do not put everything there, because context does not remove the need for clear ownership and can trigger wider rerenders.",
        lessonBody: `Context solves a specific problem: repeatedly threading the same value through many intermediate components that do not actually care about it.

That is why theme, locale, auth session, or a shared form service can be good candidates. The value is genuinely needed across multiple distant parts of the tree, so context removes noisy plumbing.

But context is not a free global state upgrade. When a context value changes, every consumer that reads that value can rerender. If you put unrelated and fast-changing state into one context, you can make the tree harder to reason about and harder to optimize.

The strong interview answer is to talk about scope and ownership. Use context for genuinely shared concerns, keep local state local, and avoid turning context into a dumping ground for everything.`,
        commonMistakes: [
          "Saying context should replace all prop passing.",
          "Using one giant context for unrelated values that change at different speeds.",
          "Talking about prop drilling without discussing ownership or rerender scope.",
        ],
        exampleTitle: "A good context candidate",
        exampleLanguage: "tsx",
        exampleCode: `const ThemeContext = createContext<"light" | "dark">("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Layout />
    </ThemeContext.Provider>
  );
}`,
        exampleExplanation:
          "Theme is a cross-tree concern that many descendants may need without every intermediate component caring about it.",
        estimatedReadMinutes: 6,
        takeaways: [
          "Context is useful for cross-tree shared concerns.",
          "Local state should usually remain local.",
          "Overusing context can widen rerenders and blur ownership.",
        ],
        verbalizePoints: [
          "Name a concrete candidate like theme, locale or auth session.",
          "Say that context is not the answer to every prop drilling complaint.",
        ],
      },
      fr: {
        prompt:
          "Quand introduis-tu React context pour reduire le prop drilling, et pourquoi faut-il quand meme eviter d'y mettre tout le state par defaut ?",
        explanation:
          "Context est utile quand beaucoup de composants eloignes ont besoin de la meme donnee ou du meme service, mais en abuser elargit la zone de rerender et brouille la notion de possession.",
        tlDr: "Il faut utiliser context pour les vraies preoccupations partagees a travers l'arbre, pas comme un bac par defaut pour tout le state.",
        shortAnswer:
          "On introduit context quand une valeur est utile a beaucoup de descendants eloignes dans l'arbre. Il ne faut pas tout y mettre, car context ne remplace pas une bonne notion de possession et peut declencher des rerenders plus larges.",
        lessonBody: `Context resout un probleme precis: faire passer la meme valeur a travers beaucoup de composants intermediaires qui, eux, n'en ont pas vraiment besoin.

C'est pour cela que le theme, la locale, la session auth ou un service partage peuvent etre de bons candidats. La valeur est vraiment utile a plusieurs zones eloignees de l'arbre, donc context supprime ce plumbing repetitif.

Mais context n'est pas une mise a niveau magique vers du state global gratuit. Quand une valeur de context change, tous les consommateurs qui la lisent peuvent rerender. Si tu mets dans un seul context des valeurs non liees qui changent a des rythmes differents, l'arbre devient plus difficile a raisonner et a optimiser.

La bonne reponse d'entretien consiste a parler de scope et de possession. Il faut utiliser context pour les vraies preoccupations partagees, garder le state local quand il est local, et eviter de transformer context en fourre-tout.`,
        commonMistakes: [
          "Dire que context doit remplacer tous les props.",
          "Utiliser un seul enorme context pour des valeurs sans rapport qui changent a des vitesses differentes.",
          "Parler du prop drilling sans discuter de la possession ou du scope de rerender.",
        ],
        exampleTitle: "Un bon candidat pour context",
        exampleLanguage: "tsx",
        exampleCode: `const ThemeContext = createContext<"light" | "dark">("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Layout />
    </ThemeContext.Provider>
  );
}`,
        exampleExplanation:
          "Le theme est une preoccupation transverse dont plusieurs descendants peuvent avoir besoin sans que chaque composant intermediaire s'en occupe.",
        estimatedReadMinutes: 6,
        takeaways: [
          "Context est utile pour des preoccupations partagees a travers l'arbre.",
          "Le state local doit en general rester local.",
          "Abuser de context peut elargir les rerenders et brouiller la possession.",
        ],
        verbalizePoints: [
          "Nommer un candidat concret comme theme, locale ou session auth.",
          "Dire que context n'est pas la reponse a toute plainte de prop drilling.",
        ],
      },
    },
  });

  await upsertClosedQuestion({
    slug: "useeffect-vs-uselayouteffect-timing",
    moduleId: effectsModule.id,
    primarySkillId: effectSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 3,
    level: QuestionLevel.MID,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "When is useLayoutEffect the better choice than useEffect in a React component?",
        explanation:
          "useLayoutEffect is for work that must happen after DOM mutation but before paint, such as measuring layout or preventing visible flicker.",
        tlDr: "Choose useLayoutEffect only when the code must run before the browser paints the updated screen.",
        shortAnswer:
          "Use useLayoutEffect when the effect must read or synchronously adjust layout before the user sees the painted result.",
        lessonBody: `The important difference is timing.

useEffect runs after React commits the DOM update and after the browser has had a chance to paint. That makes it a good default for data fetching, subscriptions, logging and most side effects.

useLayoutEffect runs earlier: after React updates the DOM, but before the browser paints. That makes it useful when you must measure an element, position something, or synchronously fix layout before the user sees a flash or jump.

The beginner-safe rule is simple: start with useEffect. Reach for useLayoutEffect only when the timing before paint is actually required.`,
        commonMistakes: [
          "Using useLayoutEffect for data fetching by default.",
          "Thinking useLayoutEffect is just a faster version of useEffect.",
          "Explaining the difference without mentioning browser paint timing.",
        ],
        exampleTitle: "Measure before paint",
        exampleLanguage: "tsx",
        exampleCode: `useLayoutEffect(() => {
  const width = ref.current?.getBoundingClientRect().width ?? 0;
  setPopoverWidth(width);
}, []);`,
        exampleExplanation:
          "This pattern is about reading layout before the user sees the final paint.",
        estimatedReadMinutes: 5,
        takeaways: [
          "useEffect is the default for most side effects.",
          "useLayoutEffect is for layout-sensitive work before paint.",
          "The key concept is browser paint timing, not speed alone.",
        ],
        verbalizePoints: [
          "Name the after paint vs before paint difference.",
          "Give one concrete layout measurement example.",
        ],
      },
      fr: {
        prompt:
          "Quand useLayoutEffect est-il un meilleur choix que useEffect dans un composant React ?",
        explanation:
          "useLayoutEffect sert aux traitements qui doivent se produire apres la mutation du DOM mais avant le paint, par exemple une mesure ou une correction de layout visible.",
        tlDr: "Il faut choisir useLayoutEffect seulement quand le code doit s'executer avant que le navigateur peigne l'ecran mis a jour.",
        shortAnswer:
          "Il faut utiliser useLayoutEffect quand l'effet doit lire ou ajuster le layout de maniere synchrone avant que l'utilisateur voie le resultat peint.",
        lessonBody: `La difference importante est une difference de timing.

useEffect se declenche apres que React a valide la mise a jour du DOM et apres que le navigateur a eu l'occasion de peindre. C'est donc le bon choix par defaut pour le fetch, les abonnements, le logging et la plupart des side effects.

useLayoutEffect se declenche plus tot: apres la mise a jour du DOM, mais avant le paint du navigateur. C'est utile quand il faut mesurer un element, positionner quelque chose ou corriger le layout avant qu'un flash visuel n'apparaisse.

La regle simple pour debutant est la suivante: commencer par useEffect. Utiliser useLayoutEffect seulement quand ce timing avant paint est reellement necessaire.`,
        commonMistakes: [
          "Utiliser useLayoutEffect par defaut pour le fetch.",
          "Croire que useLayoutEffect est juste une version plus rapide de useEffect.",
          "Expliquer la difference sans parler du moment du paint navigateur.",
        ],
        exampleTitle: "Mesurer avant le paint",
        exampleLanguage: "tsx",
        exampleCode: `useLayoutEffect(() => {
  const width = ref.current?.getBoundingClientRect().width ?? 0;
  setPopoverWidth(width);
}, []);`,
        exampleExplanation:
          "Ce pattern sert a lire le layout avant que l'utilisateur voie le paint final.",
        estimatedReadMinutes: 5,
        takeaways: [
          "useEffect reste le choix par defaut pour la plupart des effets.",
          "useLayoutEffect sert aux traitements sensibles au layout avant paint.",
          "La notion cle est le timing du paint navigateur, pas seulement la vitesse.",
        ],
        verbalizePoints: [
          "Nommer clairement la difference apres paint vs avant paint.",
          "Donner un exemple concret de mesure de layout.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label: "When you want data fetching to start as early as possible.",
          explanation:
            "No. Data fetching usually belongs in useEffect, not useLayoutEffect.",
        },
        {
          label:
            "When you must measure or fix layout before the browser paints the result.",
          explanation:
            "Correct. That is the canonical reason to choose useLayoutEffect.",
        },
        {
          label:
            "Whenever the component rerenders often and needs more performance.",
          explanation:
            "No. useLayoutEffect is not a general performance upgrade.",
        },
        {
          label:
            "Only when the code runs on the server, because it matches server rendering.",
          explanation:
            "No. The difference is about client-side timing around paint.",
        },
      ],
      fr: [
        {
          label: "Quand on veut lancer le fetch le plus tot possible.",
          explanation:
            "Non. Le fetch appartient en general a useEffect, pas a useLayoutEffect.",
        },
        {
          label:
            "Quand il faut mesurer ou corriger le layout avant que le navigateur peigne le resultat.",
          explanation:
            "Correct. C'est la raison classique d'utiliser useLayoutEffect.",
        },
        {
          label:
            "Des qu'un composant rerender souvent et a besoin de plus de performance.",
          explanation:
            "Non. useLayoutEffect n'est pas une amelioration generale de performance.",
        },
        {
          label:
            "Seulement quand le code tourne sur le serveur, parce qu'il correspond au rendu serveur.",
          explanation:
            "Non. La difference concerne surtout le timing client autour du paint.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "custom-hook-reuses-logic-not-state",
    moduleId: effectsModule.id,
    primarySkillId: effectSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.MID,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "If two components call the same custom hook, what is usually shared between them?",
        explanation:
          "A custom hook shares reusable logic, not one automatic shared state instance. Each call gets its own hook state unless the hook reads from context, an external store or another shared source.",
        tlDr: "Custom hooks share logic by default; state is still per hook call.",
        shortAnswer:
          "They usually share the hook logic, but each component call has its own separate state instance unless the hook is built on top of a real shared store.",
        lessonBody: `This is one of the most useful beginner corrections because the word share is misleading.

When you extract code into a custom hook, you are sharing the logic structure: the same state setup, effects and helper functions can be reused in multiple components.

But every call to that hook still belongs to the component that called it. So if two components both call useCounter, they do not magically point to one shared counter unless the hook itself reads from a shared source such as context, a module-level store or a server cache.

The clean interview answer is: custom hooks share behavior and structure, not automatic state instances.`,
        commonMistakes: [
          "Thinking that calling the same custom hook automatically shares one state instance.",
          "Confusing code reuse with state sharing.",
          "Forgetting to mention context or external stores as the real sharing mechanism.",
        ],
        exampleTitle: "Two calls, two states",
        exampleLanguage: "tsx",
        exampleCode: `function Parent() {
  const a = useCounter();
  const b = useCounter();
  // a.count and b.count are independent
}`,
        exampleExplanation:
          "The hook logic is reused, but each call has its own state lifecycle.",
        estimatedReadMinutes: 4,
        takeaways: [
          "Custom hooks primarily share logic.",
          "Each hook call still owns its own state by default.",
          "Real shared state needs context, a store or another shared source.",
        ],
        verbalizePoints: [
          "Separate logic reuse from state sharing.",
          "Name one real mechanism that can make state shared.",
        ],
      },
      fr: {
        prompt:
          "Si deux composants appellent le meme custom hook, qu'est-ce qui est en general partage entre eux ?",
        explanation:
          "Un custom hook partage une logique reutilisable, pas une instance de state partagee automatiquement. Chaque appel a son propre state, sauf si le hook lit depuis un contexte, un store externe ou une autre source partagee.",
        tlDr: "Par defaut, un custom hook partage la logique; le state reste propre a chaque appel.",
        shortAnswer:
          "Ils partagent en general la logique du hook, mais chaque composant a sa propre instance de state sauf si le hook repose sur une vraie source partagee.",
        lessonBody: `C'est une correction tres utile au debut parce que le mot partager peut tromper.

Quand tu extrais du code dans un custom hook, tu mutualises surtout la structure de la logique: le meme state setup, les memes effets et les memes helpers peuvent etre reutilises dans plusieurs composants.

Mais chaque appel de ce hook appartient toujours au composant qui l'a invoque. Si deux composants appellent useCounter, ils ne pointent pas magiquement vers un seul compteur commun, sauf si le hook lit lui-meme depuis un contexte, un store de module ou une autre source partagee.

La bonne reponse d'entretien est donc: les custom hooks partagent le comportement et la structure, pas des instances de state automatiques.`,
        commonMistakes: [
          "Croire qu'appeler le meme custom hook partage automatiquement un seul state.",
          "Confondre reutilisation de code et partage de state.",
          "Oublier de citer context ou un store externe comme vrai mecanisme de partage.",
        ],
        exampleTitle: "Deux appels, deux states",
        exampleLanguage: "tsx",
        exampleCode: `function Parent() {
  const a = useCounter();
  const b = useCounter();
  // a.count et b.count sont independants
}`,
        exampleExplanation:
          "La logique du hook est reutilisee, mais chaque appel garde son propre cycle de vie de state.",
        estimatedReadMinutes: 4,
        takeaways: [
          "Un custom hook partage d'abord une logique.",
          "Chaque appel garde son propre state par defaut.",
          "Un vrai state partage demande context, store ou autre source commune.",
        ],
        verbalizePoints: [
          "Bien separer reutilisation de logique et partage de state.",
          "Nommer au moins un vrai mecanisme de partage de state.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label: "The exact same state instance is shared automatically.",
          explanation:
            "No. Each hook call usually creates its own state inside its owning component.",
        },
        {
          label:
            "The reusable logic is shared, but each call still has its own state by default.",
          explanation:
            "Correct. Logic reuse and state sharing are different ideas.",
        },
        {
          label:
            "Only effects are shared, while callbacks and state are duplicated manually.",
          explanation:
            "No. The hook can reuse all kinds of logic, not only effects.",
        },
        {
          label:
            "Nothing is shared at all, because a custom hook is just a naming trick.",
          explanation:
            "Incorrect. The hook absolutely shares reusable logic and structure.",
        },
      ],
      fr: [
        {
          label: "La meme instance de state est partagee automatiquement.",
          explanation:
            "Non. Chaque appel de hook cree en general son propre state dans le composant qui le possede.",
        },
        {
          label:
            "La logique reutilisable est partagee, mais chaque appel garde son propre state par defaut.",
          explanation:
            "Correct. Reutilisation de logique et partage de state sont deux idees differentes.",
        },
        {
          label:
            "Seuls les effets sont partages, alors que callbacks et state sont dupliques a la main.",
          explanation:
            "Non. Le hook peut reutiliser plusieurs formes de logique, pas seulement les effets.",
        },
        {
          label:
            "Rien n'est partage du tout, car un custom hook n'est qu'un truc de nommage.",
          explanation:
            "Incorrect. Le hook partage bien une logique et une structure reutilisables.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "useref-persists-without-triggering-render",
    moduleId: effectsModule.id,
    primarySkillId: refsLifecycleSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "What makes useRef different from useState when you want to keep a value between renders?",
        explanation:
          "A ref persists between renders, but changing ref.current does not trigger a rerender the way a state update does.",
        tlDr: "useRef keeps a mutable value across renders without asking React to rerender when it changes.",
        shortAnswer:
          "useRef stores a persistent mutable container, while useState stores render-driving state that triggers a rerender when updated.",
        lessonBody: `A lot of beginners hear that refs store values between renders and then assume refs are just lighter state. That is not quite right.

Both useRef and useState can survive across renders, but they serve different jobs. State is for data that should influence what the UI renders. When state changes, React schedules a rerender so the screen can reflect the new value.

A ref is different. It gives you a stable object whose current field you may mutate. React does not watch ref.current for rendering purposes, so updating it does not cause the component to rerender.

That is why refs are useful for DOM access, timers, previous values, or mutable flags that should survive renders without directly driving the UI.`,
        commonMistakes: [
          "Treating refs as a faster replacement for all state.",
          "Expecting ref.current changes to refresh the UI automatically.",
          "Using state for every mutable value even when the UI does not depend on it.",
        ],
        exampleTitle: "Remember an interval id",
        exampleLanguage: "tsx",
        exampleCode: `const intervalRef = useRef<number | null>(null);

intervalRef.current = window.setInterval(runTick, 1000);`,
        exampleExplanation:
          "The interval id needs to persist, but changing it should not rerender the component.",
        estimatedReadMinutes: 5,
        takeaways: [
          "State drives rendering; refs do not.",
          "A ref persists as a stable mutable container across renders.",
          "Updating ref.current does not trigger a rerender.",
        ],
        verbalizePoints: [
          "Contrast render-driving state with non-visual mutable data.",
          "Mention DOM nodes, timers or previous values as common ref use cases.",
        ],
      },
      fr: {
        prompt:
          "Qu'est-ce qui distingue useRef de useState quand on veut conserver une valeur entre plusieurs renders ?",
        explanation:
          "Une ref persiste entre les renders, mais changer ref.current ne declenche pas de rerender comme le ferait une mise a jour de state.",
        tlDr: "useRef conserve une valeur mutable entre les renders sans demander a React de rerender quand elle change.",
        shortAnswer:
          "useRef stocke un conteneur mutable persistant, alors que useState stocke un state qui pilote le rendu et declenche un rerender quand il change.",
        lessonBody: `Beaucoup de debutants entendent que les refs gardent des valeurs entre les renders puis en concluent qu'une ref est juste une version plus legere du state. Ce n'est pas exactement cela.

useRef et useState survivent tous les deux entre les renders, mais ils ne servent pas le meme objectif. Le state sert aux donnees qui doivent influencer ce que l'UI affiche. Quand le state change, React programme un rerender pour que l'ecran reflète la nouvelle valeur.

Une ref fonctionne autrement. Elle fournit un objet stable dont le champ current peut etre modifie. React ne surveille pas ref.current pour le rendu, donc le modifier ne fait pas rerender le composant.

C'est pour cela que les refs sont utiles pour l'acces DOM, les timers, les anciennes valeurs, ou des drapeaux mutables qui doivent survivre aux renders sans piloter directement l'UI.`,
        commonMistakes: [
          "Traiter les refs comme un remplacement plus rapide de tout le state.",
          "Attendre qu'un changement de ref.current rafraichisse l'UI automatiquement.",
          "Utiliser du state pour chaque valeur mutable alors que l'UI n'en depend pas.",
        ],
        exampleTitle: "Memoriser un id de timer",
        exampleLanguage: "tsx",
        exampleCode: `const intervalRef = useRef<number | null>(null);

intervalRef.current = window.setInterval(runTick, 1000);`,
        exampleExplanation:
          "L'id du timer doit persister, mais le modifier ne doit pas rerender le composant.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Le state pilote le rendu; les refs non.",
          "Une ref persiste comme conteneur mutable stable entre les renders.",
          "Modifier ref.current ne declenche pas de rerender.",
        ],
        verbalizePoints: [
          "Opposer state qui pilote le rendu et donnees mutables non visuelles.",
          "Citer les noeuds DOM, les timers ou les anciennes valeurs comme usages classiques.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "Updating ref.current always rerenders the component with the new value.",
          explanation:
            "Incorrect. That behavior belongs to state updates, not ref mutations.",
        },
        {
          label:
            "A ref persists between renders, but mutating ref.current does not trigger a rerender.",
          explanation: "Correct. That is the key distinction from state.",
        },
        {
          label:
            "Refs are only for DOM nodes and cannot store custom mutable values.",
          explanation:
            "Incorrect. Refs can also hold timers, previous values and other mutable data.",
        },
        {
          label:
            "useRef is the same as useState except that the syntax is shorter.",
          explanation:
            "Incorrect. Their rendering behavior is fundamentally different.",
        },
      ],
      fr: [
        {
          label:
            "Mettre a jour ref.current rerender toujours le composant avec la nouvelle valeur.",
          explanation:
            "Incorrect. Ce comportement appartient aux updates de state, pas aux mutations de ref.",
        },
        {
          label:
            "Une ref persiste entre les renders, mais muter ref.current ne declenche pas de rerender.",
          explanation: "Correct. C'est la distinction cle avec le state.",
        },
        {
          label:
            "Les refs servent uniquement aux noeuds DOM et ne peuvent pas stocker d'autres valeurs mutables.",
          explanation:
            "Incorrect. Elles peuvent aussi contenir des timers, des anciennes valeurs et d'autres donnees mutables.",
        },
        {
          label:
            "useRef est la meme chose que useState sauf que la syntaxe est plus courte.",
          explanation:
            "Incorrect. Leur comportement vis-a-vis du rendu est fondamentalement different.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "empty-deps-effect-runs-after-first-commit",
    moduleId: effectsModule.id,
    primarySkillId: refsLifecycleSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "What does useEffect(() => { ... }, []) usually mean in production behavior?",
        explanation:
          "It means the effect runs after the first committed render and its cleanup runs on unmount. It does not run before render and it does not mean the code is server-side only.",
        tlDr: "An empty dependency array means the effect is tied to the first mount lifecycle of that component instance.",
        shortAnswer:
          "In normal production behavior, the effect runs once after the first commit of that component instance, then cleans up when the instance unmounts.",
        lessonBody: `The empty dependency array is often taught too loosely as "run once". That shortcut is useful, but incomplete.

The more precise explanation is that the effect is attached to the mount lifecycle of that component instance. React runs it after the first committed render, and if the effect returns a cleanup, React runs that cleanup when the instance unmounts.

That also means the effect does not run before render. Rendering happens first, React commits the UI, and then the effect runs.

If you want to sound solid in an interview, add one nuance: in development Strict Mode, React may intentionally run mount logic more than once to expose side-effect mistakes. But the core production mental model is still first commit plus unmount cleanup.`,
        commonMistakes: [
          "Saying the effect runs before the first render.",
          "Forgetting to mention cleanup on unmount.",
          "Confusing development Strict Mode behavior with the core production model.",
        ],
        exampleTitle: "Subscribe on mount, clean up on unmount",
        exampleLanguage: "tsx",
        exampleCode: `useEffect(() => {
  const connection = connect();

  return () => {
    connection.close();
  };
}, []);`,
        exampleExplanation:
          "The connection starts after the first commit and is cleaned up when the component instance leaves the tree.",
        estimatedReadMinutes: 5,
        takeaways: [
          "An empty dependency array ties the effect to the mount lifecycle.",
          "Effects run after commit, not before render.",
          "Cleanup runs when that component instance unmounts.",
        ],
        verbalizePoints: [
          "Say after the first committed render, not before render.",
          "Add the Strict Mode nuance only after the main mental model is clear.",
        ],
      },
      fr: {
        prompt:
          "Que signifie en general useEffect(() => { ... }, []) dans le comportement de production ?",
        explanation:
          "Cela signifie que l'effet tourne apres le premier render committe et que son cleanup tourne au demontage. Il ne s'execute pas avant le render et cela ne veut pas dire que le code est reserve au serveur.",
        tlDr: "Un tableau de dependances vide attache l'effet au cycle de vie du premier montage de cette instance de composant.",
        shortAnswer:
          "En comportement de production normal, l'effet tourne une fois apres le premier commit de cette instance de composant, puis son cleanup s'execute quand cette instance est demontée.",
        lessonBody: `Le tableau de dependances vide est souvent enseigne avec le raccourci "run once". Ce raccourci aide, mais il reste incomplet.

L'explication plus precise est que l'effet est rattache au cycle de vie de montage de cette instance du composant. React l'execute apres le premier render committe, et si l'effet retourne un cleanup, React appellera ce cleanup lors du demontage de l'instance.

Cela signifie aussi que l'effet ne tourne pas avant le render. Le render a lieu d'abord, React commit l'UI, puis l'effet s'execute.

Pour etre solide en entretien, on peut ajouter une nuance: en development avec Strict Mode, React peut volontairement relancer la logique de montage pour reveiller des erreurs de side effects. Mais le modele mental central en production reste premier commit puis cleanup au demontage.`,
        commonMistakes: [
          "Dire que l'effet tourne avant le premier render.",
          "Oublier de mentionner le cleanup au demontage.",
          "Confondre le comportement de Strict Mode en dev avec le modele principal de production.",
        ],
        exampleTitle: "S'abonner au montage, nettoyer au demontage",
        exampleLanguage: "tsx",
        exampleCode: `useEffect(() => {
  const connection = connect();

  return () => {
    connection.close();
  };
}, []);`,
        exampleExplanation:
          "La connexion demarre apres le premier commit et est nettoyee quand l'instance quitte l'arbre.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Un tableau vide relie l'effet au cycle de vie du montage.",
          "Les effets tournent apres le commit, pas avant le render.",
          "Le cleanup tourne quand cette instance est demontée.",
        ],
        verbalizePoints: [
          "Dire apres le premier render committe, pas avant le render.",
          "Ajouter la nuance Strict Mode seulement apres avoir donne le modele principal.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "It runs before the first render so the UI can use the fetched values immediately.",
          explanation: "Incorrect. Effects do not run before render.",
        },
        {
          label:
            "It runs after the first committed render of that component instance, then cleans up on unmount.",
          explanation: "Correct. That is the right production mental model.",
        },
        {
          label:
            "It reruns after every render because the dependency array is present.",
          explanation:
            "Incorrect. An empty array means there are no changing listed dependencies.",
        },
        {
          label:
            "It only runs during server-side rendering because the dependencies never change.",
          explanation:
            "Incorrect. Effects are a client-side lifecycle mechanism.",
        },
      ],
      fr: [
        {
          label:
            "Il tourne avant le premier render pour que l'UI utilise tout de suite les valeurs recuperees.",
          explanation: "Incorrect. Les effets ne tournent pas avant le render.",
        },
        {
          label:
            "Il tourne apres le premier render committe de cette instance, puis se nettoie au demontage.",
          explanation: "Correct. C'est le bon modele mental de production.",
        },
        {
          label:
            "Il relance apres chaque render parce que le tableau de dependances est present.",
          explanation:
            "Incorrect. Un tableau vide signifie qu'aucune dependance listee ne change.",
        },
        {
          label:
            "Il ne tourne qu'en server-side rendering parce que les dependances ne changent jamais.",
          explanation:
            "Incorrect. Les effets sont un mecanisme de cycle de vie cote client.",
        },
      ],
    },
  });

  await upsertLessonQuestion({
    slug: "fetch-race-condition-bug-hunt",
    moduleId: effectsModule.id,
    primarySkillId: effectSkill.id,
    format: QuestionFormat.BUG_HUNT,
    difficulty: 4,
    level: QuestionLevel.MID,
    translations: {
      en: {
        prompt:
          "Select the lines that let an older fetch response overwrite the latest UI, then explain the bug and the fix in simple terms.",
        explanation:
          "The effect starts a fetch for each userId but never cancels or guards older requests. A slower old response can arrive later and overwrite the newer state. The fix is to ignore stale responses or cancel the request in cleanup.",
        tlDr: "Without cleanup or cancellation, an older async response can win the race and write stale data into state.",
        shortAnswer:
          "The bug is a race condition: the old request can finish after the new one and still call setUser. You need cleanup logic or cancellation so stale results do not update state.",
        lessonBody: `This is a very common beginner bug because each fetch call looks correct in isolation.

The real problem appears when the dependency changes quickly. React starts a new request for the latest userId, but the older request is still in flight. If the older request finishes last, it can overwrite the UI with stale data.

Nothing is technically wrong with fetch itself. The bug comes from asynchronous work continuing after the component has moved on to a newer state.

The interview-safe answer is to name the race condition clearly, then explain the fix in beginner terms: either cancel the old request with AbortController or ignore stale responses during cleanup so only the latest request is allowed to update state.`,
        commonMistakes: [
          "Calling it only a performance problem instead of a stale data race.",
          "Explaining the fetch but not the out-of-order response risk.",
          "Proposing cleanup without saying what stale result it prevents.",
        ],
        exampleTitle: "A stale response race",
        exampleLanguage: "tsx",
        exampleCode: `useEffect(() => {
  fetch('/api/users/' + userId)
    .then((response) => response.json())
    .then((data) => {
      setUser(data);
    });
}, [userId]);`,
        exampleExplanation:
          "If userId changes twice quickly, the slower older request can still call setUser after the newer one.",
        estimatedReadMinutes: 6,
        contextData: {
          kind: "bug_hunt",
          language: "tsx",
          code: `function UserCard({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/users/" + userId)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      });
  }, [userId]);

  return <ProfileView user={user} />;
}`,
        },
        takeaways: [
          "Async effects can complete out of order.",
          "Old responses must not overwrite newer UI state.",
          "Cleanup or cancellation protects the latest state from stale writes.",
        ],
        verbalizePoints: [
          "Name the race condition and the stale response risk.",
          "Propose AbortController or an ignore flag in cleanup.",
        ],
      },
      fr: {
        prompt:
          "Selectionne les lignes qui permettent a une ancienne reponse fetch d'ecraser l'UI la plus recente, puis explique le bug et le correctif simplement.",
        explanation:
          "L'effet lance un fetch a chaque userId mais n'annule jamais les anciennes requetes. Une vieille reponse plus lente peut arriver plus tard et ecraser le state plus recent. Le correctif consiste a ignorer les reponses obsoletes ou a annuler la requete dans le cleanup.",
        tlDr: "Sans cleanup ou annulation, une ancienne reponse asynchrone peut gagner la course et ecrire une donnee obsolete dans le state.",
        shortAnswer:
          "Le bug est une race condition: l'ancienne requete peut finir apres la nouvelle et quand meme appeler setUser. Il faut une logique de cleanup ou d'annulation pour empecher une reponse obsolete de mettre a jour le state.",
        lessonBody: `C'est un bug tres frequent chez les debutants parce que chaque appel fetch parait correct pris isollement.

Le vrai probleme apparait quand la dependance change rapidement. React lance une nouvelle requete pour le dernier userId, mais l'ancienne requete est toujours en cours. Si l'ancienne finit en dernier, elle peut ecraser l'UI avec une donnee obsolete.

Le souci ne vient pas de fetch en lui-meme. Le bug vient du fait qu'un travail asynchrone continue alors que le composant est deja passe a un etat plus recent.

La bonne reponse d'entretien consiste a nommer clairement la race condition, puis a expliquer le correctif en termes simples: soit annuler l'ancienne requete avec AbortController, soit ignorer les reponses obsoletes pendant le cleanup pour que seule la derniere requete ait le droit de mettre a jour le state.`,
        commonMistakes: [
          "Decrire seulement un probleme de performance au lieu d'un probleme de stale data.",
          "Expliquer le fetch sans parler du risque de reponse hors ordre.",
          "Proposer un cleanup sans nommer le resultat obsolete qu'il evite.",
        ],
        exampleTitle: "Une course de reponses obsoletes",
        exampleLanguage: "tsx",
        exampleCode: `useEffect(() => {
  fetch('/api/users/' + userId)
    .then((response) => response.json())
    .then((data) => {
      setUser(data);
    });
}, [userId]);`,
        exampleExplanation:
          "Si userId change rapidement deux fois, la vieille requete plus lente peut encore appeler setUser apres la plus recente.",
        estimatedReadMinutes: 6,
        contextData: {
          kind: "bug_hunt",
          language: "tsx",
          code: `function UserCard({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/users/" + userId)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      });
  }, [userId]);

  return <ProfileView user={user} />;
}`,
        },
        takeaways: [
          "Les effets asynchrones peuvent se terminer dans le mauvais ordre.",
          "Une ancienne reponse ne doit pas ecraser le state le plus recent.",
          "Le cleanup ou l'annulation protege l'UI contre les ecritures obsoletes.",
        ],
        verbalizePoints: [
          "Nommer la race condition et le risque de stale response.",
          "Proposer AbortController ou un flag ignore dans le cleanup.",
        ],
      },
    },
  });

  await upsertClosedQuestion({
    slug: "flatlist-vs-scrollview-for-long-lists",
    moduleId: reactNativeModule.id,
    primarySkillId: rnSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.MID,
    optionCorrectness: [true, false, false, false],
    translations: {
      en: {
        prompt:
          "Why is FlatList usually the better default than ScrollView for long or changing lists in React Native?",
        explanation:
          "FlatList virtualizes rendering, so it does not keep every row mounted at once. That lowers memory and rendering cost for bigger lists.",
        tlDr: "FlatList is built for large lists because it renders items lazily and reuses list infrastructure.",
        shortAnswer:
          "FlatList is usually better for long lists because it virtualizes items instead of rendering the whole list at once like ScrollView.",
        lessonBody: `A beginner often reaches for ScrollView because it is simpler to understand. For small fixed content, that is fine.

But long data lists behave differently from a short stack of UI blocks. If you render every row at once, memory usage grows, initial rendering gets heavier, and scrolling can become less stable on mobile devices.

FlatList is designed specifically for data lists. It virtualizes the list, which means it renders only the visible rows and a small buffer around them instead of mounting everything permanently.

The interview answer should not stop at the word virtualization. Explain the consequence: less work, less memory pressure and better behavior when the list is large or changes often.`,
        commonMistakes: [
          "Saying FlatList is always required even for tiny static screens.",
          "Using the word virtualization without explaining why it matters.",
          "Thinking keys alone make ScrollView equivalent to FlatList.",
        ],
        exampleTitle: "A list of server data",
        exampleLanguage: "tsx",
        exampleCode: `return (
  <FlatList
    data={messages}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <MessageRow message={item} />}
  />
);`,
        exampleExplanation:
          "FlatList is optimized for large collections of repeated rows.",
        estimatedReadMinutes: 5,
        takeaways: [
          "ScrollView renders all children, which is costly for long lists.",
          "FlatList virtualizes rows for better mobile performance.",
          "The key benefit is lower rendering and memory pressure, not just API style.",
        ],
        verbalizePoints: [
          "Name virtualization and explain its effect on mounted rows.",
          "Connect the answer to mobile memory and scroll performance.",
        ],
      },
      fr: {
        prompt:
          "Pourquoi FlatList est-il en general un meilleur choix par defaut que ScrollView pour des listes longues ou changeantes en React Native ?",
        explanation:
          "FlatList virtualise le rendu, donc il ne garde pas toutes les lignes montees en permanence. Cela reduit le cout memoire et le cout de rendu sur les grosses listes.",
        tlDr: "FlatList est concu pour les grandes listes parce qu'il rend les items progressivement et reutilise une infrastructure adaptee.",
        shortAnswer:
          "FlatList est en general meilleur pour les longues listes parce qu'il virtualise les items au lieu de rendre toute la liste d'un coup comme ScrollView.",
        lessonBody: `Au debut, on choisit souvent ScrollView parce que c'est plus simple a comprendre. Pour un petit contenu fixe, c'est tres bien.

Mais une vraie liste de donnees ne se comporte pas comme une petite pile de blocs UI. Si tu rends toutes les lignes d'un seul coup, l'usage memoire augmente, le rendu initial devient plus lourd et le scroll peut devenir moins stable sur mobile.

FlatList est concu specialement pour ce type de liste. Il virtualise la liste, c'est-a-dire qu'il ne rend que les lignes visibles et une petite zone autour, au lieu de tout monter en permanence.

En entretien, il ne faut pas s'arreter au mot virtualization. Il faut expliquer la consequence: moins de travail, moins de pression memoire et un meilleur comportement quand la liste est grande ou change souvent.`,
        commonMistakes: [
          "Dire que FlatList est toujours obligatoire, meme pour un tout petit ecran statique.",
          "Utiliser le mot virtualisation sans expliquer pourquoi c'est utile.",
          "Croire que des keys suffisent a rendre ScrollView equivalent a FlatList.",
        ],
        exampleTitle: "Une liste de donnees serveur",
        exampleLanguage: "tsx",
        exampleCode: `return (
  <FlatList
    data={messages}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <MessageRow message={item} />}
  />
);`,
        exampleExplanation:
          "FlatList est optimise pour les grandes collections de lignes repetitives.",
        estimatedReadMinutes: 5,
        takeaways: [
          "ScrollView rend tous ses enfants, ce qui coute cher sur une longue liste.",
          "FlatList virtualise les lignes pour une meilleure performance mobile.",
          "Le benefice principal est la baisse du cout memoire et de rendu, pas juste une difference d'API.",
        ],
        verbalizePoints: [
          "Nommer la virtualisation et son effet sur les lignes montees.",
          "Relier la reponse a la memoire mobile et a la fluidite du scroll.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "Because FlatList virtualizes rows instead of rendering the entire list at once.",
          explanation:
            "Correct. That is the main performance reason FlatList exists.",
        },
        {
          label:
            "Because ScrollView cannot render clickable rows while FlatList can.",
          explanation: "Incorrect. Both can render interactive content.",
        },
        {
          label: "Because FlatList is required whenever list items have keys.",
          explanation:
            "No. Keys are useful in both cases, but they do not make ScrollView a virtualized list.",
        },
        {
          label:
            "Because ScrollView is deprecated for all list content in React Native.",
          explanation:
            "Incorrect. ScrollView still has valid uses for small static content.",
        },
      ],
      fr: [
        {
          label:
            "Parce que FlatList virtualise les lignes au lieu de rendre toute la liste d'un coup.",
          explanation:
            "Correct. C'est la raison de performance principale de FlatList.",
        },
        {
          label:
            "Parce que ScrollView ne peut pas afficher des lignes cliquables alors que FlatList le peut.",
          explanation:
            "Incorrect. Les deux peuvent afficher du contenu interactif.",
        },
        {
          label:
            "Parce que FlatList devient obligatoire des qu'une liste a des keys.",
          explanation:
            "Non. Les keys sont utiles dans les deux cas, mais elles ne rendent pas ScrollView virtualise.",
        },
        {
          label:
            "Parce que ScrollView est obsolete pour tout contenu de liste en React Native.",
          explanation:
            "Incorrect. ScrollView reste valable pour du petit contenu statique.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "flatlist-stable-keyextractor-beats-indexes",
    moduleId: reactNativeModule.id,
    primarySkillId: rnSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 3,
    level: QuestionLevel.MID,
    optionCorrectness: [true, false, false, false],
    translations: {
      en: {
        prompt:
          "When backend items already have stable ids, what is the safest keyExtractor choice for a React Native FlatList?",
        explanation:
          "Use the stable item id. It preserves row identity across inserts, deletes and reorders better than indexes or random values.",
        tlDr: "FlatList keys should come from stable item identity, not array position or random generation.",
        shortAnswer:
          "The safest default is keyExtractor={(item) => item.id}, because stable ids let FlatList preserve row identity correctly across list changes.",
        lessonBody: `This question is really about identity, not about syntax.

FlatList needs a stable way to recognize which visual row corresponds to which data item. If the key changes for the wrong reason, React Native can reuse or replace rows in confusing ways.

That is why stable ids from your data model are the best default. An item id continues to mean the same thing even if the list is filtered, sorted, prepended to, or partially refreshed from the server.

Indexes are much weaker because they describe position, not identity. Random keys are even worse because they destroy stability on every render. In interviews, say that keys should follow the item's real identity over time.`,
        commonMistakes: [
          "Using indexes even though the list can reorder or insert rows.",
          "Generating random keys in render.",
          "Talking about keys only as a warning suppressor instead of an identity mechanism.",
        ],
        exampleTitle: "Stable id keyExtractor",
        exampleLanguage: "tsx",
        exampleCode: `<FlatList
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <MessageRow message={item} />}
/>`,
        exampleExplanation:
          "The same message keeps the same key even if the list order changes.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Keys should follow item identity over time.",
          "Stable ids beat indexes when a list can change shape.",
          "Random keys destroy row stability.",
        ],
        verbalizePoints: [
          "Say identity, not position.",
          "Explain what happens when rows are inserted, deleted or reordered.",
        ],
      },
      fr: {
        prompt:
          "Quand les items backend ont deja des ids stables, quel est le keyExtractor le plus sur pour une FlatList React Native ?",
        explanation:
          "Il faut utiliser l'id stable de l'item. Cela preserve mieux l'identite des lignes a travers les insertions, suppressions et reorder que les indexes ou les valeurs aleatoires.",
        tlDr: "Les keys d'une FlatList doivent venir d'une identite d'item stable, pas de la position dans le tableau ni d'une generation aleatoire.",
        shortAnswer:
          "Le meilleur choix par defaut est keyExtractor={(item) => item.id}, car un id stable permet a FlatList de conserver correctement l'identite des lignes quand la liste change.",
        lessonBody: `Cette question parle surtout d'identite, pas de syntaxe.

FlatList a besoin d'un moyen stable de reconnaitre quelle ligne visuelle correspond a quelle donnee. Si la key change pour une mauvaise raison, React Native peut reutiliser ou remplacer des lignes de facon confuse.

C'est pour cela que les ids stables issus du modele de donnees sont le meilleur choix par defaut. Un id d'item garde le meme sens meme si la liste est filtree, triee, prefixee avec de nouvelles lignes ou rafraichie partiellement depuis le serveur.

Les indexes sont beaucoup plus fragiles parce qu'ils decrivent une position, pas une identite. Les keys aleatoires sont encore pires car elles detruisent la stabilite a chaque render. En entretien, il faut dire que la key doit suivre la vraie identite de l'item dans le temps.`,
        commonMistakes: [
          "Utiliser des indexes alors que la liste peut etre reordonnee ou recevoir des insertions.",
          "Generer des keys aleatoires dans le render.",
          "Parler des keys seulement comme d'un warning a faire disparaitre au lieu d'un mecanisme d'identite.",
        ],
        exampleTitle: "keyExtractor base sur un id stable",
        exampleLanguage: "tsx",
        exampleCode: `<FlatList
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <MessageRow message={item} />}
/>`,
        exampleExplanation:
          "Le meme message garde la meme key meme si l'ordre de la liste change.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Les keys doivent suivre l'identite de l'item dans le temps.",
          "Des ids stables sont preferables aux indexes quand la liste peut changer de forme.",
          "Les keys aleatoires detruisent la stabilite des lignes.",
        ],
        verbalizePoints: [
          "Dire identite, pas position.",
          "Expliquer ce qui se passe quand des lignes sont inserees, supprimees ou reorder.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label: "keyExtractor={(item) => item.id}",
          explanation:
            "Correct. A stable id is the safest identity source when it already exists in the data.",
        },
        {
          label:
            "keyExtractor={(_, index) => String(index)} for every changing list",
          explanation:
            "Incorrect. Indexes describe position, not durable identity.",
        },
        {
          label:
            "keyExtractor={() => Math.random().toString()} so every row gets a unique key each render",
          explanation:
            "Incorrect. Random keys destroy stability and defeat reconciliation.",
        },
        {
          label:
            "Omit keyExtractor and rely on JSX order when rows can be inserted or sorted",
          explanation:
            "Incorrect. That gives FlatList a weaker identity story for dynamic data.",
        },
      ],
      fr: [
        {
          label: "keyExtractor={(item) => item.id}",
          explanation:
            "Correct. Un id stable est la source d'identite la plus sure quand elle existe deja dans les donnees.",
        },
        {
          label:
            "keyExtractor={(_, index) => String(index)} pour toute liste qui change",
          explanation:
            "Incorrect. Les indexes decrivent une position, pas une identite durable.",
        },
        {
          label:
            "keyExtractor={() => Math.random().toString()} pour avoir une key unique a chaque render",
          explanation:
            "Incorrect. Les keys aleatoires detruisent la stabilite et cassent la reconciliation.",
        },
        {
          label:
            "Ne pas definir keyExtractor et compter sur l'ordre JSX quand des lignes peuvent etre inserees ou triees",
          explanation:
            "Incorrect. Cela donne a FlatList une histoire d'identite plus faible pour des donnees dynamiques.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "index-key-breaks-item-identity",
    moduleId: reactModule.id,
    primarySkillId: renderingSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "Why can using the array index as a key break a list item's local state when rows are reordered or inserted?",
        explanation:
          "The index tracks position, not item identity. When positions shift, React can preserve the wrong component instance for the wrong item.",
        tlDr: "Index keys are fragile because they follow position instead of the item's real identity.",
        shortAnswer:
          "When the list order changes, the same index may now point to a different item, so React can attach the previous row state to the wrong data item.",
        lessonBody: `This is one of the most interview-relevant key questions because it reveals whether you understand identity.

React uses keys to decide which previous child instance should be matched with which next child instance. If you use the array index, you are telling React that position is the identity.

That works only if the list is truly static. But if you insert a row at the top, sort the list, or filter items, the positions shift. Now the component that used to belong to one item may be reused for another item at the same index.

That is how local row state, input values, or focus can appear to jump to the wrong row. The important answer is not just "indexes are bad". The important answer is that they represent position, not stable item identity.`,
        commonMistakes: [
          "Saying index keys are always fine even in dynamic lists.",
          "Talking only about performance and not about broken local state.",
          "Forgetting that inserts and filters change positions.",
        ],
        exampleTitle: "An editable todo row",
        exampleLanguage: "tsx",
        exampleCode: `{todos.map((todo, index) => (
  <TodoRow key={index} todo={todo} />
))}`,
        exampleExplanation:
          "If a todo is inserted at the top, the row previously at index 0 may now display a different todo while keeping the old local row state.",
        estimatedReadMinutes: 5,
        takeaways: [
          "A key should represent stable item identity.",
          "Indexes represent position, which changes in dynamic lists.",
          "Wrong keys can attach preserved local state to the wrong row.",
        ],
        verbalizePoints: [
          "Explain the difference between identity and position.",
          "Mention a concrete symptom such as input state jumping rows.",
        ],
      },
      fr: {
        prompt:
          "Pourquoi utiliser l'index du tableau comme key peut-il casser le state local d'une ligne quand les rows sont reorder ou inserees ?",
        explanation:
          "L'index suit une position, pas l'identite de l'item. Quand les positions changent, React peut conserver la mauvaise instance de composant pour le mauvais item.",
        tlDr: "Les index comme keys sont fragiles car ils suivent la position au lieu de la vraie identite de l'item.",
        shortAnswer:
          "Quand l'ordre de la liste change, le meme index peut maintenant pointer vers un autre item, donc React peut rattacher l'ancien state de ligne a la mauvaise donnee.",
        lessonBody: `C'est l'une des questions de key les plus utiles en entretien parce qu'elle montre si tu comprends vraiment l'identite.

React utilise les keys pour decider quelle ancienne instance enfant doit etre associee a quelle nouvelle instance enfant. Si tu utilises l'index du tableau, tu dis a React que la position est l'identite.

Cela ne marche que si la liste est vraiment statique. Mais si tu inseres une ligne en haut, tries la liste ou filtres des elements, les positions bougent. Le composant qui appartenait a un item peut alors etre reutilise pour un autre item situe au meme index.

C'est ainsi que le state local de ligne, les valeurs d'input ou le focus peuvent sembler sauter vers la mauvaise ligne. La bonne reponse n'est pas juste "les indexes c'est mal". La bonne reponse est qu'un index represente une position, pas une identite stable d'item.`,
        commonMistakes: [
          "Dire que les index sont toujours acceptables meme dans une liste dynamique.",
          "Parler seulement de performance sans parler du state local casse.",
          "Oublier que les insertions et les filtres changent les positions.",
        ],
        exampleTitle: "Une ligne todo editable",
        exampleLanguage: "tsx",
        exampleCode: `{todos.map((todo, index) => (
  <TodoRow key={index} todo={todo} />
))}`,
        exampleExplanation:
          "Si un todo est insere en haut, la ligne qui etait a l'index 0 peut maintenant afficher un autre todo tout en conservant l'ancien state local.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Une key doit representer une identite stable d'item.",
          "Les indexes representent une position, qui change dans une liste dynamique.",
          "De mauvaises keys peuvent rattacher un state local conserve a la mauvaise ligne.",
        ],
        verbalizePoints: [
          "Expliquer clairement la difference entre identite et position.",
          "Citer un symptome concret comme un input qui saute de ligne.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "Because the index becomes faster to compare than a stable id, so React drops local state on purpose.",
          explanation:
            "Incorrect. The real issue is mismatched identity, not a deliberate state drop optimization.",
        },
        {
          label:
            "Because the index describes position, so React can preserve the wrong row instance when positions shift.",
          explanation:
            "Correct. That is why reordered or inserted rows can inherit the wrong local state.",
        },
        {
          label:
            "Because React forbids numeric keys when a row contains an input element.",
          explanation:
            "Incorrect. Numeric keys are allowed; the problem is unstable identity.",
        },
        {
          label:
            "Because using an index key forces every row to remount on every rerender.",
          explanation:
            "Incorrect. The main bug is not universal remounting, but preserving the wrong instance for a different item.",
        },
      ],
      fr: [
        {
          label:
            "Parce que l'index est plus rapide a comparer qu'un id stable, donc React supprime volontairement le state local.",
          explanation:
            "Incorrect. Le vrai probleme vient d'une mauvaise identite, pas d'une optimisation volontaire de suppression de state.",
        },
        {
          label:
            "Parce que l'index decrit une position, donc React peut conserver la mauvaise instance de ligne quand les positions bougent.",
          explanation:
            "Correct. C'est pour cela qu'une ligne reorder ou inseree peut heriter du mauvais state local.",
        },
        {
          label:
            "Parce que React interdit les keys numeriques quand une ligne contient un input.",
          explanation:
            "Incorrect. Les keys numeriques sont autorisees; le probleme est l'instabilite d'identite.",
        },
        {
          label:
            "Parce qu'une key index force toutes les lignes a etre remontees a chaque rerender.",
          explanation:
            "Incorrect. Le bug principal n'est pas un remount universel, mais la conservation de la mauvaise instance pour un autre item.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "objects-with-same-fields-are-not-equal-by-reference",
    moduleId: javascriptFoundationsModule.id,
    primarySkillId: jsValuesSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 1,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "Why does { a: 1 } === { a: 1 } evaluate to false in JavaScript?",
        explanation:
          "Objects are compared by reference identity with ===, not by deep comparison of their fields.",
        tlDr: "Two object literals with the same content are still different objects in memory.",
        shortAnswer:
          "Because each object literal creates a distinct object reference, and strict equality checks whether both sides point to the same object.",
        lessonBody: `This is one of the most important beginner JavaScript questions because it explains a lot of React behavior too.

When you create an object literal, JavaScript allocates a new object. If you create another object literal with the same keys and values, JavaScript allocates a second object. They may look identical, but they are still different references.

Strict equality on objects does not open both objects and compare every nested field. It asks a simpler question: are both operands the exact same object reference?

That is why this topic matters in React interviews. Referential equality affects dependency arrays, memoization and rerender decisions. The strong answer is to say that objects compare by identity, not by deep content.`,
        commonMistakes: [
          "Saying JavaScript compares every object property with === by default.",
          "Thinking two matching object literals reuse the same memory automatically.",
          "Missing the connection between reference identity and React behavior.",
        ],
        exampleTitle: "Same shape, different reference",
        exampleLanguage: "ts",
        exampleCode: `const a = { value: 1 };
const b = { value: 1 };

console.log(a === b); // false`,
        exampleExplanation:
          "a and b look the same, but they are separate object references.",
        estimatedReadMinutes: 4,
        takeaways: [
          "Object strict equality checks reference identity.",
          "Two equal-looking object literals are still different references.",
          "This same idea appears again in React deps and memoization.",
        ],
        verbalizePoints: [
          "Use the phrase reference identity.",
          "Connect the concept back to React when relevant.",
        ],
      },
      fr: {
        prompt:
          "Pourquoi { a: 1 } === { a: 1 } renvoie-t-il false en JavaScript ?",
        explanation:
          "Les objets sont compares par identite de reference avec ===, pas par comparaison profonde de leurs champs.",
        tlDr: "Deux litteraux objet avec le meme contenu restent deux objets differents en memoire.",
        shortAnswer:
          "Parce que chaque litteral objet cree une reference distincte, et l'egalite stricte verifie si les deux cotes pointent vers le meme objet.",
        lessonBody: `C'est une des questions JavaScript les plus importantes pour debuter, parce qu'elle explique aussi beaucoup de comportements React.

Quand tu crees un litteral objet, JavaScript alloue un nouvel objet. Si tu crees un autre litteral avec les memes cles et valeurs, JavaScript alloue un deuxieme objet. Ils se ressemblent, mais restent deux references differentes.

L'egalite stricte sur les objets n'ouvre pas les deux objets pour comparer chaque champ imbrique. Elle pose une question plus simple: est-ce que les deux operandes sont exactement la meme reference objet ?

C'est pour cela que ce sujet compte en entretien React. L'egalite de reference influence les dependency arrays, la memoization et les decisions de rerender. La bonne reponse consiste a dire que les objets sont compares par identite, pas par contenu profond.`,
        commonMistakes: [
          "Dire que JavaScript compare toutes les proprietes d'objet avec === par defaut.",
          "Croire que deux litteraux identiques reutilisent automatiquement la meme memoire.",
          "Manquer le lien entre identite de reference et comportement React.",
        ],
        exampleTitle: "Meme forme, reference differente",
        exampleLanguage: "ts",
        exampleCode: `const a = { value: 1 };
const b = { value: 1 };

console.log(a === b); // false`,
        exampleExplanation:
          "a et b se ressemblent, mais ce sont deux references objet distinctes.",
        estimatedReadMinutes: 4,
        takeaways: [
          "L'egalite stricte des objets verifie l'identite de reference.",
          "Deux litteraux objet identiques restent deux references differentes.",
          "Cette meme idee reapparait dans les deps React et la memoization.",
        ],
        verbalizePoints: [
          "Utiliser l'expression identite de reference.",
          "Relier le concept a React quand c'est pertinent.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "Because JavaScript refuses to compare object values with strict equality.",
          explanation:
            "Incorrect. JavaScript does compare objects, but it compares their references.",
        },
        {
          label:
            "Because each object literal creates a different reference, and === checks identity.",
          explanation: "Correct. That is the core rule.",
        },
        {
          label:
            "Because object property order is not guaranteed, so the comparison fails.",
          explanation: "Incorrect. The issue is not property order here.",
        },
        {
          label: "Because strict equality only works for numbers and strings.",
          explanation:
            "Incorrect. It works for all values, but the rule differs by type.",
        },
      ],
      fr: [
        {
          label:
            "Parce que JavaScript refuse de comparer les objets avec l'egalite stricte.",
          explanation:
            "Incorrect. JavaScript compare bien les objets, mais il compare leurs references.",
        },
        {
          label:
            "Parce que chaque litteral objet cree une reference differente, et === verifie l'identite.",
          explanation: "Correct. C'est la regle centrale.",
        },
        {
          label:
            "Parce que l'ordre des proprietes n'est pas garanti, donc la comparaison echoue.",
          explanation:
            "Incorrect. Le probleme ne vient pas de l'ordre des proprietes ici.",
        },
        {
          label:
            "Parce que l'egalite stricte ne fonctionne que pour les nombres et les strings.",
          explanation:
            "Incorrect. Elle fonctionne pour toutes les valeurs, mais la regle depend du type.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "spread-copy-does-not-deep-clone",
    moduleId: javascriptFoundationsModule.id,
    primarySkillId: jsValuesSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "What is the most important limitation of using the spread operator to copy an object for state updates?",
        explanation:
          "Spread only copies the first level. Nested objects and arrays still keep their original references unless you copy them too.",
        tlDr: "Object spread makes a shallow copy, not a deep clone.",
        shortAnswer:
          "The spread operator only copies the outer object. Nested references remain shared unless you also copy those nested structures.",
        lessonBody: `The spread operator feels safe because it creates a new outer object. That is useful, but it does not solve every immutability problem.

If your object contains another object or array inside it, spread copies only the top-level fields. The nested object is still the same shared reference as before.

That means a later mutation of the nested object can still leak into the old state or affect another part of the app that points to the same nested structure.

The interview-ready answer is to say that spread is shallow. It is good for replacing the outer container, but nested structures must also be copied when they are the part being changed.`,
        commonMistakes: [
          "Calling spread a full deep clone.",
          "Copying the outer object and then mutating a nested child in place.",
          "Talking about immutability without naming the nested reference problem.",
        ],
        exampleTitle: "Outer copy, shared nested object",
        exampleLanguage: "ts",
        exampleCode: `const nextUser = { ...user };
nextUser.profile.name = "Sam";`,
        exampleExplanation:
          "nextUser is new, but nextUser.profile may still point to the same nested object as user.profile.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Spread creates a shallow copy.",
          "Nested objects and arrays keep shared references unless copied too.",
          "For safe state updates, copy the exact level you are changing.",
        ],
        verbalizePoints: [
          "Say shallow copy explicitly.",
          "Name the nested shared reference as the real risk.",
        ],
      },
      fr: {
        prompt:
          "Quelle est la limite la plus importante de l'operateur spread quand on copie un objet pour une mise a jour de state ?",
        explanation:
          "Spread ne copie que le premier niveau. Les objets et tableaux imbriques gardent encore leurs references d'origine tant qu'on ne les copie pas eux aussi.",
        tlDr: "Le spread d'objet fait une copie superficielle, pas un deep clone.",
        shortAnswer:
          "L'operateur spread ne copie que l'objet externe. Les references imbriquees restent partagees tant qu'on ne copie pas aussi ces structures internes.",
        lessonBody: `L'operateur spread donne une impression de securite parce qu'il cree un nouvel objet externe. C'est utile, mais cela ne regle pas tous les problemes d'immutabilite.

Si ton objet contient un autre objet ou un tableau a l'interieur, le spread ne copie que les champs du premier niveau. L'objet imbrique reste la meme reference partagee qu'avant.

Cela veut dire qu'une mutation ulterieure de l'objet imbrique peut encore fuiter dans l'ancien state ou affecter une autre partie de l'application qui pointe vers cette meme structure.

La bonne reponse d'entretien consiste a dire que spread est superficiel. Il est utile pour remplacer le conteneur externe, mais les structures imbriquees doivent aussi etre copiees quand c'est a ce niveau que le changement se produit.`,
        commonMistakes: [
          "Appeler spread un vrai deep clone.",
          "Copier l'objet externe puis muter un enfant imbrique sur place.",
          "Parler d'immutabilite sans nommer le probleme de reference imbriquee.",
        ],
        exampleTitle: "Copie externe, objet imbrique partage",
        exampleLanguage: "ts",
        exampleCode: `const nextUser = { ...user };
nextUser.profile.name = "Sam";`,
        exampleExplanation:
          "nextUser est nouveau, mais nextUser.profile peut encore pointer vers le meme objet imbrique que user.profile.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Spread cree une copie superficielle.",
          "Les objets et tableaux imbriques restent partages tant qu'on ne les copie pas aussi.",
          "Pour une mise a jour de state fiable, il faut copier exactement le niveau modifie.",
        ],
        verbalizePoints: [
          "Dire explicitement copie superficielle.",
          "Nommer la reference imbriquee partagee comme vrai risque.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "Spread cannot copy functions, so the copy is always incomplete.",
          explanation:
            "Incorrect. The main interview limitation is shallowness, not function omission.",
        },
        {
          label:
            "Spread only copies the top level, so nested objects can still be shared.",
          explanation: "Correct. That is the key limitation to explain.",
        },
        {
          label:
            "Spread changes all nested references into primitives automatically.",
          explanation: "Incorrect. It does not transform nested values.",
        },
        {
          label:
            "Spread is unsafe only when the object contains dates or regexes.",
          explanation:
            "Incorrect. The shallow-copy issue is much broader than that.",
        },
      ],
      fr: [
        {
          label:
            "Spread ne peut pas copier les fonctions, donc la copie est toujours incomplete.",
          explanation:
            "Incorrect. La limite principale en entretien est la superficialite, pas l'omission des fonctions.",
        },
        {
          label:
            "Spread ne copie que le premier niveau, donc les objets imbriques peuvent rester partages.",
          explanation: "Correct. C'est la limite cle a expliquer.",
        },
        {
          label:
            "Spread transforme automatiquement toutes les references imbriquees en primitives.",
          explanation:
            "Incorrect. Il ne transforme pas les valeurs imbriquees.",
        },
        {
          label:
            "Spread devient dangereux seulement quand l'objet contient des dates ou des regex.",
          explanation:
            "Incorrect. Le probleme de copie superficielle est bien plus large.",
        },
      ],
    },
  });

  await upsertLessonQuestion({
    slug: "promise-microtask-runs-before-timeout",
    moduleId: javascriptFoundationsModule.id,
    primarySkillId: jsAsyncSkill.id,
    format: QuestionFormat.CODE_OUTPUT,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    translations: {
      en: {
        prompt:
          "In this snippet, what is the log order and why: console.log('sync'); Promise.resolve().then(() => console.log('promise')); setTimeout(() => console.log('timeout'), 0); ?",
        explanation:
          "The order is sync, promise, timeout. Synchronous code runs first, promise handlers run in the microtask queue, and setTimeout callbacks run later in the task queue.",
        tlDr: "Microtasks from resolved promises run before timers once the current synchronous work finishes.",
        shortAnswer:
          "The logs are sync, then promise, then timeout, because promise callbacks are microtasks and are processed before timer tasks after the current call stack clears.",
        lessonBody: `This question is really about queues, not about which API looks faster.

JavaScript first runs the synchronous code on the current call stack. That is why "sync" logs immediately.

After the current synchronous work finishes, the engine drains the microtask queue before it moves on to the next task. Promise .then handlers go into that microtask queue. setTimeout callbacks go into a later task queue, even when the delay is 0.

That is why the interview-safe order is sync, promise, timeout. The important explanation is that 0ms does not mean "before promises". It only means "eligible on a later timer task", after microtasks are done.`,
        commonMistakes: [
          "Assuming setTimeout with 0 always runs immediately after the previous line.",
          "Saying promises are synchronous because they resolve quickly.",
          "Giving the right order without naming microtasks and tasks.",
        ],
        exampleTitle: "Microtask before timer",
        exampleLanguage: "ts",
        exampleCode: `console.log("sync");
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("timeout"), 0);`,
        exampleExplanation:
          "The synchronous log runs first, then the promise microtask, then the timer callback.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Synchronous code runs first.",
          "Resolved promise handlers run in the microtask queue.",
          "setTimeout callbacks run later in the task queue, even with 0 delay.",
        ],
        verbalizePoints: [
          "Say microtask queue and task queue explicitly.",
          "Explain that 0ms does not mean immediate execution.",
        ],
      },
      fr: {
        prompt:
          "Dans ce snippet, quel est l'ordre des logs et pourquoi: console.log('sync'); Promise.resolve().then(() => console.log('promise')); setTimeout(() => console.log('timeout'), 0); ?",
        explanation:
          "L'ordre est sync, promise, timeout. Le code synchrone tourne d'abord, les handlers de promesse passent dans la file de microtasks, et les callbacks setTimeout passent plus tard dans la file de tasks.",
        tlDr: "Les microtasks issues des promesses resolues passent avant les timers une fois le travail synchrone termine.",
        shortAnswer:
          "Les logs sont sync, puis promise, puis timeout, car les callbacks de promesse sont des microtasks traitees avant les tasks de timer une fois la pile synchrone vide.",
        lessonBody: `Cette question parle surtout de files d'execution, pas de l'API qui semble la plus rapide.

JavaScript execute d'abord le code synchrone sur la pile courante. C'est pour cela que "sync" s'affiche immediatement.

Une fois le travail synchrone termine, le moteur vide la file de microtasks avant de passer a la task suivante. Les handlers .then de Promise vont dans cette file de microtasks. Les callbacks de setTimeout vont dans une file de tasks ulterieure, meme avec un delai de 0.

C'est pour cela que l'ordre correct en entretien est sync, promise, timeout. Le point important est d'expliquer que 0ms ne veut pas dire "avant les promesses". Cela veut seulement dire "eligible dans une task de timer ulterieure", apres les microtasks.`,
        commonMistakes: [
          "Supposer qu'un setTimeout a 0 s'execute immediatement apres la ligne precedente.",
          "Dire que les promesses sont synchrones parce qu'elles se resolvent vite.",
          "Donner le bon ordre sans citer microtasks et tasks.",
        ],
        exampleTitle: "Microtask avant timer",
        exampleLanguage: "ts",
        exampleCode: `console.log("sync");
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("timeout"), 0);`,
        exampleExplanation:
          "Le log synchrone passe d'abord, puis la microtask de promesse, puis le callback de timer.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Le code synchrone s'execute d'abord.",
          "Les handlers de promesse resolue vont dans la file de microtasks.",
          "Les callbacks de setTimeout passent plus tard dans la file de tasks, meme avec 0ms.",
        ],
        verbalizePoints: [
          "Dire explicitement file de microtasks et file de tasks.",
          "Expliquer que 0ms ne veut pas dire execution immediate.",
        ],
      },
    },
  });

  await upsertClosedQuestion({
    slug: "promise-all-rejects-on-first-failure",
    moduleId: javascriptFoundationsModule.id,
    primarySkillId: jsAsyncSkill.id,
    format: QuestionFormat.MULTIPLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [true, false, true, false],
    translations: {
      en: {
        prompt:
          "Which statements about Promise.all are correct in interview-style JavaScript reasoning?",
        explanation:
          "Promise.all resolves all results in input order when everything succeeds, but it rejects as soon as one input promise rejects.",
        tlDr: "Promise.all keeps result order on success and fails fast on the first rejection.",
        shortAnswer:
          "Promise.all waits for all inputs only in the success case. If one promise rejects, the combined promise rejects early instead of waiting for every other input to settle.",
        lessonBody: `Promise.all is often described too loosely as "wait for many promises". That is only half the story.

When every input promise fulfills, Promise.all gives you an array of fulfillment values in the same order as the original input array. That order is preserved even if the promises resolve at different times.

But if any input promise rejects, the combined Promise.all result rejects immediately with that failure. It does not wait for every other promise to settle before rejecting.

The clean interview answer is to mention both success ordering and fail-fast rejection. That is what distinguishes Promise.all from APIs like Promise.allSettled.`,
        commonMistakes: [
          "Saying Promise.all always waits for every promise to settle no matter what.",
          "Thinking the output array order matches completion time instead of input order.",
          "Forgetting to contrast it with Promise.allSettled.",
        ],
        exampleTitle: "Success order still follows input order",
        exampleLanguage: "ts",
        exampleCode: `const results = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchSettings(),
]);`,
        exampleExplanation:
          "results[0] is still the user result, even if fetchPosts finishes first internally.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Promise.all preserves input order on success.",
          "Promise.all rejects early on the first rejection.",
          "It is different from Promise.allSettled.",
        ],
        verbalizePoints: [
          "Say input order, not completion order.",
          "Say fail fast when one promise rejects.",
        ],
      },
      fr: {
        prompt:
          "Quelles affirmations sur Promise.all sont correctes dans un raisonnement JavaScript de type entretien ?",
        explanation:
          "Promise.all renvoie les resultats dans l'ordre d'entree quand tout reussit, mais il reject des qu'une promesse d'entree reject.",
        tlDr: "Promise.all preserve l'ordre des resultats en succes et echoue vite a la premiere rejection.",
        shortAnswer:
          "Promise.all attend tous les inputs seulement dans le cas succes. Si une promesse reject, la promesse combinee reject tot au lieu d'attendre que toutes les autres se terminent.",
        lessonBody: `Promise.all est souvent decrit trop vaguement comme "attendre plusieurs promesses". Ce n'est que la moitie de l'histoire.

Quand toutes les promesses d'entree se resolvent, Promise.all renvoie un tableau de valeurs dans le meme ordre que le tableau d'entree. Cet ordre est conserve meme si les promesses se resolvent a des vitesses differentes.

Mais si une promesse d'entree reject, le resultat combine de Promise.all reject immediatement avec cet echec. Il n'attend pas que toutes les autres promesses se terminent avant de reject.

La bonne reponse d'entretien consiste a mentionner a la fois l'ordre en succes et la rejection fail-fast. C'est ce qui distingue Promise.all d'APIs comme Promise.allSettled.`,
        commonMistakes: [
          "Dire que Promise.all attend toujours toutes les promesses jusqu'au bout quoi qu'il arrive.",
          "Croire que l'ordre du tableau de sortie suit l'ordre de completion au lieu de l'ordre d'entree.",
          "Oublier de le contraster avec Promise.allSettled.",
        ],
        exampleTitle: "L'ordre de succes suit toujours l'ordre d'entree",
        exampleLanguage: "ts",
        exampleCode: `const results = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchSettings(),
]);`,
        exampleExplanation:
          "results[0] reste le resultat user, meme si fetchPosts termine en premier en interne.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Promise.all preserve l'ordre d'entree en cas de succes.",
          "Promise.all reject vite a la premiere rejection.",
          "Il se distingue de Promise.allSettled.",
        ],
        verbalizePoints: [
          "Dire ordre d'entree, pas ordre de completion.",
          "Dire fail fast quand une promesse reject.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "On success, Promise.all returns results in the same order as the input array.",
          explanation:
            "Correct. That order is preserved independently of completion timing.",
        },
        {
          label:
            "If one input rejects, Promise.all still waits for every promise to settle before rejecting.",
          explanation:
            "Incorrect. Promise.all rejects early when one input rejects.",
        },
        {
          label: "Promise.all is fail-fast when one input promise rejects.",
          explanation:
            "Correct. That is a core behavior to mention in interviews.",
        },
        {
          label:
            "The result array is ordered by whichever promise resolves first.",
          explanation:
            "Incorrect. The output array follows input order, not completion order.",
        },
      ],
      fr: [
        {
          label:
            "En succes, Promise.all renvoie les resultats dans le meme ordre que le tableau d'entree.",
          explanation:
            "Correct. Cet ordre est preserve independamment du timing de completion.",
        },
        {
          label:
            "Si un input reject, Promise.all attend quand meme que toutes les promesses se terminent avant de reject.",
          explanation:
            "Incorrect. Promise.all reject tot des qu'un input reject.",
        },
        {
          label:
            "Promise.all est fail-fast quand une promesse d'entree reject.",
          explanation:
            "Correct. C'est un comportement central a citer en entretien.",
        },
        {
          label:
            "Le tableau resultat est ordonne selon la promesse qui se resout le plus vite.",
          explanation:
            "Incorrect. Le tableau suit l'ordre d'entree, pas l'ordre de completion.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "map-filter-reduce-do-different-jobs",
    moduleId: javascriptCodingModule.id,
    primarySkillId: jsUtilitySkill.id,
    format: QuestionFormat.MULTIPLE_CHOICE,
    difficulty: 1,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [true, true, false, false],
    translations: {
      en: {
        prompt:
          "Which statements correctly distinguish map, filter and reduce in JavaScript?",
        explanation:
          "map transforms each item, filter keeps a subset, and reduce accumulates to any target shape.",
        tlDr: "map transforms, filter selects, reduce accumulates.",
        shortAnswer:
          "map returns one transformed output per input item, filter keeps only the items that pass a test, and reduce folds the collection into a single accumulated result.",
        lessonBody: `These methods are often grouped together, but they solve different jobs.

map keeps the array length the same and transforms each item into a corresponding output item. filter keeps only the items that satisfy a condition, so the output length may shrink. reduce is more general: it builds one accumulated result step by step, and that result can be a number, object, array or any other shape.

This matters in interviews because candidates often reach for reduce too early. While reduce can do many things, using map or filter when they match the intent usually makes the code clearer.

The strong answer is to explain the mental model of each method, not just repeat their names.`,
        commonMistakes: [
          "Saying reduce is automatically better because it can do everything.",
          "Confusing map with filter because both return arrays.",
          "Forgetting that reduce can accumulate to non-array values.",
        ],
        exampleTitle: "Three different intents",
        exampleLanguage: "ts",
        exampleCode: `const names = users.map((user) => user.name);
const activeUsers = users.filter((user) => user.active);
const totalAge = users.reduce((sum, user) => sum + user.age, 0);`,
        exampleExplanation:
          "The code transforms, selects and accumulates with three different tools.",
        estimatedReadMinutes: 4,
        takeaways: [
          "map transforms item by item.",
          "filter selects a subset of items.",
          "reduce accumulates toward one result of any shape.",
        ],
        verbalizePoints: [
          "Explain intent, not just API names.",
          "Say that reduce is more general but not always clearer.",
        ],
      },
      fr: {
        prompt:
          "Quelles affirmations distinguent correctement map, filter et reduce en JavaScript ?",
        explanation:
          "map transforme chaque item, filter garde un sous-ensemble, et reduce accumule vers une forme resultat quelconque.",
        tlDr: "map transforme, filter selectionne, reduce accumule.",
        shortAnswer:
          "map renvoie une sortie transformee par item d'entree, filter garde seulement les items qui passent un test, et reduce replie la collection vers un resultat accumule unique.",
        lessonBody: `Ces methodes sont souvent groupees ensemble, mais elles ne font pas le meme travail.

map conserve la longueur du tableau et transforme chaque item en un item de sortie correspondant. filter garde seulement les items qui satisfont une condition, donc la longueur de sortie peut diminuer. reduce est plus general: il construit un resultat accumule pas a pas, et ce resultat peut etre un nombre, un objet, un tableau ou toute autre forme.

Cela compte en entretien parce que les candidats degainent parfois reduce trop tot. Meme si reduce peut tout faire ou presque, utiliser map ou filter quand ils collent a l'intention rend souvent le code plus clair.

La bonne reponse consiste a expliquer le modele mental de chaque methode, pas seulement a repeter leurs noms.`,
        commonMistakes: [
          "Dire que reduce est automatiquement meilleur parce qu'il peut tout faire.",
          "Confondre map et filter parce que les deux renvoient un tableau.",
          "Oublier que reduce peut accumuler vers autre chose qu'un tableau.",
        ],
        exampleTitle: "Trois intentions differentes",
        exampleLanguage: "ts",
        exampleCode: `const names = users.map((user) => user.name);
const activeUsers = users.filter((user) => user.active);
const totalAge = users.reduce((sum, user) => sum + user.age, 0);`,
        exampleExplanation:
          "Le code transforme, selectionne et accumule avec trois outils differents.",
        estimatedReadMinutes: 4,
        takeaways: [
          "map transforme item par item.",
          "filter selectionne un sous-ensemble d'items.",
          "reduce accumule vers un resultat unique de n'importe quelle forme.",
        ],
        verbalizePoints: [
          "Expliquer l'intention, pas seulement les noms d'API.",
          "Dire que reduce est plus general mais pas toujours plus clair.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "map usually returns one transformed output for each input item.",
          explanation:
            "Correct. map preserves the one-item-in, one-item-out transformation shape.",
        },
        {
          label: "filter keeps only the items that satisfy a condition.",
          explanation: "Correct. It selects a subset of the original array.",
        },
        {
          label:
            "reduce can only accumulate numbers and cannot build objects or arrays.",
          explanation: "Incorrect. reduce can build any accumulator shape.",
        },
        {
          label:
            "map is the right choice when you want to remove some items from the array.",
          explanation:
            "Incorrect. Removing items is filter's job, not map's main purpose.",
        },
      ],
      fr: [
        {
          label:
            "map renvoie en general une sortie transformee pour chaque item d'entree.",
          explanation: "Correct. map preserve la forme une entree, une sortie.",
        },
        {
          label:
            "filter garde seulement les items qui satisfont une condition.",
          explanation:
            "Correct. Il selectionne un sous-ensemble du tableau d'origine.",
        },
        {
          label:
            "reduce ne peut accumuler que des nombres et ne peut pas construire des objets ou des tableaux.",
          explanation:
            "Incorrect. reduce peut construire n'importe quelle forme d'accumulateur.",
        },
        {
          label:
            "map est le bon choix quand on veut retirer certains items du tableau.",
          explanation:
            "Incorrect. Retirer des items releve de filter, pas du role principal de map.",
        },
      ],
    },
  });

  await upsertLessonQuestion({
    slug: "closure-remembers-outer-variable",
    moduleId: javascriptCodingModule.id,
    primarySkillId: jsUtilitySkill.id,
    format: QuestionFormat.OPEN_ENDED,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    translations: {
      en: {
        prompt:
          "When a function returns another function, why can the inner function still read variables from the outer scope later on?",
        explanation:
          "Because JavaScript closures preserve access to the lexical environment where the inner function was created.",
        tlDr: "A closure lets a function keep access to its outer lexical scope even after that outer function has returned.",
        shortAnswer:
          "The inner function closes over the outer variables, so it keeps access to that lexical environment after the outer call finishes.",
        lessonBody: `Closures are one of the most important JavaScript ideas for front-end interviews because they appear in hooks, event handlers, debounce utilities and module design.

When JavaScript creates a function, it also remembers the lexical scope around that function. If the function later runs in a different place, it still has access to the variables that were in scope when it was created.

That is why an inner function can keep reading or updating a variable from an outer function even after the outer function has already returned.

The strong beginner answer is to avoid mysticism. A closure is not magic memory. It is simply a function plus access to the surrounding lexical environment it was created in.`,
        commonMistakes: [
          "Explaining closures as if variables were copied by value into the function text.",
          "Saying closures are only relevant for interview puzzles and not real apps.",
          "Giving the term closure without explaining lexical scope.",
        ],
        exampleTitle: "A simple counter factory",
        exampleLanguage: "ts",
        exampleCode: `function makeCounter() {
  let count = 0;

  return function increment() {
    count += 1;
    return count;
  };
}`,
        exampleExplanation:
          "increment keeps access to count because it closes over the lexical environment of makeCounter.",
        estimatedReadMinutes: 5,
        takeaways: [
          "A closure is a function with access to its outer lexical scope.",
          "Returned functions can still use outer variables later on.",
          "Closures appear in many practical front-end patterns.",
        ],
        verbalizePoints: [
          "Say lexical scope, not magic.",
          "Give one practical example like debounce, hooks or event handlers.",
        ],
      },
      fr: {
        prompt:
          "Quand une fonction renvoie une autre fonction, pourquoi la fonction interne peut-elle encore lire plus tard les variables de la portee externe ?",
        explanation:
          "Parce que les closures JavaScript preservent l'acces a l'environnement lexical dans lequel la fonction interne a ete creee.",
        tlDr: "Une closure permet a une fonction de garder acces a sa portee lexicale externe meme apres le retour de la fonction externe.",
        shortAnswer:
          "La fonction interne ferme sur les variables externes, donc elle garde acces a cet environnement lexical meme apres la fin de l'appel externe.",
        lessonBody: `Les closures sont l'une des idees JavaScript les plus importantes en entretien front-end parce qu'elles reapparaissent dans les hooks, les event handlers, les utilitaires debounce et la conception de modules.

Quand JavaScript cree une fonction, il memorise aussi la portee lexicale autour de cette fonction. Si cette fonction s'execute plus tard ailleurs, elle garde quand meme acces aux variables qui etaient visibles au moment de sa creation.

C'est pour cela qu'une fonction interne peut continuer a lire ou modifier une variable d'une fonction externe meme apres le retour de cette fonction externe.

La bonne reponse debutant consiste a eviter le mysticisme. Une closure n'est pas une memoire magique. C'est simplement une fonction accompagnee de l'acces a l'environnement lexical dans lequel elle a ete creee.`,
        commonMistakes: [
          "Expliquer les closures comme si les variables etaient copiees par valeur dans le texte de la fonction.",
          "Dire que les closures ne servent qu'aux puzzles d'entretien et pas aux vraies apps.",
          "Donner le terme closure sans expliquer la portee lexicale.",
        ],
        exampleTitle: "Une petite fabrique de compteur",
        exampleLanguage: "ts",
        exampleCode: `function makeCounter() {
  let count = 0;

  return function increment() {
    count += 1;
    return count;
  };
}`,
        exampleExplanation:
          "increment garde acces a count parce qu'elle ferme sur l'environnement lexical de makeCounter.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Une closure est une fonction avec acces a sa portee lexicale externe.",
          "Les fonctions renvoyees peuvent encore utiliser des variables externes plus tard.",
          "Les closures apparaissent dans beaucoup de patterns front-end concrets.",
        ],
        verbalizePoints: [
          "Dire portee lexicale, pas magie.",
          "Donner un exemple concret comme debounce, hooks ou event handlers.",
        ],
      },
    },
  });

  await upsertLessonQuestion({
    slug: "debounce-needs-a-closure-over-timeout",
    moduleId: javascriptCodingModule.id,
    primarySkillId: jsUtilitySkill.id,
    format: QuestionFormat.CODE_OUTPUT,
    difficulty: 3,
    level: QuestionLevel.MID,
    translations: {
      en: {
        prompt:
          "Why does a debounce utility usually keep timeoutId in an outer scope, and what is the closure preserving between calls?",
        explanation:
          "The returned debounced function needs shared memory across calls. The closure preserves timeoutId so each new call can cancel the previous timer before scheduling a fresh one.",
        tlDr: "Debounce uses a closure so repeated calls can share one timeout reference across time.",
        shortAnswer:
          "The outer variable gives all later calls to the returned function access to the same timeoutId, so the previous timer can be cleared before a new one is started.",
        lessonBody: `Debounce is a closure question disguised as a utility question.

The debounced function is called many times over time, but it still needs one shared piece of memory: the timer currently waiting to fire. If timeoutId lived only inside each call, every invocation would lose access to the previous timer and could not cancel it.

By placing timeoutId in the outer scope of the returned function, every later call closes over the same variable. That shared closure memory is what makes debounce work.

The clean interview answer is to say that debounce needs persistent state across invocations, and the closure is the mechanism that preserves that state without exposing it globally.`,
        commonMistakes: [
          "Storing timeoutId inside the inner function body only, which loses the previous timer.",
          "Explaining debounce without mentioning shared state across calls.",
          "Calling the outer variable global state instead of closure state.",
        ],
        exampleTitle: "A debounced function shape",
        exampleLanguage: "ts",
        exampleCode: `function debounce(fn: () => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(fn, delay);
  };
}`,
        exampleExplanation:
          "Every call to debounced can still see and replace the same timeoutId.",
        estimatedReadMinutes: 6,
        takeaways: [
          "Debounce needs one shared timer reference across calls.",
          "The closure preserves that timer state privately.",
          "Without the outer variable, later calls cannot cancel the previous timer.",
        ],
        verbalizePoints: [
          "Say persistent state across invocations.",
          "Explain why closure state is private but shared by later calls.",
        ],
      },
      fr: {
        prompt:
          "Pourquoi un utilitaire debounce garde-t-il souvent timeoutId dans une portee externe, et qu'est-ce que la closure preserve entre les appels ?",
        explanation:
          "La fonction debounced renvoyee a besoin d'une memoire partagee entre plusieurs appels. La closure preserve timeoutId pour que chaque nouvel appel puisse annuler le timer precedent avant d'en programmer un nouveau.",
        tlDr: "Debounce utilise une closure pour que des appels repetes partagent une meme reference de timer dans le temps.",
        shortAnswer:
          "La variable externe donne a tous les appels suivants de la fonction renvoyee acces au meme timeoutId, afin de pouvoir effacer le timer precedent avant d'en lancer un autre.",
        lessonBody: `Debounce est une question de closure deguisee en question utilitaire.

La fonction debounced est appelee plusieurs fois dans le temps, mais elle a quand meme besoin d'un morceau de memoire partagee: le timer actuellement en attente. Si timeoutId vivait seulement a l'interieur de chaque appel, chaque invocation perdrait l'acces au timer precedent et ne pourrait pas l'annuler.

En placant timeoutId dans la portee externe de la fonction renvoyee, tous les appels suivants ferment sur la meme variable. C'est cette memoire partagee par closure qui permet a debounce de fonctionner.

La bonne reponse d'entretien consiste a dire que debounce a besoin d'un state persistant entre les invocations, et que la closure est le mecanisme qui preserve ce state sans l'exposer globalement.`,
        commonMistakes: [
          "Stocker timeoutId seulement dans le corps de la fonction interne, ce qui perd le timer precedent.",
          "Expliquer debounce sans parler d'etat partage entre les appels.",
          "Appeler la variable externe un state global au lieu d'un state de closure.",
        ],
        exampleTitle: "La forme d'une fonction debounce",
        exampleLanguage: "ts",
        exampleCode: `function debounce(fn: () => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(fn, delay);
  };
}`,
        exampleExplanation:
          "Chaque appel de debounced peut encore lire et remplacer le meme timeoutId.",
        estimatedReadMinutes: 6,
        takeaways: [
          "Debounce a besoin d'une reference de timer partagee entre les appels.",
          "La closure preserve ce state de timer de maniere privee.",
          "Sans la variable externe, les appels suivants ne peuvent pas annuler le timer precedent.",
        ],
        verbalizePoints: [
          "Dire state persistant entre les invocations.",
          "Expliquer pourquoi le state de closure est prive mais partage par les appels suivants.",
        ],
      },
    },
  });

  await upsertLessonQuestion({
    slug: "nested-spread-mutation-bug-hunt",
    moduleId: javascriptFoundationsModule.id,
    primarySkillId: jsValuesSkill.id,
    format: QuestionFormat.BUG_HUNT,
    difficulty: 3,
    level: QuestionLevel.MID,
    translations: {
      en: {
        prompt:
          "Read the snippet and explain why the original nested object still changes even though the outer object was copied with spread.",
        explanation:
          "The outer object is copied, but the nested profile object is still shared. Mutating profile.social mutates the same nested reference that the original object still points to.",
        tlDr: "The bug comes from shallow copying only the outer layer while mutating a shared nested object.",
        shortAnswer:
          "The spread copy creates a new outer object, but it does not clone the nested profile branch. The mutation still hits the shared nested reference.",
        lessonBody: `This is a classic state update bug because the code looks immutable at first glance.

The outer object really is copied with spread. But spread only copies the first level. The nested profile object inside the copy is still the same object as profile in the original state.

So when the code mutates nextUser.profile.social.x, it is mutating the shared nested object, not a fully independent tree.

The interview-quality fix is to copy every level on the path you are changing. That keeps the new state isolated from the previous state and makes the update story honest.`,
        commonMistakes: [
          "Pointing only to spread and saying spread itself is broken.",
          "Missing the fact that the nested object remains shared.",
          "Fixing the code with a deep-clone reflex instead of explaining path copying.",
        ],
        exampleTitle: "Copy the path you mutate",
        exampleLanguage: "ts",
        exampleCode: `const nextUser = {
  ...user,
  profile: {
    ...user.profile,
    social: {
      ...user.profile.social,
      twitter: "@new_handle",
    },
  },
};`,
        exampleExplanation:
          "The fix copies each nested level that is being changed, so no shared mutable branch is left behind.",
        estimatedReadMinutes: 6,
        contextData: {
          kind: "bug_hunt",
          language: "ts",
          code: `const user = {
  name: "Lea",
  profile: {
    social: {
      twitter: "@lea",
    },
  },
};

const nextUser = { ...user };
nextUser.profile.social.twitter = "@new_handle";

console.log(user.profile.social.twitter);`,
        },
        takeaways: [
          "Spread only copies the outer level.",
          "Mutating a nested shared branch still mutates old state.",
          "The safe fix is to copy each level on the path you change.",
        ],
        verbalizePoints: [
          "Say shared nested reference.",
          "Explain why path copying is clearer than vague deep clone talk.",
        ],
      },
      fr: {
        prompt:
          "Lis le snippet et explique pourquoi l'objet imbrique d'origine change encore alors que l'objet externe a ete copie avec spread.",
        explanation:
          "L'objet externe est bien copie, mais l'objet profile imbrique reste partage. Muter profile.social modifie donc la meme reference imbriquee que l'objet d'origine utilise encore.",
        tlDr: "Le bug vient d'une copie superficielle du niveau externe suivie d'une mutation sur un objet imbrique partage.",
        shortAnswer:
          "La copie spread cree bien un nouvel objet externe, mais elle ne clone pas la branche profile imbriquee. La mutation touche encore la reference imbriquee partagee.",
        lessonBody: `C'est un bug classique de mise a jour de state parce que le code parait immutable au premier regard.

L'objet externe est effectivement copie avec spread. Mais spread ne copie que le premier niveau. L'objet profile imbrique a l'interieur de la copie reste le meme objet que profile dans l'etat d'origine.

Quand le code modifie nextUser.profile.social.x, il modifie donc l'objet imbrique partage, pas un arbre totalement independant.

Le correctif de qualite entretien consiste a copier chaque niveau sur le chemin qui change. Cela garde le nouveau state separe de l'ancien et rend l'histoire de la mise a jour honnete.`,
        commonMistakes: [
          "Pointer seulement spread et dire que spread est casse.",
          "Manquer le fait que l'objet imbrique reste partage.",
          "Corriger avec un reflexe deep clone sans expliquer la copie par chemin.",
        ],
        exampleTitle: "Copier le chemin que l'on modifie",
        exampleLanguage: "ts",
        exampleCode: `const nextUser = {
  ...user,
  profile: {
    ...user.profile,
    social: {
      ...user.profile.social,
      twitter: "@new_handle",
    },
  },
};`,
        exampleExplanation:
          "Le correctif copie chaque niveau imbrique modifie, donc aucune branche mutable partagee ne subsiste.",
        estimatedReadMinutes: 6,
        contextData: {
          kind: "bug_hunt",
          language: "ts",
          code: `const user = {
  name: "Lea",
  profile: {
    social: {
      twitter: "@lea",
    },
  },
};

const nextUser = { ...user };
nextUser.profile.social.twitter = "@new_handle";

console.log(user.profile.social.twitter);`,
        },
        takeaways: [
          "Spread ne copie que le niveau externe.",
          "Muter une branche imbriquee partagee modifie encore l'ancien state.",
          "Le correctif sur consiste a copier chaque niveau du chemin modifie.",
        ],
        verbalizePoints: [
          "Dire reference imbriquee partagee.",
          "Expliquer pourquoi la copie par chemin est plus claire qu'un discours vague sur le deep clone.",
        ],
      },
    },
  });

  await upsertClosedQuestion({
    slug: "semantic-html-improves-meaning-and-accessibility",
    moduleId: htmlCssModule.id,
    primarySkillId: htmlSemanticSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 1,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "Why is semantic HTML usually better than using generic divs for everything?",
        explanation:
          "Semantic elements communicate meaning and structure to browsers, assistive technologies and other developers.",
        tlDr: "Semantic HTML adds meaning, not just styling hooks.",
        shortAnswer:
          "Semantic HTML is better because elements like button, nav, main and article describe the role of the content, which improves accessibility, structure and maintainability.",
        lessonBody: `A beginner often sees HTML tags only as visual containers. But HTML is supposed to describe meaning as well as structure.

When you use semantic elements such as <button>, <nav>, <main> or <label>, you are not only helping the browser render content. You are also telling assistive technologies and other tools what that content is meant to represent.

That matters for keyboard behavior, screen-reader interpretation, default browser behavior and long-term maintainability.

The clean interview answer is that semantic HTML communicates intent. It gives structure to the document and often improves accessibility without extra JavaScript.`,
        commonMistakes: [
          "Saying semantic tags are only useful for SEO.",
          "Treating div as a neutral replacement for every native element.",
          "Forgetting that native elements come with useful built-in behavior.",
        ],
        exampleTitle: "Meaningful structure",
        exampleLanguage: "html",
        exampleCode: `<main>
  <article>
    <h1>Release Notes</h1>
    <button>Show details</button>
  </article>
</main>`,
        exampleExplanation:
          "The tags communicate what each piece of content is, not just where it sits visually.",
        estimatedReadMinutes: 4,
        takeaways: [
          "Semantic HTML communicates intent and structure.",
          "Native elements often improve accessibility automatically.",
          "Better semantics usually makes markup easier to maintain.",
        ],
        verbalizePoints: [
          "Say meaning and structure explicitly.",
          "Mention accessibility or native behavior, not only SEO.",
        ],
      },
      fr: {
        prompt:
          "Pourquoi le HTML semantique est-il en general meilleur que l'usage de div generiques partout ?",
        explanation:
          "Les elements semantiques communiquent du sens et de la structure au navigateur, aux technologies d'assistance et aux autres developpeurs.",
        tlDr: "Le HTML semantique ajoute du sens, pas seulement des hooks de style.",
        shortAnswer:
          "Le HTML semantique est meilleur parce que des elements comme button, nav, main ou article decrivent le role du contenu, ce qui ameliore l'accessibilite, la structure et la maintenabilite.",
        lessonBody: `Au debut, on voit souvent les tags HTML comme de simples conteneurs visuels. Pourtant, HTML sert aussi a decrire du sens et de la structure.

Quand tu utilises des elements semantiques comme <button>, <nav>, <main> ou <label>, tu n'aides pas seulement le navigateur a afficher le contenu. Tu indiques aussi aux technologies d'assistance et aux autres outils ce que ce contenu represente.

Cela compte pour le clavier, l'interpretation par les lecteurs d'ecran, les comportements natifs du navigateur et la maintenabilite dans le temps.

La bonne reponse d'entretien consiste a dire que le HTML semantique communique l'intention. Il structure le document et ameliore souvent l'accessibilite sans JavaScript supplementaire.`,
        commonMistakes: [
          "Dire que les tags semantiques ne servent qu'au SEO.",
          "Traiter div comme un remplacement neutre de tous les elements natifs.",
          "Oublier que les elements natifs apportent deja des comportements utiles.",
        ],
        exampleTitle: "Une structure qui a du sens",
        exampleLanguage: "html",
        exampleCode: `<main>
  <article>
    <h1>Release Notes</h1>
    <button>Show details</button>
  </article>
</main>`,
        exampleExplanation:
          "Les tags indiquent ce qu'est chaque morceau de contenu, pas seulement ou il est place visuellement.",
        estimatedReadMinutes: 4,
        takeaways: [
          "Le HTML semantique communique une intention et une structure.",
          "Les elements natifs ameliorent souvent l'accessibilite automatiquement.",
          "Une meilleure semantique rend en general le markup plus maintenable.",
        ],
        verbalizePoints: [
          "Dire explicitement sens et structure.",
          "Mentionner l'accessibilite ou les comportements natifs, pas seulement le SEO.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "Because semantic tags are the only elements that CSS can style correctly.",
          explanation:
            "Incorrect. CSS can style generic elements too; semantics solve a different problem.",
        },
        {
          label:
            "Because semantic elements describe the content's role and often improve accessibility and native behavior.",
          explanation: "Correct. That is the main reason to prefer them.",
        },
        {
          label:
            "Because browsers refuse to render pages that use too many div elements.",
          explanation:
            "Incorrect. Browsers render divs fine; the issue is lost meaning and behavior.",
        },
        {
          label:
            "Because semantic HTML automatically replaces the need for all JavaScript interactions.",
          explanation:
            "Incorrect. Semantics help, but they do not remove all interactive logic needs.",
        },
      ],
      fr: [
        {
          label:
            "Parce que seuls les tags semantiques peuvent etre stylises correctement en CSS.",
          explanation:
            "Incorrect. CSS peut aussi styliser des elements generiques; la semantique resout un autre probleme.",
        },
        {
          label:
            "Parce que les elements semantiques decrivent le role du contenu et ameliorent souvent l'accessibilite et le comportement natif.",
          explanation: "Correct. C'est la raison principale de les preferer.",
        },
        {
          label:
            "Parce que les navigateurs refusent de rendre les pages qui utilisent trop de div.",
          explanation:
            "Incorrect. Les navigateurs rendent tres bien les div; le probleme est la perte de sens et de comportement.",
        },
        {
          label:
            "Parce que le HTML semantique remplace automatiquement tout besoin d'interactions JavaScript.",
          explanation:
            "Incorrect. La semantique aide, mais ne supprime pas tous les besoins de logique interactive.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "label-click-focuses-associated-input",
    moduleId: htmlCssModule.id,
    primarySkillId: htmlSemanticSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 1,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [true, false, false, false],
    translations: {
      en: {
        prompt:
          "What practical benefit do you get when a form label is properly associated with its input?",
        explanation:
          "The label improves accessibility and lets users click the label to focus or toggle the associated control.",
        tlDr: "A proper label improves both usability and accessibility.",
        shortAnswer:
          "Associating a label with its input makes the field easier to understand for assistive technology and gives users a larger, easier click target.",
        lessonBody: `This looks like a tiny HTML detail, but it has real user impact.

When a label is correctly associated with an input, screen readers can announce the field with the right accessible name. Users also gain a more forgiving click target because clicking the label focuses the related input or toggles the checkbox.

That makes forms easier to use on desktop, on touch devices and with assistive technology.

The strong answer is to say that labels are not just visual text. They are part of the control's accessible meaning and interaction area.`,
        commonMistakes: [
          "Treating labels as purely visual text next to the field.",
          "Forgetting the click-target benefit on checkboxes and radios.",
          "Thinking placeholder text is an equivalent replacement for labels.",
        ],
        exampleTitle: "Properly linked label",
        exampleLanguage: "html",
        exampleCode: `<label for="email">Email address</label>
<input id="email" type="email" />`,
        exampleExplanation:
          "Clicking the label focuses the input, and assistive technologies can associate the name with the field.",
        estimatedReadMinutes: 4,
        takeaways: [
          "Labels improve accessibility.",
          "Labels create a better click target for the control.",
          "Placeholders do not replace real labels.",
        ],
        verbalizePoints: [
          "Mention accessible name and click target.",
          "Do not reduce the answer to styling or spacing.",
        ],
      },
      fr: {
        prompt:
          "Quel benefice concret obtient-on quand un label de formulaire est correctement associe a son input ?",
        explanation:
          "Le label ameliore l'accessibilite et permet aux utilisateurs de cliquer sur le label pour focus ou activer le controle associe.",
        tlDr: "Un bon label ameliore a la fois l'utilisabilite et l'accessibilite.",
        shortAnswer:
          "Associer un label a son input rend le champ plus clair pour les technologies d'assistance et offre aux utilisateurs une zone de clic plus large et plus pratique.",
        lessonBody: `Cela ressemble a un petit detail HTML, mais l'effet utilisateur est reel.

Quand un label est correctement associe a un input, les lecteurs d'ecran peuvent annoncer le champ avec le bon nom accessible. Les utilisateurs gagnent aussi une zone de clic plus tolérante, car cliquer sur le label focus l'input relie ou active la case a cocher.

Les formulaires deviennent donc plus faciles a utiliser sur desktop, sur mobile tactile et avec des technologies d'assistance.

La bonne reponse consiste a dire qu'un label n'est pas juste un texte visuel a cote du champ. Il fait partie du sens accessible du controle et de sa zone d'interaction.`,
        commonMistakes: [
          "Traiter le label comme un simple texte visuel a cote du champ.",
          "Oublier le benefice de zone de clic sur les checkboxes et radios.",
          "Croire qu'un placeholder remplace correctement un label.",
        ],
        exampleTitle: "Un label correctement relie",
        exampleLanguage: "html",
        exampleCode: `<label for="email">Email address</label>
<input id="email" type="email" />`,
        exampleExplanation:
          "Cliquer sur le label focus l'input, et les technologies d'assistance peuvent relier correctement le nom au champ.",
        estimatedReadMinutes: 4,
        takeaways: [
          "Les labels ameliorent l'accessibilite.",
          "Les labels offrent une meilleure zone de clic pour le controle.",
          "Les placeholders ne remplacent pas de vrais labels.",
        ],
        verbalizePoints: [
          "Mentionner nom accessible et zone de clic.",
          "Ne pas reduire la reponse a une question de style ou d'espacement.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "It helps accessibility and lets users click the label to target the input.",
          explanation: "Correct. That is the practical benefit to mention.",
        },
        {
          label: "It prevents the browser from validating the field too early.",
          explanation:
            "Incorrect. Label association is not about validation timing.",
        },
        {
          label:
            "It automatically stores the field in localStorage for later use.",
          explanation: "Incorrect. Labels do not affect browser storage.",
        },
        {
          label: "It makes the input value submit twice for screen readers.",
          explanation: "Incorrect. That is not how labels work.",
        },
      ],
      fr: [
        {
          label:
            "Cela aide l'accessibilite et permet de cliquer sur le label pour viser l'input.",
          explanation: "Correct. C'est le benefice concret a citer.",
        },
        {
          label: "Cela empeche le navigateur de valider le champ trop tot.",
          explanation:
            "Incorrect. L'association label/input n'a rien a voir avec le timing de validation.",
        },
        {
          label:
            "Cela stocke automatiquement le champ dans localStorage pour plus tard.",
          explanation:
            "Incorrect. Les labels n'affectent pas le stockage navigateur.",
        },
        {
          label:
            "Cela fait soumettre deux fois la valeur du champ pour les lecteurs d'ecran.",
          explanation: "Incorrect. Ce n'est pas le fonctionnement d'un label.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "flexbox-main-axis-follows-flex-direction",
    moduleId: htmlCssModule.id,
    primarySkillId: cssLayoutSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 1,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt: "In flexbox, what determines which direction is the main axis?",
        explanation:
          "The main axis is defined by flex-direction, not permanently by horizontal screen space.",
        tlDr: "The main axis follows flex-direction.",
        shortAnswer:
          "The main axis is whichever direction flex-direction defines, so it can be horizontal or vertical depending on the container.",
        lessonBody: `A common beginner mistake is to think flexbox always lays things out primarily left to right.

In reality, flexbox has a main axis and a cross axis. The main axis depends on flex-direction. If flex-direction is row, the main axis runs horizontally. If it is column, the main axis runs vertically.

This matters because justify-content works on the main axis, while align-items works on the cross axis.

The interview-safe answer is to explain the axes in relation to flex-direction rather than memorizing justify-content as always horizontal and align-items as always vertical.`,
        commonMistakes: [
          "Saying justify-content is always horizontal.",
          "Saying align-items is always vertical.",
          "Forgetting that column changes the axis interpretation.",
        ],
        exampleTitle: "Column changes the main axis",
        exampleLanguage: "css",
        exampleCode: `.stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
}`,
        exampleExplanation:
          "Here, justify-content centers items vertically because the main axis is vertical.",
        estimatedReadMinutes: 4,
        takeaways: [
          "flex-direction defines the main axis.",
          "justify-content works on the main axis.",
          "align-items works on the cross axis.",
        ],
        verbalizePoints: [
          "Explain row vs column explicitly.",
          "Avoid absolute horizontal/vertical rules without context.",
        ],
      },
      fr: {
        prompt:
          "En flexbox, qu'est-ce qui determine la direction de l'axe principal ?",
        explanation:
          "L'axe principal est defini par flex-direction, pas de maniere permanente par l'espace horizontal de l'ecran.",
        tlDr: "L'axe principal suit flex-direction.",
        shortAnswer:
          "L'axe principal est la direction definie par flex-direction, donc il peut etre horizontal ou vertical selon le conteneur.",
        lessonBody: `Une erreur frequente au debut consiste a croire que flexbox aligne toujours les elements principalement de gauche a droite.

En realite, flexbox a un axe principal et un axe secondaire. L'axe principal depend de flex-direction. Si flex-direction vaut row, l'axe principal est horizontal. Si flex-direction vaut column, l'axe principal devient vertical.

Cela compte parce que justify-content travaille sur l'axe principal, tandis que align-items travaille sur l'axe secondaire.

La bonne reponse d'entretien consiste a expliquer les axes par rapport a flex-direction, plutot que de memoriser justify-content comme toujours horizontal et align-items comme toujours vertical.`,
        commonMistakes: [
          "Dire que justify-content est toujours horizontal.",
          "Dire que align-items est toujours vertical.",
          "Oublier que column change l'interpretation des axes.",
        ],
        exampleTitle: "column change l'axe principal",
        exampleLanguage: "css",
        exampleCode: `.stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
}`,
        exampleExplanation:
          "Ici, justify-content centre verticalement parce que l'axe principal est vertical.",
        estimatedReadMinutes: 4,
        takeaways: [
          "flex-direction definit l'axe principal.",
          "justify-content agit sur l'axe principal.",
          "align-items agit sur l'axe secondaire.",
        ],
        verbalizePoints: [
          "Expliquer explicitement row vs column.",
          "Eviter les regles horizontales/verticales absolues sans contexte.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "The main axis is always horizontal because screens are wider than they are tall.",
          explanation: "Incorrect. The main axis depends on flex-direction.",
        },
        {
          label:
            "flex-direction determines whether the main axis is horizontal or vertical.",
          explanation: "Correct. That is the right mental model.",
        },
        {
          label:
            "justify-content determines the main axis when the container has gap.",
          explanation:
            "Incorrect. justify-content uses the main axis but does not define it.",
        },
        {
          label:
            "The child's width and height automatically decide the main axis.",
          explanation: "Incorrect. Item size does not define the axis.",
        },
      ],
      fr: [
        {
          label:
            "L'axe principal est toujours horizontal parce que les ecrans sont plus larges que hauts.",
          explanation: "Incorrect. L'axe principal depend de flex-direction.",
        },
        {
          label:
            "flex-direction determine si l'axe principal est horizontal ou vertical.",
          explanation: "Correct. C'est le bon modele mental.",
        },
        {
          label:
            "justify-content determine l'axe principal quand le conteneur a un gap.",
          explanation:
            "Incorrect. justify-content utilise l'axe principal mais ne le definit pas.",
        },
        {
          label:
            "La largeur et la hauteur de l'enfant decident automatiquement de l'axe principal.",
          explanation: "Incorrect. La taille des items ne definit pas l'axe.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "css-specificity-inline-id-class-order",
    moduleId: htmlCssModule.id,
    primarySkillId: cssLayoutSkill.id,
    format: QuestionFormat.MULTIPLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [true, true, false, false],
    translations: {
      en: {
        prompt:
          "Which statements about CSS specificity are correct at an interview-ready beginner level?",
        explanation:
          "Inline styles are stronger than normal selector rules, and an id selector is more specific than a class selector.",
        tlDr: "Inline styles outrank normal selectors, and id selectors outrank class selectors.",
        shortAnswer:
          "At a beginner-friendly level, the key rules are that inline styles outrank ordinary stylesheet selectors, and id selectors are more specific than class selectors.",
        lessonBody: `Specificity decides which matching CSS rule wins when several rules target the same element and property.

At an interview-safe beginner level, you do not need to memorize every edge case. What matters is the general order: inline styles are very strong, id selectors are more specific than class selectors, and class selectors are more specific than plain element selectors.

You should also remember that specificity is only part of the story. If specificity is tied, later source order can win.

The strong answer is to explain specificity as a conflict-resolution rule for matching selectors, not as random browser behavior.`,
        commonMistakes: [
          "Thinking CSS always uses the last rule regardless of specificity.",
          "Forgetting that id selectors outrank class selectors.",
          "Talking about !important first instead of explaining normal specificity.",
        ],
        exampleTitle: "Two selectors compete",
        exampleLanguage: "css",
        exampleCode: `#hero {
  color: red;
}

.banner {
  color: blue;
}`,
        exampleExplanation:
          "If both selectors match the same element, the id selector is more specific and wins.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Specificity resolves conflicts between matching rules.",
          "Inline styles outrank ordinary selectors.",
          "Id selectors outrank class selectors.",
        ],
        verbalizePoints: [
          "Explain specificity as conflict resolution.",
          "Mention source order only after specificity.",
        ],
      },
      fr: {
        prompt:
          "Quelles affirmations sur la specificite CSS sont correctes a un niveau debutant solide pour entretien ?",
        explanation:
          "Les styles inline sont plus forts que les regles de selecteur normales, et un selecteur d'id est plus specifique qu'un selecteur de classe.",
        tlDr: "Les styles inline passent devant les selecteurs normaux, et les selecteurs d'id passent devant les selecteurs de classe.",
        shortAnswer:
          "A un niveau debutant solide, les regles cle sont que les styles inline dominent les selecteurs classiques, et que les selecteurs d'id sont plus specifiques que les selecteurs de classe.",
        lessonBody: `La specificite decide quelle regle CSS gagne quand plusieurs regles ciblent le meme element et la meme propriete.

A un niveau entretien pour debutant, il n'est pas necessaire de memoriser tous les cas limites. L'important est l'ordre general: les styles inline sont tres forts, les selecteurs d'id sont plus specifiques que les selecteurs de classe, et les selecteurs de classe sont plus specifiques que les simples selecteurs d'element.

Il faut aussi se souvenir que la specificite n'est qu'une partie de l'histoire. Si la specificite est egale, l'ordre d'apparition dans la source peut trancher.

La bonne reponse consiste a expliquer la specificite comme une regle de resolution de conflit entre selecteurs correspondants, pas comme un comportement aleatoire du navigateur.`,
        commonMistakes: [
          "Croire que CSS prend toujours la derniere regle sans regarder la specificite.",
          "Oublier qu'un selecteur d'id passe devant un selecteur de classe.",
          "Parler de !important avant d'expliquer la specificite normale.",
        ],
        exampleTitle: "Deux selecteurs entrent en concurrence",
        exampleLanguage: "css",
        exampleCode: `#hero {
  color: red;
}

.banner {
  color: blue;
}`,
        exampleExplanation:
          "Si les deux selecteurs ciblent le meme element, le selecteur d'id est plus specifique et gagne.",
        estimatedReadMinutes: 5,
        takeaways: [
          "La specificite resout les conflits entre regles correspondantes.",
          "Les styles inline dominent les selecteurs ordinaires.",
          "Les selecteurs d'id dominent les selecteurs de classe.",
        ],
        verbalizePoints: [
          "Expliquer la specificite comme une resolution de conflit.",
          "Mentionner l'ordre source seulement apres la specificite.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "An inline style is normally stronger than a class selector from a stylesheet.",
          explanation:
            "Correct. Inline styles have very high specificity in normal cases.",
        },
        {
          label: "An id selector is more specific than a class selector.",
          explanation: "Correct. That is a core specificity rule.",
        },
        {
          label:
            "A class selector is always more specific than an id selector if it appears later in the file.",
          explanation:
            "Incorrect. Later source order does not beat a stronger selector when specificity differs.",
        },
        {
          label:
            "Specificity never matters because CSS always chooses the most recently declared rule.",
          explanation: "Incorrect. Specificity absolutely matters.",
        },
      ],
      fr: [
        {
          label:
            "Un style inline est en general plus fort qu'un selecteur de classe venant d'une feuille CSS.",
          explanation:
            "Correct. Les styles inline ont une specificite tres elevee dans les cas normaux.",
        },
        {
          label:
            "Un selecteur d'id est plus specifique qu'un selecteur de classe.",
          explanation: "Correct. C'est une regle centrale de specificite.",
        },
        {
          label:
            "Un selecteur de classe est toujours plus specifique qu'un selecteur d'id s'il apparait plus tard dans le fichier.",
          explanation:
            "Incorrect. Un ordre source plus tardif ne bat pas un selecteur plus fort quand la specificite differe.",
        },
        {
          label:
            "La specificite ne compte jamais parce que CSS choisit toujours la regle la plus recente.",
          explanation: "Incorrect. La specificite compte vraiment.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "box-sizing-border-box-includes-padding-and-border",
    moduleId: htmlCssModule.id,
    primarySkillId: cssLayoutSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt: "What changes when an element uses box-sizing: border-box?",
        explanation:
          "The declared width and height now include padding and border instead of applying only to the content box.",
        tlDr: "With border-box, the declared size includes padding and border.",
        shortAnswer:
          "border-box means the width and height you set already include the element's padding and border, which makes layout sizing easier to predict.",
        lessonBody: `The default box model can surprise beginners.

With content-box, a declared width applies only to the content area. Padding and border are then added on top, which makes the rendered element larger than the declared width.

With border-box, the declared width includes content, padding and border together. That usually makes layout reasoning easier because the visible box matches the number you wrote.

The strong answer is not only to name the rule, but to explain why teams often prefer it: sizing becomes more predictable.`,
        commonMistakes: [
          "Thinking border-box removes padding from the element entirely.",
          "Saying border-box changes margin behavior.",
          "Describing the rule without connecting it to predictable sizing.",
        ],
        exampleTitle: "Predictable card width",
        exampleLanguage: "css",
        exampleCode: `.card {
  width: 320px;
  padding: 24px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}`,
        exampleExplanation:
          "The rendered card still occupies 320px total width, not 320 plus padding and border on top.",
        estimatedReadMinutes: 4,
        takeaways: [
          "content-box applies width to content only.",
          "border-box includes padding and border in the declared size.",
          "border-box usually makes layout sizing easier to predict.",
        ],
        verbalizePoints: [
          "Contrast content-box and border-box clearly.",
          "Mention predictable layout math.",
        ],
      },
      fr: {
        prompt:
          "Qu'est-ce qui change quand un element utilise box-sizing: border-box ?",
        explanation:
          "La largeur et la hauteur declarees incluent maintenant le padding et la bordure au lieu de s'appliquer seulement a la zone de contenu.",
        tlDr: "Avec border-box, la taille declaree inclut padding et bordure.",
        shortAnswer:
          "border-box signifie que la largeur et la hauteur fixees incluent deja le contenu, le padding et la bordure, ce qui rend le sizing plus previsible.",
        lessonBody: `Le box model par defaut surprend souvent les debutants.

Avec content-box, une largeur declaree s'applique seulement a la zone de contenu. Le padding et la bordure s'ajoutent ensuite, ce qui rend l'element affiche plus large que la valeur ecrite.

Avec border-box, la largeur declaree inclut ensemble le contenu, le padding et la bordure. Cela simplifie souvent le raisonnement layout parce que la boite visible correspond mieux au nombre ecrit.

La bonne reponse consiste non seulement a nommer la regle, mais aussi a expliquer pourquoi les equipes l'apprecient: le calcul des tailles devient plus previsible.`,
        commonMistakes: [
          "Croire que border-box supprime le padding de l'element.",
          "Dire que border-box modifie le comportement des marges.",
          "Decrire la regle sans la relier a un sizing plus previsible.",
        ],
        exampleTitle: "Une largeur de carte previsible",
        exampleLanguage: "css",
        exampleCode: `.card {
  width: 320px;
  padding: 24px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}`,
        exampleExplanation:
          "La carte occupe toujours 320px au total, et non 320 plus le padding et la bordure en plus.",
        estimatedReadMinutes: 4,
        takeaways: [
          "content-box applique la largeur au contenu seulement.",
          "border-box inclut le padding et la bordure dans la taille declaree.",
          "border-box rend en general le layout plus previsible.",
        ],
        verbalizePoints: [
          "Opposer clairement content-box et border-box.",
          "Mentionner le calcul de layout plus simple.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "Padding and border are added outside the declared size, exactly like content-box.",
          explanation: "Incorrect. That describes content-box, not border-box.",
        },
        {
          label: "The declared width and height include padding and border.",
          explanation: "Correct. That is the key effect of border-box.",
        },
        {
          label:
            "Margins are automatically collapsed into the declared width and height.",
          explanation: "Incorrect. Margins are still separate.",
        },
        {
          label:
            "The element can no longer use padding once border-box is enabled.",
          explanation:
            "Incorrect. Padding still exists; it is just counted differently.",
        },
      ],
      fr: [
        {
          label:
            "Le padding et la bordure s'ajoutent en dehors de la taille declaree, exactement comme en content-box.",
          explanation: "Incorrect. Cela decrit content-box, pas border-box.",
        },
        {
          label:
            "La largeur et la hauteur declarees incluent le padding et la bordure.",
          explanation: "Correct. C'est l'effet cle de border-box.",
        },
        {
          label:
            "Les marges sont automatiquement repliees dans la largeur et la hauteur declarees.",
          explanation: "Incorrect. Les marges restent separees.",
        },
        {
          label:
            "L'element ne peut plus utiliser de padding une fois border-box active.",
          explanation:
            "Incorrect. Le padding existe toujours; il est seulement compte autrement.",
        },
      ],
    },
  });

  await upsertLessonQuestion({
    slug: "absolute-position-removes-element-from-normal-flow",
    moduleId: htmlCssModule.id,
    primarySkillId: cssLayoutSkill.id,
    format: QuestionFormat.OPEN_ENDED,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    translations: {
      en: {
        prompt:
          "What does it mean to say that an absolutely positioned element is removed from normal flow, and why does that matter in layout bugs?",
        explanation:
          "It means the element no longer takes up its usual space in the document flow, so nearby elements lay out as if it were not occupying that spot.",
        tlDr: "Absolute positioning takes the element out of normal flow, so siblings no longer reserve space for it.",
        shortAnswer:
          "An absolutely positioned element no longer reserves layout space in the normal document flow. That is why surrounding content can overlap or collapse into the space it would otherwise have taken.",
        lessonBody: `This topic explains many beginner CSS layout bugs.

In normal flow, block and inline elements occupy space and affect where later elements are placed. The document layout is built with those occupied spaces in mind.

When you set position: absolute, the element is taken out of that normal flow. It can still be visually displayed, but its siblings no longer lay themselves out around its old spot as if that space were reserved.

That is why absolutely positioned badges, menus or overlays often appear to overlap nearby content. The strong interview answer is to explain both pieces: it is visually present, but no longer participates in normal flow layout.`,
        commonMistakes: [
          "Saying absolute elements disappear from the page entirely.",
          "Thinking absolute positioning only changes z-index.",
          "Forgetting that the element may still be positioned relative to an ancestor.",
        ],
        exampleTitle: "A badge over a card",
        exampleLanguage: "css",
        exampleCode: `.badge {
  position: absolute;
  top: 0;
  right: 0;
}`,
        exampleExplanation:
          "The badge is still visible, but its size no longer pushes other content away in normal flow.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Absolute positioning removes the element from normal flow.",
          "Siblings do not reserve space for that element anymore.",
          "That often causes overlap if you expected flow-based layout.",
        ],
        verbalizePoints: [
          "Say visually present but not flow-participating.",
          "Relate the concept to overlap or collapsed spacing bugs.",
        ],
      },
      fr: {
        prompt:
          "Que signifie dire qu'un element en position absolute est retire du flux normal, et pourquoi est-ce important dans les bugs de layout ?",
        explanation:
          "Cela signifie que l'element ne reserve plus son espace habituel dans le flux du document, donc les elements voisins se disposent comme si cet espace n'etait plus occupe.",
        tlDr: "Le positionnement absolu retire l'element du flux normal, donc les siblings ne lui reservent plus de place.",
        shortAnswer:
          "Un element en position absolute ne reserve plus d'espace dans le flux normal du document. C'est pour cela que le contenu autour peut se chevaucher ou venir occuper la place qu'il aurait prise autrement.",
        lessonBody: `Ce sujet explique beaucoup de bugs de layout CSS chez les debutants.

Dans le flux normal, les elements bloc et inline occupent de la place et influencent l'emplacement des elements suivants. Le layout du document est construit en tenant compte de ces espaces occupes.

Quand tu mets position: absolute, l'element sort de ce flux normal. Il peut toujours etre affiche visuellement, mais ses siblings ne se placent plus autour de son ancien emplacement comme si cette place etait reservee.

C'est pour cela que des badges, menus ou overlays en absolute semblent souvent chevaucher le contenu voisin. La bonne reponse d'entretien consiste a expliquer les deux aspects: l'element reste visible, mais il ne participe plus au layout du flux normal.`,
        commonMistakes: [
          "Dire qu'un element absolute disparait completement de la page.",
          "Croire que le positionnement absolute ne change que le z-index.",
          "Oublier que l'element peut encore se positionner par rapport a un ancetre.",
        ],
        exampleTitle: "Un badge au-dessus d'une carte",
        exampleLanguage: "css",
        exampleCode: `.badge {
  position: absolute;
  top: 0;
  right: 0;
}`,
        exampleExplanation:
          "Le badge reste visible, mais sa taille ne pousse plus les autres contenus dans le flux normal.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Le positionnement absolute retire l'element du flux normal.",
          "Les siblings ne lui reservent plus de place.",
          "Cela provoque souvent des chevauchements si l'on attendait un layout base sur le flux.",
        ],
        verbalizePoints: [
          "Dire visible mais hors participation au flux.",
          "Relier le concept a des bugs de chevauchement ou d'espacement.",
        ],
      },
    },
  });

  await upsertClosedQuestion({
    slug: "defer-script-runs-after-parse-in-order",
    moduleId: browserFundamentalsModule.id,
    primarySkillId: browserRuntimeSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt: "What is the main behavior of a script tag that uses defer?",
        explanation:
          "Deferred scripts download without blocking HTML parsing, then execute after parsing finishes and in document order.",
        tlDr: "defer means download during parse, execute after parse, preserve order.",
        shortAnswer:
          "A deferred script does not block HTML parsing while it downloads, and it runs after the document has been parsed, keeping document order among deferred scripts.",
        lessonBody: `This question is useful because many candidates remember "defer is faster" without knowing what it really changes.

With defer, the browser can continue parsing the HTML while the script downloads. The script execution is postponed until parsing is complete.

Another important detail is ordering: multiple deferred scripts still execute in document order.

The strong answer is not just "it delays execution". It is to explain the two key benefits: parsing is not blocked during download, and execution waits until the DOM has been parsed.`,
        commonMistakes: [
          "Confusing defer with async.",
          "Thinking defer scripts execute immediately as soon as each download completes.",
          "Forgetting to mention preserved order across deferred scripts.",
        ],
        exampleTitle: "A deferred app script",
        exampleLanguage: "html",
        exampleCode: `<script src="/app.js" defer></script>`,
        exampleExplanation:
          "The browser can continue parsing the document, then execute the script after parsing finishes.",
        estimatedReadMinutes: 5,
        takeaways: [
          "defer avoids blocking HTML parsing during download.",
          "Deferred scripts run after parsing finishes.",
          "Deferred scripts preserve document order.",
        ],
        verbalizePoints: [
          "Contrast defer with async if helpful.",
          "Mention parsing and execution separately.",
        ],
      },
      fr: {
        prompt:
          "Quel est le comportement principal d'une balise script qui utilise defer ?",
        explanation:
          "Les scripts en defer se telechargent sans bloquer le parsing HTML, puis s'executent apres la fin du parsing et dans l'ordre du document.",
        tlDr: "defer signifie telechargement pendant le parsing, execution apres le parsing, ordre preserve.",
        shortAnswer:
          "Un script defer ne bloque pas le parsing HTML pendant son telechargement, puis il s'execute apres que le document a ete parse, tout en respectant l'ordre du document parmi les scripts defer.",
        lessonBody: `Cette question est utile parce que beaucoup de candidats retiennent seulement "defer est plus rapide" sans savoir ce que cela change vraiment.

Avec defer, le navigateur peut continuer a parser le HTML pendant que le script se telecharge. L'execution du script est repoussee jusqu'a la fin du parsing.

Un autre detail important est l'ordre: plusieurs scripts defer s'executent toujours dans l'ordre du document.

La bonne reponse ne se limite pas a "cela retarde l'execution". Il faut expliquer les deux benefices cle: le parsing n'est pas bloque pendant le telechargement, et l'execution attend que le DOM soit parse.`,
        commonMistakes: [
          "Confondre defer avec async.",
          "Croire que les scripts defer s'executent immediatement des que leur telechargement finit.",
          "Oublier de mentionner l'ordre preserve entre scripts defer.",
        ],
        exampleTitle: "Un script applicatif en defer",
        exampleLanguage: "html",
        exampleCode: `<script src="/app.js" defer></script>`,
        exampleExplanation:
          "Le navigateur peut continuer le parsing du document, puis executer le script une fois ce parsing termine.",
        estimatedReadMinutes: 5,
        takeaways: [
          "defer evite de bloquer le parsing HTML pendant le telechargement.",
          "Les scripts defer s'executent apres la fin du parsing.",
          "Les scripts defer preservent l'ordre du document.",
        ],
        verbalizePoints: [
          "Contraster defer et async si utile.",
          "Bien distinguer parsing et execution.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "It blocks HTML parsing until the script downloads and executes immediately.",
          explanation:
            "Incorrect. That is closer to a classic blocking script.",
        },
        {
          label:
            "It downloads during HTML parsing and runs after parsing, preserving document order.",
          explanation: "Correct. That is the key defer behavior.",
        },
        {
          label:
            "It always executes before the DOM is parsed so it can create missing elements.",
          explanation: "Incorrect. defer scripts execute after parsing.",
        },
        {
          label: "It is identical to async except for naming style.",
          explanation:
            "Incorrect. async and defer have different ordering and timing behavior.",
        },
      ],
      fr: [
        {
          label:
            "Il bloque le parsing HTML jusqu'au telechargement puis s'execute immediatement.",
          explanation:
            "Incorrect. Cela ressemble plutot a un script classique bloquant.",
        },
        {
          label:
            "Il se telecharge pendant le parsing HTML puis s'execute apres le parsing en preservant l'ordre du document.",
          explanation: "Correct. C'est le comportement cle de defer.",
        },
        {
          label:
            "Il s'execute toujours avant que le DOM soit parse afin de creer les elements manquants.",
          explanation:
            "Incorrect. Les scripts defer s'executent apres le parsing.",
        },
        {
          label: "Il est identique a async, seule la maniere de nommer change.",
          explanation:
            "Incorrect. async et defer ont des comportements differents en timing et en ordre.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "event-bubbling-moves-from-target-upward",
    moduleId: browserFundamentalsModule.id,
    primarySkillId: browserRuntimeSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 1,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "In normal DOM event bubbling, which direction does the event travel after it reaches the target?",
        explanation:
          "It bubbles upward through ancestor elements unless propagation is stopped.",
        tlDr: "After the target phase, bubbling moves upward through ancestors.",
        shortAnswer:
          "After the event reaches the target, it normally bubbles upward through parent and ancestor elements unless something stops propagation.",
        lessonBody: `Event bubbling is one of the most practical browser concepts for front-end interviews.

When an event happens on an element, the browser can notify listeners on that element and then continue through ancestor elements. This upward travel is the bubbling phase.

That is why a click inside a button can also be observed by listeners on a surrounding card, list item or document root.

The strong answer is to say that bubbling goes from the target upward through ancestors. That is also what makes event delegation possible.`,
        commonMistakes: [
          "Saying bubbling goes downward from parent to child.",
          "Confusing bubbling with the capture phase.",
          "Forgetting that propagation can be stopped.",
        ],
        exampleTitle: "Child click reaches parent listener",
        exampleLanguage: "html",
        exampleCode: `<div id="card">
  <button id="save">Save</button>
</div>`,
        exampleExplanation:
          "A click on the button can still be observed by a bubbling click listener on the surrounding div.",
        estimatedReadMinutes: 4,
        takeaways: [
          "Bubbling travels upward through ancestors.",
          "It explains why parent listeners can react to child interactions.",
          "It is the basis for event delegation patterns.",
        ],
        verbalizePoints: [
          "Say target upward through ancestors.",
          "Contrast bubbling and capture if needed.",
        ],
      },
      fr: {
        prompt:
          "Dans le bubbling DOM normal, dans quelle direction l'evenement voyage-t-il apres avoir atteint sa cible ?",
        explanation:
          "Il remonte a travers les elements ancetres tant que la propagation n'est pas interrompue.",
        tlDr: "Apres la phase cible, le bubbling remonte a travers les ancetres.",
        shortAnswer:
          "Apres avoir atteint la cible, l'evenement remonte normalement a travers les parents et les ancetres tant que rien n'interrompt la propagation.",
        lessonBody: `Le bubbling d'evenement est l'un des concepts navigateur les plus utiles en entretien front-end.

Quand un evenement se produit sur un element, le navigateur peut avertir des listeners sur cet element, puis continuer vers les elements ancetres. Cette remontee constitue la phase de bubbling.

C'est pour cela qu'un clic dans un bouton peut aussi etre observe par des listeners poses sur une carte parente, un item de liste ou meme la racine du document.

La bonne reponse consiste a dire que le bubbling va de la cible vers le haut a travers les ancetres. C'est aussi ce qui rend possible la delegation d'evenements.`,
        commonMistakes: [
          "Dire que le bubbling descend du parent vers l'enfant.",
          "Confondre bubbling et phase de capture.",
          "Oublier que la propagation peut etre stoppee.",
        ],
        exampleTitle: "Le clic enfant atteint le listener parent",
        exampleLanguage: "html",
        exampleCode: `<div id="card">
  <button id="save">Save</button>
</div>`,
        exampleExplanation:
          "Un clic sur le bouton peut quand meme etre observe par un listener de clic en bubbling sur la div parente.",
        estimatedReadMinutes: 4,
        takeaways: [
          "Le bubbling remonte a travers les ancetres.",
          "Il explique pourquoi des listeners parents reagissent a des interactions enfant.",
          "Il sert de base aux patterns de delegation d'evenements.",
        ],
        verbalizePoints: [
          "Dire cible puis remontee a travers les ancetres.",
          "Contraster bubbling et capture si besoin.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "It travels downward from the document root to smaller children only.",
          explanation: "Incorrect. That describes capture more than bubbling.",
        },
        {
          label: "It travels upward from the target through ancestor elements.",
          explanation: "Correct. That is the bubbling direction.",
        },
        {
          label:
            "It stays only on the target element and cannot reach ancestors.",
          explanation:
            "Incorrect. Bubbling exists precisely because it can reach ancestors.",
        },
        {
          label:
            "It jumps directly from the target to window without touching parents.",
          explanation: "Incorrect. It moves through the ancestor chain.",
        },
      ],
      fr: [
        {
          label:
            "Il descend de la racine du document vers les enfants plus petits uniquement.",
          explanation:
            "Incorrect. Cela decrit plutot la capture que le bubbling.",
        },
        {
          label: "Il remonte depuis la cible a travers les elements ancetres.",
          explanation: "Correct. C'est la direction du bubbling.",
        },
        {
          label:
            "Il reste seulement sur l'element cible et ne peut jamais atteindre les ancetres.",
          explanation:
            "Incorrect. Le bubbling existe justement parce qu'il peut atteindre les ancetres.",
        },
        {
          label:
            "Il saute directement de la cible a window sans passer par les parents.",
          explanation: "Incorrect. Il traverse la chaine des ancetres.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "prevent-default-does-not-stop-propagation",
    moduleId: browserFundamentalsModule.id,
    primarySkillId: browserRuntimeSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "What is the key difference between event.preventDefault() and event.stopPropagation()?",
        explanation:
          "preventDefault cancels the browser's default action, while stopPropagation stops the event from continuing through the propagation chain.",
        tlDr: "preventDefault affects default behavior; stopPropagation affects event travel.",
        shortAnswer:
          "preventDefault tells the browser not to perform its built-in default action, while stopPropagation prevents the event from continuing to other listeners higher up the propagation path.",
        lessonBody: `These two APIs are often mixed up because they are both called inside event handlers, but they solve different problems.

preventDefault is about browser behavior. For example, it can stop a form submission or prevent a link from navigating.

stopPropagation is about event travel. It stops the event from continuing to ancestor listeners in the propagation chain.

The clean interview answer is to separate behavior from propagation: one stops the browser's default action, the other stops the event from continuing through the DOM.`,
        commonMistakes: [
          "Saying preventDefault also stops bubbling automatically.",
          "Using stopPropagation when the real problem is unwanted navigation or submission.",
          "Explaining both APIs as if they were interchangeable.",
        ],
        exampleTitle: "Two different concerns",
        exampleLanguage: "ts",
        exampleCode: `link.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
});`,
        exampleExplanation:
          "The first call stops navigation, the second stops the event from continuing upward.",
        estimatedReadMinutes: 5,
        takeaways: [
          "preventDefault cancels the browser's default action.",
          "stopPropagation stops the event from traveling further.",
          "They solve different problems and are not automatic substitutes.",
        ],
        verbalizePoints: [
          "Use the words default action and propagation chain.",
          "Give one concrete example for each API.",
        ],
      },
      fr: {
        prompt:
          "Quelle est la difference cle entre event.preventDefault() et event.stopPropagation() ?",
        explanation:
          "preventDefault annule l'action par defaut du navigateur, tandis que stopPropagation empeche l'evenement de continuer dans la chaine de propagation.",
        tlDr: "preventDefault agit sur le comportement par defaut; stopPropagation agit sur le trajet de l'evenement.",
        shortAnswer:
          "preventDefault dit au navigateur de ne pas executer son action native par defaut, tandis que stopPropagation empeche l'evenement de continuer vers d'autres listeners plus haut dans le trajet de propagation.",
        lessonBody: `Ces deux APIs sont souvent confondues parce qu'elles sont appelees dans des handlers d'evenement, mais elles ne resolvent pas le meme probleme.

preventDefault concerne le comportement du navigateur. Par exemple, il peut empecher la soumission d'un formulaire ou la navigation d'un lien.

stopPropagation concerne le trajet de l'evenement. Il empeche l'evenement de continuer vers les listeners ancetres dans la chaine de propagation.

La bonne reponse d'entretien consiste a separer comportement et propagation: l'une bloque l'action native du navigateur, l'autre bloque la poursuite de l'evenement dans le DOM.`,
        commonMistakes: [
          "Dire que preventDefault arrete aussi automatiquement le bubbling.",
          "Utiliser stopPropagation alors que le vrai probleme est une navigation ou soumission non voulue.",
          "Expliquer les deux APIs comme si elles etaient interchangeables.",
        ],
        exampleTitle: "Deux problemes differents",
        exampleLanguage: "ts",
        exampleCode: `link.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
});`,
        exampleExplanation:
          "Le premier appel empeche la navigation, le second empeche la remontee de l'evenement.",
        estimatedReadMinutes: 5,
        takeaways: [
          "preventDefault annule l'action par defaut du navigateur.",
          "stopPropagation arrete le trajet de l'evenement plus loin.",
          "Ces APIs resolvent des problemes differents et ne se remplacent pas automatiquement.",
        ],
        verbalizePoints: [
          "Utiliser les expressions action par defaut et chaine de propagation.",
          "Donner un exemple concret pour chaque API.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "preventDefault and stopPropagation are two names for the exact same browser API behavior.",
          explanation:
            "Incorrect. They affect different parts of event handling.",
        },
        {
          label:
            "preventDefault cancels default browser behavior, while stopPropagation stops further event propagation.",
          explanation: "Correct. That is the key distinction.",
        },
        {
          label:
            "stopPropagation cancels form submission, while preventDefault stops ancestor listeners.",
          explanation:
            "Incorrect. Those roles are reversed and oversimplified.",
        },
        {
          label: "Both methods only work on keyboard events, not click events.",
          explanation: "Incorrect. They work on many event types.",
        },
      ],
      fr: [
        {
          label:
            "preventDefault et stopPropagation sont deux noms pour exactement le meme comportement API du navigateur.",
          explanation:
            "Incorrect. Ils agissent sur des parties differentes de la gestion d'evenement.",
        },
        {
          label:
            "preventDefault annule le comportement natif du navigateur, tandis que stopPropagation arrete la propagation ulterieure de l'evenement.",
          explanation: "Correct. C'est la distinction cle.",
        },
        {
          label:
            "stopPropagation annule la soumission d'un formulaire, tandis que preventDefault bloque les listeners ancetres.",
          explanation:
            "Incorrect. Ces roles sont inverses et simplifies a tort.",
        },
        {
          label:
            "Les deux methodes ne fonctionnent que sur les evenements clavier, pas sur les clics.",
          explanation:
            "Incorrect. Elles fonctionnent sur beaucoup de types d'evenements.",
        },
      ],
    },
  });

  await upsertClosedQuestion({
    slug: "localstorage-persists-beyond-tab-close",
    moduleId: browserFundamentalsModule.id,
    primarySkillId: browserRuntimeSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 1,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt:
          "What is the most important lifetime difference between localStorage and sessionStorage?",
        explanation:
          "localStorage persists until cleared, while sessionStorage is scoped to a tab or browsing session and is cleared when that session ends.",
        tlDr: "localStorage survives tab closes; sessionStorage is session-scoped.",
        shortAnswer:
          "localStorage keeps data across browser sessions until it is cleared, while sessionStorage lasts only for the current tab or session and is cleared when that session ends.",
        lessonBody: `This storage question appears often because candidates use the APIs without always understanding their lifetime model.

localStorage is persistent. Data usually remains there until the user or application clears it.

sessionStorage is much shorter-lived. It is scoped to the current tab or session context, so closing that session clears the stored data.

The strong interview answer is to focus on lifetime and scope, not just on API syntax. Say which one survives and which one is session-bound.`,
        commonMistakes: [
          "Saying both storages behave the same except for naming.",
          "Thinking sessionStorage is shared permanently across all future tabs.",
          "Forgetting that localStorage is still same-origin scoped and not a universal global cache.",
        ],
        exampleTitle: "Two storage lifetimes",
        exampleLanguage: "ts",
        exampleCode: `localStorage.setItem("theme", "dark");
sessionStorage.setItem("draft", "hello");`,
        exampleExplanation:
          "The theme can survive a later browser reopen, while the draft is tied to the current session context.",
        estimatedReadMinutes: 4,
        takeaways: [
          "localStorage is persistent until cleared.",
          "sessionStorage is tied to the current session or tab context.",
          "The key distinction is lifetime and scope.",
        ],
        verbalizePoints: [
          "Say persists vs session-scoped.",
          "Explain lifetime before talking about method names.",
        ],
      },
      fr: {
        prompt:
          "Quelle est la difference de duree de vie la plus importante entre localStorage et sessionStorage ?",
        explanation:
          "localStorage persiste jusqu'a suppression, tandis que sessionStorage est limite a l'onglet ou a la session courante et est vide quand cette session se termine.",
        tlDr: "localStorage survit a la fermeture d'onglet; sessionStorage est limite a la session.",
        shortAnswer:
          "localStorage conserve les donnees entre plusieurs sessions navigateur jusqu'a suppression, tandis que sessionStorage ne vit que pendant l'onglet ou la session courante et disparait quand celle-ci se termine.",
        lessonBody: `Cette question sur le stockage revient souvent parce que les candidats utilisent les APIs sans toujours bien comprendre leur modele de duree de vie.

localStorage est persistant. Les donnees y restent en general jusqu'a ce que l'utilisateur ou l'application les efface.

sessionStorage a une duree de vie bien plus courte. Il est limite au contexte d'onglet ou de session courante, donc fermer cette session efface les donnees stockees.

La bonne reponse d'entretien consiste a insister d'abord sur la duree de vie et le scope, pas seulement sur la syntaxe API. Il faut dire lequel survit et lequel reste limite a la session.`,
        commonMistakes: [
          "Dire que les deux stockages se comportent pareil sauf pour le nom.",
          "Croire que sessionStorage est partage en permanence entre tous les futurs onglets.",
          "Oublier que localStorage reste lie a la meme origine et n'est pas un cache global universel.",
        ],
        exampleTitle: "Deux durees de vie de stockage",
        exampleLanguage: "ts",
        exampleCode: `localStorage.setItem("theme", "dark");
sessionStorage.setItem("draft", "hello");`,
        exampleExplanation:
          "Le theme peut survivre a une future reouverture du navigateur, alors que le draft reste lie a la session courante.",
        estimatedReadMinutes: 4,
        takeaways: [
          "localStorage persiste jusqu'a suppression.",
          "sessionStorage est lie a la session ou au contexte d'onglet courant.",
          "La distinction cle concerne la duree de vie et le scope.",
        ],
        verbalizePoints: [
          "Dire persistant vs limite a la session.",
          "Expliquer la duree de vie avant de parler des noms de methode.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "sessionStorage survives browser restarts, while localStorage is cleared on every tab close.",
          explanation: "Incorrect. This reverses the lifetime model.",
        },
        {
          label:
            "localStorage persists until cleared, while sessionStorage is tied to the current session or tab.",
          explanation: "Correct. That is the key difference to explain.",
        },
        {
          label:
            "Both are identical in lifetime, but localStorage only accepts numbers.",
          explanation:
            "Incorrect. The lifetime model differs and both store strings.",
        },
        {
          label:
            "localStorage only exists on mobile browsers, while sessionStorage exists on desktop.",
          explanation: "Incorrect. That is not how these APIs are divided.",
        },
      ],
      fr: [
        {
          label:
            "sessionStorage survit aux redemarrages navigateur, tandis que localStorage est vide a chaque fermeture d'onglet.",
          explanation: "Incorrect. Cela inverse le modele de duree de vie.",
        },
        {
          label:
            "localStorage persiste jusqu'a suppression, tandis que sessionStorage est lie a la session ou a l'onglet courant.",
          explanation: "Correct. C'est la difference cle a expliquer.",
        },
        {
          label:
            "Les deux ont la meme duree de vie, mais localStorage n'accepte que des nombres.",
          explanation:
            "Incorrect. Leur duree de vie differe et les deux stockent des strings.",
        },
        {
          label:
            "localStorage n'existe que sur mobile, tandis que sessionStorage existe sur desktop.",
          explanation: "Incorrect. Ces APIs ne sont pas separees ainsi.",
        },
      ],
    },
  });

  await upsertLessonQuestion({
    slug: "immutable-list-toggle-avoids-mutating-react-state",
    moduleId: reactCodingModule.id,
    primarySkillId: reactUiCodingSkill.id,
    format: QuestionFormat.BUG_HUNT,
    difficulty: 3,
    level: QuestionLevel.MID,
    translations: {
      en: {
        prompt:
          "Read the snippet and explain why mutating an item inside the existing state array is a risky React update pattern, even if you call setItems afterward.",
        explanation:
          "The code mutates the existing object inside the current state array, so old references are being changed in place. React state updates should produce new references for the data being changed.",
        tlDr: "The bug is in-place mutation of existing state instead of returning a new updated structure.",
        shortAnswer:
          "Mutating an item in the current state array changes existing state in place. The safer pattern is to return a new array and a new object for the item being toggled.",
        lessonBody: `This is one of the most practical React coding interview bugs because the code can appear to work at first.

The real problem is not whether setItems is called. The real problem is that the current state is being mutated before the new array is produced. That breaks the immutability story React code relies on for predictable updates, debugging and memoization boundaries.

The safer approach is to build a new array with map and return a new object only for the toggled item. That keeps unchanged items stable while clearly replacing the changed branch.

The strong interview answer is to explain both correctness and mental model: React state should be treated as immutable snapshots, not as mutable data structures you edit in place.`,
        commonMistakes: [
          "Saying setItems([...items]) is enough even after mutating the item object in place.",
          "Talking only about rerenders without mentioning immutability and snapshots.",
          "Rebuilding every item blindly instead of changing only the targeted branch.",
        ],
        exampleTitle: "Immutable toggle with map",
        exampleLanguage: "tsx",
        exampleCode: `setItems((current) =>
  current.map((item) =>
    item.id === targetId ? { ...item, done: !item.done } : item,
  ),
);`,
        exampleExplanation:
          "The update returns a new array and a new object only for the item that changed.",
        estimatedReadMinutes: 6,
        contextData: {
          kind: "bug_hunt",
          language: "tsx",
          code: `function TodoList() {
  const [items, setItems] = useState([
    { id: "a", done: false },
    { id: "b", done: true },
  ]);

  function toggle(targetId: string) {
    const nextItems = [...items];
    const target = nextItems.find((item) => item.id === targetId);

    if (target) {
      target.done = !target.done;
    }

    setItems(nextItems);
  }
}`,
        },
        takeaways: [
          "React state should be treated as immutable snapshots.",
          "Copying only the array is not enough if nested item objects are mutated in place.",
          "A good fix returns a new array and a new object for the changed item.",
        ],
        verbalizePoints: [
          "Say snapshot and immutability explicitly.",
          "Explain why nested object mutation is still a problem after an outer array copy.",
        ],
      },
      fr: {
        prompt:
          "Lis le snippet et explique pourquoi muter un item dans le tableau de state existant est un pattern React risqué, meme si on appelle ensuite setItems.",
        explanation:
          "Le code mutile l'objet existant dans le tableau de state courant, donc d'anciennes references sont modifiees sur place. Les mises a jour React doivent produire de nouvelles references pour les donnees modifiees.",
        tlDr: "Le bug vient d'une mutation sur place du state existant au lieu de retourner une structure mise a jour nouvelle.",
        shortAnswer:
          "Muter un item dans le tableau de state courant modifie l'etat existant sur place. Le pattern plus sur consiste a retourner un nouveau tableau et un nouvel objet pour l'item togglé.",
        lessonBody: `C'est l'un des bugs de coding interview React les plus pratiques parce que le code peut sembler fonctionner au debut.

Le vrai probleme n'est pas de savoir si setItems est appele. Le vrai probleme est que le state courant est muté avant meme que le nouveau tableau soit produit. Cela casse le modele d'immutabilite dont le code React depend pour des mises a jour previsibles, le debug et les frontieres de memoization.

L'approche plus sure consiste a construire un nouveau tableau avec map et a retourner un nouvel objet seulement pour l'item modifie. Les items inchanges restent stables, tandis que la branche modifiee est remplacee proprement.

La bonne reponse d'entretien consiste a expliquer a la fois la correction du code et le modele mental: le state React doit etre traite comme un snapshot immutable, pas comme une structure mutable que l'on edite sur place.`,
        commonMistakes: [
          "Dire que setItems([...items]) suffit meme apres avoir muté l'objet item sur place.",
          "Parler seulement de rerender sans mentionner l'immutabilite et les snapshots.",
          "Reconstruire tous les items aveuglement au lieu de changer seulement la branche visee.",
        ],
        exampleTitle: "Un toggle immutable avec map",
        exampleLanguage: "tsx",
        exampleCode: `setItems((current) =>
  current.map((item) =>
    item.id === targetId ? { ...item, done: !item.done } : item,
  ),
);`,
        exampleExplanation:
          "La mise a jour retourne un nouveau tableau et un nouvel objet seulement pour l'item modifie.",
        estimatedReadMinutes: 6,
        contextData: {
          kind: "bug_hunt",
          language: "tsx",
          code: `function TodoList() {
  const [items, setItems] = useState([
    { id: "a", done: false },
    { id: "b", done: true },
  ]);

  function toggle(targetId: string) {
    const nextItems = [...items];
    const target = nextItems.find((item) => item.id === targetId);

    if (target) {
      target.done = !target.done;
    }

    setItems(nextItems);
  }
}`,
        },
        takeaways: [
          "Le state React doit etre traite comme un snapshot immutable.",
          "Copier seulement le tableau ne suffit pas si les objets items imbriques sont mutés sur place.",
          "Un bon correctif retourne un nouveau tableau et un nouvel objet pour l'item modifie.",
        ],
        verbalizePoints: [
          "Dire explicitement snapshot et immutabilite.",
          "Expliquer pourquoi une mutation d'objet imbrique reste un probleme meme apres une copie du tableau externe.",
        ],
      },
    },
  });

  await upsertLessonQuestion({
    slug: "tabs-component-needs-single-source-of-truth",
    moduleId: reactCodingModule.id,
    primarySkillId: reactUiCodingSkill.id,
    format: QuestionFormat.OPEN_ENDED,
    difficulty: 2,
    level: QuestionLevel.MID,
    translations: {
      en: {
        prompt:
          "If you are asked to sketch a Tabs component in a React interview, what state usually needs to exist and where should that state live?",
        explanation:
          "A tabs component usually needs one active tab identifier as the single source of truth, and that state should live in the tabs parent or controller component.",
        tlDr: "Tabs usually need one active tab id stored in the parent, not separate open flags inside every tab.",
        shortAnswer:
          "Most tab UIs only need one active tab id. That state should usually live in the parent tabs component so triggers and panels stay in sync from one source of truth.",
        lessonBody: `This is a very common coding-round component because it tests state ownership and component composition.

The key design decision is that the UI normally has one active tab at a time. That means the clean state shape is usually a single active id or index, not many separate booleans scattered across child components.

When the active tab state lives in the parent tabs component, each trigger can compare itself to that value and each panel can render based on the same source of truth.

The strong answer is to say that tabs are usually a coordination problem. One small piece of parent-owned state keeps all children aligned.`,
        commonMistakes: [
          "Creating one local open flag inside every tab trigger.",
          "Duplicating active state across both trigger and panel components.",
          "Explaining tabs without naming the source-of-truth decision.",
        ],
        exampleTitle: "One active tab id",
        exampleLanguage: "tsx",
        exampleCode: `const [activeTabId, setActiveTabId] = useState("overview");`,
        exampleExplanation:
          "Every trigger and panel can derive its current behavior from the same activeTabId value.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Tabs are usually controlled by one active id or index.",
          "That state usually belongs in the tabs parent.",
          "One source of truth keeps triggers and panels aligned.",
        ],
        verbalizePoints: [
          "Say single source of truth.",
          "Explain why many booleans are a worse model than one active id.",
        ],
      },
      fr: {
        prompt:
          "Si l'on te demande de esquisser un composant Tabs en entretien React, quel state doit en general exister et ou doit-il vivre ?",
        explanation:
          "Un composant Tabs a en general besoin d'un seul identifiant d'onglet actif comme source de verite unique, et ce state doit vivre dans le parent ou composant controleur.",
        tlDr: "Des tabs ont en general besoin d'un seul id actif stocke dans le parent, pas de drapeaux ouverts separes dans chaque onglet.",
        shortAnswer:
          "La plupart des UIs d'onglets n'ont besoin que d'un seul id d'onglet actif. Ce state doit en general vivre dans le composant parent des tabs pour que les triggers et les panels restent synchronises depuis une seule source de verite.",
        lessonBody: `C'est un composant tres classique en coding round parce qu'il teste la possession du state et la composition de composants.

La decision de conception cle est que l'UI n'a en general qu'un seul onglet actif a la fois. La forme de state la plus propre est donc souvent un seul id actif ou un index actif, et non plusieurs booleens eparpilles dans des enfants.

Quand le state de l'onglet actif vit dans le parent Tabs, chaque trigger peut se comparer a cette valeur et chaque panel peut rendre son contenu a partir de la meme source de verite.

La bonne reponse consiste a dire que Tabs est surtout un probleme de coordination. Un petit state possede par le parent suffit a garder tous les enfants alignes.`,
        commonMistakes: [
          "Creer un flag local open dans chaque trigger d'onglet.",
          "Dupliquer le state actif a la fois dans les triggers et dans les panels.",
          "Expliquer les tabs sans nommer la decision de source de verite.",
        ],
        exampleTitle: "Un seul id d'onglet actif",
        exampleLanguage: "tsx",
        exampleCode: `const [activeTabId, setActiveTabId] = useState("overview");`,
        exampleExplanation:
          "Chaque trigger et chaque panel peut deriver son comportement courant a partir de la meme valeur activeTabId.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Les tabs sont en general pilotes par un seul id ou index actif.",
          "Ce state appartient le plus souvent au parent Tabs.",
          "Une source de verite unique garde triggers et panels synchronises.",
        ],
        verbalizePoints: [
          "Dire source de verite unique.",
          "Expliquer pourquoi plusieurs booleens sont un moins bon modele qu'un seul id actif.",
        ],
      },
    },
  });

  await upsertLessonQuestion({
    slug: "modal-needs-escape-focus-and-background-strategy",
    moduleId: reactCodingModule.id,
    primarySkillId: reactInteractionSkill.id,
    format: QuestionFormat.OPEN_ENDED,
    difficulty: 3,
    level: QuestionLevel.MID,
    translations: {
      en: {
        prompt:
          "When you describe a modal implementation in a React interview, which interaction and accessibility details should you mention beyond just showing and hiding it?",
        explanation:
          "A good modal answer should mention focus handling, keyboard escape, background interaction strategy and often rendering outside normal stacking constraints.",
        tlDr: "A modal is not just visibility state; it also needs focus, keyboard and background interaction decisions.",
        shortAnswer:
          "Beyond open state, a strong modal answer mentions focus management, closing on Escape, preventing background interaction or confusion, and often rendering with a portal to escape layout constraints.",
        lessonBody: `A modal interview answer becomes much stronger when it goes beyond "store isOpen in state and conditionally render".

Real modals affect keyboard users, focus order and background interaction. When the modal opens, focus should move into it. When it closes, focus often needs to return to the element that launched it. Escape handling is also a common expectation.

You should also think about the rest of the page. If the modal is active, background content should not remain confusingly interactive. And because modals often need to sit above other layout layers, portals are frequently mentioned as a rendering strategy.

The strong answer is to show that you understand both state and user interaction mechanics.`,
        commonMistakes: [
          "Reducing the modal to only an isOpen boolean.",
          "Ignoring keyboard and focus behavior.",
          "Forgetting background interaction or layering concerns.",
        ],
        exampleTitle: "State plus behavior",
        exampleLanguage: "tsx",
        exampleCode: `const [isOpen, setIsOpen] = useState(false);`,
        exampleExplanation:
          "This state is necessary, but a good modal answer also explains focus, Escape and layering behavior.",
        estimatedReadMinutes: 6,
        takeaways: [
          "A modal needs more than visibility state.",
          "Focus and keyboard behavior are core accessibility concerns.",
          "Background interaction and layering strategy matter too.",
        ],
        verbalizePoints: [
          "Mention focus movement and Escape key handling.",
          "Mention portal or layering strategy when relevant.",
        ],
      },
      fr: {
        prompt:
          "Quand tu decris une implementation de modal en entretien React, quels details d'interaction et d'accessibilite dois-tu citer au-dela du simple afficher/masquer ?",
        explanation:
          "Une bonne reponse sur les modals doit citer la gestion du focus, la touche Escape, la strategie d'interaction avec l'arriere-plan et souvent un rendu hors des contraintes de stacking normales.",
        tlDr: "Un modal n'est pas qu'un etat de visibilite; il demande aussi des decisions de focus, clavier et interaction avec l'arriere-plan.",
        shortAnswer:
          "Au-dela d'un state open, une bonne reponse sur un modal mentionne la gestion du focus, la fermeture avec Escape, la prevention d'une interaction confuse avec l'arriere-plan, et souvent l'usage d'un portal pour sortir des contraintes de layout.",
        lessonBody: `Une reponse d'entretien sur un modal devient bien meilleure quand elle depasse "je stocke isOpen dans un state et je fais un rendu conditionnel".

Un vrai modal affecte les utilisateurs clavier, l'ordre du focus et l'interaction avec l'arriere-plan. Quand le modal s'ouvre, le focus doit entrer dedans. Quand il se ferme, le focus doit souvent revenir a l'element qui l'avait ouvert. La gestion de la touche Escape fait aussi partie des attentes classiques.

Il faut egalement penser au reste de la page. Si le modal est actif, le contenu d'arriere-plan ne doit pas rester interatif de facon confuse. Et comme un modal doit souvent passer au-dessus d'autres couches de layout, les portals sont frequemment cites comme strategie de rendu.

La bonne reponse consiste a montrer que tu comprends a la fois le state et la mecanique d'interaction utilisateur.`,
        commonMistakes: [
          "Reduire le modal a un simple booleen isOpen.",
          "Ignorer le clavier et le comportement du focus.",
          "Oublier les problemes d'interaction d'arriere-plan ou de superposition.",
        ],
        exampleTitle: "Du state plus du comportement",
        exampleLanguage: "tsx",
        exampleCode: `const [isOpen, setIsOpen] = useState(false);`,
        exampleExplanation:
          "Ce state est necessaire, mais une bonne reponse modal explique aussi le focus, Escape et la strategie de layering.",
        estimatedReadMinutes: 6,
        takeaways: [
          "Un modal demande plus qu'un simple state de visibilite.",
          "Le focus et le clavier sont des enjeux d'accessibilite centraux.",
          "L'interaction avec l'arriere-plan et la strategie de layering comptent aussi.",
        ],
        verbalizePoints: [
          "Mentionner le deplacement du focus et la touche Escape.",
          "Mentionner le portal ou la strategie de superposition si pertinent.",
        ],
      },
    },
  });

  await upsertClosedQuestion({
    slug: "usememo-is-not-for-correctness",
    moduleId: reactCodingModule.id,
    primarySkillId: reactUiCodingSkill.id,
    format: QuestionFormat.SINGLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.MID,
    optionCorrectness: [false, true, false, false],
    translations: {
      en: {
        prompt: "What is the best interview-ready reason to reach for useMemo?",
        explanation:
          "useMemo is for avoiding unnecessary recalculation or stabilizing a derived value when that optimization matters, not for making incorrect logic become correct.",
        tlDr: "useMemo is an optimization tool, not a correctness fix.",
        shortAnswer:
          "The best reason is performance-oriented optimization of an expensive or stability-sensitive derived value. It should not be used to patch broken logic.",
        lessonBody: `useMemo is often overused because it sounds like a general-purpose React best practice. It is not.

Its main job is to memoize a derived value so React can avoid recomputing it on every render when the dependencies have not changed. That can help with expensive calculations or values whose identity matters to optimized children.

But if a component is logically wrong, useMemo does not make that logic correct. It only caches the result of whatever logic you already wrote.

The strong answer is to frame useMemo as a targeted optimization, not a magical fix for rerenders or stale reasoning.`,
        commonMistakes: [
          "Using useMemo as a reflex on every derived value.",
          "Claiming useMemo is required for correctness.",
          "Talking about optimization without saying what work is being avoided.",
        ],
        exampleTitle: "Memoize when the cost matters",
        exampleLanguage: "tsx",
        exampleCode: `const sortedUsers = useMemo(
  () => expensiveSort(users),
  [users],
);`,
        exampleExplanation:
          "The value is memoized because the sort is expensive, not because memoization is automatically required.",
        estimatedReadMinutes: 5,
        takeaways: [
          "useMemo is an optimization tool.",
          "It can reduce unnecessary recalculation or stabilize a derived value's identity.",
          "It should not be used as a correctness patch.",
        ],
        verbalizePoints: [
          "Say optimization, not magic.",
          "Name the expensive or stability-sensitive work being protected.",
        ],
      },
      fr: {
        prompt:
          "Quelle est la meilleure raison, solide en entretien, de recourir a useMemo ?",
        explanation:
          "useMemo sert a eviter des recalculs inutiles ou a stabiliser une valeur derivee quand cette optimisation compte, pas a rendre correcte une logique qui ne l'etait pas.",
        tlDr: "useMemo est un outil d'optimisation, pas un correctif de logique.",
        shortAnswer:
          "La meilleure raison est une optimisation orientee performance d'une valeur derivee couteuse ou sensible a la stabilite de reference. Cela ne doit pas servir a masquer une logique bancale.",
        lessonBody: `useMemo est souvent surutilise parce qu'il donne l'impression d'etre une bonne pratique React generale. Ce n'est pas le cas.

Son role principal est de memoizer une valeur derivee afin que React evite de la recalculer a chaque render tant que les dependances n'ont pas change. Cela peut aider pour des calculs couteux ou pour des valeurs dont l'identite compte pour des enfants optimises.

Mais si un composant est logiquement faux, useMemo ne rend pas cette logique correcte. Il se contente de mettre en cache le resultat de la logique deja ecrite.

La bonne reponse consiste a presenter useMemo comme une optimisation ciblee, pas comme un correctif magique contre les rerenders ou les raisonnements fragiles.`,
        commonMistakes: [
          "Utiliser useMemo par reflexe sur chaque valeur derivee.",
          "Pretendre que useMemo est necessaire pour la correction fonctionnelle.",
          "Parler d'optimisation sans dire quel travail est evite.",
        ],
        exampleTitle: "Memoizer quand le cout le justifie",
        exampleLanguage: "tsx",
        exampleCode: `const sortedUsers = useMemo(
  () => expensiveSort(users),
  [users],
);`,
        exampleExplanation:
          "La valeur est memoizee parce que le tri est couteux, pas parce que la memoization serait automatiquement obligatoire.",
        estimatedReadMinutes: 5,
        takeaways: [
          "useMemo est un outil d'optimisation.",
          "Il peut reduire des recalculs inutiles ou stabiliser l'identite d'une valeur derivee.",
          "Il ne doit pas servir de patch de correction logique.",
        ],
        verbalizePoints: [
          "Dire optimisation, pas magie.",
          "Nommer le travail couteux ou sensible a l'identite que l'on protege.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "Because React components are incorrect unless every derived value is wrapped in useMemo.",
          explanation:
            "Incorrect. useMemo is not a blanket correctness requirement.",
        },
        {
          label:
            "Because you want to avoid unnecessary recalculation or stabilize a derived value when that optimization matters.",
          explanation: "Correct. That is the best interview-ready reason.",
        },
        {
          label:
            "Because useMemo guarantees child components will never rerender again.",
          explanation: "Incorrect. It does not provide that guarantee.",
        },
        {
          label:
            "Because it makes stale closures impossible anywhere in the component.",
          explanation: "Incorrect. That is not what useMemo does.",
        },
      ],
      fr: [
        {
          label:
            "Parce que les composants React sont incorrects tant que chaque valeur derivee n'est pas enveloppee dans useMemo.",
          explanation:
            "Incorrect. useMemo n'est pas une exigence generale de correction.",
        },
        {
          label:
            "Parce qu'on veut eviter des recalculs inutiles ou stabiliser une valeur derivee quand cette optimisation compte.",
          explanation:
            "Correct. C'est la meilleure raison a donner en entretien.",
        },
        {
          label:
            "Parce que useMemo garantit que les composants enfants ne rerenderont plus jamais.",
          explanation: "Incorrect. Il ne donne pas une telle garantie.",
        },
        {
          label:
            "Parce qu'il rend les stale closures impossibles partout dans le composant.",
          explanation: "Incorrect. Ce n'est pas le role de useMemo.",
        },
      ],
    },
  });

  await upsertLessonQuestion({
    slug: "custom-hook-returns-state-and-actions",
    moduleId: reactCodingModule.id,
    primarySkillId: reactUiCodingSkill.id,
    format: QuestionFormat.CODE_OUTPUT,
    difficulty: 3,
    level: QuestionLevel.MID,
    translations: {
      en: {
        prompt:
          "If you sketch a custom React hook in an interview, what makes the returned API feel clean and useful rather than vague?",
        explanation:
          "A clean custom hook returns the state values and action functions the caller actually needs, with names that describe the behavior clearly.",
        tlDr: "A good custom hook API exposes useful state plus clear actions.",
        shortAnswer:
          "A good interview sketch returns the minimum useful state and the action functions that manipulate it, with names that reveal the behavior instead of exposing raw internal details.",
        lessonBody: `When candidates sketch custom hooks, they sometimes return a vague bag of implementation details. That makes the API harder to understand and harder to reuse.

A cleaner approach is to think from the caller's point of view. What state does the caller need to read? What actions does the caller need to trigger? Those are the pieces the hook should expose.

For example, a disclosure hook might return isOpen, open, close and toggle. That is much clearer than returning unrelated internal variables and asking the caller to reconstruct the behavior.

The strong answer is to say that a custom hook should expose a small contract: meaningful state plus named actions.`,
        commonMistakes: [
          "Returning every internal implementation detail from the hook.",
          "Using vague names that do not explain the behavior.",
          "Forgetting that the hook API should be designed from the caller's needs.",
        ],
        exampleTitle: "A small disclosure hook contract",
        exampleLanguage: "tsx",
        exampleCode: `function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((current) => !current),
  };
}`,
        exampleExplanation:
          "The API gives the caller the relevant state and the actions it actually needs.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Design custom hook APIs from the caller's needs.",
          "Expose meaningful state and named actions.",
          "Avoid leaking unnecessary internal details.",
        ],
        verbalizePoints: [
          "Say caller-facing contract.",
          "Explain why meaningful names make the hook easier to reuse.",
        ],
      },
      fr: {
        prompt:
          "Si tu esquisses un custom hook React en entretien, qu'est-ce qui rend l'API retournee propre et utile plutot que vague ?",
        explanation:
          "Un custom hook propre retourne les valeurs de state et les fonctions d'action dont le composant appelant a vraiment besoin, avec des noms qui decrivent clairement le comportement.",
        tlDr: "Un bon custom hook expose un state utile plus des actions claires.",
        shortAnswer:
          "Un bon sketch d'entretien retourne le state utile minimal et les fonctions d'action qui le manipulent, avec des noms qui revelent le comportement au lieu d'exposer des details internes bruts.",
        lessonBody: `Quand les candidats esquissent des custom hooks, ils renvoient parfois un sac vague de details d'implementation. Cela rend l'API plus difficile a comprendre et a reutiliser.

Une approche plus propre consiste a penser depuis le point de vue du composant appelant. Quel state doit-il lire ? Quelles actions doit-il declencher ? Ce sont ces pieces que le hook doit exposer.

Par exemple, un hook de disclosure peut retourner isOpen, open, close et toggle. C'est beaucoup plus clair que de renvoyer des variables internes heterogenes et de laisser le composant appelant reconstruire lui-meme le comportement.

La bonne reponse consiste a dire qu'un custom hook doit exposer un petit contrat: un state utile et des actions bien nommees.`,
        commonMistakes: [
          "Retourner chaque detail interne d'implementation du hook.",
          "Utiliser des noms vagues qui n'expliquent pas le comportement.",
          "Oublier que l'API du hook doit etre concue depuis les besoins du composant appelant.",
        ],
        exampleTitle: "Un petit contrat de hook disclosure",
        exampleLanguage: "tsx",
        exampleCode: `function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((current) => !current),
  };
}`,
        exampleExplanation:
          "L'API donne au composant appelant le state pertinent et les actions dont il a vraiment besoin.",
        estimatedReadMinutes: 5,
        takeaways: [
          "Concevoir les APIs de custom hooks depuis les besoins du composant appelant.",
          "Exposer un state utile et des actions bien nommees.",
          "Eviter de fuiter des details internes inutiles.",
        ],
        verbalizePoints: [
          "Dire contrat oriente composant appelant.",
          "Expliquer pourquoi des noms explicites rendent le hook plus reusable.",
        ],
      },
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
      tlDr: "A changed key tells React that the old component instance is gone and a new one should be mounted.",
      shortAnswer:
        "No. A new key does not mean React rerenders the same instance. It means React treats the element as a different identity and remounts it.",
      lessonBody: `Beginners often hear that changing a key can force React to update the UI. That sentence is too vague and usually leads to the wrong mental model.

In React, a key is first an identity signal. During reconciliation, React uses that identity to decide whether it should keep the current component instance or replace it with a new one.

If the key changes, React does not continue with the same component instance. It unmounts the previous one and mounts a fresh instance in its place. That means local state, refs and effects are recreated.

This is why using keys as a generic rerender trick is dangerous. Sometimes it appears to solve a UI issue, but the real effect is much stronger than a simple render pass because it throws away the old component instance.`,
      commonMistakes: [
        "Saying that key changes always mean a normal rerender.",
        "Forgetting that remounting resets local state and effects.",
        "Using keys as a generic escape hatch instead of fixing the data flow.",
      ],
      exampleTitle: "Identity change vs rerender",
      exampleLanguage: "tsx",
      exampleCode: `function Demo({ userId }: { userId: string }) {
  return <ProfileForm key={userId} userId={userId} />;
}`,
      exampleExplanation:
        "When userId changes, ProfileForm is remounted because its key changed. The previous instance does not survive.",
      estimatedReadMinutes: 5,
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
      tlDr: "Une key differente dit a React que l'ancienne instance n'est plus la meme et qu'il faut monter une nouvelle instance.",
      shortAnswer:
        "Non. Une nouvelle key ne fait pas rerender la meme instance. React considere que l'identite a change et remonte le composant.",
      lessonBody: `Au debut, on entend souvent que changer une key permet de forcer React a mettre a jour l'interface. Cette phrase est trop floue et conduit souvent au mauvais modele mental.

Dans React, une key sert d'abord de signal d'identite. Pendant la reconciliation, React s'en sert pour savoir s'il doit conserver l'instance actuelle du composant ou la remplacer par une nouvelle.

Si la key change, React ne continue pas avec la meme instance. Il demonte l'ancienne puis monte une instance neuve a sa place. Le state local, les refs et les effets repartent donc de zero.

C'est pour ca qu'utiliser les keys comme un hack generique de rerender est dangereux. Parfois l'UI semble corrigee, mais l'effet reel est beaucoup plus fort qu'un simple render: on jette toute l'instance precedente.`,
      commonMistakes: [
        "Dire qu'un changement de key produit toujours un rerender normal.",
        "Oublier qu'un remount reinitialise le state local et les effets.",
        "Utiliser les keys comme echappatoire au lieu de corriger le flux de donnees.",
      ],
      exampleTitle: "Changement d'identite vs rerender",
      exampleLanguage: "tsx",
      exampleCode: `function Demo({ userId }: { userId: string }) {
  return <ProfileForm key={userId} userId={userId} />;
}`,
      exampleExplanation:
        "Quand userId change, ProfileForm est remonte parce que sa key change. L'ancienne instance ne survit pas.",
      estimatedReadMinutes: 5,
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
      tlDr: "React compares dependency identity, not deep content, so a new array reference retriggers the effect.",
      shortAnswer:
        "Because every render creates a fresh array object. Even if the array looks the same, its reference is different, so React sees the dependency as changed.",
      lessonBody: `This question is really about identity, not about arrays specifically.

When React checks a dependency array, it does not look inside objects or arrays to compare all nested values. It checks whether each dependency is the same value as before. For objects and arrays, that means reference equality.

If you write an inline array during render, a new array instance is created every time the component runs. React then compares the previous reference with the new reference, sees that they are different, and reruns the effect.

The important interview point is not "always use useMemo". The important point is to explain why the identity changes and then pick the clearest fix. Sometimes the best fix is memoization. Sometimes the best fix is to derive less, move logic, or depend on primitive values instead.`,
      commonMistakes: [
        "Claiming that React deep-compares arrays in dependencies.",
        "Using memoization by reflex without explaining the identity problem first.",
        "Forgetting that inline objects behave the same way as inline arrays.",
      ],
      exampleTitle: "Inline array dependency",
      exampleLanguage: "tsx",
      exampleCode: `function Example({ id }: { id: string }) {
  const filters = ["active", id];

  useEffect(() => {
    console.log("effect runs again");
  }, [filters]);
}`,
      exampleExplanation:
        "filters is recreated on every render, so the effect sees a new dependency reference each time.",
      estimatedReadMinutes: 6,
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
      tlDr: "React compare l'identite des dependances, pas leur contenu profond, donc une nouvelle reference de tableau relance l'effet.",
      shortAnswer:
        "Parce qu'a chaque render tu recrees un nouvel objet tableau. Meme si son contenu parait identique, sa reference change, donc React considere que la dependance a change.",
      lessonBody: `Cette question parle surtout d'identite, pas du tableau lui-meme.

Quand React verifie un tableau de dependances, il n'ouvre pas les objets et les tableaux pour comparer toutes leurs valeurs internes. Il verifie si chaque dependance est la meme qu'au render precedent. Pour les objets et tableaux, cela revient a comparer les references.

Si tu ecris un tableau inline pendant le render, une nouvelle instance est creee a chaque execution du composant. React compare alors l'ancienne reference a la nouvelle, voit qu'elles sont differentes, puis relance l'effet.

Le point important en entretien n'est pas de dire "il faut toujours mettre useMemo". Le point important est d'expliquer pourquoi l'identite change, puis de choisir le correctif le plus clair. Parfois ce sera la memoization. Parfois il vaut mieux dependre de primitives ou simplifier la logique.`,
      commonMistakes: [
        "Affirmer que React fait une deep comparison des tableaux dans les deps.",
        "Declencher un useMemo reflexe sans expliquer d'abord le probleme d'identite.",
        "Oublier que les objets inline ont exactement le meme probleme.",
      ],
      exampleTitle: "Dependance sur un tableau inline",
      exampleLanguage: "tsx",
      exampleCode: `function Example({ id }: { id: string }) {
  const filters = ["active", id];

  useEffect(() => {
    console.log("effect reruns");
  }, [filters]);
}`,
      exampleExplanation:
        "filters est recree a chaque render, donc l'effet voit une nouvelle reference a chaque fois.",
      estimatedReadMinutes: 6,
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
        label: "Because the array reference changes on every render.",
        explanation: "That is the main reason the effect retriggers.",
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
        label: "Parce que la reference du tableau change a chaque render.",
        explanation: "Oui, c'est la raison principale du redeclenchement.",
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
      tlDr: "Type inference stays useful when related props share the same generic parameter instead of being widened to any.",
      shortAnswer:
        "Inference survives when your component keeps one clear generic parameter flowing through items, callbacks and helper props such as keys or renderers.",
      lessonBody: `A lot of TypeScript interview answers become fuzzy because candidates talk about generics in the abstract. A stronger answer starts from the API shape.

If a component receives items of type T, then callbacks that read an item should usually also receive T. A getKey function, a renderItem callback, or an onSelect callback are all chances to preserve that same type information.

Inference becomes weaker when you widen one part of the API to any, unknown used carelessly, or a broad union that disconnects the props from each other. The compiler can no longer see how the pieces relate.

In interviews, the clean explanation is that a good generic component keeps one useful type parameter flowing through the whole contract. That is what lets callers get autocomplete and type safety without writing explicit generic annotations everywhere.`,
      commonMistakes: [
        "Thinking that any makes a generic API more flexible.",
        "Using a generic parameter in only one prop, which gives callers little value.",
        "Forgetting that typed callbacks are one of the strongest ways to preserve inference.",
      ],
      exampleTitle: "A generic list API with preserved inference",
      exampleLanguage: "tsx",
      exampleCode: `type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
};`,
      exampleExplanation:
        "The same T is shared by the collection and both callbacks, so callers keep strong inference.",
      estimatedReadMinutes: 6,
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
      tlDr: "L'inference reste utile quand plusieurs props reliees partagent le meme parametre generique au lieu d'etre elargies en any.",
      shortAnswer:
        "L'inference tient quand le composant fait circuler un parametre T clair dans items, callbacks et props auxiliaires comme getKey ou renderItem.",
      lessonBody: `Beaucoup de reponses d'entretien sur TypeScript restent floues parce qu'elles parlent des generics de facon trop abstraite. Une meilleure reponse part de la forme reelle de l'API.

Si un composant recoit des items de type T, alors les callbacks qui lisent un item devraient en general recevoir eux aussi T. Une fonction getKey, un renderItem ou un onSelect sont autant d'endroits qui permettent de conserver la meme information de type.

L'inference se degrade quand on elargit une partie de l'API en any, en unknown mal utilise ou en union trop large qui coupe le lien entre les props. Le compilateur ne voit plus comment les pieces se correspondent.

En entretien, la bonne explication est qu'un bon composant generique laisse circuler un type parameter utile dans tout le contrat. C'est ce qui permet au code appelant de garder l'autocompletion et la surete de type sans annotations generiques partout.`,
      commonMistakes: [
        "Croire que any rend une API generique plus flexible.",
        "Utiliser un parametre generique dans une seule prop, ce qui apporte peu de valeur.",
        "Oublier que les callbacks bien types sont un des meilleurs moyens de conserver l'inference.",
      ],
      exampleTitle: "API de liste generique avec inference preservee",
      exampleLanguage: "tsx",
      exampleCode: `type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
};`,
      exampleExplanation:
        "Le meme T est partage par la collection et les callbacks, donc le code appelant garde une inference forte.",
      estimatedReadMinutes: 6,
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

  await upsertClosedQuestion({
    slug: "unknown-beats-any-at-boundaries",
    moduleId: typeScriptModule.id,
    primarySkillId: tsBoundarySkill.id,
    format: QuestionFormat.MULTIPLE_CHOICE,
    difficulty: 2,
    level: QuestionLevel.JUNIOR,
    optionCorrectness: [true, false, true, false],
    translations: {
      en: {
        prompt:
          "Which statements explain why unknown is usually safer than any at a TypeScript boundary such as API data or third-party input?",
        explanation:
          "unknown forces you to narrow before use, while any removes checking and lets unsafe assumptions spread through the codebase.",
        tlDr: "unknown keeps uncertainty explicit; any hides it and weakens the rest of the program.",
        shortAnswer:
          "unknown is safer because it preserves the fact that the data is not trusted yet, so you must validate or narrow it before using it as a real type.",
        lessonBody: `This is one of the most practical TypeScript interview questions because it reveals whether you understand trust boundaries.

Data coming from an API, localStorage, the URL, or a third-party library is not automatically trustworthy. If you label it as any, TypeScript stops protecting you and the uncertainty leaks through the rest of your component tree.

unknown is different. It says, "we have a value, but we have not proved what it is yet." That forces you to narrow the value with runtime checks, schema validation, or safer branching before you treat it as a specific shape.

The strong interview answer is to connect unknown to safety at the boundary. Keep uncertainty explicit at the edge, then narrow it before it enters the trusted typed core of your app.`,
        commonMistakes: [
          "Saying any is more professional because it avoids friction.",
          "Using unknown but then casting immediately without a real check.",
          "Discussing types without naming the trust boundary itself.",
        ],
        exampleTitle: "Parse first, trust later",
        exampleLanguage: "ts",
        exampleCode: `const raw: unknown = await response.json();

if (isUser(raw)) {
  renderUser(raw);
}`,
        exampleExplanation:
          "The value stays uncertain until a runtime check proves it matches the expected shape.",
        estimatedReadMinutes: 5,
        takeaways: [
          "unknown preserves uncertainty at the boundary.",
          "any removes type safety and lets unsafe assumptions spread.",
          "The safe path is boundary -> validate or narrow -> trusted typed value.",
        ],
        verbalizePoints: [
          "Use the phrase trust boundary.",
          "Explain that unknown forces proof before use.",
        ],
      },
      fr: {
        prompt:
          "Quelles affirmations expliquent pourquoi unknown est en general plus sur que any a une frontiere TypeScript, par exemple pour des donnees API ou une entree tierce ?",
        explanation:
          "unknown oblige a faire du narrowing avant usage, alors que any supprime les verifications et laisse les hypothèses dangereuses se propager dans le code.",
        tlDr: "unknown garde l'incertitude explicite; any la masque et affaiblit le reste du programme.",
        shortAnswer:
          "unknown est plus sur parce qu'il preserve le fait que la donnee n'est pas encore digne de confiance, donc il faut la valider ou la raffiner avant de l'utiliser comme un vrai type.",
        lessonBody: `C'est une question TypeScript tres pratique en entretien parce qu'elle montre si tu comprends les frontieres de confiance.

Une donnee qui vient d'une API, du localStorage, de l'URL ou d'une librairie tierce n'est pas automatiquement fiable. Si tu la tapes en any, TypeScript arrete de te proteger et l'incertitude se propage dans le reste de ton arbre de composants.

unknown fonctionne autrement. Il dit: "on a bien une valeur, mais on n'a pas encore prouve ce qu'elle est." Cela oblige a faire du narrowing avec des checks runtime, une validation de schema ou des branches plus sures avant de la traiter comme une forme precise.

La bonne reponse d'entretien consiste a relier unknown a la securite de frontiere. Il faut garder l'incertitude explicite a l'entree, puis la raffiner avant qu'elle n'entre dans le coeur type de l'application.`,
        commonMistakes: [
          "Dire que any est plus professionnel parce qu'il evite les frictions.",
          "Utiliser unknown puis caster immediatement sans vrai check.",
          "Parler des types sans nommer la frontiere de confiance.",
        ],
        exampleTitle: "Parser d'abord, faire confiance ensuite",
        exampleLanguage: "ts",
        exampleCode: `const raw: unknown = await response.json();

if (isUser(raw)) {
  renderUser(raw);
}`,
        exampleExplanation:
          "La valeur reste incertaine tant qu'un check runtime n'a pas prouve qu'elle correspond a la forme attendue.",
        estimatedReadMinutes: 5,
        takeaways: [
          "unknown preserve l'incertitude a la frontiere.",
          "any supprime la surete de type et laisse se propager des hypotheses dangereuses.",
          "Le chemin sur est: frontiere -> validation ou narrowing -> valeur typee de confiance.",
        ],
        verbalizePoints: [
          "Utiliser l'expression frontiere de confiance.",
          "Expliquer que unknown oblige a prouver avant usage.",
        ],
      },
    },
    optionTranslations: {
      en: [
        {
          label:
            "unknown forces you to narrow or validate before you can safely use the value.",
          explanation:
            "Correct. That is why it keeps uncertainty explicit at the boundary.",
        },
        {
          label:
            "any is safer because it gives TypeScript more freedom to infer the right shape later.",
          explanation:
            "Incorrect. any removes meaningful checking instead of improving it.",
        },
        {
          label:
            "unknown is a good fit for untrusted input because it stops you from treating the value as already proven.",
          explanation: "Correct. That is exactly the trust-boundary benefit.",
        },
        {
          label:
            "unknown and any behave the same once the codebase gets large enough.",
          explanation:
            "Incorrect. They lead to very different safety guarantees.",
        },
      ],
      fr: [
        {
          label:
            "unknown oblige a raffiner ou valider avant de pouvoir utiliser la valeur en toute securite.",
          explanation:
            "Correct. C'est pour cela qu'il garde l'incertitude explicite a la frontiere.",
        },
        {
          label:
            "any est plus sur parce qu'il donne plus de liberte a TypeScript pour inferer plus tard la bonne forme.",
          explanation:
            "Incorrect. any supprime les verifications utiles au lieu de les ameliorer.",
        },
        {
          label:
            "unknown convient bien a une entree non fiable parce qu'il empeche de traiter la valeur comme deja prouvee.",
          explanation:
            "Correct. C'est exactement le benefice de frontiere de confiance.",
        },
        {
          label:
            "unknown et any se comportent pareil une fois que le codebase devient assez grand.",
          explanation:
            "Incorrect. Ils conduisent a des garanties de surete tres differentes.",
        },
      ],
    },
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
      tlDr: "Push back when copied state creates a second source of truth for a value that could stay derived during render.",
      shortAnswer:
        "If the component can recompute the value from props or existing state, do not mirror it into local state. Store only the real source of truth.",
      lessonBody: `Derived state is one of the most common beginner traps because copying data feels safe at first.

The real question is: who owns the truth? If a filtered list, a sorted list, or a computed flag can be calculated from props and existing state during render, creating a second local copy usually makes the component harder to reason about.

Once the component owns both the original input and a copied interpretation of that input, those values can drift apart. Then you need more effects, more synchronization logic, and more edge-case handling just to keep the copies aligned.

The cleaner pattern is to store only the minimal state that users truly change directly. Everything else should stay derived from that source of truth whenever the component renders.`,
      commonMistakes: [
        "Copying props into state because it feels easier to update later.",
        "Adding effects only to keep duplicated state in sync.",
        "Calling every computed value state even when it can be derived on demand.",
      ],
      exampleTitle: "Store the source, derive the rest",
      exampleLanguage: "tsx",
      exampleCode: `const visibleItems = items.filter((item) =>
  item.label.toLowerCase().includes(search.toLowerCase()),
);`,
      exampleExplanation:
        "If visibleItems can be derived from items and search, it usually should not live in separate local state.",
      estimatedReadMinutes: 5,
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
      tlDr: "Il faut s'opposer au derived state quand la copie locale cree une deuxieme source de verite pour une valeur qui peut rester derivee au render.",
      shortAnswer:
        "Si le composant peut recalculer la valeur a partir des props ou d'un state existant, il ne faut pas la dupliquer dans un state local. Il faut stocker uniquement la vraie source de verite.",
      lessonBody: `Le derived state fait partie des pieges les plus frequents chez les debutants parce que recopier des donnees semble rassurant au debut.

La vraie question est: qui possede la verite ? Si une liste filtree, une liste triee ou un indicateur calcule peut etre determine a partir des props et du state existant pendant le render, creer une seconde copie locale complique souvent inutilement le composant.

Des que le composant possede a la fois l'entree d'origine et une interpretation copiee de cette entree, les deux peuvent diverger. Il faut alors ajouter des effets, de la synchronisation et de la gestion de cas limites juste pour garder les copies alignees.

Le pattern le plus propre consiste a stocker seulement le state minimal que l'utilisateur modifie vraiment. Tout le reste doit rester derive a partir de cette source de verite a chaque render.`,
      commonMistakes: [
        "Recopier des props dans le state parce que cela semble plus simple a mettre a jour ensuite.",
        "Ajouter des effets uniquement pour recoller un state duplique.",
        "Appeler state toute valeur calculee alors qu'elle peut etre derivee a la demande.",
      ],
      exampleTitle: "Stocker la source, deriver le reste",
      exampleLanguage: "tsx",
      exampleCode: `const visibleItems = items.filter((item) =>
  item.label.toLowerCase().includes(search.toLowerCase()),
);`,
      exampleExplanation:
        "Si visibleItems peut etre derive depuis items et search, il ne doit en general pas vivre dans un state local separe.",
      estimatedReadMinutes: 5,
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
      tlDr: "A stable callback is only a good answer if it stays honest about the data it depends on.",
      shortAnswer:
        "Use a stable callback when reference stability matters, but keep real dependencies explicit instead of deleting them to silence rerenders.",
      lessonBody: `This kind of question is often answered with a reflexive useCallback example. That is not enough.

The interviewer usually wants to know whether you understand why callback identity matters and when it actually helps. A stable callback can reduce needless rerenders in memoized children, but only if the callback still uses up-to-date values.

If the callback reads changing data, those dependencies must stay visible in the dependency array. Removing them blindly may produce a stable function reference, but the logic inside that function becomes stale.

The strongest answer is to show a small explicit snippet and explain the tradeoff: reference stability is useful, but correctness comes first.`,
      commonMistakes: [
        "Using useCallback everywhere without a clear reason.",
        "Removing dependencies just to make the function reference stable.",
        "Talking about optimization without mentioning stale closures.",
      ],
      exampleTitle: "Stable callback with honest dependencies",
      exampleLanguage: "tsx",
      exampleCode: `const handleSelect = useCallback(
  (id: string) => {
    onSelect(id, filter);
  },
  [onSelect, filter],
);`,
      exampleExplanation:
        "The callback can still be memoized while remaining correct about the values it reads.",
      estimatedReadMinutes: 5,
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
      tlDr: "Une callback stable n'est une bonne reponse que si elle reste honnete sur les donnees dont elle depend.",
      shortAnswer:
        "Il faut utiliser une callback stable quand la stabilite de reference a un interet, mais en gardant les vraies dependances visibles au lieu de les supprimer pour faire taire les rerenders.",
      lessonBody: `Ce genre de question recoit souvent une reponse reflexe avec useCallback. Ce n'est pas suffisant.

En general, l'interviewer veut voir si tu comprends pourquoi l'identite d'une callback compte et dans quels cas elle aide vraiment. Une callback stable peut eviter des rerenders inutiles dans des enfants memoizes, mais seulement si elle lit encore des valeurs a jour.

Si la callback depend de donnees qui changent, ces dependances doivent rester visibles dans le tableau. Les retirer aveuglement peut produire une reference stable, mais la logique a l'interieur devient obsolete.

La meilleure reponse montre un petit snippet explicite et explique le compromis: la stabilite de reference est utile, mais la correction du comportement passe d'abord.`,
      commonMistakes: [
        "Utiliser useCallback partout sans raison claire.",
        "Supprimer des dependances uniquement pour stabiliser la reference.",
        "Parler d'optimisation sans mentionner les stale closures.",
      ],
      exampleTitle: "Callback stable avec dependances honnetes",
      exampleLanguage: "tsx",
      exampleCode: `const handleSelect = useCallback(
  (id: string) => {
    onSelect(id, filter);
  },
  [onSelect, filter],
);`,
      exampleExplanation:
        "La callback peut etre memoizee tout en restant correcte sur les valeurs qu'elle lit.",
      estimatedReadMinutes: 5,
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
      tlDr: "React only uses the function returned by useEffect as cleanup, not a function returned from an inner async helper.",
      shortAnswer:
        "The bug is that the timeout cleanup is returned from inside the async helper instead of from the effect itself, so React never runs it as the real cleanup.",
      lessonBody: `Bug hunt questions are really tests of reading discipline.

The first thing to say is what React expects: an effect may return one cleanup function directly from the effect callback. React does not inspect random inner helpers and does not adopt their return values as cleanups.

In this snippet, the timeout is created inside an async helper. That helper returns a function, but the effect itself returns nothing. So when the component unmounts or the dependency changes, React has no cleanup to call for that timer.

The correct fix is to keep the timer in the effect scope and return a cleanup directly from the effect. A strong interview answer names both the lifecycle bug and the user-visible risk: stale work can continue after the component should have stopped it.`,
      commonMistakes: [
        "Pointing to the async keyword without explaining the cleanup contract.",
        "Describing the bug as only a performance issue instead of a lifecycle issue.",
        "Proposing a fix without naming why React ignores the returned inner function.",
      ],
      exampleTitle: "Correct cleanup shape",
      exampleLanguage: "tsx",
      exampleCode: `useEffect(() => {
  const timer = window.setTimeout(() => {
    console.log("sync", query);
  }, 300);

  return () => {
    window.clearTimeout(timer);
  };
}, [query]);`,
      exampleExplanation:
        "Now the effect itself returns the cleanup, so React can call it on dependency changes or unmount.",
      estimatedReadMinutes: 7,
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
      tlDr: "React n'utilise comme cleanup que la fonction retournee directement par useEffect, pas celle d'un helper async interne.",
      shortAnswer:
        "Le bug est que le cleanup du timeout est retourne depuis le helper async au lieu d'etre retourne par l'effet lui-meme, donc React ne l'execute jamais comme vrai cleanup.",
      lessonBody: `Les questions de bug hunt testent surtout la discipline de lecture.

La premiere chose a dire est ce que React attend: un effet peut retourner une fonction de cleanup directement depuis la callback de useEffect. React ne va pas inspecter des helpers internes ni adopter leur valeur de retour comme cleanup.

Dans ce snippet, le timeout est cree dans un helper async. Ce helper retourne bien une fonction, mais l'effet lui-meme ne retourne rien. Quand le composant se demonte ou quand la dependance change, React n'a donc aucun cleanup a appeler pour ce timer.

Le bon correctif consiste a garder le timer dans la portee de l'effet et a retourner un cleanup directement depuis useEffect. Une bonne reponse d'entretien nomme a la fois le bug de cycle de vie et le risque visible: un travail obsolete peut continuer alors que le composant aurait du l'arreter.`,
      commonMistakes: [
        "Pointer le mot cle async sans expliquer le contrat de cleanup.",
        "Decrire le bug comme un simple probleme de performance au lieu d'un probleme de cycle de vie.",
        "Proposer un correctif sans expliquer pourquoi React ignore la fonction retournee par le helper interne.",
      ],
      exampleTitle: "Bonne forme de cleanup",
      exampleLanguage: "tsx",
      exampleCode: `useEffect(() => {
  const timer = window.setTimeout(() => {
    console.log("sync", query);
  }, 300);

  return () => {
    window.clearTimeout(timer);
  };
}, [query]);`,
      exampleExplanation:
        "L'effet retourne maintenant lui-meme le cleanup, donc React peut l'appeler au changement de dependance ou au demontage.",
      estimatedReadMinutes: 7,
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

  const reactFoundationsCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-interview-foundations",
    },
    update: {
      order: 1,
    },
    create: {
      slug: "react-interview-foundations",
      order: 1,
    },
  });

  await upsertQuestionCollectionTranslations(reactFoundationsCollection.id, {
    en: {
      title: "React Interview Foundations",
      description:
        "A starter collection for candidates who need clean mental models on rendering, state and identity before moving to harder drills.",
      summary:
        "The first collection to read when you want React answers that stay precise and beginner-friendly.",
    },
    fr: {
      title: "Fondamentaux React pour entretien",
      description:
        "Une collection de depart pour les candidats qui ont besoin de modeles mentaux propres sur le rendu, le state et l'identite avant les drills plus difficiles.",
      summary:
        "La premiere collection a lire pour construire des reponses React precises et accessibles aux debutants.",
    },
  });

  await syncQuestionCollectionItems(reactFoundationsCollection.id, [
    "jsx-is-a-ui-description",
    "props-are-read-only-inputs",
    "controlled-input-keeps-react-in-charge",
    "functional-state-update-prevents-stale-count",
    "lift-state-to-common-parent",
    "context-reduces-prop-drilling-not-all-state",
    "index-key-breaks-item-identity",
    "keys-do-not-force-rerender",
    "derived-state-pushback-open-answer",
    "effect-array-reference",
  ]);

  const hooksAndEffectsCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-hooks-and-effects",
    },
    update: {
      order: 2,
    },
    create: {
      slug: "react-hooks-and-effects",
      order: 2,
    },
  });

  await upsertQuestionCollectionTranslations(hooksAndEffectsCollection.id, {
    en: {
      title: "React Hooks and Effects",
      description:
        "Focused drills on dependency arrays, stale logic, cleanup and the reasoning that interviewers want to hear.",
      summary:
        "Built to make useEffect answers less superstitious and more mechanical.",
    },
    fr: {
      title: "Hooks et effets React",
      description:
        "Des drills cibles sur les dependency arrays, la logique obsolete, le cleanup et le raisonnement qu'un interviewer attend.",
      summary:
        "Concu pour rendre les reponses sur useEffect moins magiques et beaucoup plus mecaniques.",
    },
  });

  await syncQuestionCollectionItems(hooksAndEffectsCollection.id, [
    "effect-array-reference",
    "empty-deps-effect-runs-after-first-commit",
    "useref-persists-without-triggering-render",
    "useeffect-vs-uselayouteffect-timing",
    "custom-hook-reuses-logic-not-state",
    "stable-callback-code-sketch",
    "fetch-race-condition-bug-hunt",
    "effect-cleanup-bug-hunt",
  ]);

  const answerDefenseCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-answer-defense-starter",
    },
    update: {
      order: 3,
    },
    create: {
      slug: "react-answer-defense-starter",
      order: 3,
    },
  });

  await upsertQuestionCollectionTranslations(answerDefenseCollection.id, {
    en: {
      title: "React Answer Defense Starter",
      description:
        "A mixed collection for people who want more than multiple choice and need to defend a decision in writing or from code.",
      summary:
        "Use this collection to move from recognition to explanation and technical defense.",
    },
    fr: {
      title: "Starter de defense de reponse React",
      description:
        "Une collection mixte pour les profils qui veulent aller au-dela du choix multiple et apprendre a defendre une decision a l'ecrit ou a partir d'un snippet.",
      summary:
        "Utilise cette collection pour passer de la simple reconnaissance a la vraie explication technique.",
    },
  });

  await syncQuestionCollectionItems(answerDefenseCollection.id, [
    "context-reduces-prop-drilling-not-all-state",
    "derived-state-pushback-open-answer",
    "stable-callback-code-sketch",
    "fetch-race-condition-bug-hunt",
    "effect-cleanup-bug-hunt",
    "generic-component-inference-signals",
  ]);

  const beginnerCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-beginner-first-steps",
    },
    update: {
      order: 4,
    },
    create: {
      slug: "react-beginner-first-steps",
      order: 4,
    },
  });

  await upsertQuestionCollectionTranslations(beginnerCollection.id, {
    en: {
      title: "React Beginner First Steps",
      description:
        "A beginner-friendly sequence that explains JSX, props, shared state and early hook reasoning without assuming prior interview vocabulary.",
      summary:
        "Start here when you want React answers that teach the mechanism slowly and clearly.",
    },
    fr: {
      title: "Premiers pas React pour debutants",
      description:
        "Une sequence accessible qui explique JSX, les props, le state partage et les premiers hooks sans supposer un vocabulaire d'entretien deja solide.",
      summary:
        "Commence ici si tu veux des reponses React qui construisent le mecanisme pas a pas.",
    },
  });

  await syncQuestionCollectionItems(beginnerCollection.id, [
    "jsx-is-a-ui-description",
    "props-are-read-only-inputs",
    "controlled-input-keeps-react-in-charge",
    "functional-state-update-prevents-stale-count",
    "lift-state-to-common-parent",
    "custom-hook-reuses-logic-not-state",
  ]);

  const debuggingCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-debugging-and-race-conditions",
    },
    update: {
      order: 5,
    },
    create: {
      slug: "react-debugging-and-race-conditions",
      order: 5,
    },
  });

  await upsertQuestionCollectionTranslations(debuggingCollection.id, {
    en: {
      title: "React Debugging and Race Conditions",
      description:
        "A practical collection on cleanup, stale async work and reading suspicious React snippets with discipline.",
      summary:
        "Built for learners who need to explain not only what is broken, but why the bug happens.",
    },
    fr: {
      title: "Debug React et race conditions",
      description:
        "Une collection pratique sur le cleanup, les effets asynchrones obsoletes et la lecture rigoureuse de snippets React suspects.",
      summary:
        "Concue pour les apprenants qui doivent expliquer non seulement ce qui casse, mais aussi pourquoi le bug apparait.",
    },
  });

  await syncQuestionCollectionItems(debuggingCollection.id, [
    "useeffect-vs-uselayouteffect-timing",
    "empty-deps-effect-runs-after-first-commit",
    "fetch-race-condition-bug-hunt",
    "effect-cleanup-bug-hunt",
    "stable-callback-code-sketch",
  ]);

  const stateFormsCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-state-and-forms-basics",
    },
    update: {
      order: 6,
    },
    create: {
      slug: "react-state-and-forms-basics",
      order: 6,
    },
  });

  await upsertQuestionCollectionTranslations(stateFormsCollection.id, {
    en: {
      title: "React State and Forms Basics",
      description:
        "A guided sequence on state snapshots, controlled inputs and shared state for learners who need the fundamentals explained slowly.",
      summary:
        "Built for beginners who want to understand where values live and how updates flow through React.",
    },
    fr: {
      title: "Bases React state et formulaires",
      description:
        "Une sequence guidee sur les snapshots de state, les inputs controles et le state partage pour les apprenants qui ont besoin d'une explication lente et claire.",
      summary:
        "Concue pour les debutants qui veulent comprendre ou vivent les valeurs et comment les mises a jour circulent dans React.",
    },
  });

  await syncQuestionCollectionItems(stateFormsCollection.id, [
    "props-are-read-only-inputs",
    "controlled-input-keeps-react-in-charge",
    "functional-state-update-prevents-stale-count",
    "lift-state-to-common-parent",
    "context-reduces-prop-drilling-not-all-state",
  ]);

  const effectLifecycleCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-refs-and-effect-lifecycle",
    },
    update: {
      order: 7,
    },
    create: {
      slug: "react-refs-and-effect-lifecycle",
      order: 7,
    },
  });

  await upsertQuestionCollectionTranslations(effectLifecycleCollection.id, {
    en: {
      title: "React Refs and Effect Lifecycle",
      description:
        "A progression on mount timing, refs, layout timing and effect cleanup for learners who want a concrete mental model.",
      summary:
        "Use this collection to replace vague hook intuition with lifecycle mechanics.",
    },
    fr: {
      title: "Refs React et cycle de vie des effets",
      description:
        "Une progression sur le timing de montage, les refs, le layout timing et le cleanup pour les apprenants qui veulent un modele mental concret.",
      summary:
        "Utilise cette collection pour remplacer l'intuition floue sur les hooks par de vrais mecanismes de cycle de vie.",
    },
  });

  await syncQuestionCollectionItems(effectLifecycleCollection.id, [
    "empty-deps-effect-runs-after-first-commit",
    "useref-persists-without-triggering-render",
    "useeffect-vs-uselayouteffect-timing",
    "effect-array-reference",
    "fetch-race-condition-bug-hunt",
    "effect-cleanup-bug-hunt",
  ]);

  const tsBoundariesCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "typescript-react-boundaries",
    },
    update: {
      order: 8,
    },
    create: {
      slug: "typescript-react-boundaries",
      order: 8,
    },
  });

  await upsertQuestionCollectionTranslations(tsBoundariesCollection.id, {
    en: {
      title: "TypeScript Boundaries for React",
      description:
        "A compact collection on inference, safer unknown boundaries and practical TypeScript reasoning for React APIs.",
      summary:
        "Read this when you want TypeScript answers that sound precise without becoming abstract.",
    },
    fr: {
      title: "Frontieres TypeScript pour React",
      description:
        "Une collection compacte sur l'inference, les frontieres unknown plus sures et le raisonnement TypeScript pratique pour les APIs React.",
      summary:
        "A lire quand tu veux des reponses TypeScript precises sans tomber dans l'abstraction.",
    },
  });

  await syncQuestionCollectionItems(tsBoundariesCollection.id, [
    "unknown-beats-any-at-boundaries",
    "generic-component-inference-signals",
  ]);

  const rnListsCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-native-list-performance",
    },
    update: {
      order: 9,
    },
    create: {
      slug: "react-native-list-performance",
      order: 9,
    },
  });

  await upsertQuestionCollectionTranslations(rnListsCollection.id, {
    en: {
      title: "React Native List Performance",
      description:
        "Core React Native list questions on virtualization, key stability and explaining why long mobile lists behave differently.",
      summary:
        "A starter pack for candidates who need stronger RN list reasoning than generic web React answers.",
    },
    fr: {
      title: "Performance des listes React Native",
      description:
        "Des questions React Native sur la virtualisation, la stabilite des keys et la raison pour laquelle les longues listes mobile se comportent differemment.",
      summary:
        "Un pack de depart pour les candidats qui ont besoin d'un raisonnement RN plus solide que de simples reponses React web.",
    },
  });

  await syncQuestionCollectionItems(rnListsCollection.id, [
    "flatlist-vs-scrollview-for-long-lists",
    "flatlist-stable-keyextractor-beats-indexes",
  ]);

  const listIdentityCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-list-identity-and-keys",
    },
    update: {
      order: 10,
    },
    create: {
      slug: "react-list-identity-and-keys",
      order: 10,
    },
  });

  await upsertQuestionCollectionTranslations(listIdentityCollection.id, {
    en: {
      title: "React List Identity and Keys",
      description:
        "A focused sequence on why keys exist, what breaks when identity is wrong and how to explain list stability clearly.",
      summary:
        "Ideal for learners who know the warning message but still need the underlying identity model.",
    },
    fr: {
      title: "Identite de liste React et keys",
      description:
        "Une sequence ciblee sur la raison d'etre des keys, ce qui casse quand l'identite est fausse et comment expliquer clairement la stabilite des listes.",
      summary:
        "Ideale pour les apprenants qui connaissent le warning mais n'ont pas encore le vrai modele d'identite.",
    },
  });

  await syncQuestionCollectionItems(listIdentityCollection.id, [
    "index-key-breaks-item-identity",
    "keys-do-not-force-rerender",
  ]);

  const javascriptFoundationsCollection =
    await prisma.questionCollection.upsert({
      where: {
        slug: "javascript-foundations-for-react-learners",
      },
      update: {
        order: 11,
      },
      create: {
        slug: "javascript-foundations-for-react-learners",
        order: 11,
      },
    });

  await upsertQuestionCollectionTranslations(
    javascriptFoundationsCollection.id,
    {
      en: {
        title: "JavaScript Foundations for React Learners",
        description:
          "A beginner-first collection on references, copying, closures and array methods for learners who need stronger JavaScript before React starts feeling natural.",
        summary:
          "Read this collection when React problems still feel confusing because the underlying JavaScript model is not stable yet.",
      },
      fr: {
        title: "Fondamentaux JavaScript pour apprenants React",
        description:
          "Une collection debutant sur les references, la copie, les closures et les methodes de tableau pour les apprenants qui ont besoin d'un JavaScript plus solide avant que React devienne naturel.",
        summary:
          "A lire quand les problemes React paraissent encore flous parce que le modele JavaScript de base n'est pas assez stable.",
      },
    },
  );

  await syncQuestionCollectionItems(javascriptFoundationsCollection.id, [
    "objects-with-same-fields-are-not-equal-by-reference",
    "spread-copy-does-not-deep-clone",
    "map-filter-reduce-do-different-jobs",
    "closure-remembers-outer-variable",
    "nested-spread-mutation-bug-hunt",
  ]);

  const javascriptAsyncCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "javascript-async-and-promises-core",
    },
    update: {
      order: 12,
    },
    create: {
      slug: "javascript-async-and-promises-core",
      order: 12,
    },
  });

  await upsertQuestionCollectionTranslations(javascriptAsyncCollection.id, {
    en: {
      title: "JavaScript Async and Promises Core",
      description:
        "A compact async track on microtasks, timers and Promise coordination for front-end interviews.",
      summary:
        "Use this when async code still feels magical and you need a clear execution model.",
    },
    fr: {
      title: "Coeur JavaScript asynchrone et promesses",
      description:
        "Un parcours compact sur les microtasks, les timers et la coordination de promesses pour les entretiens front-end.",
      summary:
        "A utiliser quand le code asynchrone parait encore magique et qu'il faut un modele d'execution clair.",
    },
  });

  await syncQuestionCollectionItems(javascriptAsyncCollection.id, [
    "promise-microtask-runs-before-timeout",
    "promise-all-rejects-on-first-failure",
  ]);

  const javascriptCodingCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "javascript-coding-patterns-starter",
    },
    update: {
      order: 13,
    },
    create: {
      slug: "javascript-coding-patterns-starter",
      order: 13,
    },
  });

  await upsertQuestionCollectionTranslations(javascriptCodingCollection.id, {
    en: {
      title: "JavaScript Coding Patterns Starter",
      description:
        "A practical collection on closures, debounce-style reasoning and data transformation patterns that often surface in coding rounds.",
      summary:
        "Built for learners who need interview-ready JavaScript utility reasoning, not only theory.",
    },
    fr: {
      title: "Starter patterns de code JavaScript",
      description:
        "Une collection pratique sur les closures, le raisonnement de type debounce et les patterns de transformation de donnees qui reviennent en coding round.",
      summary:
        "Concue pour les apprenants qui ont besoin d'un raisonnement JavaScript exploitable en entretien, pas seulement de theorie.",
    },
  });

  await syncQuestionCollectionItems(javascriptCodingCollection.id, [
    "map-filter-reduce-do-different-jobs",
    "closure-remembers-outer-variable",
    "debounce-needs-a-closure-over-timeout",
    "nested-spread-mutation-bug-hunt",
  ]);

  const htmlCssCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "frontend-html-css-interview-essentials",
    },
    update: {
      order: 14,
    },
    create: {
      slug: "frontend-html-css-interview-essentials",
      order: 14,
    },
  });

  await upsertQuestionCollectionTranslations(htmlCssCollection.id, {
    en: {
      title: "Frontend HTML and CSS Interview Essentials",
      description:
        "A guided collection on semantics, form usability, flexbox, specificity, box sizing and positioned layout.",
      summary:
        "Built for learners who need stronger HTML/CSS intuition before real UI interview answers become reliable.",
    },
    fr: {
      title: "Essentiels entretien HTML et CSS frontend",
      description:
        "Une collection guidee sur la semantique, l'utilisabilite des formulaires, flexbox, la specificite, le box sizing et les layouts positionnes.",
      summary:
        "Concue pour les apprenants qui ont besoin d'une intuition HTML/CSS plus solide avant que les reponses d'interface deviennent fiables.",
    },
  });

  await syncQuestionCollectionItems(htmlCssCollection.id, [
    "semantic-html-improves-meaning-and-accessibility",
    "label-click-focuses-associated-input",
    "flexbox-main-axis-follows-flex-direction",
    "css-specificity-inline-id-class-order",
    "box-sizing-border-box-includes-padding-and-border",
    "absolute-position-removes-element-from-normal-flow",
  ]);

  const browserRuntimeCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "frontend-browser-runtime-and-events",
    },
    update: {
      order: 15,
    },
    create: {
      slug: "frontend-browser-runtime-and-events",
      order: 15,
    },
  });

  await upsertQuestionCollectionTranslations(browserRuntimeCollection.id, {
    en: {
      title: "Browser Runtime and DOM Events",
      description:
        "A practical browser collection on script loading, DOM event flow and browser-side storage lifetime.",
      summary:
        "Use this when the browser still feels like a black box around your front-end code.",
    },
    fr: {
      title: "Runtime navigateur et evenements DOM",
      description:
        "Une collection pratique sur le chargement des scripts, le flux des evenements DOM et la duree de vie du stockage cote navigateur.",
      summary:
        "A utiliser quand le navigateur parait encore etre une boite noire autour du code front-end.",
    },
  });

  await syncQuestionCollectionItems(browserRuntimeCollection.id, [
    "defer-script-runs-after-parse-in-order",
    "event-bubbling-moves-from-target-upward",
    "prevent-default-does-not-stop-propagation",
    "localstorage-persists-beyond-tab-close",
  ]);

  const frontendFoundationsCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "frontend-foundations-beyond-react",
    },
    update: {
      order: 16,
    },
    create: {
      slug: "frontend-foundations-beyond-react",
      order: 16,
    },
  });

  await upsertQuestionCollectionTranslations(frontendFoundationsCollection.id, {
    en: {
      title: "Frontend Foundations Beyond React",
      description:
        "A cross-cutting collection that mixes JavaScript, HTML, CSS and browser mechanics for learners who need the full front-end base, not only React vocabulary.",
      summary:
        "Ideal when React answers are fragile because the lower-level front-end model is still incomplete.",
    },
    fr: {
      title: "Fondations frontend au-dela de React",
      description:
        "Une collection transversale qui melange JavaScript, HTML, CSS et mecanismes navigateur pour les apprenants qui ont besoin d'une base front-end complete, pas seulement de vocabulaire React.",
      summary:
        "Ideale quand les reponses React restent fragiles parce que le modele front-end plus bas niveau est encore incomplet.",
    },
  });

  await syncQuestionCollectionItems(frontendFoundationsCollection.id, [
    "objects-with-same-fields-are-not-equal-by-reference",
    "semantic-html-improves-meaning-and-accessibility",
    "flexbox-main-axis-follows-flex-direction",
    "promise-microtask-runs-before-timeout",
    "event-bubbling-moves-from-target-upward",
    "localstorage-persists-beyond-tab-close",
  ]);

  const reactCodingCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-coding-patterns-starter",
    },
    update: {
      order: 17,
    },
    create: {
      slug: "react-coding-patterns-starter",
      order: 17,
    },
  });

  await upsertQuestionCollectionTranslations(reactCodingCollection.id, {
    en: {
      title: "React Coding Patterns Starter",
      description:
        "A practical React collection on immutable updates, tabs, custom hook APIs and performance reasoning that often appears in coding rounds.",
      summary:
        "Built for learners who need stronger component-sketch answers, not only conceptual interview definitions.",
    },
    fr: {
      title: "Starter patterns de code React",
      description:
        "Une collection React pratique sur les updates immutables, les tabs, les APIs de custom hooks et le raisonnement performance qui reviennent souvent en coding round.",
      summary:
        "Concue pour les apprenants qui ont besoin de meilleures reponses de sketch de composant, pas seulement de definitions conceptuelles.",
    },
  });

  await syncQuestionCollectionItems(reactCodingCollection.id, [
    "controlled-input-keeps-react-in-charge",
    "immutable-list-toggle-avoids-mutating-react-state",
    "tabs-component-needs-single-source-of-truth",
    "custom-hook-returns-state-and-actions",
    "usememo-is-not-for-correctness",
  ]);

  const reactInteractionCollection = await prisma.questionCollection.upsert({
    where: {
      slug: "react-interaction-and-accessibility-cases",
    },
    update: {
      order: 18,
    },
    create: {
      slug: "react-interaction-and-accessibility-cases",
      order: 18,
    },
  });

  await upsertQuestionCollectionTranslations(reactInteractionCollection.id, {
    en: {
      title: "React Interaction and Accessibility Cases",
      description:
        "A collection on modal behavior, focus, keyboard interaction and the practical details that make interactive React components robust.",
      summary:
        "Use this when you want React answers that sound production-aware, not just state-aware.",
    },
    fr: {
      title: "Cas React interaction et accessibilite",
      description:
        "Une collection sur le comportement des modals, le focus, les interactions clavier et les details pratiques qui rendent les composants React robustes.",
      summary:
        "A utiliser quand tu veux des reponses React qui sentent la production, pas seulement le state.",
    },
  });

  await syncQuestionCollectionItems(reactInteractionCollection.id, [
    "label-click-focuses-associated-input",
    "modal-needs-escape-focus-and-background-strategy",
    "event-bubbling-moves-from-target-upward",
    "prevent-default-does-not-stop-propagation",
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
      tlDr?: string;
      shortAnswer?: string;
      lessonBody?: string;
      commonMistakes?: string[];
      exampleTitle?: string;
      exampleCode?: string;
      exampleLanguage?: string;
      exampleExplanation?: string;
      estimatedReadMinutes?: number;
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
        tlDr: values.en.tlDr,
        shortAnswer: values.en.shortAnswer,
        lessonBody: values.en.lessonBody,
        commonMistakes: values.en.commonMistakes,
        exampleTitle: values.en.exampleTitle,
        exampleCode: values.en.exampleCode,
        exampleLanguage: values.en.exampleLanguage,
        exampleExplanation: values.en.exampleExplanation,
        estimatedReadMinutes: values.en.estimatedReadMinutes,
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
        tlDr: values.en.tlDr,
        shortAnswer: values.en.shortAnswer,
        lessonBody: values.en.lessonBody,
        commonMistakes: values.en.commonMistakes,
        exampleTitle: values.en.exampleTitle,
        exampleCode: values.en.exampleCode,
        exampleLanguage: values.en.exampleLanguage,
        exampleExplanation: values.en.exampleExplanation,
        estimatedReadMinutes: values.en.estimatedReadMinutes,
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
        tlDr: values.fr.tlDr,
        shortAnswer: values.fr.shortAnswer,
        lessonBody: values.fr.lessonBody,
        commonMistakes: values.fr.commonMistakes,
        exampleTitle: values.fr.exampleTitle,
        exampleCode: values.fr.exampleCode,
        exampleLanguage: values.fr.exampleLanguage,
        exampleExplanation: values.fr.exampleExplanation,
        estimatedReadMinutes: values.fr.estimatedReadMinutes,
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
        tlDr: values.fr.tlDr,
        shortAnswer: values.fr.shortAnswer,
        lessonBody: values.fr.lessonBody,
        commonMistakes: values.fr.commonMistakes,
        exampleTitle: values.fr.exampleTitle,
        exampleCode: values.fr.exampleCode,
        exampleLanguage: values.fr.exampleLanguage,
        exampleExplanation: values.fr.exampleExplanation,
        estimatedReadMinutes: values.fr.estimatedReadMinutes,
        contextData: values.fr.contextData,
        verbalizePoints: values.fr.verbalizePoints,
      },
    }),
  ]);
}

async function upsertClosedQuestion(params: {
  slug: string;
  moduleId: string;
  primarySkillId: string;
  format: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
  difficulty: number;
  level: QuestionLevel;
  optionCorrectness: boolean[];
  translations: Parameters<typeof upsertQuestionTranslations>[1];
  optionTranslations: Parameters<typeof upsertOptionTranslations>[1];
}) {
  await prisma.question.upsert({
    where: {
      slug: params.slug,
    },
    update: {
      moduleId: params.moduleId,
      primarySkillId: params.primarySkillId,
      format: params.format,
      difficulty: params.difficulty,
      level: params.level,
    },
    create: {
      slug: params.slug,
      moduleId: params.moduleId,
      primarySkillId: params.primarySkillId,
      format: params.format,
      difficulty: params.difficulty,
      level: params.level,
      options: {
        create: params.optionCorrectness.map((isCorrect, index) => ({
          order: index + 1,
          isCorrect,
        })),
      },
    },
  });

  const question = await prisma.question.findUniqueOrThrow({
    where: {
      slug: params.slug,
    },
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  await upsertQuestionTranslations(question.id, params.translations);
  await upsertOptionTranslations(question.options, params.optionTranslations);

  return question;
}

async function upsertLessonQuestion(params: {
  slug: string;
  moduleId: string;
  primarySkillId: string;
  format: "OPEN_ENDED" | "CODE_OUTPUT" | "BUG_HUNT";
  difficulty: number;
  level: QuestionLevel;
  translations: Parameters<typeof upsertQuestionTranslations>[1];
}) {
  await prisma.question.upsert({
    where: {
      slug: params.slug,
    },
    update: {
      moduleId: params.moduleId,
      primarySkillId: params.primarySkillId,
      format: params.format,
      difficulty: params.difficulty,
      level: params.level,
    },
    create: {
      slug: params.slug,
      moduleId: params.moduleId,
      primarySkillId: params.primarySkillId,
      format: params.format,
      difficulty: params.difficulty,
      level: params.level,
    },
  });

  const question = await prisma.question.findUniqueOrThrow({
    where: {
      slug: params.slug,
    },
  });

  await upsertQuestionTranslations(question.id, params.translations);

  return question;
}

async function upsertQuestionCollectionTranslations(
  collectionId: string,
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
    prisma.questionCollectionTranslation.upsert({
      where: {
        collectionId_locale: {
          collectionId,
          locale: ContentLocale.EN,
        },
      },
      update: {
        status: TranslationStatus.READY,
        ...values.en,
      },
      create: {
        collectionId,
        locale: ContentLocale.EN,
        status: TranslationStatus.READY,
        ...values.en,
      },
    }),
    prisma.questionCollectionTranslation.upsert({
      where: {
        collectionId_locale: {
          collectionId,
          locale: ContentLocale.FR,
        },
      },
      update: {
        status: TranslationStatus.READY,
        ...values.fr,
      },
      create: {
        collectionId,
        locale: ContentLocale.FR,
        status: TranslationStatus.READY,
        ...values.fr,
      },
    }),
  ]);
}

async function syncQuestionCollectionItems(
  collectionId: string,
  questionSlugs: string[],
) {
  const questions = await prisma.question.findMany({
    where: {
      slug: {
        in: questionSlugs,
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });

  const questionIdBySlug = new Map(
    questions.map((question) => [question.slug, question.id]),
  );

  await prisma.questionCollectionItem.deleteMany({
    where: {
      collectionId,
    },
  });

  if (questionSlugs.length === 0) {
    return;
  }

  await prisma.questionCollectionItem.createMany({
    data: questionSlugs.flatMap((questionSlug, index) => {
      const questionId = questionIdBySlug.get(questionSlug);

      return questionId
        ? [
            {
              collectionId,
              questionId,
              order: index + 1,
            },
          ]
        : [];
    }),
    skipDuplicates: true,
  });
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

async function syncQuestionPitfallTags(
  questionId: string,
  pitfallTagSlugs: string[],
) {
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
