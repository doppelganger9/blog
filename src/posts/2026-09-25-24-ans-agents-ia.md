---
title: 24 ans à fabriquer du logiciel, et un mois avec des agents IA
date: 2026-09-25T12:00:00
published: true
description: Mon retour sur l’IA dans mon quotidien de développeur.
tags: IA, agents, développement
category: Dev
lang: fr
keywords: IA, agents, développement logiciel, Software Craftsmanship, métier développeur
slug: 2026/09/25
thumb: https://lacourt.dev/uploads/2026-09-25-24-ans-agents-ia.png
---

![Illustration abstraite d’un clavier mécanique, de mains aux doigts surnuméraires et d’une boucle de feedback - voir la fin de l'article pour l'explication de la blague](/uploads/2026-09-25-24-ans-agents-ia.png)

*Mon retour sur l’IA dans mon quotidien de développeur. Et aussi mon retour sur le blog... et sur le marché !*

## 1 — Pourquoi je n’y croyais pas

### Complétion automagique

J’ai commencé à utiliser Copilot dans IntelliJ en 2023, et vraiment pas convaincu par la complétion de code qui se trompait souvent. 

Je l’ai donc mis de côté un temps. En 2024, les équipes internes de mon client ont expliqué que c’était devenu mieux et ont lancé une dynamique sur le sujet ; j’ai donc repris les expérimentations mais de manière très sceptique. L’intégration dans IntelliJ n’était pas folle, alors j’ai testé dans Visual Studio Code et c’était un peu mieux. Mais pas encore dingue. Bon, j’ai continué à utiliser mais pas convaincu.

Ensuite, on nous a présenté l’arrivée des Agents et des démos incroyables. 

### Premier test agentique

Pour expérimenter, j’ai tenté pendant nos sprints agiles d’obsolescence une migration technique (on passait de Java 8 à Java 21 et tout ce que ça entraîne pour Spring Boot etc.) assistée par Agent IA. En effet, le client utilisant GitHub avait activé GitHub Copilot Entreprise. Je me suis vite rendu compte des limitations en termes de contexte et d’analyse des LLM de l’époque. Elle perdait le fil, elle hallucinait des paramètres de configuration, quand il y avait une erreur, elle tournait en boucle en proposant en alternance 2 correctifs : j’ai fait un bon `git reset HEAD --hard` et j’ai tout refait moi-même ; ce n’était pas complètement perdu car l’IA m’avait montré certaines choses potables ; je dirais qu’elle avait bon à 60 % mais c’était pas viable. Un collègue emballé par mon expérience a tenté lui aussi et a fait plus confiance à l’IA… et nous avons ensuite passé beaucoup de temps, même plus tard, à corriger les erreurs introduites et fusionnées sans avoir bien relu ce qui avait été fait. 

Cette expérience m’a servi de contre-exemple, et j’ai mis tout ça de côté. Je voyais bien tout le monde s’exciter sur le sujet, mais là en vrai, c’était pas efficace voire même **contre-productif**.

### Le stagiaire nul en code, sans mémoire, mais hyper cultivé

Donc au départ on avait parlé du stagiaire un peu nul qui a lu tout internet. En plus de cela en mode agent, il avait une mémoire de poisson-rouge et il fallait ruser avec les prompts pour qu’il accumule les connaissances locales. Il repartait à chaque fois comme si on accueillait dans notre équipe un nouveau stagiaire nul en code mais très cultivé.

### Enfin, des revues de code automatisées

Ensuite est arrivée la fonctionnalité des Copilot Reviews dans GitHub, je me souviens avoir remonté ce besoin quelques mois avant en disant « ah, c’est un peu pourri sur notre machine, mais ça serait tellement bien si on pouvait lui faire relire nos pull requests je suis sûr que ça remonterait des choses que l’on ne voit pas ». Et oui, car l’Agent va au bout de sa tâche et il est exhaustif. L’humain (moi par exemple) a un cerveau qui aime l’économie d’énergie, et donc va utiliser des raccourcis comme les croyances ou l’intuition pour regarder en diagonale les PR et par chance voir un truc qui dénote — tiens il manque une constante ici, le nom de la méthode ne raconte pas vraiment ce qu’elle fait par là, etc — mais une PR qui modifie 100 fichiers et 2 000 lignes, ça a toujours été un sujet de conférence et jamais réellement résolu. Donc mettre un Agent de revue de code, ça permettrait de lui faire relire le code en entier. Et donc quand cela a été mis à disposition, tout de suite j’étais emballé ! Les premières revues automatisées étaient comme le code en local : 60 % bon, le reste des faux positifs ou des hallucinations. Sauf qu'entre deux versions, les IA peuvent progresser à une vitesse assez déconcertante. Et en quelques mois, j'ai réellement vu la qualité des reviews monter. De moins en moins d’erreurs de jugement ou d’hallucinations ou de faux positifs. De plus en plus de petites choses qui, une fois lues et comprises, étaient de vrais retours intéressants et parfois des failles de sécurité ou autre qu’on aurait laissé passer !

