/* =====================================================================
   monuments.js — Base de données des lieux (Rome & Vatican)
   ---------------------------------------------------------------------
   Chaque lieu contient :
     id          : identifiant unique (utilisé pour la mémoire "déjà vu")
     nom         : nom affiché
     emoji       : pictogramme du marqueur sur la carte et dans la liste
     categorie   : 'antique' | 'vatican' | 'place' | 'eglise' | 'quartier'
     lat / lon   : coordonnées GPS (WGS84)
     duree       : temps de visite estimé, en minutes
     description : texte principal, lu par la synthèse vocale
     enfants     : section "Pour les enfants (9-12 ans)", lue également
     conseil     : astuce pratique (non lue à voix haute)
   ===================================================================== */

const CATEGORIES = {
  antique:  { label: 'Rome antique',      emoji: '🏛️' },
  vatican:  { label: 'Vatican',           emoji: '⛪' },
  place:    { label: 'Places & rues',     emoji: '⛲' },
  eglise:   { label: 'Églises & secrets', emoji: '🕯️' },
  quartier: { label: 'Quartiers & vues',  emoji: '🌳' }
};

const MONUMENTS = [
  /* ------------------------------------------------------------------
     ROME ANTIQUE
     ------------------------------------------------------------------ */
  {
    id: 'colisee',
    nom: 'Colisée',
    emoji: '🏟️',
    categorie: 'antique',
    lat: 41.8902, lon: 12.4922,
    duree: 120,
    description:
      "Inauguré en l'an 80 par l'empereur Titus, l'amphithéâtre Flavien est le plus grand jamais construit par les Romains : 188 mètres de long, près de 50 mètres de haut et plus de 50 000 spectateurs. Pendant quatre siècles, on y a organisé des combats de gladiateurs, des chasses d'animaux venus d'Afrique et des spectacles grandioses. Sa façade en travertin comptait 80 arcades, et un immense voile de toile, le velarium, protégeait le public du soleil. Sous l'arène, un réseau de couloirs, de cages et de monte-charges permettait de faire surgir bêtes et décors par des trappes.",
    enfants:
      "Chaque spectateur avait un ticket en terre cuite avec un numéro d'entrée, exactement comme dans un stade de football aujourd'hui : le Colisée pouvait se remplir ou se vider en quelques minutes. Sous tes pieds, dans les souterrains, des lions, des ours et même des crocodiles attendaient dans des cages avant d'être hissés vers l'arène par des ascenseurs à contrepoids ! Les gladiateurs étaient souvent des esclaves ou des prisonniers, mais les meilleurs devenaient de vraies stars, avec des supporters et des cadeaux. Contrairement aux films, la plupart des combats ne se terminaient pas par la mort : un gladiateur coûtait trop cher à entraîner. Regarde les trous dans les murs : au Moyen Âge, les Romains ont arraché les agrafes de fer qui tenaient les pierres pour les revendre.",
    conseil: "Billet à réserver en ligne à l'avance avec un créneau horaire. Le même billet inclut le Forum et le Palatin. Arrivez tôt le matin ou en fin d'après-midi."
  },
  {
    id: 'arc-constantin',
    nom: 'Arc de Constantin',
    emoji: '🏛️',
    categorie: 'antique',
    lat: 41.8898, lon: 12.4907,
    duree: 15,
    description:
      "Dressé en 315 juste à côté du Colisée, cet arc de triomphe de 21 mètres célèbre la victoire de Constantin sur son rival Maxence au pont Milvius, en 312. C'est le plus grand arc de triomphe romain qui nous soit parvenu. Une grande partie de ses sculptures a été récupérée sur des monuments plus anciens dédiés à Trajan, Hadrien et Marc Aurèle. Les généraux victorieux passaient sous ce type d'arc lors du triomphe, un défilé grandiose qui traversait Rome jusqu'au Capitole.",
    enfants:
      "Cet arc est un monument recyclé ! Les sculpteurs de Constantin ont pris des statues et des reliefs sur des monuments vieux de deux siècles, puis ont retaillé les visages des anciens empereurs pour qu'ils ressemblent à Constantin. Lors d'un triomphe, le général défilait sur un char doré, le visage peint en rouge, tandis qu'un esclave derrière lui murmurait sans cesse : « Souviens-toi que tu n'es qu'un homme ». Plus récemment, en 1960, la ligne d'arrivée du marathon des Jeux Olympiques de Rome était juste ici : le vainqueur, l'Éthiopien Abebe Bikila, a couru les 42 kilomètres pieds nus !",
    conseil: "Visible gratuitement depuis la rue. Idéal pour une photo de famille avec le Colisée en arrière-plan."
  },
  {
    id: 'forum-romain',
    nom: 'Forum Romain',
    emoji: '🏛️',
    categorie: 'antique',
    lat: 41.8925, lon: 12.4853,
    duree: 90,
    description:
      "Pendant plus de mille ans, le Forum a été le cœur de Rome : on y votait les lois, on y rendait la justice, on y priait les dieux et on y faisait ses courses. Entre le Capitole et le Palatin, on découvre les temples de Saturne, de Vesta et de Castor et Pollux, la Curie où siégeait le Sénat, les arcs de Septime Sévère et de Titus, et la Via Sacra, la rue la plus célèbre de l'Antiquité. Après la chute de l'Empire, le site fut abandonné et enseveli, au point de devenir un pâturage à vaches, avant les grandes fouilles du dix-neuvième siècle.",
    enfants:
      "Au temple de Vesta vivaient six prêtresses, les Vestales, choisies dès l'âge de 6 à 10 ans pour garder le feu sacré de Rome pendant trente ans. Si la flamme s'éteignait, c'était une catastrophe pour toute la ville ! En échange, elles avaient des places d'honneur au Colisée et pouvaient même gracier un condamné à mort rien qu'en le croisant. Cherche le temple de Jules César : c'est ici que son corps a été brûlé en 44 avant J.-C., et aujourd'hui encore des visiteurs y déposent des fleurs. Pendant des siècles, le Forum était enterré sous 10 mètres de terre : seul le sommet des colonnes dépassait, au milieu des vaches !",
    conseil: "Prévoir chapeau et eau, il y a peu d'ombre. Accès inclus dans le billet du Colisée. La terrasse derrière le Capitole offre la meilleure vue d'ensemble gratuite."
  },
  {
    id: 'palatin',
    nom: 'Mont Palatin',
    emoji: '🐺',
    categorie: 'antique',
    lat: 41.8892, lon: 12.4875,
    duree: 60,
    description:
      "Le Palatin est la colline où, selon la légende, Romulus fonda Rome le 21 avril 753 avant J.-C. Les archéologues y ont retrouvé des cabanes de l'âge du fer datant justement de cette époque. Sous l'Empire, les empereurs y bâtirent des palais gigantesques, dont la Domus Augustana et la Domus Flavia, avec leurs jardins, leurs fontaines et leur stade privé. Le mot « palais », dans presque toutes les langues, vient du nom de cette colline. Du haut des jardins Farnèse, la vue sur le Forum et le Circus Maximus est superbe.",
    enfants:
      "Voici l'histoire que tous les petits Romains connaissaient : deux jumeaux, Romulus et Rémus, abandonnés dans un panier sur le Tibre, furent recueillis et nourris par une louve dans une grotte au pied de cette colline. Devenus grands, ils se disputèrent pour savoir qui fonderait la ville : Romulus tua son frère et donna son nom à Rome. L'empereur Domitien, qui avait peur des complots, avait fait recouvrir les murs de ses galeries d'une pierre polie comme un miroir pour voir qui arrivait derrière lui. Et sous les sols des palais circulait de l'air chaud : les empereurs avaient déjà le chauffage au sol !",
    conseil: "Le Palatin est plus calme que le Forum : parfait pour une pause pique-nique à l'ombre des pins parasols."
  },
  {
    id: 'colonne-trajane',
    nom: 'Colonne et Marchés de Trajan',
    emoji: '📜',
    categorie: 'antique',
    lat: 41.8958, lon: 12.4845,
    duree: 45,
    description:
      "Achevée en 113, la colonne Trajane est un chef-d'œuvre : autour de ses 30 mètres s'enroule une frise de 200 mètres de long qui raconte, scène après scène, les guerres de l'empereur Trajan contre les Daces, dans l'actuelle Roumanie. Juste derrière, les Marchés de Trajan formaient un immense complexe en demi-cercle sur six niveaux, avec plus de 150 boutiques et bureaux : on le surnomme souvent le premier centre commercial de l'histoire. La statue de Trajan au sommet a été remplacée par celle de saint Pierre en 1587.",
    enfants:
      "La colonne est une bande dessinée en pierre : 155 scènes et environ 2 500 personnages sculptés, où Trajan apparaît 59 fois ! On y voit les soldats construire des ponts, des camps, soigner des blessés et combattre. La colonne est creuse : à l'intérieur, un escalier en colimaçon de 185 marches monte jusqu'au sommet. À sa base repose une urne en or avec les cendres de Trajan, un honneur exceptionnel car on n'enterrait jamais personne à l'intérieur de la ville. Dans les Marchés, imagine les boutiques d'huile, de vin, d'épices et de poissons, avec les clients romains qui marchandaient comme au marché aujourd'hui.",
    conseil: "La colonne se voit gratuitement depuis la Via dei Fori Imperiali. Les Marchés (musée des Forums impériaux) sont payants mais couverts : bonne option s'il pleut."
  },
  {
    id: 'circus-maximus',
    nom: 'Circus Maximus',
    emoji: '🐎',
    categorie: 'antique',
    lat: 41.8860, lon: 12.4853,
    duree: 30,
    description:
      "Le Circus Maximus est le plus grand stade jamais construit : 600 mètres de long, 140 mètres de large et jusqu'à 150 000 spectateurs, soit trois fois le Colisée. Pendant mille ans, on y a organisé des courses de chars tirés par quatre chevaux, les quadriges, ainsi que des fêtes et des défilés. Aujourd'hui, c'est une immense pelouse où les Romains viennent courir, mais on distingue encore parfaitement la forme de la piste et de la spina, le mur central autour duquel tournaient les chars.",
    enfants:
      "Les courses de chars étaient le sport numéro un des Romains, plus populaire que les gladiateurs ! Quatre équipes s'affrontaient : les Bleus, les Verts, les Rouges et les Blancs, avec des supporters aussi passionnés que ceux du football. Le champion le plus célèbre, Gaius Appuleius Diocles, a gagné 1 462 courses et une fortune si énorme qu'on le considère comme le sportif le mieux payé de toute l'Histoire. Les cochers attachaient les rênes autour de leur taille et gardaient un couteau pour les couper en cas d'accident, qu'on appelait un « naufrage ». Pour compter les sept tours, on abaissait des œufs et des dauphins en bronze géants. Fais la course avec tes parents sur la longueur de la piste !",
    conseil: "Accès libre à la pelouse. Depuis l'arrière du Circus, superbe vue sur les palais du Palatin. Une expérience de réalité augmentée (Circo Maximo Experience) est proposée à la billetterie."
  },
  {
    id: 'thermes-caracalla',
    nom: 'Thermes de Caracalla',
    emoji: '🛁',
    categorie: 'antique',
    lat: 41.8790, lon: 12.4925,
    duree: 60,
    description:
      "Construits entre 212 et 216 par l'empereur Caracalla, ces thermes s'étendaient sur 11 hectares et pouvaient accueillir 1 600 baigneurs en même temps. On y trouvait des bains froids, tièdes et chauds, une piscine olympique à ciel ouvert, des salles de sport, deux bibliothèques, des jardins et des boutiques. Les murs de briques, hauts de plus de 30 mètres, étaient recouverts de marbre et de mosaïques. Les thermes ont fonctionné jusqu'en 537, quand les Goths coupèrent les aqueducs qui les alimentaient en eau.",
    enfants:
      "Les thermes, c'était la piscine, la salle de sport, la bibliothèque et le parc réunis, et l'entrée coûtait presque rien ! Les Romains n'avaient pas de savon : ils s'enduisaient d'huile, puis grattaient la saleté avec une lame courbe appelée strigile. Sous tes pieds, deux kilomètres de galeries souterraines où des centaines d'esclaves alimentaient 50 fours en brûlant dix tonnes de bois par jour. L'air chaud circulait sous les sols et dans les murs : c'était le premier chauffage central. Les statues géantes découvertes ici, comme l'Hercule Farnèse, ont tellement impressionné les architectes que la grande gare de New York a été dessinée en copiant les thermes de Caracalla !",
    conseil: "Site vaste et souvent peu fréquenté, avec de grands espaces pour courir. En été, des opéras sont joués en plein air dans les ruines."
  },
  {
    id: 'via-appia',
    nom: 'Via Appia Antica',
    emoji: '🛣️',
    categorie: 'antique',
    lat: 41.8536, lon: 12.5205,
    duree: 120,
    description:
      "La « reine des routes » fut commencée en 312 avant J.-C. par le censeur Appius Claudius pour relier Rome à Capoue, puis au port de Brindisi, à 540 kilomètres. Ses grandes dalles de basalte, encore en place, sont bordées de tombeaux monumentaux comme celui de Cecilia Metella, du cirque de Maxence et de villas impériales. Aujourd'hui protégée dans un grand parc, inscrite à l'UNESCO en 2024, elle se parcourt à pied ou à vélo, dans une campagne de pins parasols et de cyprès qui n'a presque pas changé depuis l'Antiquité.",
    enfants:
      "Pose tes pieds dans les ornières creusées dans la pierre : ce sont les traces laissées par des milliers de roues de chars il y a 2 000 ans ! Les Romains construisaient leurs routes en quatre couches, légèrement bombées pour évacuer la pluie, avec une borne tous les milles, c'est-à-dire tous les mille pas de soldats, soit 1,5 kilomètre. C'est le long de cette route qu'en 71 avant J.-C., après la grande révolte des gladiateurs menée par Spartacus, 6 000 rebelles furent crucifiés, un tous les 30 mètres. Les tombeaux bordent la route parce qu'il était interdit d'enterrer les morts dans la ville. À la petite église Domine Quo Vadis, on montre les empreintes de pieds que Jésus aurait laissées en apparaissant à saint Pierre.",
    conseil: "Le dimanche, la route est fermée aux voitures : location de vélos près de la Via Appia Antica 58. Prévoir eau et goûter, peu de commerces sur place."
  },
  {
    id: 'catacombes',
    nom: 'Catacombes de Saint-Calixte',
    emoji: '🕯️',
    categorie: 'antique',
    lat: 41.8590, lon: 12.5115,
    duree: 45,
    description:
      "Les catacombes de Saint-Calixte sont les plus grandes de Rome : 20 kilomètres de galeries sur quatre niveaux, creusées dès le troisième siècle dans le tuf volcanique, avec près d'un demi-million de tombes. On y visite la crypte des Papes, où reposèrent neuf papes, et la crypte de sainte Cécile, ornée de fresques parmi les plus anciennes du christianisme. La visite se fait obligatoirement avec un guide, en français, dans une fraîcheur constante de 15 degrés.",
    enfants:
      "Imagine une ville souterraine de 20 kilomètres de couloirs, sur quatre étages, creusée à la main par des ouvriers appelés fossores qui travaillaient à la lueur de petites lampes à huile. Les premiers chrétiens y enterraient leurs morts dans des niches creusées dans la roche, fermées par des dalles portant des symboles secrets : le poisson, l'ancre, la colombe. Contrairement aux films, ils ne s'y cachaient pas vraiment : c'était un cimetière, mais on y priait ensemble. Le mot « catacombe » vient justement de ce quartier, appelé « ad catacumbas », près des creux. Il fait 15 degrés toute l'année : prends un pull, même en plein été !",
    conseil: "Fermé le mercredi. Escalier raide, non accessible aux poussettes. Bus 118 depuis le Circus Maximus ou le Colisée."
  },
  {
    id: 'pyramide-cestius',
    nom: 'Pyramide de Cestius',
    emoji: '🔺',
    categorie: 'antique',
    lat: 41.8763, lon: 12.4807,
    duree: 20,
    description:
      "Une vraie pyramide en plein Rome ! Haute de 36 mètres, elle fut bâtie entre 18 et 12 avant J.-C. comme tombeau de Caius Cestius, un riche magistrat, à l'époque où la conquête de l'Égypte avait lancé une véritable mode égyptienne. Au troisième siècle, elle fut intégrée aux murailles d'Aurélien, ce qui l'a sauvée. Juste à côté, le cimetière non catholique, envahi de chats et de cyprès, abrite les tombes des poètes anglais Keats et Shelley, et non loin, le Monte Testaccio est une colline entièrement faite de débris d'amphores.",
    enfants:
      "Le testament de Cestius disait que la pyramide devait être finie en 330 jours, sinon ses héritiers perdaient tout leur héritage : elle a été construite en un temps record ! Elle est plus pointue que les pyramides d'Égypte parce que les Romains les ont copiées sans jamais les voir de près. À l'intérieur, une petite chambre décorée de fresques, visitable certains week-ends. Et à quelques pas, le Monte Testaccio est une colline de 35 mètres de haut faite de 53 millions d'amphores cassées : c'était la décharge de Rome, où l'on jetait les jarres d'huile d'olive vides venues d'Espagne. Une montagne de poterie de 2 000 ans !",
    conseil: "Métro B, station Piramide. Le cimetière non catholique voisin est gratuit (don conseillé) et très paisible."
  },

  /* ------------------------------------------------------------------
     PLACES, FONTAINES & RUES
     ------------------------------------------------------------------ */
  {
    id: 'pantheon',
    nom: 'Panthéon',
    emoji: '🏛️',
    categorie: 'place',
    lat: 41.8986, lon: 12.4769,
    duree: 45,
    description:
      "Reconstruit par l'empereur Hadrien vers 125, le Panthéon est le monument antique le mieux conservé de Rome. Sa coupole de béton de 43 mètres de diamètre est restée la plus grande du monde sans armature pendant près de deux mille ans. Elle est percée d'un oculus de 9 mètres, unique source de lumière. Transformé en église en 609, ce qui lui a évité la destruction, il abrite les tombes du peintre Raphaël et des premiers rois d'Italie. Ses seize colonnes de granit ont été taillées en Égypte et transportées par bateau.",
    enfants:
      "Le grand trou au sommet de la coupole est vraiment ouvert : quand il pleut, il pleut à l'intérieur du Panthéon ! Le sol est légèrement bombé avec 22 petits trous pour évacuer l'eau. Les Romains ont utilisé un béton de plus en plus léger vers le haut, avec de la pierre ponce, et une recette si bonne que ce béton se répare tout seul quand il se fissure : les scientifiques ne l'ont compris qu'en 2023 ! La coupole est si parfaite qu'une boule géante de 43 mètres tiendrait exactement à l'intérieur. Le 21 avril à midi, jour de l'anniversaire de Rome, le rayon de soleil traverse l'oculus et éclaire pile la porte d'entrée. Chaque colonne du porche pèse 60 tonnes.",
    conseil: "Entrée payante depuis 2023 (gratuite pour les moins de 18 ans), billet à prendre en ligne ou sur place. Le matin tôt, on profite du rayon de lumière presque seuls."
  },
  {
    id: 'fontaine-trevi',
    nom: 'Fontaine de Trevi',
    emoji: '⛲',
    categorie: 'place',
    lat: 41.9009, lon: 12.4833,
    duree: 20,
    description:
      "Achevée en 1762 d'après les plans de Nicola Salvi, la fontaine de Trevi est la plus grande et la plus célèbre fontaine baroque du monde : 26 mètres de haut, 49 mètres de large. Au centre, le dieu Océan se dresse sur un char en forme de coquillage tiré par deux chevaux marins guidés par des tritons. L'eau vient de l'Aqua Virgo, un aqueduc construit en 19 avant J.-C. par Agrippa et qui fonctionne toujours. Son nom vient des « tre vie », les trois rues qui se croisent ici.",
    enfants:
      "La tradition : lance une pièce de la main droite par-dessus ton épaule gauche, en tournant le dos à la fontaine. Une pièce, tu reviendras à Rome ; deux, tu trouveras l'amour ; trois, tu te marieras ! Chaque jour, on ramasse environ 3 000 euros dans le bassin, soit plus d'un million par an, entièrement donnés à une association qui aide les pauvres. Regarde bien les deux chevaux : l'un est calme, l'autre se cabre, pour montrer les deux humeurs de la mer. L'aqueduc doit son nom de « Vierge » à une jeune fille qui aurait indiqué la source aux soldats romains assoiffés. Interdit de se baigner : une actrice a essayé dans un film célèbre, mais aujourd'hui l'amende est de 500 euros.",
    conseil: "Toujours bondée : venez avant 8 h du matin ou tard le soir, quand elle est illuminée. L'accès au bord du bassin peut être régulé par une file d'attente."
  },
  {
    id: 'place-espagne',
    nom: "Place d'Espagne",
    emoji: '🪜',
    categorie: 'place',
    lat: 41.9058, lon: 12.4823,
    duree: 30,
    description:
      "La Piazza di Spagna doit son nom à l'ambassade d'Espagne installée ici depuis le dix-septième siècle. Son escalier monumental de 135 marches, construit entre 1723 et 1726 grâce à un legs d'un diplomate français, monte vers l'église de la Trinité-des-Monts, propriété de la France. Au pied de l'escalier, la fontaine de la Barcaccia, en forme de barque à demi coulée, a été sculptée par Pietro Bernini avec l'aide de son fils, le grand Gian Lorenzo. Tout autour, la Via Condotti aligne les boutiques les plus luxueuses de Rome.",
    enfants:
      "Depuis 2019, il est interdit de s'asseoir sur les marches : les policiers sifflent et l'amende peut atteindre 250 euros ! Compte les marches en montant : il y en a 135, mais certains en trouvent 136, à cause d'une marche cachée. La fontaine en forme de bateau rappelle une légende : lors d'une grande crue du Tibre en 1598, une barque fut retrouvée échouée exactement ici, une fois l'eau retirée. Sur la Via Condotti, l'Antico Caffè Greco existe depuis 1760 : on y a servi Casanova, Goethe et Andersen. Au printemps, l'escalier est couvert de centaines d'azalées en fleurs.",
    conseil: "Métro A, station Spagna. En haut de l'escalier, la terrasse offre une belle vue ; continuez vers le Pincio pour rejoindre la Villa Borghèse."
  },
  {
    id: 'piazza-navona',
    nom: 'Piazza Navona',
    emoji: '⛲',
    categorie: 'place',
    lat: 41.8992, lon: 12.4731,
    duree: 30,
    description:
      "La plus belle place baroque de Rome garde exactement la forme allongée du stade de Domitien, construit en 86 pour 30 000 spectateurs, sur lequel elle a été bâtie. Au centre, la fontaine des Quatre-Fleuves du Bernin, achevée en 1651, porte un obélisque égyptien au-dessus de quatre géants représentant le Nil, le Gange, le Danube et le Rio de la Plata. En face, l'église Sainte-Agnès-en-Agone est l'œuvre de son rival Borromini. Peintres, musiciens et marchands de glaces animent la place toute l'année.",
    enfants:
      "Sous la place se trouvent encore les gradins du stade antique où couraient les athlètes : on peut les visiter en descendant sous les immeubles ! Aux dix-septième et dix-huitième siècles, chaque week-end d'août, on bouchait les évacuations des fontaines pour inonder la place et en faire un lac, où les nobles paradaient en carrosse dans l'eau. Sur la fontaine, le Nil se cache le visage avec un voile, parce qu'à l'époque personne ne savait où était sa source. Une légende dit que la statue du Rio de la Plata lève le bras comme pour se protéger de l'église d'en face qui va tomber, moquerie du Bernin envers Borromini... mais la fontaine a été construite avant l'église !",
    conseil: "Les restaurants sur la place sont chers : préférez les ruelles voisines. En décembre, marché de Noël avec manèges."
  },
  {
    id: 'campo-de-fiori',
    nom: "Campo de' Fiori",
    emoji: '🍅',
    categorie: 'place',
    lat: 41.8956, lon: 12.4722,
    duree: 20,
    description:
      "Le « champ de fleurs » était une prairie au Moyen Âge, avant de devenir l'une des places les plus vivantes de Rome. Chaque matin sauf le dimanche s'y tient un marché coloré de fruits, légumes, épices et fleurs. Au centre se dresse la statue encapuchonnée du philosophe Giordano Bruno, brûlé vif ici en 1600 pour avoir affirmé que l'univers était infini et que les étoiles étaient d'autres soleils. Le soir, la place devient le rendez-vous des jeunes Romains.",
    enfants:
      "Regarde la statue sombre au milieu de la place : Giordano Bruno a été condamné parce qu'il disait que la Terre tournait autour du Soleil et qu'il existait d'autres mondes, des idées qui se sont révélées vraies ! Sa statue, installée en 1889, tourne exprès le dos au Vatican. Les rues autour portent encore les noms des métiers du Moyen Âge : Via dei Cappellari, la rue des chapeliers, Via dei Giubbonari, la rue des fabricants de vestes, Via dei Chiavari, les serruriers. Au marché, goûte les fruits de saison, et à la boulangerie Forno Campo de' Fiori, la pizza bianca, une pizza sans garniture, juste avec de l'huile d'olive et du sel : le goûter préféré des enfants romains.",
    conseil: "Marché du lundi au samedi, de 7 h à 14 h environ. Attention aux prix affichés au poids sur les stands pour touristes."
  },
  {
    id: 'largo-argentina',
    nom: 'Largo di Torre Argentina',
    emoji: '🐈',
    categorie: 'place',
    lat: 41.8956, lon: 12.4767,
    duree: 20,
    description:
      "Au milieu de la circulation, ce vaste chantier de fouilles révèle quatre temples de la République romaine, vieux de plus de 2 000 ans, dégagés en 1929. Derrière eux se trouvaient les restes de la Curie de Pompée, où le Sénat se réunissait : c'est ici, et non au Forum, que Jules César fut assassiné aux ides de mars, le 15 mars 44 avant J.-C. Depuis 2023, des passerelles permettent de descendre parmi les ruines. Le site est aussi célèbre pour sa colonie de chats, protégée par une association de bénévoles.",
    enfants:
      "C'est exactement ici que Jules César, le plus célèbre des Romains, a été poignardé de 23 coups de couteau par un groupe de sénateurs, dont son ami Brutus. Selon la légende, il aurait dit en le voyant : « Toi aussi, mon fils ? ». Aujourd'hui, ce sont les chats qui règnent sur les ruines : plus d'une centaine y vivent, nourris et soignés par des bénévoles, et une loi de Rome déclare que les chats de la ville font partie du patrimoine. Cherche-les : ils dorment sur les vieilles colonnes, sur les autels, au soleil. Le nom « Argentina » ne vient pas du pays, mais de Strasbourg, appelée Argentoratum en latin, ville d'origine d'un évêque qui vivait ici.",
    conseil: "Les ruines se voient gratuitement depuis le trottoir ; la descente sur les passerelles est payante. Le refuge des chats accueille les visiteurs dans un coin du site."
  },
  {
    id: 'via-del-corso',
    nom: 'Via del Corso',
    emoji: '🛍️',
    categorie: 'place',
    lat: 41.9018, lon: 12.4792,
    duree: 45,
    description:
      "Parfaitement droite sur 1,5 kilomètre entre la Piazza Venezia et la Piazza del Popolo, la Via del Corso suit le tracé de l'antique Via Flaminia, ouverte en 220 avant J.-C. Son nom vient de la « corsa dei Barberi », la course de chevaux du carnaval de Rome qui s'y est tenue pendant quatre siècles. Aujourd'hui, c'est la grande rue commerçante de la ville. À mi-chemin, la Piazza Colonna abrite la colonne de Marc Aurèle, haute de 30 mètres, et le Palazzo Chigi, siège du gouvernement italien.",
    enfants:
      "Pendant 400 ans, chaque carnaval, on lâchait des chevaux sans cavalier tout au long de cette rue : on leur attachait des boules à pointes pour les faire galoper plus vite, et toute la ville regardait depuis les balcons ! La course a été arrêtée en 1874 après un grave accident. Sur la Piazza Colonna, la colonne de Marc Aurèle est une autre bande dessinée en pierre : elle raconte ses guerres contre les tribus germaniques, avec une scène célèbre où un dieu de la pluie sauve les soldats romains mourant de soif. Le grand palais à côté, avec ses gardes, est le bureau du Premier ministre italien. Et la galerie Alberto Sordi, juste en face, est parfaite pour une pause fraîche.",
    conseil: "Rue piétonne sur une grande partie, mais très fréquentée le samedi après-midi. Nombreux glaciers dans les rues perpendiculaires."
  },
  {
    id: 'piazza-del-popolo',
    nom: 'Piazza del Popolo',
    emoji: '🦁',
    categorie: 'place',
    lat: 41.9107, lon: 12.4763,
    duree: 30,
    description:
      "Pendant des siècles, les voyageurs venant du nord entraient dans Rome par la Porta del Popolo et découvraient cette immense place ovale, dessinée en 1822 par Valadier. En son centre, l'obélisque Flaminio, rapporté d'Égypte par Auguste, est vieux de 3 300 ans. Au sud, deux églises jumelles encadrent l'entrée de la Via del Corso. L'église Santa Maria del Popolo, près de la porte, cache deux chefs-d'œuvre du Caravage et une chapelle dessinée par Raphaël. Au-dessus, la terrasse du Pincio offre l'un des plus beaux couchers de soleil de Rome.",
    enfants:
      "L'obélisque a été taillé pour le pharaon Ramsès II il y a 3 300 ans ; les Romains l'ont rapporté par bateau et l'ont planté au milieu du Circus Maximus, où les chars tournaient autour à toute vitesse. Une légende raconte que l'église Santa Maria del Popolo a été construite sur la tombe du terrible empereur Néron : un noyer hanté y poussait, rempli de corbeaux qui étaient des démons, jusqu'à ce que le pape le fasse abattre en 1099. Les deux églises jumelles ne sont pas vraiment identiques : l'une a une coupole ronde, l'autre ovale, pour paraître pareilles vues de la rue. Regarde aussi les quatre lions qui crachent de l'eau en éventail au pied de l'obélisque.",
    conseil: "Métro A, station Flaminio. Montez au Pincio par la rampe à droite de la place pour la vue et l'entrée dans la Villa Borghèse."
  },
  {
    id: 'piazza-venezia',
    nom: 'Piazza Venezia et Vittoriano',
    emoji: '🎂',
    categorie: 'place',
    lat: 41.8955, lon: 12.4823,
    duree: 30,
    description:
      "Carrefour central de Rome, la Piazza Venezia est dominée par le Vittoriano, un monument colossal de marbre blanc érigé entre 1885 et 1935 en l'honneur de Victor-Emmanuel II, premier roi de l'Italie unifiée. Il abrite la tombe du Soldat inconnu, veillée en permanence par deux soldats et une flamme éternelle. Un ascenseur panoramique en verre mène à la terrasse supérieure, d'où l'on embrasse toute la ville. Sur le côté, le Palazzo Venezia fut la résidence de Mussolini, qui haranguait la foule depuis son balcon.",
    enfants:
      "Les Romains n'aiment pas beaucoup ce monument : ils le surnomment « la machine à écrire » ou « la pièce montée » à cause de sa forme et de sa couleur blanche. La statue du roi à cheval est si gigantesque, 12 mètres de haut, que le jour où elle a été terminée, en 1911, une vingtaine d'ouvriers ont organisé un dîner à l'intérieur du ventre du cheval ! Prends l'ascenseur en verre pour monter sur le toit : de là-haut, tu peux repérer le Colisée, le Panthéon et la coupole de Saint-Pierre. Devant la flamme, les deux soldats de garde ne bougent pas d'un millimètre. Sur la place, un policier perché sur un podium dirige parfois la circulation avec de grands gestes, comme un chef d'orchestre.",
    conseil: "Accès aux terrasses basses gratuit, ascenseur panoramique payant. Excellent point de repère pour s'orienter dans le centre."
  },
  {
    id: 'capitole',
    nom: 'Place du Capitole',
    emoji: '🐺',
    categorie: 'place',
    lat: 41.8933, lon: 12.4828,
    duree: 40,
    description:
      "La plus petite des sept collines de Rome était la plus sacrée : on y trouvait le temple de Jupiter, et le mot « capitale » en descend. Michel-Ange a dessiné la place actuelle à partir de 1536, avec son pavement en étoile, son escalier en pente douce, la Cordonata, et la statue équestre de Marc Aurèle en son centre. Les palais qui l'entourent abritent les Musées capitolins, le plus ancien musée public du monde, ouvert en 1471, où l'on admire la Louve capitoline et la tête colossale de Constantin. Derrière la mairie, une terrasse domine tout le Forum.",
    enfants:
      "Au musée, tu verras la Louve capitoline, la statue de bronze de la louve qui a nourri Romulus et Rémus, symbole de Rome depuis toujours ; les jumeaux ont été ajoutés bien plus tard. La statue de Marc Aurèle à cheval a survécu au Moyen Âge parce que tout le monde croyait qu'elle représentait Constantin, le premier empereur chrétien ; toutes les autres statues de bronze ont été fondues ! Tu verras aussi la tête géante de l'empereur Constantin : elle mesure 2,6 mètres, et son pied est plus grand qu'un enfant, car la statue entière faisait 12 mètres. Enfin, en 390 avant J.-C., des oies sacrées ont sauvé le Capitole en cacardant pour réveiller les gardes lors d'une attaque nocturne des Gaulois.",
    conseil: "La terrasse sur le Forum, derrière le palais du Sénat, est gratuite et magnifique au coucher du soleil. Musées capitolins : environ 2 h, café avec vue sur le toit."
  },

  /* ------------------------------------------------------------------
     ÉGLISES & LIEUX SECRETS
     ------------------------------------------------------------------ */
  {
    id: 'bocca-verita',
    nom: 'Bouche de la Vérité',
    emoji: '🗿',
    categorie: 'eglise',
    lat: 41.8880, lon: 12.4816,
    duree: 20,
    description:
      "Sous le porche de l'église Santa Maria in Cosmedin, ce grand disque de marbre de 1,75 mètre représente le visage d'un dieu fleuve, bouche ouverte. C'était probablement, au premier siècle, une plaque d'égout ou une bouche de fontaine. Placée ici en 1632, elle est devenue mondialement célèbre grâce au film Vacances romaines, en 1953. L'église elle-même, avec son campanile du douzième siècle et ses sols de mosaïques colorées, est l'une des plus charmantes de Rome. Tout près se dressent deux temples antiques parfaitement conservés, ceux d'Hercule et de Portunus.",
    enfants:
      "La légende dit que si tu mets ta main dans la bouche et que tu dis un mensonge, elle te la coupe ! Dans le film Vacances romaines, l'acteur Gregory Peck a fait semblant d'avoir perdu sa main en la retirant, et Audrey Hepburn a crié de peur pour de vrai, car il ne l'avait pas prévenue : le réalisateur a gardé cette scène. En réalité, c'était sans doute le couvercle d'un égout de la Cloaca Maxima, le grand égout de Rome, qui fonctionne toujours depuis 2 500 ans. À l'intérieur de l'église, dans une petite boîte de verre, on conserve le crâne de saint Valentin, celui de la Saint-Valentin ! Mets ta main dans la bouche... si tu oses.",
    conseil: "File d'attente pour la photo (petite contribution demandée), mais elle avance vite. L'église ferme à l'heure du déjeuner."
  },
  {
    id: 'aventin',
    nom: "Aventin : trou de serrure et Jardin des Orangers",
    emoji: '🔑',
    categorie: 'eglise',
    lat: 41.8833, lon: 12.4780,
    duree: 30,
    description:
      "La colline de l'Aventin est un havre de calme au-dessus du Circus Maximus. Sur la Piazza dei Cavalieri di Malta, dessinée par Piranèse en 1765, la porte du prieuré de l'Ordre de Malte cache un secret : par le trou de sa serrure, on voit la coupole de Saint-Pierre parfaitement encadrée par une allée de lauriers. À côté, le Jardin des Orangers offre une terrasse panoramique sur le Tibre et Rome, et l'église Santa Sabina, du cinquième siècle, conserve des portes de bois sculptées vieilles de 1 600 ans.",
    enfants:
      "Colle ton œil au trou de la serrure : tu vois trois pays d'un coup ! Le jardin appartient à l'Ordre de Malte, qui est un État sans territoire, la ville de Rome est en Italie, et la coupole au bout de l'allée est au Vatican. Le Jardin des Orangers est plein d'orangers amers : leurs fruits ne se mangent pas, mais sentent divinement. À Santa Sabina, un petit trou dans le mur de l'entrée permet de voir un oranger que saint Dominique aurait planté en 1220 : l'arbre actuel serait son descendant. Et les portes en bois de l'église, sculptées vers 430, forment une bande dessinée avec l'une des plus anciennes images de la crucifixion au monde.",
    conseil: "Petite file d'attente pour le trou de serrure, souvent moins de 10 minutes. Le jardin est parfait pour un pique-nique avec vue."
  },
  {
    id: 'saint-jean-latran',
    nom: 'Basilique Saint-Jean-de-Latran',
    emoji: '⛪',
    categorie: 'eglise',
    lat: 41.8859, lon: 12.5057,
    duree: 40,
    description:
      "Souvent éclipsée par Saint-Pierre, Saint-Jean-de-Latran est pourtant la cathédrale de Rome et la « mère de toutes les églises » : fondée en 324 par Constantin, c'est la plus ancienne basilique d'Occident, et les papes y ont vécu pendant mille ans. Sa nef, redessinée par Borromini, est bordée de douze statues d'apôtres hautes de sept mètres. Sur la place, l'obélisque de Latran, venu du temple de Karnak, est le plus haut obélisque antique au monde. En face, les pèlerins gravissent à genoux la Scala Santa, l'escalier saint.",
    enfants:
      "L'obélisque de la place est le plus grand du monde : 32 mètres de granit, 3 500 ans, taillé en Égypte pour le pharaon Thoutmôsis. Il a fallu construire un bateau géant spécial pour le faire venir jusqu'à Rome en 357. En face, la Scala Santa est un escalier de 28 marches qui, selon la tradition, vient du palais de Ponce Pilate à Jérusalem, où Jésus l'aurait monté : les pèlerins ne le gravissent qu'à genoux, et les marches sont couvertes de bois pour les protéger. Dans la basilique, au-dessus de l'autel, un grand baldaquin doré contiendrait les crânes de saint Pierre et de saint Paul. Chaque nouveau pape vient prendre possession de cette église, car il est aussi l'évêque de Rome.",
    conseil: "Métro A, station San Giovanni. Entrée gratuite. Le cloître (payant) est un petit bijou avec ses colonnes torsadées."
  },
  {
    id: 'saint-clement',
    nom: 'Basilique Saint-Clément',
    emoji: '⬇️',
    categorie: 'eglise',
    lat: 41.8893, lon: 12.4977,
    duree: 45,
    description:
      "À deux pas du Colisée, Saint-Clément est un véritable mille-feuille d'histoire. L'église actuelle, du douzième siècle, avec sa mosaïque dorée de l'Arbre de vie, est bâtie sur une basilique du quatrième siècle ornée de fresques, elle-même construite sur des bâtiments romains du premier siècle, dont un temple secret dédié au dieu Mithra. Depuis 1667, la basilique est tenue par des dominicains irlandais, et c'est l'un d'eux, le père Mullooly, qui a découvert les niveaux souterrains en 1857.",
    enfants:
      "Descends trois étages, et tu remontes 2 000 ans dans le temps ! En haut, l'église de l'an 1100 ; en dessous, celle de l'an 400 ; tout en bas, une rue romaine de l'an 100, avec un temple secret de Mithra où des hommes, uniquement des hommes, se réunissaient pour des banquets et des rituels mystérieux autour d'un taureau sacrifié. Tends l'oreille au niveau le plus bas : on entend couler une rivière souterraine qui coule toujours depuis l'Antiquité. Sur une fresque du deuxième niveau, une bulle de dialogue contient l'une des toutes premières phrases écrites en italien, et ce sont... des gros mots que crie un noble païen à ses serviteurs !",
    conseil: "L'église du haut est gratuite, les souterrains sont payants (billet en ligne conseillé). Il fait frais et humide en bas : idéal en pleine chaleur."
  },
  {
    id: 'sainte-marie-majeure',
    nom: 'Basilique Sainte-Marie-Majeure',
    emoji: '❄️',
    categorie: 'eglise',
    lat: 41.8976, lon: 12.4985,
    duree: 40,
    description:
      "Construite entre 432 et 440, Sainte-Marie-Majeure est la plus grande église de Rome dédiée à la Vierge et l'une des quatre basiliques papales. Ses mosaïques de la nef datent de sa fondation, son campanile de 75 mètres est le plus haut de Rome, et son plafond doré aurait été réalisé avec le premier or rapporté d'Amérique. Sous l'autel, une relique de la crèche de Bethléem est vénérée depuis des siècles. Le grand sculpteur Bernin y est enterré, et le pape François a choisi d'y reposer en 2025, dans une tombe volontairement très simple.",
    enfants:
      "La légende de la neige : dans la nuit du 4 au 5 août 358, en pleine canicule romaine, la Vierge apparut en rêve au pape et à un riche Romain, leur demandant de construire une église là où il neigerait. Le lendemain matin, une colline était couverte de neige, en plein été ! Depuis, chaque 5 août, on fait tomber des milliers de pétales blancs du plafond de la basilique pendant la messe. L'or du plafond serait le premier or rapporté d'Amérique par Christophe Colomb et offert par les rois d'Espagne. Sous l'autel, dans un reliquaire de cristal, on garde des morceaux de bois qui viendraient de la mangeoire où Jésus a été couché à sa naissance.",
    conseil: "Près de la gare Termini. Entrée gratuite, tenue correcte exigée. La tombe du pape François se trouve dans la nef latérale gauche, près de la chapelle Pauline."
  },

  /* ------------------------------------------------------------------
     QUARTIERS & POINTS DE VUE
     ------------------------------------------------------------------ */
  {
    id: 'ghetto',
    nom: "Ghetto et Portique d'Octavie",
    emoji: '🎣',
    categorie: 'quartier',
    lat: 41.8925, lon: 12.4778,
    duree: 30,
    description:
      "Le quartier juif de Rome est l'un des plus anciens du monde : une communauté y vit depuis plus de 2 000 ans, enfermée derrière des murs de 1555 à 1870. Ses ruelles mènent au Portique d'Octavie, construit par Auguste pour sa sœur, dont les ruines abritèrent le marché aux poissons pendant tout le Moyen Âge, et au théâtre de Marcellus, un « petit Colisée » transformé en palais. La grande synagogue de 1904 et son musée racontent cette histoire. Les trattorias servent les célèbres artichauts à la juive, frits et croustillants.",
    enfants:
      "Le théâtre de Marcellus ressemble à un petit Colisée, mais il est plus ancien, et des gens habitent dedans : au Moyen Âge, une famille a construit son palais par-dessus, et il y a encore des appartements tout en haut ! Sous le Portique d'Octavie, une plaque de marbre du Moyen Âge dit que toute tête de poisson plus longue que la plaque devait être donnée aux chefs de la ville pour faire de la soupe. Devant certaines portes, tu verras de petits pavés dorés, les « pierres d'achoppement » : chacune porte le nom d'un habitant qui a été emmené pendant la Seconde Guerre mondiale, pour qu'on ne l'oublie jamais. Sur la place voisine, la fontaine des Tortues aurait été construite en une seule nuit par un duc pour impressionner son futur beau-père.",
    conseil: "Goûtez la pizza ebraica (gâteau aux fruits secs) à la pâtisserie Boccione. Le quartier est calme le samedi, jour de shabbat."
  },
  {
    id: 'ile-tiberine',
    nom: 'Île Tibérine',
    emoji: '🚢',
    categorie: 'quartier',
    lat: 41.8907, lon: 12.4776,
    duree: 20,
    description:
      "Seule île du Tibre à Rome, longue de 300 mètres, l'île Tibérine est dédiée à la médecine depuis 2 300 ans : un temple d'Esculape, dieu de la guérison, y fut construit en 293 avant J.-C., et l'hôpital Fatebenefratelli y fonctionne encore aujourd'hui, depuis 1584. On y accède par le pont Fabricius, bâti en 62 avant J.-C. : c'est le plus vieux pont de Rome encore utilisé dans son état d'origine. L'été, les quais accueillent un cinéma en plein air et des terrasses.",
    enfants:
      "En 293 avant J.-C., une épidémie ravageait Rome. Les Romains envoyèrent un navire en Grèce chercher le dieu de la médecine. Au retour, un serpent sacré se glissa hors du bateau et nagea jusqu'à cette île : on y construisit le temple, et les Romains sculptèrent l'île entière en forme de bateau, avec un obélisque comme mât ! À la pointe sud, on voit encore la « proue » en pierre avec le serpent gravé. Le pont Fabricius que tu traverses a 2 000 ans : on l'appelle le pont des Quatre-Têtes à cause de ses statues à quatre visages. Une légende raconte que ce sont quatre architectes que le pape fit décapiter parce qu'ils se disputaient sans arrêt.",
    conseil: "Traversez l'île pour passer du Ghetto au Trastevere : c'est le chemin le plus joli. Glacier et pause à l'ombre sur les quais."
  },
  {
    id: 'trastevere',
    nom: 'Trastevere',
    emoji: '🍕',
    categorie: 'quartier',
    lat: 41.8895, lon: 12.4699,
    duree: 60,
    description:
      "« Au-delà du Tibre », Trastevere est le quartier-village de Rome : ruelles pavées, façades ocre couvertes de lierre, linge aux fenêtres et trattorias sur les places. Au cœur du quartier, la basilique Santa Maria in Trastevere, fondée au troisième siècle, éblouit par ses mosaïques dorées et ses 22 colonnes antiques prises aux thermes de Caracalla. À voir aussi : l'église Sainte-Cécile, la Villa Farnesina peinte par Raphaël, le jardin botanique et, le dimanche matin, le grand marché aux puces de Porta Portese.",
    enfants:
      "Regarde les pavés sous tes pieds : ce sont les sampietrini, les « petits Saint-Pierre », des cubes de basalte noir posés un par un à la main, très glissants quand il pleut ! Sur la façade de Santa Maria in Trastevere, la mosaïque montre douze brebis qui représentent les apôtres. Une légende raconte qu'en l'an 38 avant J.-C., une fontaine d'huile a jailli du sol à cet endroit pendant toute une journée. À la Villa Farnesina, le banquier Agostino Chigi, l'homme le plus riche de Rome, jetait sa vaisselle en argent dans le Tibre après ses banquets pour épater ses invités... mais il avait fait installer des filets pour tout récupérer ! C'est le meilleur quartier pour la pizza à la coupe et les glaces.",
    conseil: "Le soir, arrivez avant 19 h 30 pour trouver une table sans réserver. Les marches de la Piazza Trilussa sont le lieu de rendez-vous des Romains."
  },
  {
    id: 'janicule',
    nom: 'Janicule',
    emoji: '💥',
    categorie: 'quartier',
    lat: 41.8918, lon: 12.4610,
    duree: 40,
    description:
      "Le Janicule n'est pas l'une des sept collines, mais c'est le plus beau balcon de Rome. Sa terrasse domine toute la ville, du Vatican au Colisée. Le monument équestre de Garibaldi rappelle la bataille de 1849 pour défendre la République romaine, et des dizaines de bustes de ses compagnons bordent les allées. Plus bas, la Fontana dell'Acqua Paola, surnommée le Fontanone, déverse ses eaux depuis 1612, et le Tempietto de Bramante, joyau de la Renaissance, se cache dans la cour de San Pietro in Montorio. Chaque jour à midi, un coup de canon retentit.",
    enfants:
      "Chaque jour, à midi pile, un vrai canon tire un coup à blanc depuis la terrasse ! Cette tradition date de 1847 : le pape voulait que toutes les cloches de Rome sonnent midi en même temps. Arrive vers 11 h 50, bouche-toi les oreilles, et regarde les pigeons s'envoler. Le week-end, un petit théâtre de marionnettes joue les aventures de Pulcinella, comme il y a cent ans. Un jeu depuis la terrasse : retrouve le Vittoriano tout blanc, la coupole du Panthéon et le Colisée. Ne rate pas la statue d'Anita Garibaldi, la femme du héros : elle galope sur un cheval cabré, un bébé dans un bras et un pistolet dans l'autre, car elle a vraiment combattu à ses côtés.",
    conseil: "Montée à pied depuis Trastevere en 15 min, ou bus 115. Marchands de glaces et jeux pour enfants sur la terrasse."
  },
  {
    id: 'villa-borghese',
    nom: 'Villa Borghèse',
    emoji: '🚣',
    categorie: 'quartier',
    lat: 41.9130, lon: 12.4850,
    duree: 90,
    description:
      "Avec ses 80 hectares, la Villa Borghèse est le grand parc de Rome, ancien domaine du cardinal Scipione Borghese créé en 1606. On y trouve la Galerie Borghèse, avec les sculptures les plus célèbres du Bernin et des toiles du Caravage, un lac avec des barques et un petit temple, le zoo Bioparco, une horloge à eau, la terrasse du Pincio, un cinéma minuscule et de grandes pelouses. On peut y louer des vélos ou des voitures à pédales pour explorer les allées bordées de pins parasols.",
    enfants:
      "C'est le parc des Romains, et il est fait pour vous : louez une rosalie, une voiture à pédales pour quatre, ou une barque sur le petit lac pour ramer jusqu'au temple d'Esculape. Près du Pincio, une horloge de 1867 fonctionne uniquement avec de l'eau, sans électricité ni ressort. Le Cinema dei Piccoli, une maisonnette de 63 places, est le plus petit cinéma du monde depuis 1934. À la Galerie Borghèse, cherche la statue de Daphné qui se transforme en arbre pour échapper à Apollon : ses feuilles en marbre sont aussi fines que du papier. Et le visage du David du Bernin, qui se mord la lèvre en visant Goliath, est celui du sculpteur lui-même, qui se regardait dans un miroir.",
    conseil: "Galerie Borghèse : réservation obligatoire plusieurs semaines à l'avance, visite limitée à 2 h. Location de rosalies près de la Casina dell'Orologio."
  },

  /* ------------------------------------------------------------------
     VATICAN
     ------------------------------------------------------------------ */
  {
    id: 'chateau-saint-ange',
    nom: 'Château Saint-Ange',
    emoji: '🏰',
    categorie: 'vatican',
    lat: 41.9031, lon: 12.4663,
    duree: 75,
    description:
      "Construit vers 139 comme mausolée de l'empereur Hadrien, le château est devenu forteresse, refuge des papes, prison redoutée et aujourd'hui musée. Un passage secret de 800 mètres, le Passetto di Borgo, le relie au Vatican depuis 1277. Au sommet, l'archange saint Michel en bronze rengaine son épée, en souvenir d'une vision du pape Grégoire le Grand qui annonça la fin de la peste de 590. On y découvre la rampe en spirale antique, les appartements des papes, les cachots, et une terrasse avec une vue splendide sur le pont Saint-Ange et ses anges du Bernin.",
    enfants:
      "En 1527, quand les soldats de Charles Quint pillèrent Rome, le pape Clément VII s'enfuit du Vatican par le passage secret sur les murailles, pendant que 147 gardes suisses mouraient pour le protéger : c'est pour cela que les gardes suisses prêtent serment chaque 6 mai. Le sculpteur Benvenuto Cellini, enfermé ici en 1538, s'est évadé avec une corde faite de draps, mais il s'est cassé la jambe en sautant ! Dans les cours, tu verras des tas de boulets de pierre pour les catapultes et des cuves pour l'huile bouillante. Et à l'intérieur, la grande rampe en spirale a été creusée pour le cortège funèbre de l'empereur Hadrien, il y a presque 1 900 ans.",
    conseil: "Billet en ligne pour éviter la file. Le café sur la terrasse haute est l'un des plus beaux points de vue de Rome. Comptez 1 h 30 avec les enfants."
  },
  {
    id: 'place-saint-pierre',
    nom: 'Place Saint-Pierre',
    emoji: '🔑',
    categorie: 'vatican',
    lat: 41.9022, lon: 12.4573,
    duree: 30,
    description:
      "Dessinée par le Bernin entre 1656 et 1667, la place Saint-Pierre est enserrée par deux colonnades de 284 colonnes surmontées de 140 statues de saints : les « bras » de l'Église accueillant les fidèles. Au centre, l'obélisque de 25 mètres, rapporté d'Égypte par Caligula, se dressait dans le cirque de Néron où saint Pierre fut martyrisé. Il fut déplacé ici en 1586 par 900 ouvriers et 140 chevaux. La place peut réunir 300 000 personnes lors des audiences du mercredi et de l'Angélus du dimanche à midi.",
    enfants:
      "Bienvenue dans le plus petit pays du monde : le Vatican fait 44 hectares, moins qu'un grand parc, et compte environ 800 habitants, avec ses propres timbres, ses pièces d'euro, ses plaques d'immatriculation et même une équipe de football. La frontière avec l'Italie est une simple ligne sur le sol de la place ! Cherche les deux disques de pierre entre l'obélisque et les fontaines : quand tu te places dessus, les quatre rangées de colonnes s'alignent parfaitement et il n'y en a plus qu'une. Le jour où l'on a dressé l'obélisque, le silence était obligatoire sous peine de mort ; mais un marin cria « De l'eau sur les cordes ! » et sauva l'opération. Les gardes suisses en uniforme jaune, bleu et rouge doivent être suisses, célibataires et mesurer au moins 1,74 mètre.",
    conseil: "Entrée gratuite après un contrôle de sécurité (file variable). Le mercredi matin, la place est fermée pour l'audience papale."
  },
  {
    id: 'basilique-saint-pierre',
    nom: 'Basilique Saint-Pierre',
    emoji: '⛪',
    categorie: 'vatican',
    lat: 41.9022, lon: 12.4539,
    duree: 90,
    description:
      "Plus grande église du monde, Saint-Pierre a été bâtie entre 1506 et 1626 au-dessus de la tombe de l'apôtre Pierre, par les plus grands artistes : Bramante, Michel-Ange, Maderno et le Bernin. Sa coupole culmine à 136 mètres, sa nef mesure 186 mètres et elle peut accueillir 60 000 personnes. On y admire la Pietà, sculptée par Michel-Ange à 24 ans, le baldaquin de bronze du Bernin haut de 29 mètres, et la statue de saint Pierre au pied usé. Les grottes vaticanes abritent les tombes des papes, et la montée à la coupole offre le plus beau panorama de Rome.",
    enfants:
      "Sur le sol de la nef, des marques de bronze indiquent la taille des autres grandes églises du monde : toutes tiendraient à l'intérieur de Saint-Pierre. Pour grimper à la coupole, il y a 551 marches, ou un ascenseur puis 320 marches, dans des couloirs penchés et étroits entre les deux coques du dôme : là-haut, tu domines toute la ville. Michel-Ange a sculpté la Pietà à 24 ans, et quand il a entendu des visiteurs dire qu'elle était d'un autre artiste, il est revenu la nuit graver son nom sur la ceinture de Marie : c'est la seule œuvre qu'il ait jamais signée. Le pied droit de la statue de saint Pierre est complètement usé par les millions de pèlerins qui le touchent. Sous l'autel, à 20 mètres de profondeur, les archéologues ont retrouvé la tombe de saint Pierre.",
    conseil: "Épaules et genoux couverts obligatoires, même pour les enfants. Coupole : montée à faire tôt le matin, éviter avec de jeunes enfants claustrophobes. Entrée gratuite, la file de sécurité est commune avec la place."
  },
  {
    id: 'musees-vatican',
    nom: 'Musées du Vatican et Chapelle Sixtine',
    emoji: '🎨',
    categorie: 'vatican',
    lat: 41.9065, lon: 12.4536,
    duree: 180,
    description:
      "Les Musées du Vatican comptent 7 kilomètres de galeries et 20 000 œuvres exposées : momies égyptiennes, statues grecques comme le Laocoon et l'Apollon du Belvédère, la galerie des Cartes géographiques longue de 120 mètres, les Chambres de Raphaël et leur École d'Athènes. Le parcours s'achève dans la chapelle Sixtine, dont Michel-Ange a peint le plafond entre 1508 et 1512, avec la célèbre Création d'Adam, puis le Jugement dernier. C'est ici que les cardinaux, enfermés en conclave, élisent le pape. L'escalier à double hélice de la sortie est l'un des plus photographiés du monde.",
    enfants:
      "Michel-Ange a peint les 500 mètres carrés du plafond de la Sixtine pendant quatre ans, debout sur un échafaudage, la tête renversée en arrière, la peinture lui coulant dans les yeux ; il a même écrit un poème pour se plaindre de son mal de dos ! Dans cette salle, les cardinaux s'enferment à clé, « cum clave », pour élire le pape : on brûle les bulletins de vote, et la fumée qui sort de la cheminée est noire si personne n'est élu, blanche quand il y a un nouveau pape. Dans la chapelle, silence total et pas de photos. Cherche aussi la Pigna, une pomme de pin de bronze de 4 mètres qui était une fontaine romaine, la galerie aux 40 cartes géantes de l'Italie, et le Laocoon, une statue retrouvée dans une vigne en 1506 : Michel-Ange est venu la voir sortir de terre.",
    conseil: "Réservation en ligne indispensable, sur le site officiel uniquement. Fermé le dimanche sauf le dernier du mois (gratuit mais bondé). Demandez le parcours famille ou l'audioguide enfants."
  }
];

/* Export pour un éventuel usage en module (tests, scripts Node) ; sans effet dans le navigateur. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MONUMENTS, CATEGORIES };
}
