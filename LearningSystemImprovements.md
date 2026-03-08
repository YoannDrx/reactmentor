# React Mentor Learning System Improvements

Derniere mise a jour: 8 mars 2026

## 1. Role du document

Ce document cadre les ameliorations cross-surface du systeme d'apprentissage React Mentor.

Il ne remplace pas:

- [ContentExpansionTracker.md](./ContentExpansionTracker.md) pour le volume et la couverture editoriale
- [BuildTracker.md](./BuildTracker.md) pour le suivi de delivery
- [Roadmap.md](./Roadmap.md) pour la vision produit globale

Il sert a repondre a une question plus precise:

"Comment transformer la bibliotheque `learn`, la pratique, la review, le tracking et les mocks en un vrai systeme d'apprentissage coherent ?"

## 2. Etat actuel consolide

### 2.1 Ce qui existe deja

- bibliotheque publique `learn` avec index, collections et pages question detaillees
- cours bilingues FR/EN avec `tlDr`, reponse courte, explication longue, erreurs frequentes, exemple et points a verbaliser
- CTA `Lire le cours` relies depuis modules, review, notes, bookmarks et mock recovery
- sessions `practice`, `review` et `mock` avec plusieurs formats jouables
- `QuestionProgress` et `SkillProgress` relies a la repetition espacee et a des signaux de confiance/couverture
- recommandations dashboard et recovery plans deja relies a de vraies donnees
- notes, bookmarks et playlists pour l'appropriation personnelle
- admin contenu v1 et tracking produit / ops de base

### 2.2 Ce qui manque encore

- la lecture d'un cours n'alimente pas encore un vrai signal d'apprentissage
- chaque cours n'a pas encore son mini checkpoint ou exercice de verification
- il manque des liens explicites entre "je lis", "je m'entraine", "je revise" et "je refais un mock"
- les recommandations restent surtout basees sur attempts et review, pas encore sur comprehension de cours
- il n'existe pas encore de vue claire "ou j'en suis par concept / cours / skill / module"
- la partie cours reste encore tres textuelle et pas assez structuree comme un systeme pedagogique progressif

## 3. Diagnostic produit-pedagogie

Le produit est deja bon pour:

- faire pratiquer
- corriger
- montrer une file de review
- expliquer des reponses

Le produit est encore moyen pour:

- enseigner un concept dans une progression claire
- mesurer la comprehension juste apres le cours
- remontrer plus tard un concept mal retenu
- relier une faiblesse de mock a un vrai parcours de remediaton

La priorite n'est donc plus de rajouter des pages.
La priorite est de connecter les couches deja presentes:

- `learn`
- practice
- review
- mock
- notes / bookmarks / playlists
- tracking de progression

## 4. Ameliorations prioritaires du learning system

### 4.1 Boucle cours -> verification -> pratique

Objectif:

- qu'un cours ne soit plus une simple lecture passive

Ameliorations:

- ajouter un mini checkpoint en bas de chaque cours
- ajouter une question "est-ce que tu peux l'expliquer a l'oral ?" avec points a verbaliser
- ajouter un CTA "faire 3 questions associees"
- ajouter un CTA "ajouter a ma review plus tard"
- ajouter des liens prerequis / cours suivants / exercices relies

Impact attendu:

- meilleure retention immediate
- transition plus naturelle entre contenu et entrainement
- usage plus actionnable de `learn`

### 4.2 Tracking par concept et non seulement par tentative

Objectif:

- suivre autre chose que des bonnes ou mauvaises reponses

Ameliorations:

- enregistrer la consultation d'un cours
- enregistrer si le mini checkpoint de fin de cours est reussi
- distinguer `vu`, `compris`, `a revoir`, `solide`, `a verbaliser`
- ajouter une notion de "cours termines mais non verifies"
- introduire un signal "lecture sans pratique" pour recommander une session ciblee

Impact attendu:

- meilleur tableau de bord pedagogique
- recommendations plus fines
- meilleure explication de "pourquoi on te propose ceci maintenant"

### 4.3 Tracking de confiance et de restitution

Objectif:

- mieux mesurer ce qu'un etudiant sait vraiment defendre

Ameliorations:

- demander un niveau de confiance avant ou apres certaines reponses
- distinguer reconnaissance, rappel et argumentation
- ajouter des prompts de restitution courte apres lecture
- tagger les questions selon "reconnaissance", "explication", "defense", "bug hunt", "coding"
- remonter un signal "bonne reponse mais explication fragile"

Impact attendu:

- meilleur alignement avec la realite d'un entretien
- plus de valeur pedagogique que le simple score

### 4.4 Recovery plans vraiment pedagogiques

Objectif:

- transformer une faiblesse en plan concret

Ameliorations:

- pour chaque weak skill, generer une sequence:
  - 1 cours coeur
  - 2 a 3 questions de verification
  - 1 bug hunt ou question ouverte si possible
  - 1 rappel a replanifier
- afficher clairement pourquoi ce plan est propose
- proposer une duree estimee et un niveau de difficulte

Impact attendu:

- dashboard plus utile
- review plus explicable
- meilleur pont entre tracking et apprentissage

### 4.5 Workspace personnel d'apprentissage

Objectif:

- faire de notes, bookmarks et playlists autre chose que des listes

Ameliorations:

- permettre de sauvegarder un cours entier dans une playlist
- distinguer bookmark de question, bookmark de cours et bookmark de module
- proposer une playlist auto-generee "a revoir cette semaine"
- proposer une playlist "faiblesses mock"
- rattacher les notes a des concepts, pas seulement a des questions

Impact attendu:

- plus forte appropriation personnelle
- meilleure retention long terme
- meilleure valeur premium

## 5. Ameliorations prioritaires de la partie cours

### 5.1 Template pedagogique plus riche

Chaque cours devrait tendre vers la structure:

- question d'entretien
- reponse courte reutilisable a l'oral
- intuition simple pour debutant
- explication mecanique precise
- erreur frequente
- exemple de code
- mini verification
- questions associees
- cours prerequis
- cours suivants

### 5.2 Parcours par niveau

Le meme sujet devrait exister a plusieurs profondeurs:

- `Starter`: vocabulaire et intuition
- `Junior`: mecanisme de base
- `Mid`: tradeoffs et erreurs courantes
- `Senior`: limites, exceptions, architecture et perf

Cela implique:

- mieux tagger le niveau pedagogique des cours
- mieux lier les questions de meme theme mais de profondeur differente

### 5.3 Cours plus relies aux vrais signaux d'entretien

Chaque cours devrait idealement porter:

- le risque en entretien si le concept est mal compris
- ce qu'un recruteur teste reellement
- comment verbaliser une reponse propre
- comment eviter une reponse superficielle

### 5.4 Cours plus utiles pour debutants

Point de vigilance:

- ne pas supposer le jargon
- ne pas commencer par la definition la plus abstraite
- partir d'un exemple, puis remonter vers le concept
- expliciter les erreurs de modele mental

## 6. Ameliorations du tracking et du dashboard

### 6.1 Nouvelles vues de progression utiles

Ajouter idealement:

- progression par cours
- progression par skill
- progression par famille de questions
- progression par type d'effort:
  - lecture
  - practice
  - review
  - mock

### 6.2 Signaux a ajouter

Signaux utiles a considerer:

- cours lus
- cours relus
- checkpoint reussi / echoue
- dernier concept etudie
- concepts jamais reverifies
- ecart entre confiance et justesse
- pourcentage de faiblesse deja traitees par un vrai recovery plan

### 6.3 Recommandations a rendre plus intelligibles

Une recommandation devrait toujours expliquer:

- pourquoi maintenant
- quel gain attendu
- combien de temps cela prend
- si elle vise comprehension, memorisation ou defense orale

## 7. Ameliorations du contenu pratique

### 7.1 Mini exercices de consolidation

Ajouter:

- question rapide de verification en bas de cours
- petite reformulation a completer
- question "choisis l'erreur de raisonnement"
- micro bug hunt sur le concept du cours

### 7.2 Cas pratiques relies aux cours

Pour les familles importantes:

- associer 1 a 2 exercices pratiques par cours coeur
- afficher "tu devrais faire ceci ensuite"
- preselectionner une micro-session depuis la page cours

### 7.3 Mocks plus relies a la remediaton

Apres un mock, il devrait etre possible de generer:

- une playlist de remediaton
- une suite de cours associes
- une suite de questions ouvertes / bug hunts
- une file de review specialisee sur les erreurs observees

## 8. Industrialisation editoriale a prevoir

### 8.1 QA pedagogique

Avant de considerer un cours termine:

- verifier la clarte debutant
- verifier la justesse technique
- verifier la coherence FR/EN
- verifier les liens vers prerequis et contenus associes
- verifier qu'une action pedagogique suit la lecture

### 8.2 Deduplication benchmark

GreatFrontEnd doit rester un benchmark de couverture, pas un patchwork de sujets dupliques.

Il faut donc:

- cartographier les doublons
- fusionner les formulations trop proches
- preferer une meilleure profondeur pedagogique a plus d'articles superficiels

### 8.3 Freshness review

Tous les sujets n'ont pas la meme stabilite.

Il faut prevoir:

- une revue reguliere des sujets temporally unstable
- une check-list de mise a jour pour libs, APIs et best practices

## 9. Priorisation recommandee

### 9.1 Prochain lot P0

- mini checkpoints de fin de cours
- liens "cours associes" / "questions associees" / "faire une micro-session"
- tracking `course viewed` / `course checkpoint completed`
- playlists auto-generees de remediaton

### 9.2 Lot P1

- progression par cours et par type d'effort
- signal confiance vs justesse
- recovery plans plus structures
- helpers de rendu pedagogiques plus riches dans `learn`

### 9.3 Lot P2

- systeme de prerequis explicite
- plans adaptatifs multi-seances
- davantage d'intelligence sur la restitution orale
- plus forte articulation mock -> remediaton -> re-mock

## 10. Definition du succes

On pourra dire que le learning system monte en gamme quand:

- lire un cours declenche une action utile juste apres
- le dashboard sait distinguer ce qui a ete lu de ce qui a ete compris
- une faiblesse identifiee mene a un plan de remediaton concret
- les playlists, bookmarks et notes deviennent des outils de progression, pas de simple stockage
- les mocks alimentent directement la bibliotheque de rattrapage
- un etudiant comprend mieux pourquoi React Mentor lui recommande une action a un moment donne