Je suis alors entré dans une boucle de : je pousse mon code, Copilot fait la revue, je corrige ses retours et repousse et relance une revue, en itérant parfois 4 ou 5 fois.

## 2 — Merde, ça marche !

### Juillet 2026 : le tournant

Bon, après cela, dans l’équipe on utilisait tous Copilot Review, et cet été 2026, je me suis dit, tiens, si je retentais les agents ? En fait j’avais retenté dans IntelliJ mais l’expérience Copilot + IntelliJ ne m’avait pas convaincu, il n’arrivait pas à chercher dans le filesystem, etc. Alors j’ai rouvert mon VS Code et tenté de faire une analyse avec Agent sur un repository. J’ai choisi un sujet que je maîtrisais en me disant que je pourrais ainsi voir si l’IA :

- Inventerait des choses ou comprendrait de travers
- Serait au niveau de ma compréhension
- Dépasserait ma compréhension 

Et là, honnêtement je pensais tomber entre le 1 et le 2, eh bien j’ai constaté plutôt le 3 ! Incroyable ! Je me suis dit qu’il y avait un truc. Forcément c’est parce que j’ai bien formulé ma question et lui ai donné des indices qu’elle a pu arriver aux bonnes conclusions. J’ai donc demandé à un autre collègue de lancer ses propres analyses, et il a eu grosso modo la même conclusion. 

J’ai donc révisé mon jugement : avec les derniers LLM de cet été (juillet 2026 : Opus 5 et GPT 5.6 Sol, Terra, Luna), sur ce type de tâche en particulier, le résultat obtenu en 2 h parvenait voire dépassait ce que j’avais fait. Donc cette fameuse analyse, je l’avais réalisée à la main quelques années auparavant, et m’avait pris plusieurs heures voire jours pour consolider mes infos, ma compréhension, lire le code, suivre les liens d’appel entre les méthodes et les branches logiques, noter les API par lesquelles on passe, les constantes, les configurations et propriétés impliquées, etc. Là, en juillet 2026, l’analyse a pris 2 h. Et à la fin j’avais une description qui ressemblait à la page Confluence que j’avais écrite, en mieux car mieux structurée (je suis un peu du genre à partir dans tous les sens), et exhaustive (pour simplifier dans ma doc, j’ai omis certains détails). Avec des graphiques, il suffit de lui demander ! Ok, je suis convaincu.

### AI Fatigue

Donc à partir de juillet/août 2026, j’ai pris sérieusement le train en marche. Et au secours, j’avais vécu la « JavaScript Fatigue » dans les années 2010, eh bien j’ai eu (et encore maintenant) la « IA fatigue » en essayant de suivre un domaine qui pour moi évolue trop vite. Les modèles s’enchaînent, les gens sortent des libs, des outils, des prompts, des skills, des agents, etc. Une vraie explosion cambrienne !

## 3 — Qu’est-ce que ça change à mon métier ?

### L’imagination et l’intention est la limite ? Le Software Craftsmanship comme mécanisme de compensation des limites humaines

Donc j’ai poussé l’expérience. Nous autres humains avons des limites. Mais on a des idées aussi ! Nous avons inventé des tas de méthodes, garde-fous pour contrer ces limites. En réalité, la plupart des pratiques de Software Craftsmanship servent à contrer une limitation ou un biais cognitif humain. Notre contexte mental est limité ? On découpe les problèmes en plus petit, on fait des petites méthodes, des petites classes, on sépare bien les choses. On ne se fait pas confiance, on ne voit pas ses propres erreurs ? On fait de la revue de code par les pairs. Spécifier pendant des mois et coder pour ensuite se rendre compte que ça ne correspond pas au vrai besoin ? On raccourcit le cycle pour avoir des retours plus tôt et éviter de s’engager sur la mauvaise piste trop longtemps et pour un coût trop élevé. Etc. 

Allez, je crois que j’ai trouvé une idée forte, accrochez-vous, je ferais peut-être une conférence à ce sujet 😂 :

- Les tests automatisés par code : on code 2 fois pour être sûr que le vrai code marche bien en l’utilisant dans du code de validation. Car le testeur humain il va se fatiguer, il va faire des erreurs de copier-coller, il va oublier une ligne du cahier de recette de ses tests de non-régression et il va prendre 5 jours à les dérouler et se plaindre de pas pouvoir venir à la rétrospective (pardon Jiji je t’adore)

Bref, l’IA ne rend pas ces pratiques obsolètes, mais si on lui explique, elle les appliquera à chaque fois et donc on automatise et fiabilise tout cela une bonne fois pour toutes ! Une parenthèse encore sur les bonnes pratiques, les méthodes et autres façons de programmer, comme l’Event Driven, le BDD, le Domain Driven, etc. Et ça tombe plutôt bien : dans mon expérience, les agents se débrouillent nettement mieux quand on leur donne des choses bien structurées. Et elle, vous pouvez être sûrs qu’elle va suivre vos préconisations et recommandations, pas besoin de refaire un talk à Devoxx tous les ans pour lui rabâcher le sujet ! En 5 min c’est plié ! Il y a matière alors j’en reparlerai sans doute dans un futur article.

### L’assistant inhumain qui ne lâche rien !

En tant que Scrum Master (ETQSM comme je dis dans mon équipe) j’ai toujours eu du mal à bien faire appliquer les actions de rétro, par exemple, vérifier la Définition du Prêt ou Fini. Eh bien maintenant, j’ai un agent qui se connecte à JIRA et Confluence, je lui dis, analyse la fiche XYZ-1234, et il télécharge via MCP Atlassian le JSON, suit les liens, analyse les screenshots, et sauvegarde en local dans un Markdown pour pas refaire ces allers-retours 40 fois. Ensuite il suit mes instructions et applique nos bonnes pratiques, la DoD, la DoR, et tout ce que je lui ai dit, pour qu’il ait un contexte qui petit à petit rattrape ce que j’ai (mon expérience de développeur dans le SI de ce client), voire la dépasse car il peut rapidement regarder tous les repositories (oui j’ai tout mis dans un workspace) et comme on travaille en value-stream, on a besoin de passer par 4 ou 5 apps différentes pour une User Story, eh bien il sait le faire.

J’ai poussé le vice à lui apprendre comment faire une échelle d’estimation et maintenant c’est lui qui me sort une estimation en story points. De toute façon ça n’a jamais été une science exacte, mais il est aligné sur ce que j’aurais dit donc je considère que ça aussi c’est automatisé. 

En fait, le fait que ce soit le langage et l’intention qui se transforment en action ouvre énormément de possibilités ! On croirait même qu’on parle de magie ! 

Il suffit de décrire une chose, ou bien de lui demander comment faire pour lui faire faire les choses et lui faire s’en souvenir, et c’est parti ! Bon, ça marche pas du premier coup, mais encore une ou deux itérations et c’est bon et ensuite on capitalise là-dessus et on y va !

Petit à petit, je me pose et je réfléchis et je lui décris comment je travaille et comment on pourrait automatiser cela. Et c’est là que mon expérience doit jouer un rôle car après 24 ans dans le métier, je sais à peu près **ce qu’il faut demander et juger du résultat**…

Par exemple, j’avais introduit une liste de cases à cocher dans les PR qui servaient à vérifier manuellement si on avait pensé à tout. Évidemment la plupart des gens (moi y compris) l’ignoraient ou en cochaient 2 ou 3 et basta. Je vais bientôt prendre le temps de transformer cela en instructions pour le Copilot Review et **c’est fini les gars !** Tout le monde sera obligé de corriger et de voir ce qui manque car la review automatique le remontera.

### Automatisation et raccourcir la feedback-loop

Ce que j’en pense : notre métier a toujours été d’automatiser d’autres métiers. Et on a fini d’une certaine façon par automatiser une partie de notre métier et donc de court-circuiter la boucle de rétro-action. Pas tout, non. Déjà le code, ça ne fait aucun doute. Cette recherche d’optimiser la feedback-loop a toujours été une de mes préoccupations. Test Driven Development, expérience développeur, passer sur macOS, clavier mécanique pour être efficace, etc. Je recherche l’amélioration continue, le plaisir de maîtriser fait partie de pourquoi j’aime mon métier.

L’IA accélère la réduction de la loop de feedback : on peut brainstormer mieux qu’avec un canard en plastique (rubber duck programming), on peut challenger ses idées, ou celles de l’IA ; on peut lancer un agent en // et lui faire rapidement réaliser une idée pour mesurer l’impact et valider rapidement l’hypothèse plutôt que d’étudier pendant des jours et avoir une réponse tardive et un coût exorbitant.

Mais raccourcir la boucle de feedback ne signifie pas seulement obtenir les bonnes réponses plus vite : on peut aussi produire les mauvaises beaucoup plus vite.

### Vitesse et erreurs

En revanche plus on va vite, plus on accumule les choses qui auparavant prenaient du temps.

Par exemple les bugs. Les erreurs de conception, etc.

Donc une personne inexpérimentée qui vibe-code convergera certes plus vite vers la réalisation de son idée, MAIS elle aura aussi plus rapidement des bugs qui résultent de son inexpérience (sécurité, design, etc.).

Il faut donc être capable de valider ce qui a été produit.

Pour moi, avoir des idées et être créatif c’est ce qu’il nous reste encore un peu. Apporter de l’intention, et diriger vers quelque chose. Avoir du goût, choisir entre une peinture taupe ou vert-de-gris.

### Agilité, expérimentation et discussion avec Agent IA

L’agilité a aussi cette philosophie d’expérimentation pour valider des idées. Et d’une certaine façon, grâce aux agents IA, on peut aller encore plus vite et sortir un produit rapidement testable pour le confronter aux utilisateurs et mesurer l’impact (et la valeur qui se mesure une fois mis en service et payé par les gens !). De même que discuter avec une IA relève d’itérations afin de converger vers un résultat satisfaisant.

### « Notre métier va disparaître »

Franchement, fin août, j’ai pris peur car je savais que j’allais finir ma mission et devoir chercher une nouvelle. Et quand j’ai vu ce qu’on pouvait réellement faire, et encore, à mon niveau de débutant, il y a vraiment de quoi s’inquiéter et/ou se réjouir. J’ai pris un moment pour réfléchir sur la question et me remettre en question. En vérité, je pense que je ne coderai plus autant *manuellement* qu’avant, voire plus du tout. J’ai tellement d’idées que perdre du temps pour leur donner corps manuellement ne me satisfait plus. Oui, l’état de Flow c’était grisant, eh bien j’irais le chercher ailleurs. Maintenant je lance un truc, et je fais autre chose en parallèle. Parfois je lance encore une autre idée, puis une autre. Et je comprends comment les gens en viennent à organiser des équipes d’agents car je suis leur cheminement logique en décalé.

### Retour sur le marché assisté par IA

Pour en revenir à mon retour sur le marché, j’ai eu la chance et la confiance de pouvoir rester 3 ans chez mon client. Alors je me suis dit, il va falloir que je mette à jour mon CV, LinkedIn, Malt, ce blog, … j’ai pas le temps ni l’énergie ! Par contre, je peux utiliser un Agent ? Mais oui, et donc j’ai commencé à échanger avec ChatGPT sur le sujet, à lui faire prendre le rôle d’un recruteur qui analyserait ma trace sur internet, est-ce que je projette la bonne image ? Est-ce que mon profil est toujours attractif ? Et de créer un plan pour aménager 1 h par jour pour avancer à petit pas. 

*Cet article est écrit presque sans IA — peut-être pas les suivants par contre…*

J’ai écrit une première version de cet article à la main, promis, mais je n’ai pas pu m’empêcher de le faire relire à ChatGPT. J’ai décidé de limiter au maximum les retouches. Je sais pas si je résisterais longtemps cette uniformisation de la création de contenus…

Pouvoir déléguer certaines tâches, c’est quand même très séduisant.

(Et pis les fautes d’orthographe, il m’a convaincu en disant que c’était que du bruit et pas ma pensée donc il m’a eu.)

Cet article c’est **l’étape 8** pour tout vous dire. Pour les autres étapes, j’ai laissé plus de champ à ChatGPT, mais ici c’est moi qui écris. 

Le résultat me satisfait et j’ai l’impression d’avoir eu du répondant, comme si j’avais eu un coach de carrière ? Bon c’est un peu exagéré, mais en tout cas j’ai pu faire plus que si j’avais été en solo sur le sujet.

Et pour en revenir aux étapes, peut-être que vous êtes là parce que la stratégie — jouons cartes sur table — de vous faire venir ici via le CV ou LinkedIn a fonctionné. 

Dans tous les cas, si vous avez lu jusqu’ici mon bouillon d’idées mal dégrossies et non poli par IA, je vous en remercie, et faites-moi signe qu’on échange sur le sujet !

--

Cet article est le résultat de plusieurs semaines de réflexions et je remercie toutes les personnes à qui j'ai présenté tout ou partie des idées qui y figurent. Vous vous reconnaitrez ! Il est possible que je le retravaille, aucune garantie qu'il soit figé ainsi.

Pour l'illustration, c'est signé ChatGPT, mais pour la blague, je l'ai forcé à remettre des doigts en plus pour faire écho à sa rapidité de traitement, au travail à 4 mains, et ChatGPT a dit 
> "oui, le défaut historique devient presque le sujet de l’image 😄 Les doigts en trop évoquent la vitesse de l’IA, et les deux mains qui travaillent ensemble racontent bien le « à quatre mains ». La boucle de feedback complète la blague : on itère vite, avec quelques doigts bonus."

Vous me pardonnerez l'AI Slop, du coup ? 😂

## Discussion

Comme d'habitude, vous pouvez répondre ou réagir ci-dessous 👇, et je ne consulte plus les réseaux sociaux, donc, pour me joindre, suprenez-moi !
