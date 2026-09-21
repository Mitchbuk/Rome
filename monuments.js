/* =====================================================================
   monuments.js — Base de données des lieux (Rome & Vatican)
   ---------------------------------------------------------------------
   FICHIER GÉNÉRÉ par scripts/build_monuments.js à partir de content/part*.json.
   Pour modifier un texte : éditer le JSON correspondant dans content/, puis
   relancer  node scripts/build_monuments.js  (et  python scripts/generate_audio.py
   pour régénérer les MP3 des textes modifiés).

   Chaque lieu contient :
     id          : identifiant unique (photos img/<id>.jpg, audios audio/<id>-*.mp3)
     nom         : nom affiché
     categorie   : 'antique' | 'vatican' | 'place' | 'eglise' | 'quartier'
     lat / lon   : coordonnées GPS (WGS84)
     duree       : temps de visite estimé, en minutes
     conseil     : astuce pratique (non lue à voix haute)
     adultes     : sections { titre, texte } du guide adultes
     enfants     : sections { titre, texte } du guide enfants (9-12 ans)
   Les adresses "Où manger" (categorie 'manger') ont une structure propre :
     type ('trattoria' | 'street' | 'bar'), quartier, budget, prix, resume,
     pourquoi, commander, enfants (texte), pratique { adresse, horaires,
     fermeture, reservation, tel, site }, conseil. Pas d'audio MP3 : la fiche
     est lue par la voix du téléphone.
   ===================================================================== */

const CATEGORIES = {
  antique: {
    label: "Rome antique",
    emoji: "🏛️"
  },
  vatican: {
    label: "Vatican",
    emoji: "⛪"
  },
  place: {
    label: "Places & rues",
    emoji: "⛲"
  },
  eglise: {
    label: "Églises & secrets",
    emoji: "🕯️"
  },
  quartier: {
    label: "Quartiers & vues",
    emoji: "🌳"
  },
  manger: {
    label: "Où manger",
    emoji: "🍝"
  }
};

const MONUMENTS = [
  {
    id: "colisee",
    nom: "Colisée",
    categorie: "antique",
    lat: 41.8902, lon: 12.4922,
    duree: 120,
    conseil: "Billet à réserver en ligne à l'avance avec un créneau horaire. Le même billet inclut le Forum et le Palatin. Arrivez tôt le matin ou en fin d'après-midi.",
    adultes: [
      { titre: "Des origines à l'inauguration",
        texte: "Vers 70 de notre ère, l'empereur Vespasien décide d'offrir au peuple un terrain que Néron s'était approprié. Il s'agit du lac artificiel de sa Maison dorée, dans la vallée entre le Palatin, l'Esquilin et le Cælius. Le chantier est financé en grande partie par le butin rapporté de Jérusalem, prise en 70. Vespasien meurt avant la fin des travaux. Son fils Titus inaugure l'amphithéâtre en 80 avec cent jours de jeux, puis son second fils, Domitien, achève le dernier étage et fait creuser les souterrains. Les Romains l'appelaient l'amphithéâtre Flavien, du nom de cette dynastie. Le surnom de Colisée n'apparaît qu'au Moyen Âge, sans doute en souvenir du Colosse. C'était une statue de bronze de Néron, haute d'environ trente mètres, qui se dressait juste à côté." },
      { titre: "Un géant de travertin",
        texte: "L'édifice dessine une ellipse de 188 mètres sur 156, pour près de 50 mètres de haut. Sa façade est en travertin, une pierre calcaire claire extraite près de Tivoli. Elle superpose trois niveaux de 80 arcades, encadrées de demi-colonnes toscanes, ioniques puis corinthiennes, et un dernier étage plein, l'attique, percé de fenêtres. Les blocs étaient assemblés sans mortier et tenus par environ 300 tonnes d'agrafes de fer. À l'intérieur, le tuf, la brique et le béton romain portent des gradins prévus pour 50 000 à 70 000 spectateurs, selon les estimations. Tout en haut, 240 mâts soutenaient le velarium, une immense toile tendue pour protéger le public du soleil. Sous l'arène de bois recouverte de sable, l'hypogée, c'est-à-dire le sous-sol, abritait deux niveaux de couloirs, de cages et de monte-charges." },
      { titre: "Une journée au Colisée",
        texte: "Les spectacles étaient gratuits, offerts par l'empereur ou un riche magistrat. Le programme suivait toujours le même ordre. Le matin, on donnait les chasses : des combattants spécialisés, les bestiaires, affrontaient lions, ours, panthères ou éléphants dans des décors reconstitués. À midi venaient les exécutions de condamnés. L'après-midi, enfin, le clou du spectacle, les combats de gladiateurs. Chacun s'asseyait selon son rang. Le podium, au plus près de l'arène, était réservé aux sénateurs, aux magistrats et aux Vestales, avec la loge impériale au centre. Au-dessus s'installaient les chevaliers, puis les citoyens ordinaires. Tout en haut, sur des gradins de bois, se tenaient les femmes, les esclaves et les plus pauvres. Les gladiateurs s'entraînaient juste à côté, au Ludus Magnus, une caserne reliée à l'arène par un tunnel. Ses ruines sont encore visibles de l'autre côté de la rue." },
      { titre: "Abandon, pillage et survie",
        texte: "Les derniers combats de gladiateurs ont eu lieu vers 435, les dernières chasses vers 523. Puis le monument est tombé dans l'oubli. Des tremblements de terre, dont celui de 1349, ont fait s'effondrer une grande partie du côté sud. Pendant des siècles, le Colisée a servi de carrière. On a pris ses blocs pour bâtir le palais de Venise, le palais Barberini et même une partie de la basilique Saint-Pierre. La famille Frangipane en a fait une forteresse, et des artisans y ont installé leurs ateliers. En 1749, le pape Benoît XIV l'a consacré à la mémoire des martyrs chrétiens, ce qui a mis fin aux pillages. Au dix-neuvième siècle, les architectes Stern et Valadier ont sauvé la façade avec de grands contreforts de brique, d'énormes murs de soutien. On les distingue nettement aux deux extrémités de l'anneau extérieur." },
      { titre: "Parcours conseillé",
        texte: "Faites d'abord le tour de l'arène au premier niveau : vous y prendrez la mesure de l'ellipse et du dédale des souterrains. Une plateforme reconstituée montre la hauteur de l'ancien plancher. Montez ensuite au deuxième niveau, d'où la vue est la plus saisissante. D'un côté, les gradins en ruine ; de l'autre, à travers les arcades, l'arc de Constantin et le temple de Vénus et de Rome. Repérez au sol les fragments de marbre des anciennes places d'honneur. À l'extérieur, observez la différence entre la façade complète du nord et le mur intérieur mis à nu au sud." }
    ],
    enfants: [
      { titre: "Imagine le jour de l'ouverture",
        texte: "Imagine : nous sommes en l'an 80. L'empereur Titus vient d'inaugurer le plus grand amphithéâtre du monde et il a promis cent jours de fêtes. Tu serres dans ta main ton jeton en terre cuite, tu cherches ton numéro au-dessus des arcades, tu grimpes des escaliers sombres. Et soudain, tu débouches en pleine lumière. Des dizaines de milliers de personnes crient, ça sent le sable et le parfum, et un immense voile de toile claque au-dessus de ta tête. Dans la loge d'honneur, l'empereur lève la main. Le spectacle commence." },
      { titre: "Vaincu, mais vivant ?",
        texte: "Quand un gladiateur tombait, il levait un doigt pour demander grâce. Alors la foule hurlait « Mitte ! », ce qui veut dire laisse-le partir, ou « Iugula ! », achève-le. Et c'est l'empereur qui décidait. Contrairement à ce que montrent les films, personne ne sait vraiment si le pouce vers le bas voulait dire la mort : les Romains ne l'ont jamais expliqué clairement. Ce que l'on sait, c'est que les gladiateurs mangeaient surtout de l'orge et des fèves, ce qui leur valait le surnom de « hordearii », les mangeurs d'orge. En étudiant leurs os, les archéologues ont retrouvé les traces de cette alimentation très riche en légumes." },
      { titre: "Rétiaire contre secutor",
        texte: "Chaque gladiateur avait son équipement, comme un personnage de jeu vidéo. Le rétiaire n'avait presque pas d'armure, seulement un filet, un trident et un poignard, mais il courait vite. Face à lui, le secutor portait un casque lisse et rond, sans rebord, pour que le filet glisse dessus. Mais il voyait à peine par deux petits trous et s'essoufflait vite. Le mirmillon avait un grand bouclier et un casque orné d'un poisson. Le Thrace, lui, avait un bouclier minuscule et une épée courbe. Les organisateurs opposaient toujours des équipements différents, pour que personne ne puisse deviner le vainqueur." },
      { titre: "Une mer dans l'arène ?",
        texte: "Les écrivains romains racontent que, pour l'inauguration, l'arène a été remplie d'eau et que des navires y ont livré une vraie bataille. Est-ce possible ? Les historiens en discutent encore. Les souterrains que tu vois aujourd'hui n'existaient pas encore : Domitien les a fait creuser quelques années plus tard. Au tout début, sans ces souterrains, remplir l'arène d'eau était donc peut-être possible." },
      { titre: "Défi sur place",
        texte: "Lève les yeux au-dessus des arcades du rez-de-chaussée, du côté de la rue. Certaines portent encore leur numéro en chiffres romains, gravé il y a presque deux mille ans pour guider les spectateurs. Trouve un L et un V. Puis cherche la grande croix de bois à l'intérieur. Compte combien d'étages d'arcades restent debout au point le plus haut. Enfin, repère, tout en haut, les petits trous carrés où l'on plantait les mâts du velarium, la grande toile qui servait de toit." },
      { titre: "Quiz éclair",
        texte: "Question : qui manœuvrait l'immense toile tendue pour protéger les spectateurs du soleil ? Réponse : des marins de la flotte de guerre romaine, venus exprès de la base navale de Misène, près de Naples. Ils étaient les seuls à savoir tirer autant de cordages en même temps, comme sur un navire. Ils logeaient dans une caserne près du Colisée, prêts à hisser les toiles dès que le soleil tapait trop fort." }
    ]
  },
  {
    id: "arc-constantin",
    nom: "Arc de Constantin",
    categorie: "antique",
    lat: 41.8898, lon: 12.4907,
    duree: 15,
    conseil: "Visible gratuitement depuis la rue. Idéal pour une photo de famille avec le Colisée en arrière-plan.",
    adultes: [
      { titre: "Une victoire au pont Milvius",
        texte: "Le 28 octobre 312, Constantin affronte son rival Maxence aux portes de Rome, au pont Milvius, et remporte une victoire décisive. Il entre dans Rome en vainqueur, et le Sénat décide de lui élever un arc de triomphe, inauguré en 315 pour ses dix ans de règne. L'inscription, répétée sur les deux faces, attribue la victoire à « l'inspiration de la divinité » et à la grandeur de son esprit. La formule est volontairement vague : Constantin venait d'autoriser le christianisme par l'édit de Milan, mais le Sénat, encore païen, évitait de nommer un dieu en particulier. L'arc est ainsi le dernier grand monument de la Rome antique et l'un des premiers de la Rome chrétienne." },
      { titre: "Chiffres et architecture",
        texte: "Avec ses 21 mètres de haut, 25,7 mètres de large et 7,4 mètres de profondeur, c'est le plus grand arc de triomphe romain conservé. Trois passages le traversent : celui du centre est plus haut et plus large que les deux autres. Huit colonnes corinthiennes en marbre jaune de Numidie, un marbre précieux venu d'Afrique du Nord, rythment les façades. L'attique, l'étage plein tout en haut, porte l'inscription de dédicace, encadrée de reliefs et de huit statues de prisonniers daces en marbre blanc veiné de violet. Avec ses marbres blancs, gris et colorés, la façade était bien plus éclatante qu'elle ne le paraît aujourd'hui." },
      { titre: "Un monument de réemploi",
        texte: "La plupart des sculptures ont été prélevées sur des monuments plus anciens. Les statues de Daces et les grands panneaux de bataille, visibles dans le passage central et sur les petits côtés de l'attique, viennent du forum de Trajan. Les huit médaillons ronds, qui montrent des chasses et des sacrifices, proviennent d'un monument d'Hadrien. Les huit panneaux rectangulaires de l'attique célébraient à l'origine Marc Aurèle. Les seuls reliefs sculptés pour l'occasion forment la frise étroite qui court au-dessus des passages latéraux. On y suit le siège de Vérone, la bataille du pont Milvius, l'entrée dans Rome, le discours au Forum et la distribution d'argent au peuple. Leurs personnages trapus, aux grosses têtes, annoncent déjà l'art du Moyen Âge." },
      { titre: "La cérémonie du triomphe",
        texte: "Le triomphe était l'honneur suprême accordé par le Sénat à un général victorieux. Le cortège partait du Champ de Mars, franchissait une porte spéciale, contournait le Palatin, remontait la Via Sacra à travers le Forum et s'achevait au temple de Jupiter Capitolin. En tête défilaient les sénateurs et les musiciens, puis venaient les chariots de butin, les tableaux peints des batailles, les taureaux blancs destinés au sacrifice et les prisonniers enchaînés. Le général fermait la marche sur son char à quatre chevaux, le quadrige. Ses soldats le suivaient en chantant des couplets moqueurs sur leur chef, pour éloigner le mauvais sort. Selon certains historiens, Constantin aurait évité la montée finale au Capitole et le sacrifice à Jupiter, un geste très remarqué à l'époque." },
      { titre: "Hier et aujourd'hui",
        texte: "Au Moyen Âge, l'arc a été englobé dans la forteresse des Frangipane, ce qui l'a protégé. Il a été dégagé et restauré au dix-huitième siècle, puis en 1804. Devant lui, un tracé circulaire au sol marque l'emplacement de la Meta Sudans, une fontaine conique antique démolie en 1936 pour laisser passer les défilés. Pour lire le monument, placez-vous côté Colisée, au nord. Sous les médaillons, la petite frise de Constantin montre l'empereur qui parle à la foule depuis les Rostres, la tribune du Forum. Les statues d'Hadrien et de Marc Aurèle l'encadrent, comme pour l'inscrire dans la lignée des bons empereurs." }
    ],
    enfants: [
      { titre: "Imagine le grand défilé",
        texte: "Imagine des trompettes, des tambours, et la foule qui se presse le long de la rue. Un général victorieux passe sous une arche immense, debout sur un char tiré par quatre chevaux blancs. Derrière lui, des chariots débordent d'or, de vases et d'armes pris à l'ennemi, des prisonniers marchent enchaînés, et des soldats brandissent des pancartes racontant leurs batailles. Voilà à quoi servait un arc de triomphe : une porte de gloire, construite pour un seul homme, et que tout le monde devait admirer pendant des siècles." },
      { titre: "Un puzzle de pierres",
        texte: "Regarde bien : cet arc est fait de morceaux qui n'ont pas le même âge. Les statues de prisonniers barbus tout en haut, avec leurs bonnets, ont été prises à un monument de Trajan. Les grands médaillons ronds viennent d'un monument d'Hadrien. Les tableaux rectangulaires du haut célébraient Marc Aurèle. Et la bande sculptée étroite, juste au-dessus des petites arches, avec ses personnages serrés aux grosses têtes, a été faite exprès pour Constantin, à toute vitesse. Les sculpteurs ont même retaillé les visages des vieux empereurs pour leur donner la tête de Constantin ! Compare les deux styles : lequel te semble le plus réussi ?" },
      { titre: "Le signe dans le ciel",
        texte: "Selon une histoire racontée bien après la bataille, Constantin aurait vu une croix lumineuse dans le ciel, la veille du combat. Elle était accompagnée de ces mots : « Par ce signe, tu vaincras ». Il aurait fait peindre le signe sur les boucliers de ses soldats. Le lendemain, l'armée de son rival Maxence a reculé en désordre vers le Tibre. Le pont de bateaux a cédé sous le poids des fuyards, et Maxence est tombé dans le fleuve avec son armure." },
      { titre: "Le champion pieds nus",
        texte: "Le 10 septembre 1960, la ligne d'arrivée du marathon des Jeux olympiques de Rome se trouvait exactement ici. La course s'est déroulée le soir, dans des rues éclairées par des soldats tenant des torches. Un inconnu venu d'Éthiopie, Abebe Bikila, a franchi la ligne le premier, pieds nus, en battant le record du monde. Ses chaussures neuves lui faisaient mal, alors il avait décidé de courir comme il s'entraînait chez lui. Quatre ans plus tard, il a gagné de nouveau, avec des chaussures cette fois." },
      { titre: "Défi sur place",
        texte: "Fais le tour complet de l'arc. Cherche dans les grands médaillons ronds les animaux chassés par Hadrien : un lion, un sanglier et un ours se cachent dans les sculptures, avec des chiens de chasse. Compte ensuite les colonnes jaunes : il doit y en avoir huit. Enfin, lève la tête vers l'inscription tout en haut et trouve les quatre lettres S P Q R gravées dans la pierre." },
      { titre: "Quiz éclair",
        texte: "Question : que signifient les lettres S P Q R que l'on voit sur l'arc ? Réponse : « Senatus Populusque Romanus », le Sénat et le peuple romain. C'était la signature officielle de Rome, gravée sur les monuments et portée sur les enseignes des légions. Le plus drôle, c'est qu'elle est toujours utilisée aujourd'hui : regarde les plaques d'égout, les poubelles et les bus de Rome, ces quatre lettres sont partout." }
    ]
  },
  {
    id: "forum-romain",
    nom: "Forum Romain",
    categorie: "antique",
    lat: 41.8925, lon: 12.4853,
    duree: 90,
    conseil: "Prévoir chapeau et eau, il y a peu d'ombre. Accès inclus dans le billet du Colisée. La terrasse derrière le Capitole offre la meilleure vue d'ensemble gratuite.",
    adultes: [
      { titre: "D'un marais au centre du monde",
        texte: "Au huitième siècle avant Jésus-Christ, la vallée entre le Capitole et le Palatin n'est qu'un marécage où l'on enterre les morts des villages voisins. Les rois étrusques la drainent grâce à un grand égout, la Cloaca Maxima, qui fonctionne encore. Le terrain assaini devient une place de marché, puis le cœur politique de la République. On y trouve le Comitium, où le peuple vote, la Curie, où siège le Sénat, et la tribune des Rostres, d'où parlent les orateurs. Sous l'Empire, les empereurs le couvrent de temples, de basiliques et d'arcs, mais le pouvoir réel se déplace vers le Palatin et les nouveaux forums impériaux. Le Forum reste malgré tout, pendant mille ans, le symbole même de Rome." },
      { titre: "Les monuments à ne pas manquer",
        texte: "En entrant par la Via Sacra, on passe sous l'arc de Titus, élevé en 81 pour célébrer la prise de Jérusalem. Sur la droite, les trois voûtes colossales de la basilique de Maxence, hautes de 25 mètres, ne sont qu'un tiers de l'édifice d'origine. Plus loin, le temple d'Antonin et Faustine doit sa survie à l'église bâtie à l'intérieur. Au centre se trouvent le petit temple rond de Vesta et la maison des Vestales, avec ses bassins et ses statues. Trois colonnes élancées signalent le temple de Castor et Pollux, et huit colonnes de granit marquent celui de Saturne. La Curie, reconstruite par Dioclétien, est presque intacte, et l'arc de Septime Sévère, élevé en 203, ferme la place du côté du Capitole." },
      { titre: "La vie quotidienne au Forum",
        texte: "Dès l'aube, le Forum bourdonnait. Les avocats plaidaient dans les basiliques, de vastes halles couvertes où l'on rendait la justice à l'abri du soleil. Les banquiers tenaient boutique sous les portiques, et les crieurs annonçaient les nouvelles et les enchères. Les jours de fête, les processions et les triomphes remontaient la Via Sacra. Le calendrier officiel, les lois gravées sur bronze et les traités étaient affichés ici. Cicéron y a prononcé ses grands discours. Après son assassinat en 43 avant Jésus-Christ, Marc Antoine a fait clouer sa tête et ses mains sur la tribune même d'où il avait parlé. Un an plus tôt, c'est au Forum que le corps de César avait été brûlé par une foule en colère, à l'endroit où s'élève aujourd'hui un petit autel." },
      { titre: "Ce qui a disparu",
        texte: "Il faut imaginer les colonnes de marbre coloré, les toits couverts de tuiles de bronze doré, les statues peintes par centaines, les inscriptions rehaussées de rouge. La plupart des marbres ont été brûlés dans des fours à chaux au Moyen Âge pour produire du mortier. Les portes de bronze de la Curie ont été transférées en 1660 à la basilique Saint-Jean-de-Latran, où elles servent toujours : celles que l'on voit ici sont des copies. Les temples ont perdu leurs statues de culte, et les basiliques leurs toitures. Quant au sol de la place, il a fini enseveli sous près de dix mètres de terre et de gravats, accumulés au fil des crues et des démolitions." },
      { titre: "Oubli et redécouverte",
        texte: "Au Moyen Âge, le Forum devient le Campo Vaccino, le champ aux vaches, un pré où l'on mène paître le bétail entre des colonnes à demi enterrées. Les artistes du dix-huitième siècle, Piranèse en tête, en dessinent les ruines romantiques. Les premières fouilles sérieuses commencent en 1803 avec Carlo Fea, qui dégage l'arc de Septime Sévère, puis s'intensifient après l'unification de l'Italie. Entre 1898 et 1925, l'archéologue Giacomo Boni fouille jusqu'aux niveaux les plus anciens et découvre le Lapis Niger, une dalle de pierre noire. Elle recouvre l'une des plus anciennes inscriptions latines connues, datée du sixième siècle avant Jésus-Christ. Le dernier monument élevé au Forum, la colonne de Phocas, date de 608 : elle marque la fin d'une histoire de plus de mille ans." }
    ],
    enfants: [
      { titre: "Imagine la foule du matin",
        texte: "Imagine : le soleil se lève sur la Via Sacra. Des sénateurs en toge blanche bordée de pourpre discutent en marchant, suivis de leurs secrétaires. Un avocat répète son discours à voix haute. Des enfants de ton âge courent vers l'école avec leurs tablettes de cire sous le bras. Devant les boutiques des changeurs, on pèse des pièces d'argent. Ça sent le pain chaud, l'encens des temples et la sueur des mules. Tu es au centre du monde connu." },
      { titre: "Le trésor sous le temple",
        texte: "Le temple de Saturne, avec ses huit grosses colonnes, servait de coffre-fort à l'État romain. Dans ses caves, on gardait les réserves d'or et d'argent, les enseignes des légions et les textes des lois. En 49 avant Jésus-Christ, Jules César, qui venait de prendre le pouvoir par la force, a voulu s'en emparer pour payer ses soldats. Un magistrat nommé Metellus, un tribun chargé de défendre le peuple, s'est planté devant la porte pour l'en empêcher. César lui a répondu qu'il lui serait plus facile de le tuer que de le menacer, et Metellus s'est écarté. César a emporté le trésor." },
      { titre: "Rallumer le feu sacré",
        texte: "Le feu de Vesta ne devait jamais s'éteindre, et pourtant cela arrivait. On ne le rallumait pas avec n'importe quelle flamme. Selon l'écrivain Plutarque, les Vestales concentraient les rayons du soleil dans un récipient de bronze poli pour enflammer une mèche. Ou bien elles frottaient deux morceaux de bois d'un arbre porte-bonheur. Dans ce temple rond, on cachait aussi des objets sacrés que personne, à part elles, n'avait le droit de voir. Parmi eux, une statue mystérieuse venue, disait-on, de Troie : tant qu'elle restait à Rome, la ville était protégée." },
      { titre: "Le nombril de Rome",
        texte: "Près de l'arc de Septime Sévère, un petit monument rond en brique marquait l'Umbilicus Urbis, le nombril de la ville, considéré comme le centre exact de Rome. Juste à côté, Auguste avait fait dresser le Milliaire d'or, une colonne recouverte de bronze doré. On y avait gravé les distances entre Rome et les grandes villes de l'Empire. C'est de là que vient l'expression « tous les chemins mènent à Rome » : toutes les routes étaient mesurées à partir de ce point." },
      { titre: "Défi sur place",
        texte: "Sous l'arc de Titus, lève la tête vers les sculptures de l'intérieur : cherche le grand chandelier à sept branches que les soldats romains rapportent de Jérusalem. Ensuite, compte les colonnes du temple de Saturne et trouve les trois colonnes solitaires de Castor et Pollux. Enfin, dans la maison des Vestales, repère les longs bassins et les statues de prêtresses alignées, dont plusieurs ont perdu leur tête." },
      { titre: "Quiz éclair",
        texte: "Question : pourquoi la tribune des orateurs s'appelle-t-elle les Rostres ? Réponse : parce qu'elle était décorée de rostres, les éperons de bronze que les navires de guerre portaient à l'avant pour éventrer les bateaux ennemis. Les Romains les avaient arrachés à la flotte de la ville d'Antium, vaincue en 338 avant Jésus-Christ, et les avaient fixés sur la tribune comme des trophées. Quand un orateur parlait au peuple, il avait donc littéralement des becs de navires sous les pieds." }
    ]
  },
  {
    id: "palatin",
    nom: "Mont Palatin",
    categorie: "antique",
    lat: 41.8892, lon: 12.4875,
    duree: 60,
    conseil: "Le Palatin est plus calme que le Forum : parfait pour une pause pique-nique à l'ombre des pins parasols.",
    adultes: [
      { titre: "La colline des origines",
        texte: "Le Palatin est la plus ancienne des sept collines habitées. Sur son versant sud-ouest, les archéologues ont mis au jour en 1948 les trous de poteaux de cabanes de bergers, datées du dixième au huitième siècle avant Jésus-Christ. C'est à cet endroit précis que la tradition situait la cabane de Romulus, que les Romains ont entretenue avec soin jusque sous l'Empire. Au pied de la colline se trouvait le Lupercal, la grotte où la louve aurait allaité les jumeaux, et devant elle, le figuier sous lequel leur panier se serait échoué. Chaque 15 février, la fête des Lupercales y rassemblait des jeunes gens qui couraient autour de la colline. En 204 avant Jésus-Christ, on y a installé le temple de la Grande Mère, la déesse Cybèle, dont la pierre noire avait été rapportée d'Asie Mineure." },
      { titre: "Le quartier chic de la République",
        texte: "Aux derniers siècles de la République, le Palatin est le quartier le plus recherché de Rome : Cicéron, Crassus, l'orateur Hortensius ou Catilina y possèdent leurs maisons. C'est là que naît Auguste en 63 avant Jésus-Christ. Devenu maître de Rome, il achète la maison d'Hortensius et les propriétés voisines pour y bâtir un ensemble volontairement sobre. Il le relie au temple d'Apollon, qu'il inaugure en 28 avant Jésus-Christ avec une bibliothèque grecque et une bibliothèque latine. Les maisons dites d'Auguste et de Livie conservent des fresques aux couleurs éclatantes, avec des architectures peintes en trompe-l'œil, des masques de théâtre et des scènes mythologiques." },
      { titre: "Les palais des empereurs",
        texte: "Tibère fait bâtir le premier vrai palais, la Domus Tiberiana, aujourd'hui sous les jardins Farnèse. Caligula l'étend jusqu'au Forum, Néron relie le Palatin à l'Esquilin par sa Maison dorée. Mais c'est Domitien qui, vers 92, confie à l'architecte Rabirius l'ensemble qui occupe encore le sommet. Il comprend trois parties. La Domus Flavia est l'aile officielle, avec sa salle du trône, sa basilique et sa salle de banquet ouvrant sur des fontaines. La Domus Augustana est la résidence privée, sur deux niveaux autour d'un bassin. Le Stade, enfin, est un jardin en forme de piste de 160 mètres de long. Septime Sévère complète l'ensemble vers le Circus Maximus par des terrasses sur arcades, dont les hautes arches de brique dominent encore la vallée." },
      { titre: "Ce qu'il en reste",
        texte: "Les palais ont été pillés dès le sixième siècle, et leurs marbres ont alimenté les fours à chaux. Il faut imaginer les sols en marbres de couleur, les murs revêtus de plaques polies, les statues colossales, les jardins suspendus. Au seizième siècle, le cardinal Alexandre Farnèse fait aménager sur les ruines de la Domus Tiberiana les Orti Farnesiani, les jardins Farnèse. C'est l'un des premiers jardins botaniques d'Europe, avec des volières et des terrasses. Le Septizodium, façade monumentale de Septime Sévère tournée vers la Via Appia, a été démoli en 1588 par Sixte Quint. Les fouilles commencées sous Napoléon III, qui avait acheté les jardins Farnèse en 1861, se poursuivent encore aujourd'hui." },
      { titre: "Parcours et points de vue",
        texte: "Depuis le Forum, montez par le Clivus Palatinus jusqu'aux jardins Farnèse : le belvédère offre la plus belle vue plongeante sur le Forum, la Curie et le Capitole. Redescendez vers la maison de Livie et la maison d'Auguste, puis traversez la Domus Flavia pour rejoindre le Stade. Continuez jusqu'à la terrasse de la Domus Augustana, qui domine le Circus Maximus. Le musée du Palatin, installé dans un ancien couvent, présente les objets trouvés sur la colline, des fragments de fresques aux sculptures des palais. Sous les palais, le cryptoportique de Néron, un long couloir voûté, est traditionnellement associé à l'assassinat de Caligula. En 41, l'empereur a été poignardé par ses propres gardes dans un passage du palais." }
    ],
    enfants: [
      { titre: "Imagine le premier village",
        texte: "Imagine cette colline il y a près de trois mille ans. Pas de marbre, pas de palais : quelques cabanes de bois et de paille, aux toits pointus, entourées d'une palissade. Des bergers gardent leurs moutons sur les pentes, des enfants vont chercher l'eau au Tibre, et le soir, la fumée des foyers monte dans le ciel. C'est de ce village minuscule qu'est née la ville qui allait dominer tout le monde connu." },
      { titre: "Le mystère de la grotte",
        texte: "En 2007, des archéologues qui exploraient le sous-sol avec une caméra ont fait une découverte à seize mètres sous la maison d'Auguste. Ils ont trouvé une grotte décorée de coquillages, de mosaïques et de marbres colorés, avec un aigle blanc au centre de la voûte. Certains ont aussitôt crié : c'est le Lupercal, la grotte de la louve, transformée en sanctuaire par Auguste ! D'autres pensent que c'est simplement une belle salle à manger souterraine avec des fontaines. Le mystère n'est pas résolu, et la grotte est trop fragile pour être visitée. La louve garde son secret." },
      { titre: "Un empereur qui dormait modestement",
        texte: "Auguste, le premier empereur, aurait pu vivre dans le luxe. Pourtant, selon l'écrivain Suétone, il a dormi pendant quarante ans dans la même petite chambre, dans une maison sans marbre, aux murs peints de rouge et de jaune. Il l'avait fait relier au temple d'Apollon, son dieu protecteur, et travaillait dans un petit bureau tout en haut qu'il surnommait « Syracuse ». Les empereurs suivants ont été bien moins modestes : Domitien s'est fait construire une salle du trône si haute qu'un immeuble de dix étages y tiendrait presque." },
      { titre: "Un stade pour un seul homme",
        texte: "Domitien avait aussi un stade privé, une longue piste de 160 mètres entourée de portiques, des galeries à colonnes. Personne ne sait exactement à quoi il servait : peut-être à se promener à cheval, à faire des courses ou à admirer les jardins, peut-être seulement à se détendre. Plus tard, un roi barbare, Théodoric, y a fait ajouter une petite piste ovale. Debout sur la terrasse qui le domine, tu vois toute sa forme d'un coup. C'est l'un des endroits les plus étranges de la colline : une piste de course perdue au milieu d'un palais." },
      { titre: "Défi sur place",
        texte: "Depuis le belvédère des jardins Farnèse, retrouve dans le Forum en contrebas l'arc de Septime Sévère et le grand toit de la Curie. Puis, dans la maison de Livie, cherche sur les murs peints des guirlandes de fruits et des oiseaux. Enfin, dans les palais de Domitien, trouve la grande fontaine en forme d'octogone, un bassin à huit côtés creusé de petits canaux, et compte les côtés pour vérifier." },
      { titre: "Quiz éclair",
        texte: "Question : quel mot très courant, que tu utilises pour désigner la maison d'un roi, vient directement du nom de cette colline ? Réponse : le mot palais. Comme les empereurs habitaient tous sur le Palatin, le nom latin de la colline, Palatium, a fini par désigner leur demeure, puis toutes les grandes demeures royales. On le retrouve dans « palace » en anglais, « palazzo » en italien et « Palast » en allemand." }
    ]
  },
  {
    id: "colonne-trajane",
    nom: "Colonne et Marchés de Trajan",
    categorie: "antique",
    lat: 41.8958, lon: 12.4845,
    duree: 45,
    conseil: "La colonne se voit gratuitement depuis la Via dei Fori Imperiali. Les Marchés (musée des Forums impériaux) sont payants mais couverts : bonne option s'il pleut.",
    adultes: [
      { titre: "Le forum du plus grand empire",
        texte: "Entre 101 et 106, Trajan mène deux guerres contre les Daces, un peuple installé dans l'actuelle Roumanie, et s'empare de leur royaume et de ses mines d'or. Ce butin finance le plus vaste des forums impériaux, inauguré en 112 et confié à l'architecte Apollodore de Damas. Il a fallu pour cela raser une partie de la colline du Quirinal. L'ensemble comprenait une immense place bordée de portiques et la basilique Ulpia, la plus grande de Rome. Venaient ensuite deux bibliothèques, l'une grecque et l'autre latine, la colonne dressée entre elles, puis le temple de Trajan divinisé, ajouté par Hadrien. L'historien Ammien Marcellin raconte qu'en 357, l'empereur Constance II est resté muet de stupeur devant cet ensemble unique au monde." },
      { titre: "La colonne, chiffres et techniques",
        texte: "Le fût mesure un peu moins de 30 mètres et repose sur un piédestal de plus de 5 mètres, pour près de 40 mètres au total avec la statue. Il est composé de dix-sept blocs cylindriques de marbre de Carrare, appelés tambours, pesant chacun plusieurs dizaines de tonnes et empilés avec une précision extraordinaire. Un escalier en colimaçon éclairé par 43 petites fenêtres monte jusqu'au sommet. La frise, sculptée après la pose des blocs, s'enroule sur 23 tours et près de 200 mètres. Sa hauteur augmente légèrement vers le haut, pour compenser l'éloignement du regard. À l'origine, elle était peinte de couleurs vives et garnie d'armes miniatures en métal, aujourd'hui disparues. La statue de bronze doré de Trajan, tombée au Moyen Âge, a été remplacée en 1587 par un saint Pierre sur ordre de Sixte Quint." },
      { titre: "Lire la frise",
        texte: "Le récit commence en bas par la traversée du fleuve sur un pont de bateaux. Viennent ensuite la construction des camps et des routes, les discours de Trajan à ses troupes, les sacrifices et les ambassades. Puis ce sont les batailles, où l'on reconnaît les Daces à leur bonnet et à leur épée courbe. Une Victoire écrivant sur un bouclier sépare la première guerre de la seconde. On y voit le pont de pierre jeté sur le Danube par Apollodore et la prise de la capitale, Sarmizegetusa. Puis vient la fin tragique du roi Décébale, qui se donne la mort au moment où les cavaliers romains l'atteignent. Détail remarquable, les Romains sont plus souvent représentés en train de construire que de combattre : la frise célèbre l'ordre et la discipline autant que la victoire." },
      { titre: "Les Marchés de Trajan",
        texte: "Derrière la colonne, un vaste ensemble de brique en demi-cercle épouse la pente du Quirinal, sur six niveaux. Les quelque 150 salles voûtées ouvrant sur des rues pavées ont longtemps été prises pour des boutiques, d'où le surnom de premier centre commercial de l'histoire. Les archéologues y voient aujourd'hui plutôt des bureaux de l'administration impériale, chargée notamment des distributions de blé. La Grande Salle, couverte de six voûtes d'arêtes, c'est-à-dire des voûtes qui se croisent, est un chef-d'œuvre de l'architecture en brique et béton. Au Moyen Âge, la Torre delle Milizie, haute tour du treizième siècle, a été plantée sur l'ensemble, transformé ensuite en couvent. Dégagé dans les années 1930, l'ensemble abrite le musée des Forums impériaux." },
      { titre: "Une postérité mondiale",
        texte: "La colonne Trajane a servi de modèle à la colonne de Marc Aurèle, à quelques centaines de mètres, puis à des monuments bien plus lointains. La colonne Vendôme, à Paris, coulée en 1810 dans le bronze des canons pris à Austerlitz, ou les colonnes de la Karlskirche, à Vienne, s'en inspirent directement. Napoléon III a fait réaliser en 1861 un moulage complet de la frise. On en trouve des copies au Victoria and Albert Museum de Londres et au musée de la Civilisation romaine, à Rome. Elles permettent d'étudier de près des scènes que l'on ne distingue plus depuis le sol." }
    ],
    enfants: [
      { titre: "Imagine une bande dessinée déroulée",
        texte: "Imagine que tu puisses dérouler la sculpture qui s'enroule autour de cette colonne. Tu obtiendrais une bande de pierre de 200 mètres, soit deux terrains de football mis bout à bout. Dessus, plus de 2 500 personnages : des soldats, des chevaux, des rivières, des villes en flammes, des bateaux. C'est une bande dessinée en pierre, racontée dans l'ordre, du bas vers le haut. À l'époque, elle était peinte de couleurs vives, et les Romains pouvaient lire les scènes du haut depuis les terrasses des deux bibliothèques qui l'entouraient." },
      { titre: "Le meilleur des empereurs",
        texte: "Trajan est né en Espagne, à Italica, près de Séville : c'est le premier empereur qui ne venait pas d'Italie. Soldat avant tout, il marchait à pied avec ses légions, mangeait la même chose qu'elles et traversait les rivières à la nage. Les Romains l'aimaient tellement que le Sénat lui a donné le titre d'« Optimus », le Meilleur. Pendant des siècles après sa mort, quand un nouvel empereur montait sur le trône, on lui souhaitait d'être « plus heureux qu'Auguste et meilleur que Trajan »." },
      { titre: "La montagne déplacée",
        texte: "Lis l'inscription sur le socle. Elle explique que la colonne a été dressée pour montrer à quelle hauteur s'élevait la colline que les ouvriers ont enlevée pour bâtir le forum. Autrement dit, là où tu te trouves, il y avait autrefois une montagne de terre et de roche presque aussi haute que la colonne. Des milliers d'ouvriers l'ont creusée et transportée à la pelle et à la brouette, sans aucune machine. Les Romains voulaient que tout le monde connaisse cet exploit." },
      { titre: "Le trésor du roi Décébale",
        texte: "Le roi des Daces, Décébale, avait caché son trésor d'une manière géniale. Il avait fait détourner une rivière, enterrer l'or et l'argent dans son lit, puis remettre l'eau à sa place. Personne n'aurait dû le trouver. Mais un de ses compagnons, capturé par les Romains, a révélé le secret. Trajan a récupéré des tonnes d'or et d'argent, assez pour payer le forum, la colonne et 123 jours de fêtes à Rome." },
      { titre: "Défi sur place",
        texte: "Tout en bas de la colonne, juste au-dessus du socle, cherche un vieil homme barbu à moitié sorti de l'eau. C'est le dieu du fleuve Danube, qui regarde les soldats romains traverser. Juste après, repère les légionnaires qui portent leurs bagages accrochés à un bâton sur l'épaule. Puis compte les petites fentes verticales qui percent la colonne : ce sont les fenêtres de l'escalier caché à l'intérieur. Dans les Marchés, trouve la rue pavée en pente, la Via Biberatica, et imagine les enseignes des boutiques." },
      { titre: "Quiz éclair",
        texte: "Question : où se trouve aujourd'hui la Dacie, le pays conquis par Trajan ? Réponse : c'est la Roumanie. Les soldats et les colons romains s'y sont installés en si grand nombre que leur langue y est restée. Le roumain est, comme le français, l'italien ou l'espagnol, une langue fille du latin, alors que tous les pays voisins parlent des langues très différentes. Le nom même du pays, Roumanie, veut dire « le pays des Romains »." }
    ]
  },
  {
    id: "circus-maximus",
    nom: "Circus Maximus",
    categorie: "antique",
    lat: 41.886, lon: 12.4853,
    duree: 30,
    conseil: "Accès libre à la pelouse. Depuis l'arrière du Circus, superbe vue sur les palais du Palatin. Une expérience de réalité augmentée (Circo Maximo Experience) est proposée à la billetterie.",
    adultes: [
      { titre: "Mille ans de courses",
        texte: "Le cirque occupe la vallée Murcia, une dépression naturelle entre le Palatin et l'Aventin. La tradition attribue les premières courses au roi Tarquin l'Ancien, au sixième siècle avant Jésus-Christ, mais pendant des siècles les installations restent en bois. César agrandit l'ensemble, Auguste installe la loge impériale et, en 10 avant Jésus-Christ, dresse au centre de la piste un obélisque de Ramsès II rapporté d'Égypte. En 64, le grand incendie de Rome, sous Néron, part des boutiques adossées au cirque. Trajan le reconstruit en pierre vers 103, sous la forme dont on voit aujourd'hui les vestiges. Constance II ajoute en 357 un second obélisque, le plus haut jamais transporté. Les dernières courses ont lieu en 549, organisées par le roi goth Totila dans une ville presque vide." },
      { titre: "Un stade de 150 000 places",
        texte: "Long de 600 mètres et large de 140, le Circus Maximus est le plus grand édifice de spectacle de l'Antiquité. Les gradins, sur trois niveaux, abritaient environ 150 000 spectateurs, davantage selon certains auteurs anciens. À l'extrémité plate, douze stalles de départ, les carceres, s'ouvraient toutes en même temps grâce à un mécanisme à ressort. Au centre courait la spina, un long mur de 340 mètres orné de statues, d'autels, de bassins et des deux obélisques. À chaque bout se dressaient trois bornes coniques dorées, les metae. Sous les gradins, des tavernes, des boutiques et des échoppes de devins attiraient une foule très mélangée. Hommes et femmes s'y asseyaient ensemble, ce qui n'était pas le cas au Colisée." },
      { titre: "Une journée de courses",
        texte: "Une course comptait sept tours, soit près de cinq kilomètres, et une journée en alignait jusqu'à vingt-quatre. Le magistrat qui présidait donnait le départ en lâchant un linge blanc, la mappa. Les cochers, presque tous esclaves ou anciens esclaves affranchis, couraient pour quatre écuries, appelées factions : les Bleus, les Verts, les Rouges et les Blancs. On les soutenait avec une ferveur de supporter. Le virage serré autour des metae provoquait les accidents les plus spectaculaires. Les vainqueurs recevaient une palme, une couronne et une bourse d'argent. Le plus grand champion, Gaius Appuleius Diocles, a couru pendant vingt-quatre ans au deuxième siècle. Il a remporté 1 462 victoires en plus de 4 000 courses et amassé près de 36 millions de sesterces, une fortune colossale." },
      { titre: "Ce qu'il en reste",
        texte: "Après l'abandon, la vallée est redevenue un champ, puis un quartier d'entrepôts et, au dix-neuvième siècle, une usine à gaz. La grande pelouse actuelle date des années 1930. À l'extrémité arrondie, des fouilles achevées en 2016 ont dégagé les gradins, les boutiques et les fondations d'un arc de triomphe. Élevé pour Titus en 81, il servait d'entrée monumentale. La tour médiévale qui domine cette zone, la Torre della Moletta, appartenait à la famille Frangipane et faisait tourner un moulin. Le niveau de la piste antique se trouve à plusieurs mètres sous la pelouse. Depuis la terrasse sud-est, on comprend d'un coup d'œil la forme allongée de la piste et l'emplacement de la spina." },
      { titre: "Petites histoires",
        texte: "Néron, passionné de course, s'est fait lui-même cocher et a couru en Grèce, où il a été déclaré vainqueur malgré une chute. Caracalla soutenait les Bleus avec passion. Le cirque servait aussi aux triomphes, aux processions religieuses et aux chasses avant la construction du Colisée. Aujourd'hui, la pelouse accueille les grands rassemblements de la ville : la fête de l'équipe d'Italie championne du monde en 2006, ou des concerts géants. Chaque 21 avril, on y célèbre aussi l'anniversaire de Rome, avec des défilés de légionnaires en costume et des reconstitutions de courses de chars." }
    ],
    enfants: [
      { titre: "Imagine le départ",
        texte: "Imagine : douze chars sont alignés dans leurs boîtes de départ, les chevaux piaffent, la poussière monte. Là-haut, un magistrat en toge brodée lève un mouchoir blanc. Cent cinquante mille personnes retiennent leur souffle. Le mouchoir tombe, les douze portes s'ouvrent d'un coup, et les chars s'élancent dans un vacarme de roues et de sabots. Sept tours à faire, des virages à prendre au ras des bornes, et une seule règle : arriver le premier." },
      { titre: "Choisis ton équipe",
        texte: "Il y avait quatre écuries, et chaque Romain en avait une dans le cœur : les Bleus, les Verts, les Rouges et les Blancs. On portait leurs couleurs, on se disputait dans les tavernes pour elles, et même les empereurs avaient leur camp. Caligula adorait les Verts au point de dîner dans leurs écuries. L'écrivain Suétone raconte même qu'il avait offert à son propre cheval, Incitatus, une écurie de marbre, une mangeoire en ivoire et des serviteurs. Il voulait aussi le nommer consul, l'un des postes les plus importants de Rome." },
      { titre: "Scorpus, la star morte trop tôt",
        texte: "Bien avant les footballeurs, les cochers étaient les vraies vedettes de Rome. Scorpus, qui courait pour les Verts, a remporté 2 048 victoires alors qu'il n'avait même pas trente ans. Son portrait était partout, on chantait son nom, et il gagnait en une heure ce qu'un ouvrier gagnait en une année. Il est mort dans un accident vers l'âge de 27 ans, et le poète Martial, qui l'admirait, a écrit un poème pour le pleurer." },
      { titre: "L'enlèvement des Sabines",
        texte: "Au tout début de Rome, la ville ne comptait presque que des hommes, et les voisins refusaient de leur donner leurs filles en mariage. Alors Romulus a organisé dans cette vallée une grande fête avec des courses et a invité le peuple des Sabins. Au signal, les jeunes Romains ont enlevé les jeunes Sabines pour les épouser. La guerre a éclaté entre les deux peuples. Mais au moment de la bataille, les Sabines se sont jetées entre leurs pères et leurs maris pour les empêcher de se battre. Alors les deux peuples ont décidé de n'en former qu'un seul." },
      { titre: "Défi sur place",
        texte: "Repère d'abord les deux bouts de la piste. Le côté arrondi, près de la tour médiévale, est celui où les chars faisaient demi-tour. Le côté plat, vers le Tibre, est celui où se trouvaient les boîtes de départ. Puis mesure la piste à ta façon : compte tes pas sur une longueur, et calcule combien de pas feraient sept tours. Enfin, regarde vers le Palatin : les grandes arcades de brique que tu vois sont les terrasses du palais d'où l'empereur regardait les courses sans sortir de chez lui." },
      { titre: "Quiz éclair",
        texte: "Question : deux obélisques égyptiens se dressaient au milieu de la piste. Où sont-ils aujourd'hui ? Réponse : le premier, rapporté par Auguste, se trouve sur la Piazza del Popolo, au nord de la ville. Le second, le plus haut du monde, se dresse devant la basilique Saint-Jean-de-Latran. Tous deux ont été retrouvés cassés sous la terre du cirque au seizième siècle et redressés par le pape Sixte Quint." }
    ]
  },
  {
    id: "thermes-caracalla",
    nom: "Thermes de Caracalla",
    categorie: "antique",
    lat: 41.879, lon: 12.4925,
    duree: 60,
    conseil: "Site vaste et souvent peu fréquenté, avec de grands espaces pour courir. En été, des opéras sont joués en plein air dans les ruines.",
    adultes: [
      { titre: "Un cadeau impérial",
        texte: "Les travaux commencent en 206, sous Septime Sévère. Les bains sont inaugurés en 216 par son fils Caracalla, un empereur brutal qui avait fait assassiner son propre frère Geta cinq ans plus tôt. Offrir au peuple les thermes les plus somptueux jamais construits était un moyen de se faire aimer. Officiellement, ils s'appelaient les thermes Antoniniens. Les portiques extérieurs, les bibliothèques et le stade ont été achevés par ses successeurs Héliogabale et Alexandre Sévère. Une nouvelle branche de l'aqueduc de l'Aqua Marcia, l'Aqua Antoniniana, a été construite pour alimenter les bassins, avec de gigantesques citernes sur la pente voisine." },
      { titre: "Chiffres et architecture",
        texte: "L'enceinte mesure environ 337 mètres sur 328, soit plus de 11 hectares, et le bâtiment des bains 214 mètres sur 110. Il a été construit en cinq ans à peine. Les archéologues estiment que plusieurs milliers d'ouvriers y ont travaillé chaque jour et qu'il a fallu des millions de briques. Le plan est symétrique autour d'un axe central. On y trouve d'abord la natatio, une piscine à ciel ouvert de 50 mètres sur 22. Viennent ensuite le frigidarium, la salle froide, couvert de trois voûtes croisées, puis le tepidarium, la salle tiède. Vient enfin le caldarium, la salle chaude, une rotonde de 35 mètres de diamètre coiffée d'une coupole presque aussi large que celle du Panthéon. De part et d'autre, deux palestres identiques, de grandes cours de sport, servaient à l'exercice. Les murs, hauts de plus de 30 mètres, étaient plaqués de marbre et les voûtes couvertes de mosaïques de verre." },
      { titre: "Une journée aux bains",
        texte: "On arrivait en début d'après-midi, après le travail. Le parcours commençait dans la palestre, par la lutte, la course ou les jeux de balle. On passait ensuite dans des salles de plus en plus chaudes, avant de plonger dans l'eau froide. Masseurs, épileurs, vendeurs de boissons et de gâteaux proposaient leurs services. On pouvait ensuite lire dans l'une des deux bibliothèques, flâner dans les jardins ou assister à une conférence. Les thermes accueillaient toutes les classes sociales : le sénateur y croisait l'artisan. Sous les salles, un réseau de galeries de plusieurs kilomètres abritait les fours et les réserves de bois nécessaires pour chauffer l'eau et l'air qui circulait sous les sols." },
      { titre: "Un musée disparu",
        texte: "Les thermes étaient un véritable musée de sculptures. En 1545, le pape Paul III Farnèse y a fait fouiller pour orner son palais. On en a sorti des chefs-d'œuvre colossaux : l'Hercule Farnèse, le Taureau Farnèse et la Flore Farnèse. Tous sont aujourd'hui au musée archéologique de Naples. Les mosaïques des athlètes, découvertes en 1824, sont au Vatican. Deux immenses baignoires de granit gris servent de fontaines sur la Piazza Farnese, et des colonnes ont été réutilisées dans la basilique Santa Maria in Trastevere. L'architecture elle-même a inspiré les gares monumentales du vingtième siècle : le grand hall de la Pennsylvania Station de New York, détruite en 1963, copiait directement le frigidarium." },
      { titre: "Déclin et renaissance",
        texte: "Les bains ont fonctionné plus de trois siècles, jusqu'en 537. Cette année-là, les Goths de Vitigès, qui assiégeaient Rome, ont coupé les aqueducs. Privé d'eau, l'édifice a été abandonné, pillé, puis secoué par le tremblement de terre de 847. Ses ruines envahies de végétation ont fasciné les voyageurs du Grand Tour et le poète Shelley, qui y a écrit une partie de son Prométhée délivré en 1819. Depuis 1937, les ruines servent de décor à l'opéra de Rome en été. C'est là que les trois ténors Pavarotti, Domingo et Carreras ont donné leur premier concert commun, le 7 juillet 1990. C'était la veille de la finale de la Coupe du monde. Des millions de téléspectateurs l'ont suivi." }
    ],
    enfants: [
      { titre: "Imagine ton après-midi aux bains",
        texte: "Imagine : l'école est finie, il est tôt dans l'après-midi et toute la ville se dirige vers les thermes. Tu paies une toute petite pièce à l'entrée et tu déposes tes vêtements dans un casier surveillé par un esclave. Te voilà dans une cour immense où des adultes soulèvent des poids, luttent dans le sable ou jouent à la balle. Ensuite, direction les salles chaudes, où la vapeur te fait transpirer, puis un plongeon glacé dans la grande piscine, sous le ciel bleu." },
      { titre: "C'était très bruyant",
        texte: "Le philosophe Sénèque habitait juste au-dessus d'un établissement de bains, et il s'en plaignait dans une lettre restée célèbre. Il entendait les costauds qui grognaient en soulevant leurs poids, les claques du masseur sur les épaules des clients, et le plouf de ceux qui sautaient dans la piscine. Il entendait aussi le vendeur de saucisses et le pâtissier qui hurlaient leurs prix. Et surtout l'épileur, qui arrachait les poils des aisselles et faisait crier ses clients. Voilà à quoi ressemblaient des bains romains : une fête foraine géante, du matin au soir." },
      { titre: "Les secrets du sous-sol",
        texte: "Sous tes pieds, ce n'est pas fini. Des galeries assez larges pour des chariots serpentent sous tout le bâtiment. Des centaines d'esclaves y transportaient du bois pour les fours qui chauffaient l'eau et l'air. On y a retrouvé un moulin à eau, qui écrasait le grain pour faire la farine des boulangers. Et surtout, un temple secret du dieu Mithra, le plus grand de Rome. Des hommes s'y réunissaient en cachette autour de l'image d'un taureau, près d'une fosse mystérieuse dont les archéologues se demandent encore à quoi elle servait." },
      { titre: "Les géants de marbre",
        texte: "En 1545, des ouvriers qui creusaient dans les ruines pour le pape sont tombés sur une statue gigantesque. C'était un Hercule de plus de trois mètres, épuisé, appuyé sur sa massue. Il cache quelque chose dans la main qu'il tient derrière le dos : les pommes d'or du jardin des Hespérides, sa dernière mission. Peu après, on a sorti de terre un groupe encore plus grand, le Taureau Farnèse, taillé dans un seul bloc de marbre, avec un taureau furieux et quatre personnages. Ces géants sont aujourd'hui à Naples, mais imagine-les ici, à leur place, au bord des piscines." },
      { titre: "Défi sur place",
        texte: "Regarde les grands murs de brique : cherche les rangées de petits trous carrés. C'était l'emplacement des crochets qui tenaient les plaques de marbre, arrachées depuis longtemps. Ensuite, dans les deux cours de sport, trouve les morceaux de mosaïque noire et blanche encore en place au sol, avec leurs motifs. Enfin, repère la grande salle ronde du caldarium, la salle la plus chaude, et essaie de compter ses immenses fenêtres." },
      { titre: "Quiz éclair",
        texte: "Question : pourquoi appelle-t-on l'empereur Caracalla, alors que ce n'était pas son vrai nom ? Réponse : son vrai nom était Marcus Aurelius Antoninus. Caracalla était un surnom moqueur, donné à cause du long manteau gaulois à capuche qu'il adorait porter et qu'il avait mis à la mode chez les soldats. Le surnom lui est resté pour toujours, et personne ne l'appelle plus autrement." }
    ]
  },
  {
    id: "via-appia",
    nom: "Via Appia Antica",
    categorie: "antique",
    lat: 41.8536, lon: 12.5205,
    duree: 120,
    conseil: "Le dimanche, la route est fermée aux voitures : location de vélos près de la Via Appia Antica 58. Prévoir eau et goûter, peu de commerces sur place.",
    adultes: [
      { titre: "La reine des routes",
        texte: "En 312 avant Jésus-Christ, Rome est en pleine guerre contre les Samnites. Le censeur Appius Claudius Caecus lance la construction d'une route militaire pour acheminer rapidement les légions vers Capoue, à 195 kilomètres. La même année, il fait construire le premier aqueduc de Rome. La route est ensuite prolongée jusqu'à Bénévent, Tarente et enfin Brindisi, sur l'Adriatique, port d'embarquement pour la Grèce et l'Orient. Le poète Stace la surnomme au premier siècle « regina viarum », la reine des routes. En 109, Trajan ouvre une variante plus courte par la côte, la Via Appia Traiana. Pendant des siècles, elle voit passer armées, marchands, pèlerins et courriers de la poste impériale." },
      { titre: "Une technique de construction exemplaire",
        texte: "Les ingénieurs romains commençaient par creuser une tranchée jusqu'à un sol ferme, puis ils superposaient plusieurs couches. D'abord de gros blocs, puis un lit de pierres et de gravier lié à la chaux, un mortier fin, et enfin les dalles de basalte à plusieurs côtés, parfaitement ajustées. La chaussée, large d'environ 4 mètres, permettait à deux chars de se croiser ; elle était bombée pour évacuer l'eau et bordée de trottoirs. Tous les milles, une borne de pierre indiquait la distance depuis Rome. Grâce à ce soin, plus de deux mille ans après, des kilomètres de dalles d'origine sont encore en place, notamment entre le quatrième et le huitième mille." },
      { titre: "Une route bordée de tombeaux",
        texte: "La loi interdisait d'enterrer les morts à l'intérieur de la ville. Les familles riches ont donc fait bâtir leurs tombeaux le long des grandes routes, là où tout le monde les verrait. Sur la Via Appia, ils se succèdent sur des kilomètres. Le plus célèbre est le mausolée de Cecilia Metella, une tour ronde de près de 30 mètres de diamètre élevée vers 30 avant Jésus-Christ. La famille Caetani l'a transformé en château fort en 1302. Plus loin se trouve la Villa des Quintilii, si belle que l'empereur Commode a fait exécuter ses propriétaires pour s'en emparer, en 182. En face, le cirque de Maxence, bâti en 309, conserve mieux que le Circus Maximus la forme d'une piste antique." },
      { titre: "Parcours conseillé",
        texte: "La promenade commence à la Porta San Sebastiano, la plus belle porte des murailles d'Aurélien, qui abrite un musée des murs. On passe ensuite devant la petite église Domine Quo Vadis, puis devant les grandes catacombes de Saint-Calixte et de Saint-Sébastien. Après le cirque de Maxence et le tombeau de Cecilia Metella, la route devient une allée bordée de pins parasols et de cyprès. C'est à partir de là que les dalles antiques réapparaissent, avec les ruines des tombeaux, les statues sans tête et, au loin, les arches des aqueducs. Le tronçon le plus spectaculaire s'étend jusqu'au Casal Rotondo, un immense tombeau rond sur lequel une ferme a été construite au Moyen Âge." },
      { titre: "Petites histoires",
        texte: "En 71 avant Jésus-Christ, après l'écrasement de la révolte de Spartacus, six mille prisonniers ont été crucifiés le long de la route entre Capoue et Rome. Le roman Quo Vadis et son film de 1951 ont fait connaître au monde entier la légende de saint Pierre fuyant Rome par cette route et rencontrant le Christ. Au dix-neuvième siècle, l'architecte Luigi Canina a dégagé les tombeaux et transformé la route en promenade archéologique. Au vingtième siècle, le journaliste Antonio Cederna a mené un combat acharné pour sauver la campagne romaine des promoteurs immobiliers. Ce combat a abouti à la création du parc régional en 1988, puis à l'inscription au patrimoine mondial en 2024." }
    ],
    enfants: [
      { titre: "Imagine une légion en marche",
        texte: "Imagine : tu entends d'abord un grondement, puis tu vois la poussière. Une légion arrive, des milliers de soldats en rangs serrés, casques brillants, sandales cloutées qui claquent sur les dalles. Chacun porte sur l'épaule un bâton avec son sac, ses outils et sa nourriture, plus de 30 kilos : on les surnommait les « mules ». Ils marchent 30 kilomètres par jour et, le soir, ils construisent un camp entier, avec fossé et palissade, avant de dormir." },
      { titre: "La route d'un aveugle",
        texte: "L'homme qui a lancé cette route s'appelait Appius Claudius. Il était censeur, un magistrat très puissant, et il a laissé son nom à la route et à un aqueduc. À la fin de sa vie, il est devenu aveugle, ce qui lui a valu le surnom de Caecus, l'Aveugle. Vieux et aveugle, il s'est quand même fait porter au Sénat. Il voulait convaincre les Romains de ne jamais faire la paix avec le roi Pyrrhus tant que celui-ci serait sur le sol italien. Son discours est resté célèbre." },
      { titre: "Le château aux têtes de bœuf",
        texte: "Le grand tombeau rond que tu vois au troisième mille appartenait à Cecilia Metella, une riche Romaine dont on ne sait presque rien. Regarde en haut du mur : des crânes de bœufs sculptés, reliés par des guirlandes. Les gens du Moyen Âge l'ont surnommé Capo di Bove, la tête de bœuf. Vers 1300, la puissante famille Caetani a ajouté des créneaux à la tombe et a fait payer un péage à tous ceux qui passaient sur la route." },
      { titre: "Le poète et les moustiques",
        texte: "Il y a plus de deux mille ans, le poète Horace a fait tout le voyage de Rome à Brindisi sur cette route et a tout raconté. La première nuit, il a pris un bateau tiré par une mule sur un canal à travers les marais. Impossible de dormir : les grenouilles coassaient, les moustiques piquaient, le batelier chantait à tue-tête, puis il s'est endormi et la mule s'est arrêtée. Plus loin, l'eau était si mauvaise qu'il a préféré ne pas boire, et le pain si dur qu'il en a emporté pour la suite." },
      { titre: "Défi sur place",
        texte: "Trouve une dalle avec deux ornières parallèles creusées par les roues, et mesure l'écart entre elles avec tes pieds : environ un mètre quarante, la largeur des chars romains. Cherche ensuite une borne milliaire, une colonne de pierre ronde qui indiquait la distance depuis Rome. Puis marche mille pas doubles, c'est-à-dire mille fois deux pas, en comptant : tu auras parcouru un mille romain, l'unité de distance des soldats. Enfin, compte combien de tombeaux tu croises en une seule longueur." },
      { titre: "Quiz éclair",
        texte: "Question : les dalles de la route sont d'une pierre grise presque noire. D'où vient-elle ? Réponse : c'est du basalte, une roche de lave refroidie. Elle vient des monts Albains, les collines que tu vois au sud, qui sont d'anciens volcans éteints depuis des milliers d'années. Les Romains ont choisi cette pierre parce qu'elle est extrêmement dure. C'est pour cela que la route est encore là, alors que les routes goudronnées d'aujourd'hui doivent être refaites tous les dix ans." }
    ]
  },
  {
    id: "catacombes",
    nom: "Catacombes de Saint-Calixte",
    categorie: "antique",
    lat: 41.859, lon: 12.5115,
    duree: 45,
    conseil: "Fermé le mercredi. Escalier raide, non accessible aux poussettes. Bus 118 depuis le Circus Maximus ou le Colisée.",
    adultes: [
      { titre: "Le cimetière des premiers chrétiens",
        texte: "Au début du troisième siècle, le pape Zéphyrin confie au diacre Calixte la gestion d'un cimetière souterrain, au deuxième mille de la Via Appia. Le terrain a été offert par des familles chrétiennes. C'est le premier cimetière commun des chrétiens de Rome, jusque-là enterrés dans des tombes privées. Calixte devient pape en 217, et le cimetière garde son nom. Il ne cesse de s'agrandir aux troisième et quatrième siècles, en absorbant les galeries voisines. On estime aujourd'hui son réseau à près de 20 kilomètres de couloirs sur quatre niveaux, pour environ un demi-million de tombes, sous une surface de 15 hectares." },
      { titre: "Comment on creusait",
        texte: "Le sous-sol de Rome est fait de tuf, une roche volcanique tendre à creuser mais qui durcit à l'air, idéale pour ouvrir des galeries sans risque d'effondrement. Les fossoyeurs taillaient des couloirs d'environ un mètre de large. Dans les parois, ils creusaient des niches rectangulaires superposées, les loculi, fermées par une dalle de marbre ou de terre cuite scellée au mortier. Les familles aisées disposaient d'arcosolia, des tombes surmontées d'un arc, ou de cubicula, de petites chambres funéraires peintes. Des puits verticaux apportaient un peu de lumière et d'air. Les inscriptions, en latin ou en grec, indiquent le nom du défunt, parfois son métier, et souvent un simple souhait : « en paix »." },
      { titre: "La crypte des Papes",
        texte: "Le cœur du site est une chambre découverte en 1854, que l'archéologue Giovanni Battista de Rossi a baptisée « le petit Vatican ». Neuf papes du troisième siècle y ont été enterrés, dont Pontien, Fabien et Sixte II. Ce dernier a été arrêté dans ces mêmes catacombes et exécuté en 258, pendant la persécution de Valérien. Les plaques de marbre grecques portant leurs noms sont encore en place. Au fond, un long poème gravé en lettres élégantes par le calligraphe Filocalus rend hommage aux martyrs. Il a été composé vers 370 par le pape Damase, qui a aménagé le lieu pour les pèlerins. Damase y précise qu'il aurait voulu être enterré ici, mais qu'il n'osait pas déranger les cendres des saints." },
      { titre: "Sainte Cécile",
        texte: "La crypte voisine a abrité la tombe de Cécile, une jeune femme de la noblesse romaine, martyrisée au troisième siècle et devenue la patronne des musiciens. En 821, le pape Pascal Ier a fait transférer son corps dans l'église qui lui est dédiée, dans le quartier du Trastevere. En 1599, lors de travaux dans cette église, le sarcophage a été ouvert. Selon les témoins, le corps était dans un état de conservation remarquable. Le sculpteur Stefano Maderno l'a représenté tel quel, allongé sur le côté, dans une statue dont une copie orne aujourd'hui la crypte. Les murs conservent des fresques du septième au neuvième siècle, parmi lesquelles une image du Christ et une sainte Cécile en prière." },
      { titre: "Oubli et redécouverte",
        texte: "Après les invasions lombardes du huitième siècle, les papes transfèrent les reliques dans les églises de la ville, et les catacombes, abandonnées, disparaissent sous la végétation. Il faut attendre 1849 pour qu'un jeune archéologue, Giovanni Battista de Rossi, remarque dans une vigne un fragment de marbre portant les lettres « NELIUS MARTYR ». Il devine qu'il s'agit du pape Corneille, dont les textes anciens situaient la tombe près de celle des autres papes. Le pape Pie IX achète la vigne, les fouilles commencent en 1852, et en 1854 de Rossi identifie la crypte des Papes, puis le reste du réseau. Le site, propriété du Saint-Siège, est confié depuis 1930 aux frères salésiens, qui assurent les visites guidées." }
    ],
    enfants: [
      { titre: "Imagine la descente",
        texte: "Imagine : tu descends un escalier taillé dans la roche, avec pour seule lumière une petite lampe à huile qui tremble dans ta main. L'air devient frais, presque froid. Devant toi s'ouvre un couloir si étroit que deux personnes peuvent à peine se croiser, et si haut que la lumière n'atteint pas le plafond. De chaque côté, tu vois des rangées de niches creusées les unes au-dessus des autres, comme les étagères d'une immense bibliothèque. Chacune est fermée par une plaque avec un nom." },
      { titre: "Le langage secret des chrétiens",
        texte: "Sur les plaques, tu verras des dessins simples qui étaient en réalité des messages codés. Le poisson d'abord : en grec, poisson se dit Ichthus, et chaque lettre est le début d'un mot de la phrase « Jésus Christ, Fils de Dieu, Sauveur ». L'ancre voulait dire l'espérance, la colombe avec un rameau voulait dire la paix, et le berger portant un agneau représentait le Christ. On raconte que, pour se reconnaître sans se trahir, un chrétien dessinait dans le sable une moitié de poisson : si l'inconnu complétait le dessin, on pouvait lui faire confiance." },
      { titre: "Perdu dans le noir",
        texte: "En 1593, un garçon de 18 ans nommé Antonio Bosio descend avec des amis dans une catacombe que personne n'a explorée depuis des siècles. Ils avancent, se perdent, leurs bougies s'éteignent une à une. Bosio pense qu'il va mourir là, dans le noir. Ils finissent par retrouver la sortie, épuisés. Au lieu de jurer de ne jamais recommencer, Bosio décide de consacrer toute sa vie à explorer la Rome souterraine, avec des cordes et des lampes de secours. Son grand livre a fait de lui le « Christophe Colomb des catacombes »." },
      { titre: "Les hommes qui creusaient",
        texte: "Les fossores, les fossoyeurs, passaient leurs journées sous terre à tailler le tuf à la pioche, à la lueur des lampes. Ils portaient la terre dehors dans des paniers, creusaient des puits pour laisser entrer l'air et un peu de lumière, et vendaient les emplacements aux familles. On a retrouvé leurs portraits peints sur les murs : un homme avec une pioche sur l'épaule et une lampe à la main. Pour les enfants, ils creusaient de toutes petites niches, souvent placées tout en haut." },
      { titre: "Défi sur place",
        texte: "Pendant la visite, cherche sur les plaques et les murs les trois symboles secrets : un poisson, une ancre et une colombe. Compte combien de niches sont empilées les unes sur les autres dans un couloir : il y en a parfois six ou sept. Enfin, devant la statue de sainte Cécile allongée, regarde bien ses mains. Elle montre trois doigts d'une main et un seul de l'autre : un message qui signifie « un seul Dieu en trois personnes »." },
      { titre: "Quiz éclair",
        texte: "Question : jusqu'à quelle profondeur descendent les galeries les plus basses ? Réponse : à environ vingt mètres sous terre, soit la hauteur d'un immeuble de six étages, mais à l'envers. Quand il n'y a plus eu de place en haut, on a creusé vers le bas au lieu de s'étendre sur les côtés. Les terrains voisins appartenaient en effet à d'autres gens." }
    ]
  },
  {
    id: "pyramide-cestius",
    nom: "Pyramide de Cestius",
    categorie: "antique",
    lat: 41.8763, lon: 12.4807,
    duree: 20,
    conseil: "Métro B, station Piramide. Le cimetière non catholique voisin est gratuit (don conseillé) et très paisible.",
    adultes: [
      { titre: "Un tombeau à la mode égyptienne",
        texte: "Quand Octave, le futur Auguste, s'empare de l'Égypte en 30 avant Jésus-Christ, Rome se prend de passion pour tout ce qui vient du Nil : obélisques, sphinx, divinités et pyramides. C'est dans ce climat qu'un riche magistrat, Caius Cestius Epulo, décide de se faire construire un tombeau en forme de pyramide. Cet homme cumule les titres : préteur, tribun de la plèbe et membre du collège des sept prêtres chargés des banquets sacrés. Les inscriptions gravées sur les deux faces les plus visibles donnent son nom et ses titres. Elles précisent aussi que le tombeau a été achevé en trois cent trente jours, comme l'exigeait son testament. Ses héritiers, parmi lesquels figure Marcus Agrippa, le gendre et bras droit d'Auguste, tenaient donc à respecter le délai. La construction est datée entre 18 et 12 avant Jésus-Christ." },
      { titre: "Architecture et chiffres",
        texte: "La pyramide mesure environ 36 mètres de haut pour une base carrée d'un peu moins de 30 mètres de côté. Elle est bâtie en béton romain sur des fondations de travertin, une pierre calcaire de la région, puis entièrement revêtue de plaques de marbre blanc de Carrare. Ses pentes sont beaucoup plus raides que celles des pyramides de Gizeh. Les architectes se sont sans doute inspirés des pyramides de Nubie, au sud de l'Égypte, que les légions venaient de découvrir pendant leurs campagnes militaires. À l'intérieur, une chambre funéraire voûtée d'environ 6 mètres sur 4 était décorée de fresques délicates, avec des figures féminines et des Victoires ailées. Une fois le corps déposé, on a muré l'entrée : le tombeau n'avait pas de porte." },
      { titre: "Sauvée par les murailles",
        texte: "Entre 271 et 275, l'empereur Aurélien fait entourer Rome d'une muraille de 19 kilomètres pour la protéger des invasions. Les bâtisseurs, pressés, incorporent tout ce qui se trouve sur le tracé, et la pyramide devient une sorte de bastion à côté de la Porta Ostiensis, aujourd'hui Porta San Paolo. C'est ce qui l'a préservée, alors que presque tous les autres tombeaux de Rome ont été démontés pour récupérer leur marbre. Au Moyen Âge, on avait oublié Cestius. On appelait la pyramide la Meta Remi, le tombeau de Rémus, tandis qu'une seconde pyramide, près du Vatican, passait pour celui de Romulus. Cette dernière a été démolie vers 1499 pour ouvrir une rue vers Saint-Pierre." },
      { titre: "Redécouverte et restaurations",
        texte: "En 1660, le pape Alexandre VII ordonne de dégager la pyramide, alors à moitié enterrée, et de la restaurer. Les ouvriers percent un tunnel jusqu'à la chambre funéraire, qu'ils trouvent vide, déjà pillée. Ils retrouvent aussi les bases de deux statues de bronze de Cestius et deux colonnes, remises debout aux angles ouest du monument. Une inscription rappelle ces travaux. Le tombeau devient ensuite un sujet favori des graveurs et des peintres, de Piranèse aux aquarellistes anglais. Ces derniers faisaient le Grand Tour, ce long voyage en Italie à la mode chez les jeunes aristocrates. La dernière grande restauration, entre 2013 et 2015, a été financée par un mécène japonais, l'homme d'affaires Yuzo Yagi. Elle a permis de nettoyer le marbre et de consolider les fresques." },
      { titre: "Autour de la pyramide",
        texte: "Le cimetière non catholique s'étend contre la muraille. Il a été ouvert au dix-huitième siècle pour les étrangers protestants et orthodoxes, qui n'avaient pas le droit d'être enterrés dans les cimetières de la Ville éternelle. Les poètes anglais John Keats, mort à Rome en 1821 à vingt-cinq ans, et Percy Shelley, noyé au large de la Toscane en 1822, reposent sous les cyprès. On y trouve aussi la tombe du penseur italien Antonio Gramsci. À quelques centaines de mètres, le Monte Testaccio est une colline artificielle de 35 mètres, faite de millions de morceaux d'amphores à huile cassées. Le quartier était le port fluvial et l'entrepôt de la Rome antique." }
    ],
    enfants: [
      { titre: "Imagine un pharaon romain",
        texte: "Imagine que tu vis à Rome il y a un peu plus de deux mille ans. L'Égypte vient d'être conquise, et tout le monde ne parle que de ça : les bateaux rapportent des obélisques, des statues de dieux à tête d'animal, des tissus brodés. Un riche Romain nommé Caius Cestius se dit alors : pourquoi ne pas me faire un tombeau comme un pharaon ? Et le voilà, ce tombeau, tout blanc, tout pointu, planté entre les voitures et le métro. Ce n'est pas un décor de cinéma, c'est une vraie pyramide antique, la seule qui reste à Rome." },
      { titre: "Le tombeau de Rémus",
        texte: "Pendant le Moyen Âge, plus personne ne savait lire les vieilles inscriptions, et les Romains ont inventé une explication. Cette pyramide serait la tombe de Rémus, le frère jumeau de Romulus, tué quand Rome a été fondée. Une autre pyramide, près du Vatican, était censée être celle de Romulus. Le problème, c'est que les jumeaux, s'ils ont existé, sont morts sept cents ans avant la construction de ce monument. La pyramide du Vatican a été démolie il y a cinq cents ans. Celle de Cestius a survécu parce qu'elle avait été coincée dans les remparts de la ville, comme une tour de défense." },
      { titre: "Le savais-tu",
        texte: "Quand des ouvriers ont creusé un tunnel pour entrer dans la pyramide, il y a environ trois cent soixante ans, ils espéraient un trésor. Ils n'ont trouvé qu'une pièce vide : des voleurs étaient passés bien avant eux, sans doute en perçant le marbre. Autre curiosité : Cestius voulait qu'on enferme dans son tombeau de précieuses tapisseries brodées d'or, mais une loi venait d'interdire d'enterrer des objets de luxe. Ses héritiers les ont donc vendues et ont utilisé l'argent pour lui offrir deux statues de bronze devant la pyramide. Il ne reste que leurs socles : les statues ont disparu." },
      { titre: "Défi sur place",
        texte: "Fais le tour de la pyramide par l'extérieur du cimetière et cherche les grandes lettres gravées dans le marbre, très haut sur la face qui donne sur la rue. C'est le nom de Cestius, écrit en latin, sans espaces entre les mots. Trouve ensuite les deux colonnes dressées près d'un angle, puis les chats. Il y en a toute une colonie dans le cimetière voisin, souvent couchés au soleil sur les tombes. Enfin, essaie de repérer les endroits où le marbre a l'air plus neuf et plus blanc : ce sont les plaques restaurées il y a une dizaine d'années." },
      { titre: "Le quiz",
        texte: "Pourquoi cette pyramide est-elle beaucoup plus pointue que les grandes pyramides d'Égypte que tu vois dans les livres ? Réponse : parce que les Romains ne l'ont pas copiée sur celles de Gizeh, mais sur les petites pyramides très raides de Nubie, tout au sud de l'Égypte. Leurs soldats les avaient vues pendant une expédition, quelques années plus tôt. Bonus : la construction a duré trois cent trente jours, soit moins d'un an, alors que les pharaons mettaient parfois vingt ans." }
    ]
  },
  {
    id: "pantheon",
    nom: "Panthéon",
    categorie: "place",
    lat: 41.8986, lon: 12.4769,
    duree: 45,
    conseil: "Entrée payante depuis 2023 (gratuite pour les moins de 18 ans), billet à prendre en ligne ou sur place. Le matin tôt, on profite du rayon de lumière presque seuls.",
    adultes: [
      { titre: "Trois temples pour tous les dieux",
        texte: "Le premier Panthéon est bâti entre 27 et 25 avant Jésus-Christ par Marcus Agrippa, le fidèle général et gendre d'Auguste, au Champ de Mars. Ce temple dédié à tous les dieux brûle en l'an 80, est reconstruit par Domitien, puis foudroyé et incendié à nouveau en l'an 110. L'empereur Hadrien, passionné d'architecture, le fait entièrement rebâtir entre 118 et 125 environ, en lui donnant la forme que nous voyons aujourd'hui. Par modestie ou par habileté politique, il conserve sur le fronton la dédicace du premier bâtisseur, en grandes lettres de bronze. On y lit : Marcus Agrippa, fils de Lucius, consul pour la troisième fois, a fait cet édifice." },
      { titre: "La coupole et ses secrets",
        texte: "La rotonde est un cylindre coiffé d'une coupole de 43,3 mètres de diamètre, exactement égale à sa hauteur : une sphère parfaite pourrait tenir à l'intérieur. Elle est restée la plus grande coupole du monde jusqu'au vingtième siècle, et reste la plus grande jamais réalisée en béton non armé. Les Romains ont allégé la structure en changeant la recette du béton en montant. À la base, du travertin, une pierre lourde ; ensuite du tuf et de la brique ; au sommet, de la pierre ponce, très légère. Là s'ouvre l'oculus, un trou rond de près de 9 mètres. Cinq rangées de vingt-huit caissons, ces creux carrés dans la voûte, réduisent encore son poids. À l'entrée, seize colonnes de granit gris et rose, taillées d'un seul bloc et hautes d'environ 12 mètres, ont été extraites en Égypte et transportées par bateau." },
      { titre: "D'un temple à une église",
        texte: "En 609, l'empereur byzantin Phocas offre le bâtiment au pape Boniface IV, qui le consacre à sainte Marie et à tous les martyrs. Cette transformation précoce en église explique qu'il soit si bien conservé : ses portes de bronze antiques sont encore en place. Le monument n'a pourtant pas échappé aux pillages. En 663, l'empereur Constant II emporte à Constantinople les tuiles de bronze doré de la coupole. En 1625, le pape Urbain VIII Barberini fait fondre le bronze des poutres du porche pour couler des canons destinés au château Saint-Ange, et aussi, dit-on, le baldaquin de Saint-Pierre. Les Romains en ont tiré un jeu de mots resté célèbre : ce que les Barbares n'ont pas fait, les Barberini l'ont fait." },
      { titre: "Les tombeaux illustres",
        texte: "Depuis la Renaissance, on enterre au Panthéon les plus grands artistes. Raphaël, mort en 1520 à trente-sept ans, y repose sous une Vierge sculptée par son élève Lorenzetto. Son épitaphe est du poète Pietro Bembo. Elle dit à peu près ceci : de son vivant, la Nature a eu peur d'être vaincue par lui, et à sa mort, elle a eu peur de mourir. À ses côtés se trouvent les peintres Annibale Carracci et Baldassare Peruzzi. Après l'unification de l'Italie, le monument devient aussi le mausolée de la famille royale. On y enterre le roi Victor-Emmanuel II en 1878, son fils Humbert Ier en 1900 et la reine Marguerite en 1926. Des volontaires de la Garde d'honneur veillent encore aujourd'hui sur leurs tombes." },
      { titre: "À voir sur place",
        texte: "Avant d'entrer, observez la différence de couleur entre les colonnes de la façade et celles des côtés. Regardez aussi, sur le mur du porche, les traces laissées par les poutres de bronze disparues. Sous la coupole, prenez le temps de suivre le rayon de soleil qui se déplace sur les caissons, comme l'aiguille d'un cadran solaire géant. Le 21 avril à midi, anniversaire de la fondation de Rome, il vient frapper la porte d'entrée, comme un projecteur braqué sur l'empereur qui entrait. Le sol légèrement bombé et ses vingt-deux petits trous évacuent la pluie qui tombe par l'oculus. À la Pentecôte, les pompiers de Rome montent sur la coupole et font pleuvoir des milliers de pétales de rose rouge sur les fidèles." }
    ],
    enfants: [
      { titre: "Imagine un empereur bricoleur",
        texte: "Imagine un empereur qui adore dessiner des bâtiments. C'est Hadrien, et le Panthéon est son chef-d'œuvre. Il y a mille neuf cents ans, il a fait couler ici la plus grande coupole du monde, sans grue et sans ordinateur. Juste avec du béton, des échafaudages en bois et des ouvriers très doués. Quand tu franchis les portes de bronze, qui sont les mêmes qu'à l'époque, tu entres dans une pièce que les Romains ont vue exactement comme toi. Lève la tête : le trou rond au sommet est ouvert sur le ciel, et les nuages passent au-dessus de toi." },
      { titre: "Le mystère des poutres volées",
        texte: "Regarde le plafond du porche, juste au-dessus des colonnes : il est en bois, mais ce n'est pas normal. À l'origine, il était fait d'énormes poutres de bronze. Il y a quatre cents ans, un pape de la famille Barberini a décidé de les récupérer pour fabriquer des canons. Les Romains, furieux, ont inventé une phrase moqueuse qui dit que les Barberini ont fait pire que les barbares. Tu as remarqué ? Le nom de sa famille ressemble au mot barbare. Encore avant, un empereur avait déjà emporté les tuiles dorées de la coupole. Si tu vois des trous dans les murs du porche, ce sont les endroits où les poutres de bronze étaient accrochées." },
      { titre: "Le savais-tu",
        texte: "Le peintre Raphaël, mort il y a cinq cents ans, est enterré ici, dans un ancien sarcophage romain. Il était tellement admiré qu'on l'appelait le divin, et à sa mort, toute la ville a pleuré. Sur sa tombe, un poète a écrit que la Nature elle-même avait eu peur d'être battue par lui. Autre secret : tous les ans, cinquante jours après Pâques, des pompiers grimpent sur le toit. Ils lâchent des milliers de pétales de roses rouges par le trou de la coupole." },
      { titre: "Défi sur place",
        texte: "Compte les colonnes du porche : il devrait y en avoir seize, mais attention, certaines sont grises et d'autres roses. Trouve la différence. Ensuite, à l'intérieur, compte les rangées de caissons, ces grands creux carrés dans la coupole, de bas en haut. Il y en a cinq, avec vingt-huit caissons par rangée, et ils rapetissent en montant pour donner l'impression que le plafond est encore plus haut. Baisse les yeux sur le sol au centre : cherche les petits trous ronds qui avalent la pluie. Enfin, repère le rond de soleil sur le mur ou la voûte : il se déplace sans bruit pendant que tu visites." },
      { titre: "Le quiz",
        texte: "Sur la façade, on lit le nom de Marcus Agrippa, écrit en énormes lettres. Est-ce lui qui a construit le bâtiment que tu vois ? Réponse : non. Agrippa a bâti le tout premier Panthéon, mais il a brûlé deux fois. Le monument actuel a été construit par l'empereur Hadrien, environ cent cinquante ans plus tard. Il a laissé le nom d'Agrippa sur le fronton, peut-être par respect, peut-être pour montrer qu'il continuait l'œuvre des premiers empereurs." }
    ]
  },
  {
    id: "fontaine-trevi",
    nom: "Fontaine de Trevi",
    categorie: "place",
    lat: 41.9009, lon: 12.4833,
    duree: 20,
    conseil: "Toujours bondée : venez avant 8 h du matin ou tard le soir, quand elle est illuminée. L'accès au bord du bassin peut être régulé par une file d'attente.",
    adultes: [
      { titre: "L'eau de la Vierge",
        texte: "Tout commence en 19 avant Jésus-Christ, lorsque Marcus Agrippa fait construire un aqueduc pour alimenter ses thermes près du Panthéon. L'Aqua Virgo capte des sources à une vingtaine de kilomètres à l'est de Rome et court presque entièrement sous terre, ce qui a protégé l'aqueduc des destructions. C'est le seul aqueduc antique qui n'a jamais cessé de couler. Son nom viendrait, selon l'ingénieur Frontin, d'une jeune fille qui aurait montré la source à des soldats assoiffés. Au Moyen Âge, l'aqueduc aboutissait à une simple fontaine à trois bassins au carrefour de trois rues, les tre vie, d'où le nom de Trevi. En 1453, le pape Nicolas V l'a fait rénover par l'architecte Alberti, mais elle restait modeste." },
      { titre: "Un chantier de trente ans",
        texte: "En 1730, le pape Clément XII lance un concours pour donner enfin à l'Aqua Virgo une fontaine monumentale. Le projet de Nicola Salvi, un architecte encore peu connu, est retenu en 1732, devant des concurrents plus prestigieux. Un siècle plus tôt, le Bernin lui-même avait dessiné un projet, resté sans suite. Salvi imagine une immense scène de théâtre adossée à la façade du palais Poli. L'eau y jaillit d'un chaos de rochers de travertin, la pierre calcaire de Tivoli, taillés sur place. Il meurt en 1751 sans voir l'œuvre achevée. Giuseppe Pannini termine le chantier et la fontaine est inaugurée en 1762 sous Clément XIII, trente ans après le concours. Elle mesure environ 26 mètres de haut et 49 mètres de large." },
      { titre: "Lire la fontaine",
        texte: "Au centre, dans une niche encadrée de colonnes, le dieu Océan, sculpté par Pietro Bracci, s'avance sur un char en forme de coquille tiré par deux chevaux marins. Le cheval de gauche se cabre tandis que celui de droite reste paisible : ce sont les deux visages de la mer. Deux tritons, des hommes-poissons, les guident, l'un jeune, l'autre plus âgé. De part et d'autre, deux statues de Filippo della Valle encadrent la scène. L'Abondance renverse une urne, et la Salubrité, c'est-à-dire la bonne santé, tend une coupe à un serpent. Au-dessus, deux bas-reliefs racontent l'histoire de l'aqueduc : sur l'un, Agrippa approuve les plans ; sur l'autre, la jeune fille montre la source aux soldats. Tout en haut, le blason des Corsini, la famille de Clément XII, domine l'ensemble." },
      { titre: "Le mystère du grand vase",
        texte: "À droite de la fontaine, posé sur la balustrade, un grand vase de pierre semble n'avoir rien à faire là. Selon une tradition romaine, un barbier installé en face du chantier critiquait chaque jour le travail de Salvi. Excédé, l'architecte aurait fait sculpter ce vase pour lui boucher la vue. Les Romains l'appellent l'as de coupe, en référence à une carte de jeu italienne. Autre curiosité : les coins et recoins de la fontaine sont peuplés d'une trentaine d'espèces de plantes sculptées avec un grand réalisme. Figuiers, chênes, lierre, artichauts, roseaux : toutes rappellent que l'eau donne la vie." },
      { titre: "Une star de cinéma",
        texte: "La fontaine doit sa renommée mondiale au cinéma. En 1954, le film américain La Fontaine des amours popularise le lancer de pièces. Six ans plus tard, Federico Fellini y plonge Anita Ekberg et Marcello Mastroianni dans La Dolce Vita. La scène a été tournée de nuit, en plein hiver, et l'actrice est restée des heures dans l'eau glacée. Quand Mastroianni meurt en 1996, la ville voile la fontaine de noir et arrête l'eau en signe de deuil. Les pièces sont ramassées plusieurs fois par semaine et remises à l'association Caritas, qui aide les personnes en difficulté. La dernière grande restauration, financée en 2014 et 2015 par la maison Fendi, a nettoyé le travertin et refait les circuits d'eau." }
    ],
    enfants: [
      { titre: "Imagine une rivière verticale",
        texte: "Imagine que tu marches dans une ruelle étroite, pleine de monde, et que tu entends un grondement d'eau de plus en plus fort. Tu tournes au coin, et là, tout un palais se transforme en cascade : des rochers, des chevaux, un géant qui sort de la façade. C'est la fontaine de Trevi. L'eau qui coule devant toi vient de sources situées loin à l'est de Rome. Elle arrive par un tunnel construit il y a deux mille ans par les ingénieurs de l'empereur Auguste. Elle n'a jamais cessé de couler depuis, même pendant les guerres et les invasions." },
      { titre: "Le barbier ronchon",
        texte: "Pendant les trente ans de travaux, l'architecte Nicola Salvi devait supporter un voisin pénible : un barbier dont la boutique donnait juste sur le chantier. Chaque matin, paraît-il, le barbier se moquait de la fontaine. Pour se venger, Salvi aurait fait sculpter un énorme vase de pierre sur la balustrade, pile devant la fenêtre du barbier, afin qu'il ne voie plus rien. Les Romains, qui adorent cette histoire, appellent ce vase l'as de coupe, comme la carte de leurs jeux. Personne ne sait si c'est vrai, mais le vase, lui, est bien là." },
      { titre: "Le savais-tu",
        texte: "Le géant du milieu n'est pas Neptune, contrairement à ce que beaucoup de gens pensent, mais Océan, le dieu de toutes les eaux du monde. Les sculpteurs ont caché sur les rochers une trentaine de plantes différentes, taillées dans la pierre : des figuiers, du lierre, des roseaux, même un artichaut. Et sur le côté droit, une petite fontaine à deux becs avait un rôle spécial. Quand un jeune Romain partait pour un long voyage, il y buvait avec sa fiancée, puis il cassait le verre pour qu'elle ne l'oublie pas. Aujourd'hui, l'eau de la grande vasque tourne en boucle grâce à des pompes." },
      { titre: "Défi sur place",
        texte: "Cherche d'abord le vase du barbier : il est à droite, sur la balustrade, et il ressemble à une grosse coupe de pierre. Ensuite, compte les chevaux et les hommes-poissons qui les tiennent. Repère au-dessus du géant les deux tableaux sculptés : sur l'un, une jeune fille pointe du doigt le sol pour montrer une source à des soldats. Enfin, essaie de trouver au moins cinq plantes différentes cachées dans les rochers. Celui qui en trouve le plus a gagné." },
      { titre: "Le quiz",
        texte: "Depuis quand les gens jettent-ils des pièces dans la fontaine ? Réponse : la tradition est bien plus jeune que la fontaine. Elle est devenue célèbre en 1954 grâce à un film américain dont la chanson passait partout à la radio. Avant, les voyageurs buvaient un verre de son eau pour être sûrs de revenir à Rome. Aujourd'hui, les pièces sont ramassées avec des balais et des aspirateurs, puis données à une association qui aide les personnes en difficulté." }
    ]
  },
  {
    id: "place-espagne",
    nom: "Place d'Espagne",
    categorie: "place",
    lat: 41.9058, lon: 12.4823,
    duree: 30,
    conseil: "Métro A, station Spagna. En haut de l'escalier, la terrasse offre une belle vue ; continuez vers le Pincio pour rejoindre la Villa Borghèse.",
    adultes: [
      { titre: "Une place entre deux nations",
        texte: "Au dix-septième siècle, ce creux au pied de la colline du Pincio est un terrain disputé. En haut, l'église de la Trinité-des-Monts, fondée en 1502 par le roi Louis XII et achevée en 1585, appartient à la France, avec son couvent. En bas, depuis 1647, l'ambassade d'Espagne auprès du pape occupe le palais qui donne son nom à la place. À l'époque, les Espagnols considéraient les alentours comme leur territoire, et les passants imprudents risquaient d'être enrôlés de force dans leur armée. Le versant abrupt qui séparait les deux camps n'était qu'un talus boueux, planté d'ormes, où les carrosses ne pouvaient pas monter. Chacun voulait le transformer à sa gloire." },
      { titre: "L'escalier de la discorde",
        texte: "En 1661, un diplomate français, Étienne Gueffier, lègue une somme importante pour bâtir un escalier reliant la place à l'église. Mais le projet s'enlise pendant soixante ans. Louis XIV exige une statue de lui à cheval en haut des marches, ce que le pape refuse net dans sa propre ville. Il faut attendre la mort du roi et l'arrivée du pape Innocent XIII pour qu'un compromis soit trouvé. L'architecte Francesco De Sanctis construit l'escalier entre 1723 et 1726 : cent trente-cinq marches de travertin, la pierre blonde de Rome. Les rampes courbes se séparent et se rejoignent autour de terrasses, une véritable chorégraphie de pierre. Des fleurs de lys françaises et des aigles du pape se partagent discrètement la décoration. Au sommet, l'obélisque n'a été dressé qu'en 1789 : c'est une copie romaine d'un modèle égyptien, retrouvée dans les jardins de Salluste." },
      { titre: "La barque de Bernini père",
        texte: "Au pied des marches, la Barcaccia, la vilaine barque, est l'œuvre de Pietro Bernini, achevée vers 1629 pour le pape Urbain VIII Barberini. Les abeilles et les soleils de sa famille ornent la pierre. Le fils du sculpteur, Gian Lorenzo, alors âgé d'une trentaine d'années, y a probablement participé. La forme étrange, une barque à demi coulée qui déborde de partout, est une solution astucieuse à un problème technique. À cet endroit, l'eau de l'aqueduc Aqua Virgo arrive avec si peu de pression qu'aucun jet ne pouvait s'élever. Le sculpteur a donc creusé le bassin sous le niveau de la place et laissé l'eau s'écouler doucement par les flancs et la proue. L'eau y est potable, et les Romains viennent y remplir leurs gourdes." },
      { titre: "Le quartier des étrangers",
        texte: "Dès le dix-huitième siècle, les riches voyageurs du Grand Tour, ce long voyage d'Europe à la mode chez les aristocrates, s'installent autour de la place. On parle même du ghetto des Anglais. Les peintres y recrutent leurs modèles, qui posent en costume sur les marches. Au numéro 26, à droite de l'escalier, la maison rose abrite le musée Keats-Shelley. C'est là que le poète John Keats, venu chercher un climat plus doux, meurt de la tuberculose en février 1821, à vingt-cinq ans. En face, les salons de thé Babington's servent les Britanniques depuis 1893. Sur la Via Condotti, l'Antico Caffè Greco, ouvert en 1760, a vu passer Goethe, Stendhal, Liszt et Wagner." },
      { titre: "Traditions et cinéma",
        texte: "Chaque 8 décembre, le pape vient déposer des fleurs au pied de la colonne de l'Immaculée Conception, dressée en 1857 à l'angle de la place. Les pompiers de Rome, qui l'ont mise en place à l'époque, grimpent à la grande échelle pour accrocher une couronne au bras de la Vierge. Au printemps, la ville couvre l'escalier de centaines d'azaléas en pots, une tradition née au vingtième siècle. En 1953, l'image d'Audrey Hepburn mangeant une glace sur les marches, dans le film Vacances romaines, a fait le tour du monde. Depuis sa restauration en 2015 et 2016, financée par le joaillier Bulgari, il est interdit de s'asseoir sur les marches, pour préserver la pierre." }
    ],
    enfants: [
      { titre: "Imagine une colline boueuse",
        texte: "Imagine cette place il y a trois cents ans. Le grand escalier n'existe pas encore : il n'y a qu'une pente de terre pleine d'arbres et de boue, où les carrosses s'embourbent. En haut, une église qui appartient au roi de France. En bas, l'ambassade du roi d'Espagne, dont les soldats considèrent la place comme chez eux. Pendant soixante ans, ils se disputent pour savoir qui construira l'escalier et quelle statue trônera en haut. Résultat : un escalier payé par un Français, sur une place espagnole, dans la ville du pape, sans aucune statue de roi." },
      { titre: "La barque qui déborde",
        texte: "La fontaine en forme de bateau a un vrai problème : l'eau arrive ici sans force. L'aqueduc romain qui l'amène est presque au même niveau que la place. Impossible de faire jaillir un grand jet comme à Trevi. Le sculpteur Pietro Bernini, le papa du célèbre Gian Lorenzo, a eu une idée de génie. Il a creusé la fontaine dans le sol et a sculpté un bateau à moitié coulé, qui laisse l'eau s'échapper tranquillement par tous les côtés. Sur les flancs, tu peux voir des abeilles : c'était l'emblème de la famille du pape qui a payé la fontaine." },
      { titre: "Le savais-tu",
        texte: "Au sommet de l'escalier, dans la rue qui part sur la droite, il existe une maison très bizarre. Sa porte et ses fenêtres sont des bouches de monstres grandes ouvertes, avec des yeux qui te fixent. C'est le palais Zuccari, construit par un peintre farceur il y a plus de quatre cents ans. Tout en bas, dans la maison rose à droite des marches, un jeune poète anglais nommé John Keats a vécu ses derniers mois. Il est mort ici en 1821, et sa chambre est devenue un musée. Et chaque 8 décembre, des pompiers grimpent avec leur grande échelle pour poser une couronne de fleurs au bras de la statue de la Vierge. Elle se trouve tout en haut de la colonne, au coin de la place." },
      { titre: "Défi sur place",
        texte: "Monte l'escalier en comptant les marches, mais attention : il y a plusieurs terrasses, et les marches larges peuvent te tromper. Sur la fontaine, trouve les abeilles et les soleils sculptés, puis cherche les deux becs à l'avant et à l'arrière du bateau où l'on peut boire. À l'angle de la place, repère la colonne avec la Vierge dorée tout en haut. Enfin, si tu montes jusqu'en haut, va voir la maison aux bouches de monstres dans la rue de droite." },
      { titre: "Le quiz",
        texte: "Pourquoi le grand escalier s'appelle-t-il l'escalier d'Espagne alors qu'il mène à une église française et qu'il a été payé par un diplomate français ? Réponse : simplement parce qu'il débouche sur la place d'Espagne, qui tient son nom de l'ambassade d'Espagne installée là depuis presque quatre siècles. Le roi Louis XIV voulait même sa statue à cheval au sommet. Le pape a dit non, et le nom espagnol est resté." }
    ]
  },
  {
    id: "piazza-navona",
    nom: "Piazza Navona",
    categorie: "place",
    lat: 41.8992, lon: 12.4731,
    duree: 30,
    conseil: "Les restaurants sur la place sont chers : préférez les ruelles voisines. En décembre, marché de Noël avec manèges.",
    adultes: [
      { titre: "Le stade sous la place",
        texte: "Vers l'an 86, l'empereur Domitien, grand admirateur de la culture grecque, fait bâtir au Champ de Mars un stade pour des concours sportifs à la manière d'Olympie. On y pratique la course à pied, la lutte et le lancer du disque. L'édifice mesure environ 275 mètres de long, avec une extrémité arrondie au nord et des gradins pour près de 30 000 spectateurs. Les Romains appellent ces jeux les agones, et le lieu devient au Moyen Âge le campus in agone, puis, en déformant le nom, Navona. La place a conservé exactement le dessin de la piste, et les immeubles reposent sur les anciens gradins. À l'angle nord, on visite les vestiges de l'entrée monumentale, plusieurs mètres sous le niveau actuel." },
      { titre: "Le pape Pamphilj et sa place",
        texte: "En 1644, Giovanni Battista Pamphilj devient le pape Innocent X. Sa famille possède un palais sur la place, et il décide d'en faire une vitrine de sa puissance. Le palais est agrandi par Girolamo Rainaldi et Borromini ; il abrite aujourd'hui l'ambassade du Brésil. Le pape veut au centre une fontaine portant l'obélisque de granit retrouvé en morceaux au cirque de Maxence, sur la Via Appia. Cet obélisque n'est pas égyptien mais romain, taillé sous Domitien avec de faux hiéroglyphes à la gloire de l'empereur. Bernini, qui n'a plus la faveur du nouveau pape, est écarté du concours. Il fait alors parvenir au pape, grâce à la belle-sœur de celui-ci, la redoutable Olimpia Maidalchini, une maquette en argent qui emporte la décision." },
      { titre: "La fontaine des Quatre-Fleuves",
        texte: "Achevée en 1651, la fontaine est une montagne de travertin, la pierre blonde de Rome, creusée de grottes. Quatre géants de marbre y incarnent les fleuves des quatre continents alors connus. Le Nil, sculpté par Jacopo Antonio Fancelli, se voile le visage, car ses sources restaient inconnues ; un lion et un palmier l'accompagnent. Le Gange, par Claude Poussin, tient une rame, symbole d'un fleuve où l'on peut naviguer. Le Danube, par Antonio Raggi, touche le blason du pape et s'appuie sur un cheval. Le Rio de la Plata, par Francesco Baratta, est assis sur un tas de pièces, richesse du Nouveau Monde, et un tatou surgit à ses pieds. Une colombe de bronze, emblème des Pamphilj, couronne l'obélisque. Bernini a conçu un rocher creusé au centre, où l'obélisque semble flotter sur le vide." },
      { titre: "Sainte Agnès et Borromini",
        texte: "Face à la fontaine, l'église Sainte-Agnès-en-Agone occupe l'endroit où, selon la tradition, la jeune Agnès a été exposée nue dans les arcades du stade, vers l'an 304. C'était juste avant son martyre, et ses cheveux auraient miraculeusement poussé pour la couvrir. Commencée en 1652 par les Rainaldi, la façade est reprise en 1653 par Borromini, qui lui donne sa courbe creusée vers l'intérieur, ses deux clochers et sa haute coupole. Innocent X y est enterré. Les deux autres fontaines de la place, celle du Maure au sud et celle de Neptune au nord, ont été dessinées par Giacomo della Porta vers 1575. Bernini a ajouté la figure du Maure en 1653, et les statues de Neptune ne datent que de 1878." },
      { titre: "Une place en fête",
        texte: "De 1652 à 1866, chaque samedi et dimanche d'août, on bouchait les évacuations des fontaines pour inonder le centre de la place. Ce lac de la Piazza Navona rafraîchissait le peuple, tandis que les nobles y faisaient rouler leurs carrosses. Le marché quotidien, installé ici en 1477, a déménagé au Campo de' Fiori en 1869. Mais chaque hiver, la place accueille encore le marché de la Befana, la sorcière qui apporte les cadeaux à l'Épiphanie. Portraitistes, caricaturistes et musiciens de rue font vivre une tradition de spectacle vieille de près de deux mille ans." }
    ],
    enfants: [
      { titre: "Imagine la course de fond",
        texte: "Imagine : tu es assis sur des gradins de pierre, il y a mille neuf cents ans. Devant toi, des athlètes grecs et romains courent pieds nus sur une piste de sable de deux cent quarante mètres. Ils n'ont ni casque ni épée, car ici, pas de gladiateurs. Ce sont des jeux sportifs, comme aux Jeux olympiques, avec de la lutte, du lancer de disque et des courses. Regarde la forme de la place : elle est longue, avec un bout arrondi. C'est exactement la piste, et les maisons tout autour sont construites sur les anciens gradins. Tu marches sur le stade de l'empereur Domitien." },
      { titre: "La ruse de la maquette d'argent",
        texte: "Quand le pape Innocent X a voulu une fontaine géante, il a organisé un concours d'artistes. Mais il a refusé d'inviter Bernini, qu'il n'aimait pas, parce que celui-ci avait travaillé pour le pape précédent. Bernini ne s'est pas découragé : il a fabriqué en secret une maquette de sa fontaine, tout en argent. Ensuite, il s'est débrouillé pour qu'elle soit posée dans une pièce du palais où le pape devait passer. Le pape l'a vue et il est resté planté devant pendant un long moment. Puis il a soupiré que la seule façon de ne pas travailler avec Bernini, c'était de ne jamais regarder ses projets. Bernini a eu le chantier." },
      { titre: "Le savais-tu",
        texte: "Pour payer la fontaine, le pape a augmenté le prix du pain. Les Romains, furieux, ont collé des messages sans signature sur une vieille statue abîmée du quartier, appelée Pasquin. Elle servait de journal secret : on y accrochait, la nuit, des poèmes moqueurs contre les puissants. Un des messages disait à peu près : nous ne voulons pas d'obélisques et de fontaines, c'est du pain que nous voulons. Pasquin existe toujours, à deux minutes d'ici, et les Romains y collent encore des papiers. Autre secret : l'obélisque de la fontaine a été fabriqué à Rome, avec de faux hiéroglyphes, pour faire égyptien." },
      { titre: "Défi sur place",
        texte: "Fais le tour de la grande fontaine et trouve tous les animaux cachés dans les rochers. Il y a un lion qui boit, un cheval qui surgit d'une grotte, un serpent, un tatou avec sa carapace et un dragon marin. Tout en haut, une colombe tient un rameau dans son bec. Ensuite, cherche le géant qui se cache le visage sous un tissu, puis celui qui est assis sur des pièces de monnaie. Enfin, regarde la fontaine du sud : un homme musclé y attrape un dauphin qui se débat." },
      { titre: "Le quiz",
        texte: "Pourquoi le géant appelé le Nil se couvre-t-il la tête avec un voile ? Réponse : parce qu'au moment où la fontaine a été sculptée, personne en Europe ne savait où le Nil prenait sa source. Le fleuve gardait son secret, et le sculpteur l'a montré en cachant son visage. Il a fallu attendre plus de deux cents ans pour que des explorateurs découvrent les grands lacs d'Afrique d'où il vient." }
    ]
  },
  {
    id: "campo-de-fiori",
    nom: "Campo de' Fiori",
    categorie: "place",
    lat: 41.8956, lon: 12.4722,
    duree: 20,
    conseil: "Marché du lundi au samedi, de 7 h à 14 h environ. Attention aux prix affichés au poids sur les stands pour touristes.",
    adultes: [
      { titre: "Du pré aux auberges",
        texte: "Jusqu'au quinzième siècle, cet espace au bord de l'ancien théâtre de Pompée n'est qu'une prairie souvent inondée où poussent des fleurs, d'où son nom. Vers 1456, le pape Calixte III fait paver la place, et le quartier se transforme en carrefour d'affaires. Les cardinaux y bâtissent leurs palais : celui de la Chancellerie à deux pas et, juste derrière, le palais Farnèse, aujourd'hui ambassade de France. Auberges, écuries et boutiques d'artisans se serrent autour du marché aux chevaux qui se tient deux fois par semaine. Vannozza Cattanei, maîtresse du pape Alexandre VI Borgia et mère de César et Lucrèce, y possède une auberge : son blason est encore visible à l'angle du Vicolo del Gallo." },
      { titre: "Le bûcher de Giordano Bruno",
        texte: "Le Campo de' Fiori a aussi été une place d'exécutions. Le 17 février 1600, on y brûle vif le philosophe Giordano Bruno, ancien moine dominicain né près de Naples. Après avoir enseigné à Paris, à Oxford et en Allemagne, il avait été arrêté à Venise en 1592, puis jugé pendant huit ans par le tribunal de l'Inquisition romaine. Il soutenait que l'univers est infini, que les étoiles sont des soleils entourés de planètes peut-être habitées, et que la Terre tourne autour du Soleil. Il a refusé de renier ses idées, et il a répondu à ses juges qu'ils prononçaient sa sentence avec plus de peur que lui n'en avait à l'entendre. On l'a conduit au bûcher avec la langue bloquée par un bâillon, pour l'empêcher de parler à la foule, et il est mort sans avoir cédé." },
      { titre: "Une statue qui fit scandale",
        texte: "En 1889, les papes ont perdu le pouvoir sur Rome depuis moins de vingt ans. Des étudiants et des intellectuels font alors dresser au centre de la place une statue de bronze de Bruno, œuvre du sculpteur Ettore Ferrari. Le pape Léon XIII, indigné, passe la journée de l'inauguration en prières, tandis que trente mille personnes défilent. Le philosophe est représenté avec une capuche sur la tête, le visage sombre, un livre entre les mains. Sur le socle, huit médaillons honorent d'autres penseurs persécutés, dont Érasme, Jan Hus et Michel Servet. L'inscription dit que le siècle qu'il avait deviné lui rend hommage, là où le bûcher a brûlé. Le monument est devenu un symbole de la liberté de pensée, et chaque 17 février, des fleurs y sont déposées." },
      { titre: "Le marché et la Terrine",
        texte: "Le marché quotidien, transféré de la Piazza Navona en 1869, reste l'âme de la place. Sous les parasols, les maraîchers proposent artichauts, courgettes en fleur, tomates, herbes aromatiques, fromages et fleurs coupées. À l'extrémité ouest se trouve la fontaine dite la Terrina, une vasque à couvercle en forme de soupière. C'est une copie, installée en 1898, de celle que Giacomo della Porta avait créée vers 1590. Le couvercle avait été ajouté à l'origine parce que les marchands jetaient leurs déchets dans l'eau. Tout autour de la place, remarquez la petite boulangerie historique où l'on vend la pizza bianca, et les palais aux façades peintes en ocre et en rouge pompéien." },
      { titre: "Les rues des métiers",
        texte: "Les ruelles qui partent de la place ont gardé les noms des métiers du Moyen Âge. La Via dei Cappellari est celle des chapeliers et la Via dei Giubbonari celle des tailleurs de vestes. La Via dei Baullari est celle des fabricants de malles et la Via dei Chiavari celle des serruriers. En suivant la Via di Grotta Pinta, vous marcherez sur la courbe parfaite des gradins du théâtre de Pompée. C'était le premier théâtre en pierre de Rome, inauguré en 55 avant Jésus-Christ. Les maisons ont épousé la forme de ces gradins disparus. Le soir, les terrasses remplacent les étals, et la place devient le rendez-vous des jeunes Romains." }
    ],
    enfants: [
      { titre: "Imagine le marché d'autrefois",
        texte: "Imagine cette place il y a cinq cents ans. Des chevaux à vendre hennissent, des auberges sont pleines de voyageurs et de pèlerins, des cardinaux passent en carrosse vers leurs palais. Dans les ruelles autour, des artisans martèlent des clés ou cousent des chapeaux. On y annonce aussi les nouvelles, et parfois, hélas, on y exécute des condamnés devant la foule. Aujourd'hui, le matin, ce sont les marchands de légumes et de fleurs qui crient pour attirer les clients, et le soir, les guitares et les terrasses. Mais au milieu de tout ce bruit, une statue sombre ne bouge jamais." },
      { titre: "L'homme qui voyait d'autres mondes",
        texte: "Giordano Bruno était un moine qui posait trop de questions. Il pensait que l'univers n'a pas de bord, que chaque étoile est un soleil et qu'autour de ces soleils tournent peut-être des planètes avec des habitants. Il y a quatre cents ans, dire cela était très dangereux. Il a été enfermé pendant huit ans, on lui a demandé de dire qu'il s'était trompé, et il a refusé jusqu'au bout. Il a été brûlé ici, sur cette place, en l'an 1600. Aujourd'hui, les astronomes ont découvert des milliers de planètes autour d'autres étoiles : Bruno avait vu juste." },
      { titre: "Le savais-tu",
        texte: "La statue de Bruno a été installée en 1889 par des étudiants, contre l'avis du pape, qui a boudé toute la journée. Sur le socle, huit visages en bronze représentent d'autres penseurs qui ont eu des ennuis à cause de leurs idées. Au bout de la place, la fontaine ressemble à une soupière avec son couvercle : les Romains l'appellent la Terrine. Le couvercle a été ajouté parce que les marchands y jetaient leurs feuilles de salade et leurs trognons. Et à un angle, une famille très célèbre et très redoutée, les Borgia, tenait une auberge pour voyageurs." },
      { titre: "Défi sur place",
        texte: "Compte les médaillons de bronze sur le socle de la statue et essaie de lire un nom. Trouve ensuite la fontaine en forme de soupière, puis lis les plaques des rues qui partent de la place. Cherche celles qui parlent de chapeaux, de vestes, de malles et de clés : ce sont les métiers d'autrefois. Au marché, repère un légume que tu n'as jamais vu et demande son nom au vendeur. Bonus : à l'angle du Vicolo del Gallo, lève les yeux pour trouver un vieux blason sculpté avec une vache." },
      { titre: "Le quiz",
        texte: "Que veut dire le nom Campo de' Fiori ? Réponse : le champ de fleurs. Avant d'être pavée, il y a plus de cinq cents ans, la place n'était qu'un pré où poussaient des fleurs sauvages, tout près d'un vieux théâtre romain en ruine. Certains racontent plutôt que le nom vient d'une femme prénommée Flora, aimée du général Pompée, qui avait construit ce théâtre. Les fleurs du marché, elles, sont un joli clin d'œil au nom de la place." }
    ]
  },
  {
    id: "largo-argentina",
    nom: "Largo di Torre Argentina",
    categorie: "place",
    lat: 41.8956, lon: 12.4767,
    duree: 20,
    conseil: "Les ruines se voient gratuitement depuis le trottoir ; la descente sur les passerelles est payante. Le refuge des chats accueille les visiteurs dans un coin du site.",
    adultes: [
      { titre: "Une découverte sous les pioches",
        texte: "En 1926, la municipalité de Rome entreprend de raser un vieux quartier pour ouvrir une grande place moderne. Les démolitions mettent au jour des colonnes, des bases de temples et une tête géante de déesse en marbre. Les travaux s'arrêtent, et en 1929, Mussolini inaugure ce qu'on appelle depuis l'Aire sacrée de Largo Argentina. Ce sont quatre temples de la République romaine, alignés côte à côte : les plus anciens visibles à Rome. Les archéologues, faute de certitudes, les ont baptisés A, B, C et D. Le nom de la place vient d'une tour bâtie en 1503 par Johannes Burckardt, maître des cérémonies du pape Alexandre VI. Il venait de Strasbourg, dont le nom latin est Argentoratum." },
      { titre: "Quatre temples républicains",
        texte: "Le temple C, au centre, est le plus ancien : ses murs de tuf, une pierre volcanique tendre, datent du début du troisième siècle avant Jésus-Christ. Il était peut-être dédié à la déesse Feronia. Le temple A, au nord, aurait été dédié à la déesse Juturne par le consul Lutatius Catulus, après une victoire navale sur Carthage en 241 avant Jésus-Christ. Au Moyen Âge, une église s'est installée entre ses colonnes, et l'on distingue encore deux absides de brique, les murs arrondis du fond. Le temple B, le seul rond, a été élevé en 101 avant Jésus-Christ pour la Fortune du jour présent. Il remerciait la déesse pour une victoire sur les Cimbres, un peuple venu du nord. La tête colossale retrouvée ici appartenait à sa statue de culte, haute de huit mètres. Le temple D, au sud, le plus vaste, était dédié aux Lares, les dieux protecteurs des marins ; il dort en partie sous la rue." },
      { titre: "Les ides de mars",
        texte: "Derrière les temples B et C se trouvent les restes de la curie de Pompée. C'était une salle de réunion rattachée au premier théâtre en pierre de Rome, inauguré en 55 avant Jésus-Christ. Le Sénat y siégeait quand la Curie du Forum était en travaux. Le 15 mars 44 avant Jésus-Christ, Jules César s'y rend malgré les avertissements d'un devin et le mauvais rêve de son épouse Calpurnia. Une soixantaine de conjurés, menés par Cassius et Brutus, l'entourent. Casca frappe le premier ; César, atteint de vingt-trois coups, s'effondre au pied de la statue de Pompée, son ancien rival. Auguste a ensuite fait murer la salle et déclarer le lieu maudit. Le mur de tuf que l'on aperçoit sous les arbres en est le vestige." },
      { titre: "Le royaume des chats",
        texte: "Dès les fouilles de 1929, les chats errants du quartier ont colonisé les ruines. Des Romaines, qu'on appelle les gattare, les dames aux chats, viennent les nourrir depuis des dizaines d'années. L'actrice Anna Magnani, qui jouait au théâtre voisin, en faisait partie. Depuis 1993, un refuge tenu par des bénévoles occupe un angle du site : les animaux y sont soignés, stérilisés et proposés à l'adoption. Une loi italienne de 1991 protège les colonies de chats libres. En 2001, la ville de Rome a même reconnu les chats de Largo Argentina comme une partie de son patrimoine, au même titre que ses monuments. Une centaine d'entre eux vivent ici, entre les colonnes." },
      { titre: "Visiter le site aujourd'hui",
        texte: "Pendant longtemps, on ne pouvait voir l'Aire sacrée que depuis les trottoirs. Depuis juin 2023, on peut la parcourir grâce à des passerelles financées par le joaillier Bulgari, qui descendent au niveau antique, quelques mètres sous la rue. On y voit de près les autels et les bases des temples, ainsi qu'une petite exposition des objets découverts. Sur le côté ouest de la place, le Teatro Argentina, ouvert en 1732, a accueilli la première du Barbier de Séville de Rossini en 1816. Ce soir-là, fiasco mémorable : le public a sifflé un spectacle devenu depuis l'un des opéras les plus joués au monde." }
    ],
    enfants: [
      { titre: "Imagine un matin de mars",
        texte: "Imagine : nous sommes le 15 mars de l'an 44 avant Jésus-Christ. Jules César, le maître de Rome, hésite à sortir de chez lui. Sa femme a fait un cauchemar. Et un devin, un homme qui prédit l'avenir, lui a dit de se méfier de ce jour, que les Romains appellent les ides de mars. Mais ses amis insistent, et il se rend à la réunion du Sénat, ici même, dans une grande salle à côté d'un théâtre. Il ne sait pas que des dizaines de sénateurs cachent des poignards sous leur toge. Ce matin-là, l'histoire de Rome bascule, et tu te tiens juste à côté de l'endroit où c'est arrivé." },
      { titre: "Le devin avait raison",
        texte: "Quand César arrive au Sénat, il croise le devin qui l'avait averti et se moque de lui : les ides de mars sont arrivées, et il ne s'est rien passé. Le devin répond : elles sont arrivées, mais pas encore passées. Quelques minutes plus tard, les comploteurs l'encerclent. Un certain Casca frappe le premier, et les autres suivent. On raconte que César, en reconnaissant Brutus qu'il aimait comme un fils, s'est couvert le visage avec sa toge pour mourir dignement. Après sa mort, l'empereur Auguste a fait murer la salle pour que plus personne n'y entre jamais." },
      { titre: "Le savais-tu",
        texte: "En creusant ici, en 1929, les ouvriers ont découvert une tête de déesse en marbre plus grande qu'une voiture. Elle appartenait à une statue de huit mètres qui se dressait dans le temple rond. Aujourd'hui, les vrais habitants des ruines sont les chats : environ une centaine, nourris et soignés par des bénévoles qui tiennent un refuge dans un coin du site. Une grande actrice italienne, Anna Magnani, venait elle-même leur apporter à manger entre deux représentations au théâtre d'en face." },
      { titre: "Défi sur place",
        texte: "Depuis le trottoir ou les passerelles, compte les temples : il y en a quatre, et un seul est rond. Trouve-le. Cherche ensuite les deux demi-cercles de brique rouge construits au Moyen Âge entre les colonnes du temple le plus au nord : c'était une petite église. Puis pars à la chasse aux chats : compte ceux que tu vois sur les colonnes couchées, sur les murs et sous les arbres. Enfin, essaie de repérer le grand mur de blocs de pierre brune au fond, derrière le temple rond : c'est le reste de la salle où César a été tué." },
      { titre: "Le quiz",
        texte: "Pourquoi cette place s'appelle-t-elle Largo Argentina, alors que l'Argentine n'a rien à voir avec l'histoire de Rome ? Réponse : à cause d'une tour construite il y a cinq cents ans par un homme d'église venu de Strasbourg. À l'époque, on écrivait les noms de villes en latin, et Strasbourg s'appelait Argentoratum. Sa tour est devenue la Torre Argentina, et le nom est resté pour toute la place. Le pays d'Amérique du Sud, lui, tient son nom du mot latin pour l'argent, le métal." }
    ]
  },
  {
    id: "via-del-corso",
    nom: "Via del Corso",
    categorie: "place",
    lat: 41.9018, lon: 12.4792,
    duree: 45,
    conseil: "Rue piétonne sur une grande partie, mais très fréquentée le samedi après-midi. Nombreux glaciers dans les rues perpendiculaires.",
    adultes: [
      { titre: "La Via Lata des Romains",
        texte: "La rue suit le tracé de la Via Flaminia, ouverte en 220 avant Jésus-Christ par le censeur Caius Flaminius, un haut magistrat, pour relier Rome à Rimini, sur l'Adriatique. Là où elle traversait le Champ de Mars, les Romains l'appelaient la Via Lata, la rue large, car elle était bien plus vaste que les ruelles voisines. Bordée de portiques et de monuments, dont l'arc de Marc Aurèle démoli au dix-septième siècle, elle est restée l'axe principal de la ville pendant tout le Moyen Âge." },
      { titre: "La course des Barbari",
        texte: "En 1466, le pape Paul II transfère sur cette rue les festivités du carnaval, jusque-là organisées au Testaccio. Le clou de la fête était la corsa dei Barberi, la course des chevaux de race barbe. Ces chevaux, sans cavalier, étaient lâchés depuis la Piazza del Popolo et galopaient sur un kilomètre et demi jusqu'à la Piazza Venezia. Là, on tendait un drap en travers de la rue pour les arrêter. La foule s'entassait sur des tribunes et aux balcons, loués à prix d'or. L'écrivain allemand Goethe, qui a vécu au numéro 18 en 1787, en a laissé une description enthousiaste. La rue a pris tout naturellement le nom de Corso, la course. Les papes l'ont fait élargir et redresser, en particulier Alexandre VII au dix-septième siècle, pour en faire une avenue digne de ces spectacles. La course a été interdite en 1874 par le roi Victor-Emmanuel II après la mort d'un jeune spectateur." },
      { titre: "Piazza Colonna et le pouvoir",
        texte: "À mi-parcours, la Piazza Colonna tient son nom de la colonne de Marc Aurèle, achevée vers l'an 193, l'année qui a suivi la mort de l'empereur. Haute d'environ 30 mètres sans son socle, elle imite la colonne Trajane. Une bande sculptée s'enroule en spirale et raconte les guerres contre les Marcomans et les Quades, deux peuples du Danube, entre 172 et 175. Une scène célèbre montre un dieu de la pluie aux bras ruisselants qui sauve une armée romaine assoiffée. En 1589, le pape Sixte Quint a remplacé la statue de l'empereur par celle de saint Paul, en bronze doré. Derrière la colonne, le palais Chigi, achevé au dix-septième siècle, est depuis 1961 le siège de la présidence du Conseil. Les gardes en uniforme signalent la résidence du chef du gouvernement italien." },
      { titre: "Palais et églises du parcours",
        texte: "En remontant depuis la Piazza Venezia, on longe d'abord le palais Doria Pamphilj. Sa galerie privée conserve le portrait d'Innocent X par Vélasquez, l'un des plus grands tableaux du dix-septième siècle. La Galleria Alberto Sordi a ouvert en 1922 sous le nom de Galleria Colonna, puis a été rebaptisée en 2003 en hommage à l'acteur romain. Ce passage couvert vaut le détour pour son sol en mosaïques et sa verrière. Vers le nord, les palais du dix-huitième siècle se succèdent jusqu'aux deux églises jumelles qui encadrent l'entrée de la rue sur la Piazza del Popolo." },
      { titre: "La rue de la promenade",
        texte: "Au dix-neuvième siècle, le Corso devient le lieu de la promenade en voiture à cheval. La bonne société vient s'y montrer en fin d'après-midi, dans un flot ininterrompu de calèches que décrit Stendhal. Les premiers grands cafés et les boutiques de mode s'y installent, puis les grands magasins au vingtième siècle. Aujourd'hui, la rue est en grande partie piétonne, et la passeggiata, la promenade du samedi, y rassemble des milliers de Romains et de visiteurs. Depuis la Piazza Venezia, la perspective toute droite d'un kilomètre et demi file jusqu'à l'obélisque de la Piazza del Popolo. C'est l'un des rares endroits de Rome où l'on peut voir d'un seul regard un axe tracé il y a plus de deux mille ans." }
    ],
    enfants: [
      { titre: "Imagine le dernier soir du carnaval",
        texte: "Imagine cette rue le dernier soir du carnaval, il y a deux cents ans. La nuit tombe, et des milliers de personnes tiennent chacune une petite bougie allumée, le moccoletto. Le jeu consiste à souffler la bougie du voisin tout en protégeant la sienne. Chaque fois qu'une flamme s'éteint, on crie en riant que le malheureux est mort. Les balcons débordent de gens qui lancent des fleurs et des dragées, les masques dansent, et la rue entière scintille comme un fleuve de lumière. Pendant des siècles, le Corso a été le plus grand terrain de jeu de Rome." },
      { titre: "La ligne d'arrivée",
        texte: "Chaque après-midi de carnaval, des chevaux sans cavalier étaient lâchés au bout de la rue, depuis la Piazza del Popolo, et fonçaient sur un kilomètre et demi. Le départ était donné au son des trompettes, et les chevaux étaient rendus fous par des rubans et des ornements accrochés sur leur dos. À l'arrivée, à la Piazza Venezia, on tendait un grand drap en travers de la rue pour les arrêter, et les garçons d'écurie se jetaient sur eux pour les attraper. Un célèbre écrivain allemand, Goethe, a regardé la course depuis sa fenêtre, au numéro 18 de la rue." },
      { titre: "Le savais-tu",
        texte: "La colonne au milieu de la Piazza Colonna est creuse : un escalier en colimaçon monte à l'intérieur jusqu'au sommet, mais il est fermé au public. Tout en haut, ce n'est plus l'empereur Marc Aurèle qui se tient debout, mais saint Paul, en bronze doré. Un pape l'a fait installer il y a plus de quatre cents ans. Juste derrière, dans le grand palais gardé par des soldats en uniforme, travaille le Premier ministre d'Italie. Et encore derrière, les députés se réunissent pour voter les lois. Tu es dans le quartier le plus important de la politique italienne." },
      { titre: "Défi sur place",
        texte: "Sur la Piazza Colonna, fais le tour de la colonne et essaie de suivre la spirale sculptée du bas vers le haut. Compte combien de tours elle fait avant d'arriver au sommet. Cherche les soldats romains qui traversent un fleuve sur un pont de bateaux, tout en bas de la bande sculptée. Repère ensuite saint Paul au sommet, avec son épée. En face, dans la galerie couverte, regarde le sol : il est fait de milliers de petits morceaux de mosaïque. Enfin, place-toi au milieu de la rue et vérifie qu'elle est vraiment droite jusqu'à l'obélisque, tout au bout." },
      { titre: "Le quiz",
        texte: "Que veut dire le mot Corso ? Réponse : la course. Pendant quatre cents ans, cette rue a été la piste d'une course de chevaux organisée à chaque carnaval, et les Romains ont fini par l'appeler elle-même le Corso. Avant cela, les Romains de l'Antiquité l'appelaient la Via Lata, la rue large, parce que c'était la plus large de la ville. Plus tard, d'autres villes d'Italie ont donné le nom de Corso à leur grande rue principale, en copiant Rome." }
    ]
  },
  {
    id: "piazza-del-popolo",
    nom: "Piazza del Popolo",
    categorie: "place",
    lat: 41.9107, lon: 12.4763,
    duree: 30,
    conseil: "Métro A, station Flaminio. Montez au Pincio par la rampe à droite de la place pour la vue et l'entrée dans la Villa Borghèse.",
    adultes: [
      { titre: "La porte du nord",
        texte: "Pendant près de deux mille ans, la Piazza del Popolo fut la première image de Rome pour ceux qui arrivaient du nord. La Via Flaminia, tracée en 220 avant Jésus-Christ, franchissait ici l'enceinte d'Aurélien par la Porta Flaminia, rebaptisée Porta del Popolo au Moyen Âge. Pèlerins, marchands, ambassadeurs et jeunes aristocrates du Grand Tour passaient tous sous cette porte avant de s'engager dans la ville. En 1655, le pape Alexandre VII demanda au Bernin d'en décorer la face intérieure pour accueillir la reine Christine de Suède, célèbre pour s'être convertie au catholicisme. L'inscription latine gravée pour l'occasion souhaite encore aujourd'hui une heureuse entrée au voyageur." },
      { titre: "L'obélisque du pharaon",
        texte: "Au centre de la place se dresse l'obélisque Flaminio, l'un des plus anciens de Rome. Taillé dans le granit rouge d'Assouan sous les pharaons Séthi premier et Ramsès II, au treizième siècle avant Jésus-Christ, il ornait le temple du Soleil à Héliopolis. Auguste le fit transporter à Rome en l'an 10 avant Jésus-Christ, après la conquête de l'Égypte, et le dressa au centre du Circus Maximus. Il s'y effondra au Moyen Âge et resta enfoui jusqu'en 1587. Le pape Sixte Quint le fit redresser ici en 1589 par son architecte Domenico Fontana, celui-là même qui avait déplacé l'obélisque de la place Saint-Pierre. Haut d'environ 24 mètres sans son socle, il dépasse 36 mètres avec la base et la croix. Les quatre lions de style égyptien qui crachent de l'eau à ses pieds datent de 1823." },
      { titre: "La place de Valadier",
        texte: "La forme actuelle date du début du dix-neuvième siècle. Entre 1811 et 1822, l'architecte Giuseppe Valadier transforma un espace irrégulier, en forme de trapèze, en une vaste place ovale de style néoclassique. Il dessina les deux hémicycles qui bordent la place en demi-cercle, la fontaine de Neptune à l'ouest et celle de la déesse Rome à l'est, encadrée par les fleuves Tibre et Aniene. Il traça aussi les rampes qui montent vers le Pincio. Au sud, les églises jumelles Santa Maria dei Miracoli et Santa Maria in Montesanto encadrent le départ de la Via del Corso. Elles furent élevées entre 1662 et 1679 sur les plans de Carlo Rainaldi, puis achevées par le Bernin et Carlo Fontana. Avec la Via del Babuino et la Via di Ripetta, la Via del Corso forme le Tridente : trois rues qui s'ouvrent en éventail vers le cœur de la ville." },
      { titre: "Raphaël et le Caravage",
        texte: "Adossée au rempart, l'église Santa Maria del Popolo est l'un des trésors les plus accessibles de Rome. Une première chapelle fut élevée en 1099 par le pape Pascal II, et l'édifice actuel fut reconstruit entre 1472 et 1477 sous Sixte IV. La chapelle Chigi fut conçue par Raphaël vers 1513 pour le banquier Agostino Chigi, puis achevée un siècle plus tard par le Bernin, qui y ajouta les statues de Daniel et d'Habacuc. Près du chœur, la chapelle Cerasi abrite deux toiles majeures du Caravage, peintes en 1600 et 1601 : la Conversion de saint Paul et la Crucifixion de saint Pierre. Leur réalisme dérouta les gens de l'époque. Détail surprenant : le moine augustin Martin Luther logea dans le couvent voisin lors de son séjour à Rome en 1510, quelques années avant de déclencher la Réforme." },
      { titre: "Le Pincio au couchant",
        texte: "La terrasse du Pincio, aménagée elle aussi par Valadier, domine la place d'une vingtaine de mètres. Dans l'Antiquité, la colline portait les jardins de Lucullus, un général gourmet dont les banquets étaient si fastueux qu'on en parle encore aujourd'hui. On y trouve des bustes d'Italiens illustres et une horloge à eau installée en 1867 par le père Giovanni Battista Embriaco. On y vient surtout pour la vue, qui embrasse la place, les coupoles de la ville et Saint-Pierre à l'horizon, au moment où le soleil se couche derrière le Vatican. La promenade se prolonge ensuite, sans redescendre, vers les allées ombragées de la Villa Borghèse." }
    ],
    enfants: [
      { titre: "Imagine ton arrivée à Rome",
        texte: "Imagine que tu es un voyageur de l'an 1700. Tu marches depuis des semaines sur la vieille route romaine qui descend du nord. Tes pieds sont couverts de poussière et soudain, devant toi, apparaît une grande porte percée dans une muraille. Tu la franchis et la ville s'ouvre d'un coup. Devant toi, une place immense, un obélisque pointé vers le ciel, deux églises jumelles et trois rues qui filent vers le centre comme les dents d'une fourchette. C'est exactement ce que vivaient les pèlerins, les peintres et les princes qui arrivaient à Rome. Cette place était la porte d'entrée de la ville, son grand hall d'accueil." },
      { titre: "Le voyage fou de l'obélisque",
        texte: "L'obélisque du milieu a plus de 3 200 ans. Il a été taillé en Égypte d'un seul bloc de granit, sans grue ni machine, seulement avec des outils de pierre et de cuivre. L'empereur Auguste l'a fait charger sur un bateau construit exprès pour lui. L'obélisque a traversé la Méditerranée, remonté le Tibre, puis il a été dressé au milieu du Circus Maximus, la grande piste de courses de chars. Pendant des siècles, les chevaux ont galopé autour de lui. Puis il est tombé, s'est brisé et a dormi sous la terre pendant presque mille ans. En 1589, le pape l'a fait déterrer, réparer et replanter ici, avec une croix au sommet." },
      { titre: "La reine qui entra à cheval",
        texte: "Le savais-tu ? En 1655, une reine est arrivée par cette porte : Christine de Suède. Elle avait abandonné son trône pour devenir catholique, un scandale énorme à l'époque. Pour l'accueillir, le pape a demandé au Bernin, le plus grand sculpteur de Rome, de décorer l'intérieur de la porte en quelques mois. Christine est entrée à cheval, habillée comme un homme, sous les acclamations. Elle a vécu à Rome jusqu'à la fin de sa vie, entourée de savants et d'artistes, et elle est l'une des rares femmes enterrées dans la basilique Saint-Pierre." },
      { titre: "Le défi des fausses jumelles",
        texte: "Place-toi au pied de l'obélisque et regarde les deux églises au sud. Elles ont l'air identiques, mais l'architecte a triché. Le terrain de gauche était plus étroit que celui de droite. Alors il a donné une coupole ovale à l'une et une coupole ronde à l'autre, et il les a orientées pour que personne ne remarque la différence. Compte aussi les lions : il y en a quatre, et chacun crache l'eau en éventail. Enfin, cherche sur la place les deux grandes fontaines qui se font face : l'une montre Neptune avec son trident et ses dauphins, l'autre la déesse Rome entre deux statues d'hommes allongés qui représentent des fleuves." },
      { titre: "Le quiz",
        texte: "D'où vient le nom de la place, Piazza del Popolo ? Réponse : personne n'en est totalement sûr. Certains disent qu'il vient du mot latin populus, qui veut dire peuplier, parce que des peupliers poussaient ici autrefois. D'autres pensent qu'il vient du peuple de Rome, qui a payé la construction de l'église Santa Maria del Popolo. En latin, peuplier et peuple s'écrivent presque pareil, alors l'énigme reste ouverte." }
    ]
  },
  {
    id: "piazza-venezia",
    nom: "Piazza Venezia et Vittoriano",
    categorie: "place",
    lat: 41.8955, lon: 12.4823,
    duree: 30,
    conseil: "Accès aux terrasses basses gratuit, ascenseur panoramique payant. Excellent point de repère pour s'orienter dans le centre.",
    adultes: [
      { titre: "Le carrefour de Rome",
        texte: "La Piazza Venezia est le point où se rejoignent les grands axes de la capitale. On y trouve la Via del Corso, venue du nord, la Via dei Fori Imperiali, qui file vers le Colisée, et les rues qui mènent au Tibre et au Capitole. Ce carrefour existait déjà dans l'Antiquité, au pied du Capitole, la colline sacrée, non loin du forum de Trajan, dont la colonne se dresse toujours à quelques pas. Les travaux du métro, commencés dans les années 2000, ont mis au jour sous la place les auditoriums d'Hadrien, de vastes salles de conférence du deuxième siècle. Preuve que le sous-sol de Rome réserve encore bien des surprises." },
      { titre: "Le palais du cardinal vénitien",
        texte: "La place tire son nom du Palazzo Venezia, élevé à partir de 1455 pour le cardinal Pietro Barbo, futur pape Paul II. C'est l'un des premiers grands édifices de la Renaissance à Rome, mais il garde encore un air médiéval avec ses créneaux. Le pape y résida, puis le palais fut cédé en 1564 à la République de Venise comme ambassade, avant de passer à l'Autriche. Mussolini y installa son bureau en 1929, dans l'immense Salle de la Mappemonde. C'est depuis le balcon central qu'il haranguait les foules, notamment le 10 juin 1940, pour annoncer l'entrée en guerre de l'Italie. Le palais abrite aujourd'hui un musée d'arts décoratifs et de sculptures médiévales." },
      { titre: "Une montagne de marbre",
        texte: "Le monument qui écrase la place fut construit pour célébrer Victor-Emmanuel II, mort en 1878, premier roi de l'Italie unifiée. Le projet de l'architecte Giuseppe Sacconi remporta le concours de 1884, et le chantier ouvrit en 1885. Il fallut raser un quartier médiéval entier, démolir des couvents et déplacer pierre par pierre le Palazzetto Venezia. Inauguré en 1911 pour les cinquante ans de l'unité italienne, l'ensemble ne fut achevé qu'en 1935. Il mesure environ 135 mètres de large et 70 mètres de haut, et même 81 mètres jusqu'aux quadriges de bronze, ces chars à quatre chevaux qui couronnent les portiques du sommet. Le marbre blanc de Botticino, près de Brescia, fut choisi pour son éclat. Il tranche avec le travertin, la pierre dorée des monuments romains, ce qui explique en partie pourquoi les habitants ont d'abord rejeté le monument." },
      { titre: "L'Autel de la Patrie",
        texte: "Au cœur du monument, la statue de la déesse Rome domine l'Autel de la Patrie. Depuis le 4 novembre 1921, le Soldat inconnu y repose. Son cercueil fut choisi à Aquilée parmi onze cercueils de soldats non identifiés de la Première Guerre mondiale. C'est Maria Bergamas, une mère dont le fils n'avait jamais été retrouvé, qui le désigna. Deux sentinelles montent la garde en permanence devant la flamme. Les statues des seize régions italiennes et les fontaines des deux mers, l'Adriatique et la Tyrrhénienne, résument l'idée d'une nation rassemblée. La statue équestre du roi, en bronze, mesure douze mètres de haut et fut modelée par le sculpteur Enrico Chiaradia." },
      { titre: "À voir autour de la place",
        texte: "Les terrasses inférieures se parcourent librement et offrent déjà une belle vue sur les forums impériaux. L'ascenseur vitré, ajouté en 2007, conduit à la terrasse des quadriges, d'où le regard porte du Colisée à Saint-Pierre. À l'intérieur, le musée du Risorgimento retrace l'unification de l'Italie. En face, à l'angle de la Via del Corso, le Palazzo Bonaparte fut la demeure de Letizia Ramolino, la mère de Napoléon, qui y vécut jusqu'à sa mort en 1836. Elle observait la rue depuis le petit balcon vert fermé d'un treillage, que l'on voit encore aujourd'hui." }
    ],
    enfants: [
      { titre: "Imagine un gâteau géant",
        texte: "Imagine un énorme gâteau de mariage tout blanc, avec des étages, des colonnes en guise de bougies et deux chars tirés par des chevaux ailés posés sur le dessus. C'est le Vittoriano. Quand il a été construit, beaucoup de Romains l'ont trouvé trop grand, trop blanc, trop brillant à côté des vieilles pierres dorées de la ville. Ils lui ont donné des surnoms moqueurs : la pièce montée, la machine à écrire, ou même le dentier ! Pourtant, aujourd'hui, c'est l'un des monuments les plus photographiés de Rome et le meilleur point de repère pour ne jamais se perdre." },
      { titre: "Le dîner dans le cheval",
        texte: "Regarde bien la statue du roi Victor-Emmanuel II à cheval, au milieu du monument. Elle est en bronze et mesure douze mètres de haut, comme un immeuble de quatre étages. Le cheval est tellement énorme qu'en 1911, juste avant de le refermer, les ouvriers qui l'avaient fabriqué ont organisé un banquet dans son ventre. Une vingtaine de personnes assises à table, avec des plats et du vin, à l'intérieur du cheval ! Une photo de ce repas existe encore. Le savais-tu ? Ce roi a réussi à réunir en un seul pays des dizaines de petits États qui se faisaient la guerre." },
      { titre: "Un soldat sans nom",
        texte: "Sous la statue de la déesse Rome repose un soldat dont personne ne connaît le nom. En 1921, après la Première Guerre mondiale, on a placé onze cercueils de soldats non identifiés côte à côte dans une église du nord de l'Italie. Une maman, Maria Bergamas, dont le fils n'avait jamais été retrouvé, a dû en choisir un. Elle a posé son voile sur l'un des cercueils, sans savoir qui était dedans. Ce soldat est devenu le symbole de tous ceux qui sont morts pour l'Italie. Deux gardes le veillent sans bouger, jour et nuit, et une flamme brûle sans jamais s'éteindre." },
      { titre: "Le défi des détails",
        texte: "Depuis les terrasses, cherche les deux chars de bronze tout en haut : chacun est tiré par quatre chevaux et conduit par une déesse ailée. Repère ensuite le Palazzo Venezia, le grand bâtiment couleur brique avec des créneaux, à droite de la place. C'est depuis son balcon que le dictateur Mussolini faisait ses discours devant des milliers de personnes. Enfin, trouve la colonne Trajane, juste derrière : c'est une bande dessinée en pierre de 30 mètres qui raconte une guerre contre les Daces, un peuple qui vivait dans l'actuelle Roumanie. Si tu prends l'ascenseur, essaie de retrouver le Colisée, le Panthéon et la coupole de Saint-Pierre depuis le toit." },
      { titre: "Le quiz",
        texte: "Pourquoi le monument est-il aussi blanc, alors que les autres monuments de Rome sont plutôt beiges ou dorés ? Réponse : parce que son marbre ne vient pas de la région de Rome. Il a été extrait à Botticino, près de Brescia, dans le nord de l'Italie, et il est d'un blanc très pur. Ce choix a été fait pour que le monument brille de loin, mais c'est aussi pour cela que les Romains ont mis très longtemps à l'aimer." }
    ]
  },
  {
    id: "capitole",
    nom: "Place du Capitole",
    categorie: "place",
    lat: 41.8933, lon: 12.4828,
    duree: 40,
    conseil: "La terrasse sur le Forum, derrière le palais du Sénat, est gratuite et magnifique au coucher du soleil. Musées capitolins : environ 2 h, café avec vue sur le toit.",
    adultes: [
      { titre: "La colline sacrée",
        texte: "Le Capitole est la plus petite des sept collines, mais la plus chargée de symboles. Ses deux sommets, l'Arx au nord et le Capitolium au sud, dominaient le Forum. Sur le Capitolium s'élevait le temple de Jupiter Optimus Maximus, dédié en 509 avant Jésus-Christ, l'année même de la naissance de la République. Les généraux victorieux y achevaient leur triomphe, les consuls y prêtaient serment. Sur le versant sud, on précipitait les traîtres du haut de la roche Tarpéienne. Au Moyen Âge, la colline retomba en friche. Mais en 1144, les Romains y installèrent leur nouveau Sénat, sur les ruines du Tabularium, l'ancien dépôt d'archives bâti en 78 avant Jésus-Christ. C'est de Capitole que vient le mot capitale, dans toutes les langues d'Europe." },
      { titre: "Michel-Ange dessine une place",
        texte: "En 1536, le pape Paul III voulait offrir à l'empereur Charles Quint une entrée digne de son triomphe. Il confia à Michel-Ange le réaménagement de la place, alors boueuse et irrégulière. L'artiste imagina une place en forme de trapèze, ouverte vers la ville et non plus vers le Forum, et fermée par trois palais. Leurs façades sont rythmées par des pilastres géants, ces colonnes plates qui montent sur deux étages, une invention reprise dans toute l'Europe. Il dessina aussi la Cordonata, cet escalier en pente douce que l'on peut gravir à cheval, gardé en haut par les jumeaux divins Castor et Pollux. Michel-Ange mourut en 1564 sans voir son projet achevé. Le Palazzo Nuovo ne fut terminé qu'en 1654, et le dallage en étoile à douze branches, connu par une gravure de 1568, ne fut posé qu'en 1940." },
      { titre: "Le cavalier qui a survécu",
        texte: "Au centre de la place trône la statue équestre de Marc Aurèle, coulée en bronze doré vers 175 après Jésus-Christ. C'est la seule grande statue équestre antique en bronze parvenue jusqu'à nous : toutes les autres furent fondues au Moyen Âge pour récupérer le métal. Elle a échappé à ce sort parce qu'on la prenait pour Constantin, premier empereur chrétien. Elle se dressait au Latran quand Michel-Ange la fit transférer ici en 1538. L'original, fragilisé par la pollution, a été mis à l'abri au musée en 1981, et la copie de la place date de 1997. Un dicton romain prétend que le jour où la dorure aura entièrement réapparu, la fin du monde sera proche." },
      { titre: "Le plus ancien musée du monde",
        texte: "Les Musées capitolins sont nés en 1471, lorsque le pape Sixte IV offrit au peuple romain quelques bronzes antiques conservés au Latran. Parmi eux, la Louve, le Tireur d'épine et une tête colossale de Constantin. Ouverts au public en 1734, ils forment la plus ancienne collection publique du monde. Dans la cour du Palazzo dei Conservatori, on découvre les fragments du colosse en marbre de Constantin : une tête de deux mètres soixante, une main, un pied. Ils proviennent de la basilique de Maxence, et la statue entière atteignait environ douze mètres. Le Palazzo Nuovo abrite le Gaulois mourant et la Vénus capitoline. Un passage souterrain relie les deux palais en traversant le Tabularium, avec une vue imprenable sur le Forum." },
      { titre: "Louve, oies et poète couronné",
        texte: "La Louve capitoline a longtemps été datée du cinquième siècle avant Jésus-Christ et attribuée aux Étrusques. Mais elle a été réexaminée en 2012, et les analyses suggèrent qu'elle a été coulée au Moyen Âge, vers le douzième siècle. Les jumeaux, eux, furent ajoutés à la fin du quinzième siècle. L'historien Tite-Live rapporte l'histoire des oies sacrées de Junon, dont les cris auraient réveillé la garnison lors de l'attaque des Gaulois, en 390 avant Jésus-Christ. En 1341, le poète Pétrarque reçut ici la couronne de laurier. Et c'est sur cette colline qu'en 1764, l'historien Edward Gibbon eut l'idée de son Histoire de la décadence et de la chute de l'Empire romain. À gauche, les 124 marches de l'Aracoeli furent construites en 1348 pour remercier la Vierge de la fin de la peste." }
    ],
    enfants: [
      { titre: "Imagine un triomphe",
        texte: "Imagine la scène, il y a 2 000 ans. Un général romain vient de gagner une guerre. Il traverse Rome sur un char doré, le visage peint en rouge, avec derrière lui des prisonniers enchaînés, des chariots remplis d'or et des soldats qui chantent. Toute la ville hurle de joie. Le cortège grimpe la colline où tu te trouves, jusqu'au temple de Jupiter, le plus grand dieu des Romains. Là, le général sacrifie des taureaux blancs et dépose sa couronne de laurier. Le Capitole était le point d'arrivée de tous les triomphes, l'endroit le plus sacré de tout l'Empire. Et derrière le général, un esclave lui murmurait sans cesse à l'oreille : souviens-toi que tu n'es qu'un homme." },
      { titre: "Les oies qui sauvèrent Rome",
        texte: "Le savais-tu ? En 390 avant Jésus-Christ, les Gaulois ont envahi Rome. Les Romains se sont réfugiés sur le Capitole, la colline aux pentes raides. Une nuit, les Gaulois ont escaladé la falaise en silence. Les chiens de garde n'ont rien entendu. Mais les oies sacrées de la déesse Junon, qu'on avait épargnées malgré la famine, se sont mises à cacarder, c'est-à-dire à crier de toutes leurs forces, et à battre des ailes. Le soldat Marcus Manlius s'est réveillé, a repoussé le premier Gaulois dans le vide, et la colline a été sauvée. Ensuite, chaque année, les Romains ont promené une oie sur un coussin doré pour la remercier, et puni un chien pour sa paresse." },
      { titre: "Le colosse en morceaux",
        texte: "Dans la cour du musée, tu tomberas sur une tête géante en marbre avec des yeux immenses qui regardent vers le haut, à côté d'une main énorme et d'un pied plus grand que toi. C'est tout ce qui reste d'une statue de l'empereur Constantin, haute comme un immeuble de quatre étages. Seuls la tête, les bras et les jambes étaient en marbre. Le corps était fait de briques et de bois recouverts de bronze, et tout cela a disparu. Le pouce, à lui seul, est presque aussi long que ton bras." },
      { titre: "Le défi de l'étoile",
        texte: "Place-toi au bord de la place et regarde le dallage : Michel-Ange a dessiné une immense étoile. Compte ses branches, il y en a douze. Ensuite, trouve les deux statues géantes en haut de l'escalier : ce sont les jumeaux Castor et Pollux, chacun avec son cheval. Regarde bien le cheval de Marc Aurèle au centre : lequel de ses sabots est levé ? Enfin, passe à droite du palais du fond et cherche la terrasse cachée : d'un seul coup d'œil, tu verras tout le Forum romain en bas, comme sur une maquette." },
      { titre: "Le quiz",
        texte: "Pourquoi la statue du cavalier au milieu de la place est-elle une copie ? Réponse : la vraie statue de Marc Aurèle, en bronze doré, a environ 1 850 ans. Elle est restée dehors pendant des siècles, mais la pollution des voitures commençait à la ronger. En 1981, on l'a mise à l'abri dans le musée juste à côté, où tu peux la voir sous une grande verrière, et on a fabriqué une copie parfaite pour la place." }
    ]
  },
  {
    id: "bocca-verita",
    nom: "Bouche de la Vérité",
    categorie: "eglise",
    lat: 41.888, lon: 12.4816,
    duree: 20,
    conseil: "File d'attente pour la photo (petite contribution demandée), mais elle avance vite. L'église ferme à l'heure du déjeuner.",
    adultes: [
      { titre: "Un disque de marbre antique",
        texte: "Sous le porche de Santa Maria in Cosmedin, un grand disque de marbre pavonazzetto, un marbre blanc veiné de violet, mesure environ un mètre soixante-quinze de diamètre et pèse près de 1 300 kilos. Il montre un visage barbu dont les yeux, les narines et la bouche sont percés. Il date probablement du premier siècle après Jésus-Christ. On ne sait pas bien à quoi il servait : plaque d'égout d'une rue voisine, bouche de fontaine ou couvercle d'un puits de temple. Le visage serait celui d'Océan ou d'un dieu fleuve, peut-être le Tibre lui-même, dont les quais étaient tout proches. La plaque fut adossée au mur du porche en 1632, et c'est depuis le Moyen Âge qu'on lui attribue le pouvoir de démasquer les menteurs." },
      { titre: "Le marché aux bœufs",
        texte: "L'église se dresse sur le Forum Boarium, le marché aux bestiaux de la Rome antique, au bord du premier port fluvial de la ville. C'est ici que débarquaient les marchandises remontées depuis Ostie. Ici aussi s'élevait l'Ara Maxima, le grand autel d'Hercule, que le héros aurait fondé lui-même après avoir tué le géant Cacus. Sur la place voisine, deux temples exceptionnellement bien conservés témoignent de cette époque. Le temple rond d'Hercule Victor, de la fin du deuxième siècle avant Jésus-Christ, est le plus ancien édifice de marbre encore debout à Rome. Le temple de Portunus, le dieu des ports, dresse ses colonnes ioniques au-dessus du Tibre. Tous deux doivent leur survie à leur transformation en églises." },
      { titre: "Santa Maria in Cosmedin",
        texte: "L'église fut fondée au sixième siècle sur les bureaux de l'annone, l'administration chargée de distribuer le blé aux Romains. On voit encore leurs colonnes dans la nef. Au huitième siècle, le pape Adrien premier l'agrandit pour la communauté grecque qui fuyait Constantinople et la querelle des images, ce grand conflit sur le droit de représenter Dieu et les saints. Son surnom, Cosmedin, viendrait du grec kosmidion, qui signifie ornement. Le campanile roman à sept étages, l'un des plus élégants de Rome, date du douzième siècle. À l'intérieur, on admire le sol de marbres colorés réalisé par les Cosmates, une famille de mosaïstes romains, et la tribune de pierre réservée aux chanteurs. Avec le baldaquin gothique de 1294, ce dais de pierre qui surmonte l'autel, ils composent un ensemble médiéval rare. Dans une chapelle latérale, un reliquaire contient un crâne présenté comme celui de saint Valentin." },
      { titre: "La légende du menteur",
        texte: "La croyance en une bouche capable de mordre la main des menteurs existe déjà au Moyen Âge : les pèlerins la mentionnaient dans leurs guides. Une histoire médiévale raconte qu'une épouse soupçonnée d'adultère fut menée devant la pierre par son mari. Son amant, déguisé en fou, l'embrassa dans la foule juste avant l'épreuve. Elle put alors jurer que personne d'autre que son mari et ce fou ne l'avait jamais touchée, et la bouche resta fermée. La ruse est restée le modèle de tous les contes sur la vérité et le mensonge." },
      { titre: "Vacances romaines",
        texte: "La célébrité mondiale de la Bocca date de 1953 et du film Vacances romaines de William Wyler. Gregory Peck, qui joue un journaliste, glisse sa main dans la bouche devant Audrey Hepburn, princesse en fugue, puis fait semblant de l'avoir perdue. Peck avait emprunté ce gag à un comique de cabaret et n'avait rien dit à sa partenaire, dont le cri est authentique. Wyler garda la première prise. Depuis, la file d'attente sous le porche ne désemplit pas, et le geste est devenu l'un des rituels touristiques de Rome. Prenez le temps de visiter l'intérieur de l'église, que beaucoup de visiteurs ignorent." }
    ],
    enfants: [
      { titre: "Imagine ta main dans la bouche",
        texte: "Imagine que tu es un enfant romain du Moyen Âge. Tes parents te traînent devant un gros visage de pierre aux yeux creux. Tout le quartier connaît sa réputation : si tu mets ta main dans sa bouche et que tu dis un mensonge, elle se referme d'un coup et te tranche les doigts. Tu as vraiment rangé ta chambre ce matin ? Ta main tremble. Voilà comment, pendant des siècles, on a fait peur aux menteurs à Rome. Aujourd'hui encore, des milliers de visiteurs font la queue pour tenter l'expérience. Sois honnête, ça ne coûte rien." },
      { titre: "Hercule contre le monstre Cacus",
        texte: "Le savais-tu ? La petite place devant l'église était, il y a 2 500 ans, le marché aux bœufs de Rome. La légende raconte qu'Hercule lui-même y est passé, en ramenant un troupeau de bœufs volés à un géant à trois corps. Pendant qu'il dormait, un monstre cracheur de feu nommé Cacus lui a volé quelques bêtes en les tirant par la queue, à reculons, pour brouiller les traces. Hercule a fini par entendre les meuglements, il a défoncé la grotte de Cacus et l'a étranglé. Les Romains ont construit un autel à cet endroit, et le petit temple rond que tu vois sur la place est dédié à Hercule." },
      { titre: "Le plus vieil égout du monde",
        texte: "La bouche de pierre était sans doute, au départ, une plaque d'égout ! Sous tes pieds passe la Cloaca Maxima, le grand égout de Rome, creusé il y a environ 2 500 ans pour assécher les marécages entre les collines. Il est si bien construit qu'une partie fonctionne encore. Il se jette dans le Tibre juste à côté, sous un arc de pierre que tu peux apercevoir depuis le pont. Les Romains avaient même une déesse des égouts, Cloacina, avec son propre petit temple au Forum." },
      { titre: "Le défi des colonnes",
        texte: "Regarde le clocher de l'église et compte ses étages : il y en a sept, et chacun a des petites fenêtres à colonnettes. Sur la place, trouve le temple rond et compte ses colonnes : il y en avait vingt, mais une a disparu. Cherche ensuite le second temple, rectangulaire, celui de Portunus, le dieu des ports : certaines de ses colonnes sont rondes et libres, les autres sont à moitié enfoncées dans le mur. Enfin, dans l'église, regarde le sol : il est fait de milliers de petits morceaux de marbre rouge, vert et blanc qui forment des cercles et des tresses." },
      { titre: "Le quiz",
        texte: "Pourquoi les deux temples de la place sont-ils encore debout, alors que presque tous les autres temples romains sont en ruine ? Réponse : parce qu'ils ont été transformés en églises au Moyen Âge. Les chrétiens les ont entretenus, réparés et utilisés pendant des siècles, au lieu de prendre leurs pierres pour construire d'autres bâtiments, comme c'est arrivé au Colisée." }
    ]
  },
  {
    id: "aventin",
    nom: "Aventin : trou de serrure et Jardin des Orangers",
    categorie: "eglise",
    lat: 41.8833, lon: 12.478,
    duree: 30,
    conseil: "Petite file d'attente pour le trou de serrure, souvent moins de 10 minutes. Le jardin est parfait pour un pique-nique avec vue.",
    adultes: [
      { titre: "La colline du peuple",
        texte: "L'Aventin est la plus au sud des sept collines. Selon la légende, c'est ici que Rémus observa le vol des oiseaux pour fonder la ville, avant d'être vaincu par son frère Romulus, installé sur le Palatin. Longtemps hors de l'enceinte sacrée, la colline devint celle de la plèbe, le petit peuple de Rome. En 494 avant Jésus-Christ, le peuple s'y retira pour obtenir des tribuns chargés de le défendre, et en 456 une loi lui en distribua les terrains. Le temple de Diane, fondé par le roi Servius Tullius, faisait de la colline le lieu de culte commun des cités latines. Sous l'Empire, l'Aventin devint au contraire un quartier résidentiel élégant, où Trajan vécut avant de devenir empereur. Le pillage de Rome par Alaric, en 410, ravagea ses palais." },
      { titre: "Santa Sabina, la basilique intacte",
        texte: "Élevée entre 422 et 432 à l'emplacement de la maison d'une riche Romaine nommée Sabina, l'église est la basilique des premiers temps chrétiens la mieux conservée de Rome. Ses vingt-quatre colonnes corinthiennes en marbre de Proconnèse et sa nef toute simple donnent une idée exacte d'une église du cinquième siècle. Ses grandes fenêtres ne sont pas en verre mais en sélénite, une pierre translucide qui filtre une lumière blonde. Sous le porche, les portes de cyprès sculptées vers 430 conservent dix-huit panneaux sur vingt-huit, dont l'une des plus anciennes représentations connues de la Crucifixion. Les dominicains y sont installés depuis 1222 : saint Dominique y vécut et saint Thomas d'Aquin y enseigna. L'oranger du cloître, que l'on aperçoit par une ouverture du vestibule, serait le descendant de celui que planta le fondateur de l'ordre." },
      { titre: "Le Jardin des Orangers",
        texte: "Le parc Savello, que tout le monde appelle Jardin des Orangers, occupe l'emplacement du château de la famille Savelli, bâti au treizième siècle, et dont les murailles existent toujours. Aménagé en 1932 par l'architecte Raffaele De Vico, il fut planté d'orangers amers en hommage à saint Dominique. Sa terrasse s'ouvre sur le Tibre, le Trastevere, le Janicule et, au loin, la coupole de Saint-Pierre. En contrebas, la roseraie municipale occupe l'ancien cimetière juif, et ses allées dessinent la forme d'une menorah, le chandelier à sept branches. Plus bas encore s'étend le Circus Maximus, long d'environ 600 mètres, où les courses de chars rassemblaient plus de cent cinquante mille spectateurs." },
      { titre: "Piranèse et le trou de serrure",
        texte: "Au bout de la rue, la Piazza dei Cavalieri di Malta fut dessinée en 1765 par Giovanni Battista Piranesi, le graveur célèbre pour ses vues de Rome et ses prisons imaginaires. C'est sa seule réalisation architecturale : il orna la place d'obélisques et de stèles chargées de trophées militaires, puis rebâtit l'église Santa Maria del Priorato, où il est enterré. Derrière la porte verte s'étend le prieuré de l'Ordre souverain de Malte, héritier des Hospitaliers de Jérusalem, qui échappe aux lois italiennes, comme une ambassade. Par le trou de la serrure, une allée de lauriers taillés cadre exactement la coupole de Saint-Pierre, à plus de deux kilomètres. Les jardiniers entretiennent la perspective avec soin, et la perfection de l'effet doit peut-être autant au hasard qu'à Piranèse." },
      { titre: "Conseils de promenade",
        texte: "Le meilleur moment est la fin d'après-midi, quand le soleil descend sur le Trastevere. C'est aussi l'heure où les moines bénédictins de Sant'Anselmo, l'abbaye voisine, chantent les vêpres, la prière du soir, en grégorien. On peut redescendre par le Clivo di Rocca Savella, une ruelle médiévale pavée qui rejoint le Tibre, ou traverser le Circus Maximus vers les thermes de Caracalla." }
    ],
    enfants: [
      { titre: "Imagine le duel des jumeaux",
        texte: "Imagine deux frères jumeaux, Romulus et Rémus, debout chacun sur une colline, en train d'observer le ciel. Ils veulent fonder une ville, mais ils ne sont pas d'accord sur l'endroit. Pour se départager, ils comptent les vautours qui passent dans le ciel : c'est ainsi que les dieux enverront leur signe. Rémus, sur l'Aventin, la colline où tu marches, en voit six le premier. Romulus, sur le Palatin en face, en voit douze ensuite. Qui a gagné ? Les deux crient victoire, la dispute tourne mal, et Rémus est tué. Rome porte le nom de Romulus, mais l'Aventin est resté la colline des rebelles, où le peuple se réfugiait pour faire grève contre les riches." },
      { titre: "Une porte de 1 600 ans",
        texte: "Le savais-tu ? Sous le porche de l'église Santa Sabina, tu verras une porte en bois de cyprès sculptée vers l'an 430, quand l'Empire romain existait encore. Elle a survécu aux incendies, aux guerres et aux pillages. Ses panneaux racontent la Bible comme une bande dessinée. Cherche en haut à gauche l'une des toutes premières images de Jésus sur la croix de toute l'histoire, avec deux petits bonshommes à ses côtés. À l'époque, les chrétiens n'osaient presque jamais représenter cette scène. Dans l'église, la lumière ne passe pas par du verre mais par de fines plaques de pierre translucide, qui laissent passer le jour, comme il y a 1 600 ans." },
      { titre: "Un pays derrière une porte",
        texte: "La porte verte de la place, tout au bout de la rue, cache un jardin qui n'est pas vraiment en Italie. Il appartient à l'Ordre de Malte, une organisation de chevaliers fondée il y a plus de 900 ans pour soigner les pèlerins à Jérusalem. Ces chevaliers ont possédé l'île de Rhodes, puis l'île de Malte, avant de tout perdre face à Napoléon. Aujourd'hui, ils n'ont plus de pays, mais ils ont encore un drapeau, des passeports, des ambassades, et cette maison sur l'Aventin, où les lois italiennes ne s'appliquent pas. Le grand artiste Piranèse a dessiné la place et l'église juste à côté, et il y est enterré." },
      { titre: "Le défi de la serrure",
        texte: "Colle ton œil au trou de la serrure de la porte verte. Tu dois voir une allée bordée de buissons taillés et, tout au bout, parfaitement encadrée, la coupole de Saint-Pierre, à plus de deux kilomètres. Chronomètre le temps que met chaque membre de ta famille à la trouver. Puis va au Jardin des Orangers : sens les fleurs d'oranger au printemps, mais ne goûte pas les fruits, ils sont amers. Depuis la terrasse, repère le fleuve Tibre en bas, la colline du Janicule en face, et retrouve les vieux murs du château qui entourent le jardin." },
      { titre: "Le quiz",
        texte: "Dans le jardin de Santa Sabina, il y a un oranger qui aurait été planté par saint Dominique, un moine espagnol, vers 1220. Question : cet arbre peut-il vraiment avoir 800 ans ? Réponse : non, un oranger vit rarement plus d'un siècle. Mais chaque fois que l'arbre meurt, les moines en font repousser un nouveau à partir de ses graines ou de ses pousses, comme une chaîne. Celui que tu peux apercevoir par le petit trou du vestibule serait donc l'arrière-arrière-petit-fils de l'original." }
    ]
  },
  {
    id: "saint-jean-latran",
    nom: "Basilique Saint-Jean-de-Latran",
    categorie: "eglise",
    lat: 41.8859, lon: 12.5057,
    duree: 40,
    conseil: "Métro A, station San Giovanni. Entrée gratuite. Le cloître (payant) est un petit bijou avec ses colonnes torsadées.",
    adultes: [
      { titre: "Des Laterani à Constantin",
        texte: "Le nom vient d'une riche famille romaine, les Laterani, dont Néron confisqua les propriétés en 65 après Jésus-Christ, à la suite d'une conspiration manquée. Sous Septime Sévère, on installa ici la caserne de la garde à cheval de l'empereur. En 312, ces cavaliers combattirent pour Maxence au pont Milvius. Constantin, le vainqueur, supprima leur corps et rasa leur caserne. Sur ses fondations, il fit bâtir la première grande basilique chrétienne de Rome et offrit le palais voisin à l'évêque de la ville. L'église fut dédiée au Sauveur en 324 par le pape Sylvestre. Ses deux saints Jean, le Baptiste et l'Évangéliste, lui furent associés plus tard. Elle reste la cathédrale de Rome, et son inscription la proclame mère et tête de toutes les églises de la ville et du monde." },
      { titre: "Mille ans de papauté",
        texte: "Pendant près de mille ans, jusqu'au départ pour Avignon en 1309, les papes vécurent au Latran, et non au Vatican. Cinq grands conciles, ces assemblées d'évêques venus du monde entier, y furent réunis entre 1123 et 1517, dont le quatrième, en 1215, qui fixa des règles encore en vigueur. Le palais subit un tremblement de terre en 896 et deux incendies, en 1307 et 1361. À leur retour de France en 1377, les papes trouvèrent des ruines et s'installèrent au Vatican. En 1586, Sixte Quint fit abattre l'ancien palais et confia à Domenico Fontana la construction de l'édifice actuel. C'est dans ce palais que furent signés en 1929 les accords du Latran, qui créèrent l'État de la Cité du Vatican. Chaque pape nouvellement élu vient toujours prendre possession de sa cathédrale." },
      { titre: "Borromini et la façade",
        texte: "L'intérieur doit son allure à Francesco Borromini, chargé par Innocent X de consolider la basilique pour le jubilé, l'année sainte de 1650. Génie tourmenté, il enveloppa les vieilles colonnes dans des piliers massifs, creusa des niches et créa un espace blanc et solennel. Les douze statues d'apôtres qui occupent ces niches furent sculptées entre 1703 et 1718 par les meilleurs artistes de Rome. Les portes de bronze du portail central proviennent de la Curie du Forum romain, où siégeait le Sénat, et furent transférées ici en 1660. La façade monumentale, avec ses quinze statues de sept mètres de haut, fut achevée par Alessandro Galilei en 1735." },
      { titre: "À voir à l'intérieur",
        texte: "Au-dessus de l'autel papal, où seul le pape peut célébrer la messe, se dresse le ciborium gothique de 1367, une sorte de grand dais de pierre. Il abrite les reliquaires qui, selon la tradition, contiennent les têtes de saint Pierre et de saint Paul. Devant, une dalle de bronze marque la tombe de Martin V, le pape qui ramena définitivement la papauté à Rome en 1420. Le plafond à caissons date du seizième siècle, et le sol de marbres colorés, œuvre de l'atelier des Cosmates, de 1425. Le cloître, réalisé vers 1230 par la famille Vassalletto, aligne des colonnettes torsadées incrustées de mosaïques. Le baptistère à huit côtés, fondé par Constantin et remodelé au cinquième siècle, servit de modèle à tous les baptistères d'Italie." },
      { titre: "L'obélisque et la Scala Santa",
        texte: "Sur la place, l'obélisque de granit rouge est le plus haut obélisque antique encore debout : 32 mètres, plus de 45 avec son socle, pour environ 455 tonnes. Il fut taillé pour les pharaons Thoutmôsis III et son petit-fils Thoutmôsis IV, au quinzième siècle avant Jésus-Christ, et se dressait à Karnak. L'empereur Constance II le fit apporter à Rome en 357 pour orner le Circus Maximus. Retrouvé brisé en trois morceaux en 1587, il fut redressé ici l'année suivante. En face, la Scala Santa est un escalier de vingt-huit marches de marbre que sainte Hélène aurait rapportées du palais de Ponce Pilate, à Jérusalem. Il mène au Sancta Sanctorum, la chapelle privée des papes du Moyen Âge, où l'on conserve une icône du Christ que l'on dit peinte sans main humaine." }
    ],
    enfants: [
      { titre: "Imagine la caserne des cavaliers",
        texte: "Imagine cet endroit il y a 1 800 ans. Pas de basilique, mais une immense caserne pleine de chevaux, d'écuries et de soldats qui s'entraînent : la garde à cheval de l'empereur, les meilleurs cavaliers de l'Empire. En 312, ces cavaliers ont choisi le mauvais camp dans une guerre entre deux empereurs. Le vainqueur, Constantin, a dissous leur troupe et rasé leur caserne jusqu'aux fondations. Puis il a offert le terrain aux chrétiens, qui étaient encore persécutés quelques années plus tôt, pour bâtir leur première grande église. Sous le sol de la basilique, les archéologues ont retrouvé les murs de la caserne et même des tombes de cavaliers." },
      { titre: "Le géant de granit",
        texte: "Le savais-tu ? L'obélisque sur la place pèse autant que près de cent éléphants. Pour le transporter d'Égypte, il y a 1 700 ans, l'empereur Constance II a fait construire un navire spécial, gigantesque, avec 300 rameurs. Le navire a traversé toute la Méditerranée. Ensuite, l'obélisque a été dressé au Circus Maximus, où les chars de course l'ont contourné pendant des siècles. Puis il est tombé, s'est cassé en trois morceaux et a disparu dans la boue. On l'a retrouvé par hasard en 1587, enterré à sept mètres de profondeur. Le pape l'a fait réparer et installer ici, avec une croix au sommet." },
      { titre: "Les portes du Sénat",
        texte: "Les grandes portes de bronze au milieu de la façade ont environ 1 700 ans, mais elles n'ont pas été fabriquées pour l'église. Elles fermaient la Curie, le bâtiment du Forum romain où se réunissaient les sénateurs. Des milliers de fois, des hommes en toge les ont poussées pour aller débattre des guerres, des lois et des impôts de l'Empire. Un pape les a fait démonter et transporter ici en 1660. Quand tu passes devant, tu touches presque le même métal que les sénateurs romains." },
      { titre: "Le défi des géants",
        texte: "À l'intérieur, compte les statues géantes dans les niches de la grande nef : il y a douze apôtres, chacun avec un objet qui raconte sa vie. Cherche celui qui tient des clés, saint Pierre, celui qui tient une épée, saint Paul, et celui qui tient une scie, saint Simon. Dehors, sur le toit de la façade, compte les quinze statues, hautes comme des immeubles de deux étages. Enfin, si tu traverses la place, regarde les pèlerins de la Scala Santa : ils ne montent les 28 marches qu'à genoux, jamais debout." },
      { titre: "Le quiz",
        texte: "Quelle est la vraie cathédrale de Rome, celle de l'évêque de Rome, qui est le pape : Saint-Pierre du Vatican ou Saint-Jean-de-Latran ? Réponse : Saint-Jean-de-Latran ! Saint-Pierre est plus grande et plus célèbre, mais ce n'est pas une cathédrale. Une cathédrale est l'église où se trouve le siège officiel de l'évêque, sa cathedra, et celui du pape est ici. C'est pourquoi chaque nouveau pape vient s'y asseoir en cérémonie peu après son élection." }
    ]
  },
  {
    id: "saint-clement",
    nom: "Basilique Saint-Clément",
    categorie: "eglise",
    lat: 41.8893, lon: 12.4977,
    duree: 45,
    conseil: "L'église du haut est gratuite, les souterrains sont payants (billet en ligne conseillé). Il fait frais et humide en bas : idéal en pleine chaleur.",
    adultes: [
      { titre: "Trois églises superposées",
        texte: "Saint-Clément est le meilleur endroit de Rome pour comprendre comment la ville s'est construite sur elle-même. Le niveau de la rue a monté d'une quinzaine de mètres depuis l'Antiquité, au gré des incendies, des inondations et des démolitions. En descendant, on traverse trois époques : la basilique médiévale, une basilique du quatrième siècle et, tout en bas, des constructions du premier siècle. Celles-ci furent élevées après le grand incendie de Néron, en 64. L'église est dédiée à Clément, le quatrième pape selon la tradition, mort en exil en Crimée vers l'an 100. Jeté à la mer avec une ancre au cou, il aurait été enseveli dans un sanctuaire sous-marin." },
      { titre: "Le temple secret de Mithra",
        texte: "Au niveau le plus bas, une ruelle romaine sépare deux bâtiments. D'un côté, une grande construction de briques, peut-être un entrepôt ou l'atelier où l'on frappait la monnaie impériale. De l'autre, une maison bourgeoise dont la cour fut transformée vers l'an 200 en sanctuaire de Mithra. Ce dieu d'origine perse, très populaire dans l'armée, était honoré dans des salles voûtées qui imitaient une grotte. Ses fidèles, uniquement des hommes, y partageaient un banquet rituel sur deux banquettes de pierre. L'autel central montre Mithra égorgeant le taureau des origines, et la voûte est parsemée d'étoiles en stuc, un plâtre décoratif. Le christianisme, qui rivalisait avec ce culte, l'emporta au quatrième siècle, et la basilique fut bâtie juste au-dessus." },
      { titre: "La basilique du quatrième siècle",
        texte: "Le niveau intermédiaire correspond à l'église édifiée vers 390 sous le pape Sirice, à partir d'une maison où les chrétiens se réunissaient déjà auparavant. Elle fut décorée entre le neuvième et le onzième siècle de fresques exceptionnelles : la vie de saint Clément, le transport de ses reliques jusqu'à Rome par saint Cyrille, et l'histoire du noble païen Sisinnius. Cette dernière scène porte une inscription peinte vers 1080, où le maître insulte ses serviteurs dans la langue du peuple. C'est l'un des tout premiers textes écrits en italien plutôt qu'en latin. Saint Cyrille, l'inventeur de l'alphabet des Slaves, mourut à Rome en 869 et fut enterré ici. Sa tombe est un lieu de pèlerinage pour les Bulgares et tous les peuples slaves." },
      { titre: "La basilique médiévale",
        texte: "En 1084, les troupes normandes de Robert Guiscard, venues secourir le pape Grégoire VII, incendièrent le quartier. La vieille basilique fut remplie de gravats, et le pape Pascal II fit élever la nouvelle entre 1100 et 1120 environ. On y remonta les marbres sculptés de la tribune des chanteurs, qui datent du sixième siècle. La mosaïque de l'abside, l'une des plus belles de Rome, montre une croix d'où jaillit une immense plante d'acanthe. Ses rameaux forment cinquante médaillons peuplés d'oiseaux, de cerfs et de scènes de la vie quotidienne : c'est l'image du Christ arbre de vie. À l'entrée, la chapelle Sainte-Catherine conserve des fresques peintes vers 1430 par Masolino, aux premiers temps de la Renaissance." },
      { titre: "Les dominicains irlandais",
        texte: "Depuis 1667, la basilique est confiée aux dominicains irlandais, chassés de leur île par Cromwell. En 1857, l'un d'eux, le père Joseph Mullooly, commença à creuser sous le pavement et découvrit les niveaux inférieurs, un événement pour l'archéologie chrétienne. Les fouilles furent longtemps gênées par l'eau, car une source antique inondait le temple de Mithra. Il fallut creuser en 1912 un tunnel de près de 700 mètres pour l'évacuer vers la Cloaca Maxima, le grand égout de Rome. On entend toujours couler cette eau au fond, dernier bruit d'une Rome enfouie." }
    ],
    enfants: [
      { titre: "Imagine une machine temporelle",
        texte: "Imagine un escalier qui descend, descend, et à chaque étage tu recules de plusieurs siècles. En haut, tu es en l'an 1100, dans une église scintillante de mosaïques dorées. Un étage plus bas, tu arrives en l'an 400 : les murs sont couverts de peintures et l'Empire romain existe encore. Encore plus bas, te voilà en l'an 100. Tu marches dans une vraie rue de Rome, entre deux immeubles de briques, dans le noir et l'humidité. Les gens qui vivaient ici ont vu construire le Colisée, juste à côté. Saint-Clément est l'un des rares endroits au monde où l'on peut faire ce voyage à pied." },
      { titre: "Le pape à l'ancre",
        texte: "Le savais-tu ? Clément était l'un des tout premiers papes, il y a 1 900 ans. L'empereur l'a exilé en Crimée, au bord de la mer Noire, pour travailler dans les mines. Comme il continuait à convertir les prisonniers, on l'a jeté à la mer avec une ancre attachée au cou. La légende dit que la mer s'est retirée pour montrer sa tombe, dans un petit temple sous-marin. Un jour, un enfant oublié sur la plage a été englouti par la marée. Un an plus tard, quand l'eau s'est retirée à nouveau, ses parents l'ont retrouvé vivant, endormi près de la tombe du saint. C'est pour cela que tu verras des ancres un peu partout dans l'église." },
      { titre: "Le club secret du taureau",
        texte: "Tout en bas, une petite salle voûtée était le temple d'un dieu venu de Perse, Mithra. Ses fidèles formaient une sorte de club secret réservé aux hommes, surtout des soldats et des marchands. Il y avait sept grades, comme des niveaux dans un jeu : on commençait Corbeau et on finissait Père. Pour monter de niveau, il fallait passer des épreuves dont personne ne connaît les détails, car tout était secret. Les membres se réunissaient sur les deux banquettes de pierre pour un banquet, sous un plafond décoré d'étoiles, devant l'image de Mithra en train de tuer un taureau." },
      { titre: "Le défi des sens",
        texte: "Dans l'église du haut, lève les yeux vers la grande mosaïque dorée : cherche les deux cerfs qui boivent, les colombes blanches et la femme qui donne à manger à ses poules. Descends ensuite au deuxième niveau et trouve la peinture où des hommes tirent une colonne : c'est celle avec les gros mots écrits en vieil italien. Tout en bas, dans le temple de Mithra, cherche le taureau sur l'autel. Puis fais silence, pose ta main sur un mur et écoute : tu entendras une rivière couler quelque part sous tes pieds. On ne sait pas exactement d'où elle vient." },
      { titre: "Le quiz",
        texte: "Pourquoi les trois églises sont-elles empilées les unes sur les autres, au lieu d'être construites côte à côte ? Réponse : parce que le sol de Rome a monté d'environ quinze mètres en 2 000 ans. Quand un bâtiment brûlait ou s'écroulait, on ne déblayait pas : on remplissait les ruines de gravats et on construisait dessus. Les vieilles églises ont été oubliées sous terre, jusqu'à ce qu'un moine irlandais, en 1857, les retrouve en creusant." }
    ]
  },
  {
    id: "sainte-marie-majeure",
    nom: "Basilique Sainte-Marie-Majeure",
    categorie: "eglise",
    lat: 41.8976, lon: 12.4985,
    duree: 40,
    conseil: "Près de la gare Termini. Entrée gratuite, tenue correcte exigée. La tombe du pape François se trouve dans la nef latérale gauche, près de la chapelle Pauline.",
    adultes: [
      { titre: "La neige d'août",
        texte: "Selon une légende née au Moyen Âge, la Vierge apparut dans la nuit du 4 au 5 août 358 au pape Libère et à un riche patricien nommé Jean. Elle leur demanda de bâtir une église là où ils trouveraient de la neige. Le lendemain, la neige recouvrait le sommet de l'Esquilin. Cette histoire, qu'aucun texte ancien ne mentionne, a donné à la basilique ses surnoms de Sainte-Marie-des-Neiges et de basilique libérienne. La réalité est un peu différente : c'est le pape Sixte III qui fit construire l'édifice actuel entre 432 et 440. C'était juste après le concile d'Éphèse de 431, qui venait de proclamer Marie Mère de Dieu. C'est la plus grande église de Rome dédiée à la Vierge." },
      { titre: "La basilique du cinquième siècle",
        texte: "Malgré les ajouts, Sainte-Marie-Majeure est, des quatre basiliques papales, celle qui a le mieux conservé sa structure des premiers siècles chrétiens. La nef, longue de près de 86 mètres, est portée par quarante colonnes antiques de marbre et de granit. Au-dessus court une série de trente-six panneaux de mosaïques du cinquième siècle qui racontent l'Ancien Testament, d'Abraham à Josué. L'arc triomphal, au fond de la nef, illustre l'enfance du Christ dans un style encore très romain. Ces mosaïques sont les plus anciennes de ce type à Rome. Le sol de marbres de toutes les couleurs, œuvre des Cosmates, fut offert vers 1150 par un noble romain. L'abside reçut en 1295 la grande mosaïque du Couronnement de la Vierge, signée par Jacopo Torriti." },
      { titre: "Or, campanile et façade",
        texte: "Le plafond à caissons, dessiné par Giuliano da Sangallo à la fin du quinzième siècle, porte les armoiries des papes Borgia. La tradition veut que sa dorure provienne du premier or rapporté des Amériques, offert par les rois catholiques d'Espagne. Le campanile roman, élevé en 1377 au retour des papes d'Avignon, atteint 75 mètres, un record à Rome. La façade actuelle, avec sa loggia, fut construite par Ferdinando Fuga en 1743. Elle abrite, sans les cacher, les mosaïques du treizième siècle de Filippo Rusuti, qui racontent le miracle de la neige. Sur la place, la colonne de marbre provient de la basilique de Maxence, au Forum. Paul V la fit dresser en 1614 et couronner d'une Vierge de bronze." },
      { titre: "Les chapelles et la crèche",
        texte: "Deux chapelles monumentales se font face de part et d'autre du transept, la partie de l'église qui croise la nef. La chapelle Sixtine, à droite, fut bâtie par Domenico Fontana pour Sixte Quint en 1585. La chapelle Pauline, à gauche, fut élevée par Flaminio Ponzio pour Paul V Borghèse, entre 1605 et 1611. Cette dernière abrite l'icône Salus Populi Romani, le Salut du peuple romain, une Vierge à l'Enfant que la tradition attribue à saint Luc. Depuis des siècles, les Romains la promènent en procession pour éloigner les pestes et les guerres. Sous l'autel majeur, la crypte de la Nativité conserve dans un reliquaire de cristal cinq planches en bois de sycomore, vénérées comme les restes de la crèche de Bethléem." },
      { titre: "Le Bernin et le pape François",
        texte: "Le plus grand sculpteur du baroque, Gian Lorenzo Bernini, que l'on appelle le Bernin, repose ici sous une simple dalle, à droite de l'autel, dans le caveau de sa famille. Le pape François, très attaché à l'icône de la Vierge, venait prier devant elle avant et après chacun de ses voyages, plus d'une centaine de fois. Il choisit d'être enterré tout près, dans le bas-côté gauche, sous une pierre venue de Ligurie, la région de ses grands-parents, qui porte un seul mot : Franciscus. Sa tombe, où il fut inhumé le 26 avril 2025, est devenue l'un des lieux les plus visités de la basilique." }
    ],
    enfants: [
      { titre: "Imagine de la neige en août",
        texte: "Imagine Rome en plein mois d'août, il y a plus de 1 600 ans. Il fait une chaleur écrasante, les rues sont poussiéreuses, tout le monde cherche l'ombre. Et pourtant, un matin, les habitants découvrent le sommet d'une colline recouvert de neige fraîche, blanche et froide. La nuit précédente, la Vierge Marie est apparue en rêve au pape et lui a dit : construis-moi une église là où tu trouveras de la neige. Le pape a tracé le plan de l'église directement dans la neige avec son bâton. Voilà la légende de cette basilique. Chaque année, le 5 août, on fait tomber des milliers de pétales blancs du plafond pour rejouer la scène." },
      { titre: "Un plafond en or d'Amérique",
        texte: "Le savais-tu ? Lève la tête : le plafond est couvert d'or. On raconte que cet or est le premier arrivé en Europe depuis l'Amérique, après les voyages de Christophe Colomb. Les rois d'Espagne l'auraient offert au pape Alexandre VI Borgia, un pape espagnol. Et lui l'aurait fait étaler ici, en feuilles très fines, sur les caissons, ces grandes cases creusées dans le plafond de bois. Personne ne peut le prouver, mais si c'est vrai, cet or a traversé l'océan Atlantique sur une caravelle. Cherche le taureau des Borgia sculpté sur le plafond : c'était l'emblème de leur famille." },
      { titre: "L'image qui voyage",
        texte: "Dans la grande chapelle de gauche, une vieille icône représente Marie et Jésus enfant. Les Romains l'appellent le Salut du peuple romain, car ils croient qu'elle les a protégés de la peste, de la famine et des guerres. Pendant des siècles, quand un danger menaçait, on la portait en procession dans les rues. Le pape François l'adorait : avant chaque voyage à l'étranger, il venait lui déposer des fleurs, et il revenait la remercier au retour. Il est venu plus de cent fois, et il a demandé à être enterré juste à côté d'elle, dans une tombe toute simple." },
      { titre: "Le défi des trésors cachés",
        texte: "Compte les colonnes de la grande nef : il y en a quarante, et elles ont été prises sur des bâtiments romains encore plus anciens. Au-dessus, cherche les petites mosaïques carrées avec des personnages minuscules : elles ont 1 600 ans. Ensuite, descends l'escalier devant l'autel : au fond, dans une boîte de cristal, cinq vieilles planches de bois seraient des morceaux du berceau de Jésus. Trouve aussi la tombe du pape François, dans le bas-côté gauche : une pierre claire avec un seul mot, son nom en latin. Et dehors, lève la tête vers le clocher, le plus haut de Rome." },
      { titre: "Le quiz",
        texte: "Quelle est la hauteur du clocher de Sainte-Marie-Majeure, le plus haut de Rome ? Réponse : environ 75 mètres, soit la hauteur d'un immeuble de 25 étages. Il a été construit en 1377 pour fêter le retour des papes à Rome après soixante-dix ans passés en France, à Avignon. Sa cloche, surnommée la Sperduta, la perdue, sonne chaque soir : la légende dit qu'elle guidait autrefois une bergère égarée dans la nuit." }
    ]
  },
  {
    id: "ghetto",
    nom: "Ghetto et Portique d'Octavie",
    categorie: "quartier",
    lat: 41.8925, lon: 12.4778,
    duree: 30,
    conseil: "Goûtez la pizza ebraica (gâteau aux fruits secs) à la pâtisserie Boccione. Le quartier est calme le samedi, jour de shabbat.",
    adultes: [
      { titre: "Deux mille ans de présence",
        texte: "Les Juifs de Rome forment la plus ancienne communauté juive d'Europe. Des délégués de Judée sont reçus par le Sénat dès le deuxième siècle avant Jésus-Christ. Au temps de Jules César, qui la protège, une communauté organisée vit déjà dans la ville. Après la destruction du Temple de Jérusalem en l'an 70, l'empereur Titus ramène à Rome des milliers de prisonniers et le trésor du sanctuaire. L'arc de Titus, au Forum, montre encore les légionnaires qui portent le chandelier à sept branches. Pendant l'Antiquité et le Moyen Âge, les Juifs romains habitent surtout le Trastevere. Puis ils traversent le fleuve et s'installent sur la rive gauche, autour du Portique d'Octavie, dans le quartier que l'on parcourt aujourd'hui." },
      { titre: "Le ghetto, de 1555 à 1870",
        texte: "Le 14 juillet 1555, le pape Paul IV publie un décret, la bulle Cum nimis absurdum, et ordonne d'enfermer les Juifs de Rome dans un enclos de trois hectares à peine. Il se trouve le long du Tibre, dans la zone la plus basse et la plus inondable de la ville. Des murs sont dressés, des portes fermées chaque soir au coucher du soleil et rouvertes à l'aube. Les habitants doivent porter un signe jaune. Ils n'ont le droit d'exercer que deux métiers, la vente de vieux vêtements et le prêt sur gages, et on les oblige à assister à des sermons destinés à les convertir. Les maisons s'y élèvent sur plusieurs étages pour loger des milliers de personnes. Les murs tombent en 1848, sont relevés, puis disparaissent pour de bon en 1870, lorsque Rome devient la capitale de l'Italie. Le vieux quartier insalubre est rasé vers 1888 et la grande synagogue, avec sa coupole carrée couverte d'aluminium, est inaugurée en 1904. En 1986, Jean-Paul II y entre en ami : c'est la première visite d'un pape dans une synagogue." },
      { titre: "Le 16 octobre 1943",
        texte: "En septembre 1943, les Allemands qui occupent la ville exigent de la communauté cinquante kilos d'or en trente-six heures. Les Juifs romains, aidés par de nombreux voisins chrétiens, rassemblent la somme, mais cela ne les sauve pas. Le 16 octobre à l'aube, le quartier est encerclé et plus de mille personnes sont arrêtées et déportées vers Auschwitz. Seize seulement reviendront. Devant les portes, de petits pavés de laiton doré rappellent un par un le nom des habitants disparus, avec leur date de naissance et leur date d'arrestation. On les appelle les pierres d'achoppement, parce que le regard bute dessus." },
      { titre: "Portique et théâtre antiques",
        texte: "Au bout de la rue principale se dressent les ruines du Portique d'Octavie, reconstruit par Auguste entre 27 et 23 avant Jésus-Christ et dédié à sa sœur. C'était un vaste rectangle de colonnes qui abritait deux temples, des bibliothèques et des chefs-d'œuvre grecs rapportés par les généraux victorieux. Ce qui reste aujourd'hui, le pavillon d'entrée, a été restauré par l'empereur Septime Sévère en 203, après un incendie. Au Moyen Âge, l'église Sant'Angelo in Pescheria s'y est installée et le marché aux poissons a occupé les lieux jusqu'au dix-neuvième siècle. Juste derrière se dresse le théâtre de Marcellus, commencé par César et inauguré par Auguste vers 13 avant Jésus-Christ, en mémoire de son neveu mort à vingt ans. Il pouvait accueillir près de quinze mille spectateurs. Ses arcades superposées, avec des colonnes de style dorique en bas et ionique au-dessus, ont servi de modèle aux architectes du Colisée. Devenu forteresse au Moyen Âge, il a été transformé en palais au seizième siècle par l'architecte Baldassarre Peruzzi, pour la famille Savelli." },
      { titre: "Saveurs et parcours",
        texte: "Flânez le long de la Via del Portico d'Ottavia, où les trattorias servent les carciofi alla giudia, ces artichauts frits qui s'ouvrent comme des fleurs. Poussez ensuite jusqu'à la Piazza Mattei pour admirer la fontaine des Tortues, dessinée par Giacomo della Porta et sculptée par Taddeo Landini entre 1581 et 1588. Les quatre tortues de bronze, ajoutées vers 1658, sont attribuées au Bernin. Le musée juif, sous la synagogue, expose tissus brodés, objets rituels et documents du ghetto, et permet de visiter la grande salle de prière." }
    ],
    enfants: [
      { titre: "Imagine un quartier fermé à clé",
        texte: "Imagine que tu habites une rue où, chaque soir au coucher du soleil, des gardes ferment de grandes portes à clé. Personne ne peut sortir avant le lever du jour. C'est ce qu'ont vécu les Juifs de Rome pendant plus de trois cents ans, de 1555 à 1870, dans un quartier minuscule coincé contre le Tibre. À chaque crue, le fleuve entrait dans les maisons. Comme la place manquait, on construisait les maisons toujours plus haut. Les ruelles étaient si étroites que les voisins pouvaient presque se serrer la main d'une fenêtre à l'autre. Aujourd'hui, les murs ont disparu, mais le quartier a gardé ses ruelles, ses odeurs de friture et sa grande synagogue." },
      { titre: "Le chandelier disparu",
        texte: "Il y a presque deux mille ans, les soldats de l'empereur Titus ont pris Jérusalem et rapporté à Rome le trésor du Temple. Dedans, il y avait un immense chandelier d'or à sept branches, la menorah. On la voit sculptée sur l'arc de Titus, au Forum, portée par des soldats qui défilent. Et ensuite ? Mystère. Certains racontent qu'elle a coulé au fond du Tibre quand les Vandales ont pillé Rome. D'autres disent qu'elle a été emportée à Constantinople, ou même qu'elle dort dans une cave du Vatican. Personne ne l'a jamais retrouvée." },
      { titre: "Le gâteau brûlé exprès",
        texte: "Dans la rue principale, une petite boulangerie sans enseigne vend la pizza ebraica. Ce n'est pas une pizza du tout : c'est un gâteau épais aux amandes, aux raisins secs et aux fruits confits. Son dessus est volontairement presque noir, comme s'il avait brûlé. Les Romains font la queue pour l'acheter depuis plus d'un siècle. Les recettes du quartier sont nées de la pauvreté du ghetto. On cuisinait ce que les autres ne voulaient pas, comme les artichauts ou les restes de morue, et on les faisait frire pour leur donner du goût. Résultat : ce sont aujourd'hui les plats les plus célèbres de Rome." },
      { titre: "Défi sur les pavés",
        texte: "Devant les portes des immeubles, cherche les petits pavés dorés gravés d'un nom et d'une date : compte ceux que tu trouves dans une seule rue. Sous le Portique d'Octavie, trouve la plaque de marbre du Moyen Âge où l'on mesurait les poissons. Sur la Piazza Mattei, compte les tortues de la fontaine et observe comment les quatre jeunes hommes les poussent vers le bassin du haut. Enfin, devant le théâtre de Marcellus, compte les étages : deux étages d'arcades romaines en bas, et au-dessus, un palais avec de vraies fenêtres et des rideaux." },
      { titre: "Le quiz",
        texte: "Question : pourquoi le théâtre de Marcellus ressemble-t-il autant au Colisée ? Réponse : parce que c'est le Colisée qui l'a copié ! Le théâtre a été inauguré vers 13 avant Jésus-Christ, et le Colisée près de quatre-vingt-dix ans plus tard. Les architectes des empereurs Vespasien et Titus ont repris la même idée d'arcades superposées, avec des colonnes de styles différents à chaque étage." }
    ]
  },
  {
    id: "ile-tiberine",
    nom: "Île Tibérine",
    categorie: "quartier",
    lat: 41.8907, lon: 12.4776,
    duree: 20,
    conseil: "Traversez l'île pour passer du Ghetto au Trastevere : c'est le chemin le plus joli. Glacier et pause à l'ombre sur les quais.",
    adultes: [
      { titre: "Une île née du fleuve",
        texte: "Longue d'environ trois cents mètres et large de moins de soixante-dix, l'île Tibérine est la seule île du Tibre dans Rome. Elle repose sur un socle de roche volcanique autour duquel le fleuve a déposé ses alluvions. Les Romains lui donnaient une origine plus poétique. En 509 avant Jésus-Christ, après avoir chassé le dernier roi, Tarquin le Superbe, le peuple aurait jeté dans le Tibre les gerbes de blé récoltées sur les champs du tyran. Retenues par la vase, ces gerbes auraient formé l'île. Sa position, à l'endroit où le fleuve est le plus facile à franchir, explique pourquoi Rome est née juste ici. C'est à ce gué, ce passage où l'on traversait à pied, que les marchands de sel franchissaient le Tibre bien avant Romulus." },
      { titre: "Esculape et le serpent",
        texte: "En 293 avant Jésus-Christ, une épidémie ravage la ville. Sur le conseil des livres sibyllins, de vieux recueils de prophéties, le Sénat envoie une ambassade à Épidaure, en Grèce, pour chercher Esculape, le dieu de la médecine. Selon la légende, le dieu est monté à bord sous la forme d'un serpent. À l'arrivée, il s'est glissé dans l'eau pour gagner l'île, et c'est ainsi qu'il a désigné l'emplacement de son sanctuaire. Le temple a été inauguré vers 289 avant Jésus-Christ. Les malades y passaient la nuit dans l'espoir de recevoir le remède en rêve. Au premier siècle avant Jésus-Christ, les Romains ont habillé les bords de l'île de travertin, une pierre blanche de la région, pour lui donner la silhouette d'un navire. Un obélisque dressé au milieu faisait office de mât. Un fragment de cette proue est encore visible à la pointe sud. On y distingue un bâton autour duquel s'enroule un serpent : c'est l'emblème d'Esculape, que les pharmacies utilisent toujours. L'église San Bartolomeo all'Isola, fondée par l'empereur Otton III en 998, occupe la place du temple. Le puits de marbre, au milieu des marches du chœur, serait le souvenir de la source sacrée." },
      { titre: "Les ponts les plus anciens",
        texte: "Le pont Fabricius, qui relie l'île à la rive gauche, a été construit en 62 avant Jésus-Christ par Lucius Fabricius, le responsable des routes de la ville. Son nom se lit encore quatre fois sur les arches. Ses deux arches de vingt-quatre mètres n'ont jamais été reconstruites : c'est le plus vieux pont de Rome encore utilisé dans son état d'origine. Les Romains l'appellent pont des Quatre-Têtes, à cause des deux piliers antiques à quatre visages qui ornent son parapet. En face, le pont Cestius, du premier siècle avant Jésus-Christ, a été remonté à la fin du dix-neuvième siècle lors de la construction des quais. Un peu plus bas sur le fleuve, l'arche solitaire du Ponte Rotto, le pont brisé, est tout ce qui reste du pont Aemilius, le premier pont de pierre de Rome. Il avait été commencé en 179 avant Jésus-Christ, et la crue de 1598 l'a emporté." },
      { titre: "Deux mille ans de soins",
        texte: "La vocation médicale de l'île n'a jamais cessé. En 1584, les frères de Saint-Jean-de-Dieu fondent l'hôpital que les Romains appellent Fatebenefratelli, du cri des moines qui quêtaient dans les rues : « Faites le bien, frères ! » Il fonctionne toujours. Pendant l'occupation allemande, en octobre 1943, le médecin Giovanni Borromeo et ses collègues y ont caché des dizaines de Juifs. Ils avaient inventé une maladie imaginaire, terriblement contagieuse, qu'ils ont baptisée « syndrome K ». Les soldats venus fouiller l'hôpital ont préféré ne pas entrer dans le service." },
      { titre: "À voir sur place",
        texte: "Descendez sur les quais pour faire le tour de l'île à pied, sous les platanes. Vous verrez la tour médiévale des Caetani, la petite place devant San Bartolomeo, avec sa colonne de 1869 qui porte quatre saints, puis la proue de pierre et la vue sur le Ponte Rotto. L'ensemble compose un décor unique. En été, l'île accueille un festival de cinéma en plein air, avec des terrasses le long de l'eau." }
    ],
    enfants: [
      { titre: "Imagine un bateau de pierre",
        texte: "Imagine une île tellement bien placée dans le fleuve que les Romains ont décidé de la transformer en navire géant. Ils ont recouvert ses bords de blocs de pierre blanche taillés en forme de coque. Ils ont planté un obélisque au milieu pour faire le mât, et construit un temple à bord, comme une cabine. Vue du pont, l'île avait l'air de descendre le Tibre vers la mer. Deux mille ans plus tard, un bout de la proue existe encore, à la pointe sud : penche-toi sur le parapet pour l'apercevoir." },
      { titre: "L'île du roi chassé",
        texte: "Les Romains racontaient que l'île n'existait pas au début. En 509 avant Jésus-Christ, ils ont chassé leur dernier roi, Tarquin le Superbe, un tyran détesté. Le blé de ses champs venait d'être récolté, mais personne ne voulait manger le pain du tyran : on a jeté toutes les gerbes dans le Tibre. Elles se sont accrochées à la boue, la terre s'est accumulée dessus, et l'île est apparue. C'est une légende, bien sûr, mais elle dit bien à quel point les Romains détestaient l'idée d'avoir un roi." },
      { titre: "La maladie qui n'existait pas",
        texte: "En 1943, pendant la guerre, des soldats allemands arrêtaient les Juifs de Rome, juste de l'autre côté du pont. Les médecins de l'hôpital de l'île ont eu une idée géniale : ils ont inventé une maladie, le syndrome K, censée être horriblement contagieuse. Ils ont caché des familles entières dans un service marqué de ce nom, en leur demandant de tousser très fort dès que des soldats approchaient. Les soldats, terrifiés, n'ont jamais osé entrer. La maladie n'existait pas : le K était un clin d'œil moqueur au nom des chefs allemands qui occupaient la ville." },
      { titre: "Défi du plus vieux pont",
        texte: "Traverse le pont Fabricius en lisant les lettres gravées sur l'arche : tu y verras le nom de Fabricius, écrit en grandes lettres latines il y a plus de deux mille ans. Trouve les deux piliers à quatre visages qui lui ont donné son surnom de pont des Quatre-Têtes. Puis, depuis la pointe sud de l'île, cherche le serpent gravé sur la proue. Plus loin dans le fleuve, repère l'arche toute seule du Ponte Rotto, le pont brisé : une crue l'a cassé en 1598 et on ne l'a jamais réparé." },
      { titre: "Le quiz",
        texte: "Question : quel animal est l'emblème d'Esculape, le dieu de la médecine, et où le retrouves-tu encore aujourd'hui ? Réponse : le serpent, enroulé autour d'un bâton. Regarde bien les pharmacies en Italie et en France : la croix verte cache souvent une coupe avec un serpent. C'est un souvenir direct du dieu arrivé sur cette île en 293 avant Jésus-Christ." }
    ]
  },
  {
    id: "trastevere",
    nom: "Trastevere",
    categorie: "quartier",
    lat: 41.8895, lon: 12.4699,
    duree: 60,
    conseil: "Le soir, arrivez avant 19 h 30 pour trouver une table sans réserver. Les marches de la Piazza Trilussa sont le lieu de rendez-vous des Romains.",
    adultes: [
      { titre: "Au-delà du Tibre",
        texte: "Trans Tiberim, « au-delà du Tibre » : le nom dit tout. Pendant les premiers siècles de Rome, cette rive appartenait aux Étrusques, et le quartier n'est entré dans la ville que tardivement, sous la République. Il est alors devenu le port et l'atelier de Rome. Marins de la flotte de Ravenne, pêcheurs, tanneurs, potiers, marchands venus d'Orient, Juifs et premiers chrétiens y vivaient côte à côte. Les riches y possédaient des jardins. Ceux de Jules César, qu'il a légués au peuple par testament, s'étendaient au pied du Janicule. Englobé dans les murailles de l'empereur Aurélien au troisième siècle, le Trastevere a gardé pendant tout le Moyen Âge un caractère à part, populaire et rebelle. Ses habitants se disent encore « Noantri », nous autres, et célèbrent chaque juillet la Festa de Noantri, une procession de la Vierge du Carmel qui remonte au seizième siècle." },
      { titre: "Santa Maria in Trastevere",
        texte: "Selon la tradition, le pape Calixte a fondé ici vers 220 l'un des premiers lieux de culte chrétiens officiels de Rome, sur l'emplacement d'une taverne. L'église actuelle date de 1140 environ : le pape Innocent II, né dans le quartier, l'a fait reconstruire avec vingt-deux colonnes de granit qui proviendraient des thermes de Caracalla. Au fond, dans l'abside, la mosaïque du douzième siècle montre le Christ et la Vierge assis sur le même trône, une nouveauté à l'époque. En dessous, en 1291, Pietro Cavallini a raconté la vie de Marie en six tableaux d'une finesse étonnante. Le plafond doré est du Dominiquin. Près de l'autel, une inscription, Fons Olei, marque l'endroit où, en 38 avant Jésus-Christ, une source d'huile aurait jailli du sol pendant une journée entière. On a interprété plus tard ce signe comme l'annonce de la naissance du Christ." },
      { titre: "Cécile, Raphaël et la reine",
        texte: "La basilique Sainte-Cécile s'élève sur la maison où cette jeune Romaine de grande famille aurait été martyrisée au troisième siècle. Sous l'autel, la statue de Stefano Maderno la représente couchée sur le côté, le visage caché, exactement comme on a retrouvé son corps intact en 1599. Dans le chœur des religieuses, le Jugement dernier de Cavallini, peint vers 1293, annonce déjà Giotto. La Villa Farnesina a été bâtie de 1506 à 1510 par Baldassarre Peruzzi pour le banquier Agostino Chigi. Elle abrite le Triomphe de Galatée de Raphaël et la loggia de Psyché, une galerie ouverte peinte par son atelier. En face, le palais Corsini a été la résidence de la reine Christine de Suède, qui avait renoncé à son trône pour venir vivre à Rome. Son parc est devenu le jardin botanique : douze hectares de bambous et de palmiers sur les pentes du Janicule." },
      { titre: "La vie du quartier",
        texte: "Le Ponte Sisto, construit entre 1473 et 1479 par Sixte IV pour le jubilé, débouche sur la Piazza Trilussa. Elle porte le nom d'un poète en dialecte romain, dont la statue semble réciter ses vers. Les ruelles pavées de sampietrini, les petits pavés noirs de Rome, les madones aux coins des rues, les vignes vierges sur les façades et le linge aux fenêtres composent le décor. Le dimanche matin, le marché aux puces de Porta Portese s'étire sur plus d'un kilomètre. Rue de la Septième Cohorte, on peut apercevoir les restes d'une caserne de vigiles, les pompiers de la Rome impériale, avec les graffitis laissés par les hommes de garde. Le soir, les trattorias servent cacio e pepe, supplì et pizza croustillante, et les jeunes Romains se retrouvent sur les marches des fontaines." }
    ],
    enfants: [
      { titre: "Imagine un village dans la ville",
        texte: "Imagine que tu traverses un pont et que, d'un coup, la grande ville disparaît. Plus de larges avenues : des ruelles tordues, des façades orange et roses, du lierre qui grimpe partout, des chats sur les marches et du linge qui sèche entre les fenêtres. Bienvenue au Trastevere, le quartier « de l'autre côté du fleuve ». Pendant des siècles, ses habitants ont eu l'impression de ne pas être tout à fait des Romains comme les autres. Ils se surnomment « Noantri », nous autres, et organisent encore chaque été leur propre fête, avec des feux d'artifice sur le Tibre." },
      { titre: "Les pompiers de l'empereur",
        texte: "Rome brûlait souvent : des maisons en bois, des lampes à huile, des braseros pleins de braises partout. Alors l'empereur Auguste a créé un corps de sept mille pompiers, les vigiles, répartis en sept cohortes. Ils patrouillaient la nuit avec des seaux, des couvertures mouillées, des haches et des pompes à eau, et ils avaient aussi le droit d'arrêter les voleurs. Au Trastevere, on a retrouvé la caserne de la septième cohorte, enfouie sous une rue. Sur les murs, les pompiers de garde avaient écrit des messages, un peu comme des graffitis, pour se plaindre de la fatigue ou souhaiter bonne chance à leur chef." },
      { titre: "La sainte qui dort",
        texte: "Dans la basilique Sainte-Cécile, une statue de marbre blanc montre une jeune fille allongée sur le côté, comme endormie, le visage tourné vers le sol. C'est sainte Cécile, la patronne des musiciens, morte il y a près de mille huit cents ans. En 1599, on a ouvert son tombeau et, dit-on, on l'a trouvée intacte, exactement dans cette position. Le sculpteur Stefano Maderno a copié ce qu'il avait vu. Regarde ses doigts : trois sont tendus sur une main, un seul sur l'autre. On raconte que c'est pour dire qu'il y a un seul Dieu en trois personnes." },
      { titre: "Le géant de Michel-Ange",
        texte: "À la Villa Farnesina, Raphaël a peint Galatée, une nymphe, c'est-à-dire une fée de la mer, qui file sur les vagues dans un char tiré par des dauphins. On raconte que Michel-Ange, jaloux et curieux, s'est glissé dans la villa pendant l'absence de Raphaël. Il a dessiné au fusain une tête énorme sur un mur de la galerie, comme une signature. Raphaël, admiratif, aurait interdit qu'on l'efface. La tête est toujours là. Est-ce vraiment Michel-Ange ? Personne n'en est sûr, mais les Romains adorent cette histoire de deux génies qui se taquinaient." },
      { titre: "Défi des madonnelles",
        texte: "Aux coins des rues, cherche les madonnelles : de petites images de la Vierge, encadrées et protégées par un petit toit, souvent avec une lanterne. Avant l'électricité, c'étaient les seules lumières de la nuit. Compte celles que tu croises entre la Piazza Trilussa et Santa Maria in Trastevere. Dans la basilique, compte les colonnes de la grande nef : il doit y en avoir vingt-deux. Trouve aussi, près de l'autel, la petite inscription Fons Olei." },
      { titre: "Le quiz",
        texte: "Question : que signifie le mot Trastevere ? Réponse : « au-delà du Tibre », du latin trans Tiberim. Pour les Romains de l'Antiquité, qui vivaient sur l'autre rive, c'était le quartier d'en face, celui des marins, des pêcheurs et des étrangers." }
    ]
  },
  {
    id: "janicule",
    nom: "Janicule",
    categorie: "quartier",
    lat: 41.8918, lon: 12.461,
    duree: 40,
    conseil: "Montée à pied depuis Trastevere en 15 min, ou bus 115. Marchands de glaces et jeux pour enfants sur la terrasse.",
    adultes: [
      { titre: "La colline de Janus",
        texte: "Le Janicule culmine à près de quatre-vingt-dix mètres sur la rive droite du Tibre. Il ne compte pas parmi les sept collines, toutes situées sur l'autre rive, mais il a toujours veillé sur Rome. Son nom viendrait de Janus, le dieu aux deux visages, qui y aurait fondé une cité avant même Romulus. En 508 avant Jésus-Christ, l'armée étrusque du roi Porsenna y a installé son camp, et c'est en défendant le pont de bois, en contrebas, qu'Horatius Coclès est devenu un héros. Sous l'empereur Trajan, un aqueduc a amené sur ces hauteurs l'eau du lac de Bracciano, qui a fait tourner pendant des siècles les moulins à grain de la ville. Le pape Urbain VIII a enfin enfermé la colline dans une nouvelle muraille entre 1642 et 1644." },
      { titre: "1849, Garibaldi défend Rome",
        texte: "En février 1849, les Romains chassent le pape Pie IX et proclament la République. Louis-Napoléon Bonaparte envoie une armée française pour la renverser. Garibaldi, à la tête de volontaires venus de toute l'Italie, repousse un premier assaut le 30 avril. Il se bat ensuite pendant tout le mois de juin sur ces pentes, autour des villas Corsini et Pamphilj. La ville capitule le 30 juin. La colline est devenue le mémorial de cette lutte. On y trouve la statue de Garibaldi à cheval, inaugurée en 1895, et celle d'Anita, sa compagne brésilienne, sous laquelle elle repose depuis 1932. Plus de quatre-vingts bustes de combattants s'alignent le long de la promenade. Parmi eux, Goffredo Mameli, l'auteur des paroles de l'hymne italien, mort à vingt et un ans d'une blessure reçue ici. Son tombeau se trouve dans le mausolée ossuaire de la Via Garibaldi, où reposent les restes des combattants." },
      { titre: "Bramante, le Fontanone et le phare",
        texte: "Dans la cour de l'église San Pietro in Montorio se dresse le Tempietto de Bramante, daté de 1502 et commandé par les rois catholiques d'Espagne. Il marque l'endroit où, selon la tradition, saint Pierre a été crucifié. Ce petit temple rond, entouré de seize colonnes de style dorique, le plus sobre des styles antiques, est considéré comme la première œuvre parfaite de la Renaissance à Rome. Plus haut, la fontaine de l'Acqua Paola, terminée en 1612 pour le pape Paul V Borghèse, marque l'arrivée de l'aqueduc de Trajan, remis en service. Ses colonnes de granit proviennent de l'ancienne basilique Saint-Pierre et son marbre du forum de Nerva. Les Romains l'appellent simplement le Fontanone. Sur la terrasse, un phare blanc, offert en 1911 par les Italiens d'Argentine, projette parfois vers la ville un faisceau vert, blanc et rouge." },
      { titre: "Le canon de midi",
        texte: "Depuis le premier décembre 1847, un coup de canon annonce midi à Rome. Le pape Pie IX voulait que toutes les cloches de la ville sonnent l'heure ensemble. Le tir partait alors du château Saint-Ange, puis du Monte Mario, avant de s'installer sur le Janicule en 1904. Interrompu par la guerre en 1939, il a repris le 21 avril 1959, jour anniversaire de Rome. Un obusier, un canon de l'armée italienne, tire à blanc, et les pigeons de la terrasse s'envolent tous ensemble." },
      { titre: "Petites histoires",
        texte: "Le poète Torquato Tasso est mort en 1595 au couvent voisin de Sant'Onofrio, la veille du jour où il devait recevoir la couronne de laurier au Capitole. Le vieux chêne sous lequel il aimait s'asseoir, mort lui aussi et cerclé de fer, est encore là. Le week-end, un théâtre de marionnettes joue les aventures de Pulcinella pour les enfants, une tradition qui se transmet ici de génération en génération. Et juste en dessous, l'hôpital pédiatrique Bambino Gesù, fondé en 1869, est l'hôpital pour enfants le plus réputé d'Italie." }
    ],
    enfants: [
      { titre: "Imagine le balcon de Rome",
        texte: "Imagine que tu montes sur un immense balcon d'où l'on voit toute la ville d'un coup : les coupoles, les clochers, les toits roses, les pins parasols et, au loin, les montagnes. Le Janicule est ce balcon. Les Romains de l'Antiquité y postaient des guetteurs. Quand un drapeau flottait au sommet, cela voulait dire que tout allait bien et que l'assemblée du peuple pouvait se réunir en bas. Si le drapeau descendait, l'ennemi approchait et tout le monde courait aux armes." },
      { titre: "Le garçon de l'hymne",
        texte: "En 1849, des milliers de jeunes volontaires sont venus défendre Rome sur cette colline, avec Garibaldi. Parmi eux, un poète de vingt et un ans, Goffredo Mameli, qui avait écrit deux ans plus tôt une chanson pour encourager les Italiens : « Fratelli d'Italia ». Blessé à la jambe pendant les combats, il est mort quelques semaines plus tard. Sa chanson est devenue l'hymne national de l'Italie : c'est celui que les joueurs chantent, la main sur le cœur, avant chaque match de l'équipe nationale de football. Son buste se trouve sur l'allée, parmi plus de quatre-vingts têtes de pierre de ses compagnons." },
      { titre: "Un temple de poche",
        texte: "Dans la cour d'une église, en descendant vers le Trastevere, se cache un temple minuscule, tout rond, entouré de seize colonnes : le Tempietto. Il est si petit qu'il tiendrait dans ta salle de classe. Pourtant, les architectes du monde entier viennent l'admirer. C'est le premier bâtiment de Rome à avoir copié parfaitement les temples antiques, il y a un peu plus de cinq cents ans. Il a été construit à l'endroit exact où, d'après la tradition, saint Pierre a été crucifié la tête en bas." },
      { titre: "L'eau qui traverse la colline",
        texte: "La grande fontaine blanche que tu croises en montant, le Fontanone, crache l'eau d'un aqueduc, un long canal de pierre. L'empereur Trajan l'a construit il y a mille neuf cents ans, puis un pape l'a réparé. Cette eau vient d'un lac à quarante kilomètres de là. Autrefois, elle faisait tourner des moulins qui broyaient le blé de tout Rome. Mais elle n'a jamais été très bonne à boire : quand un Romain veut dire qu'une chose ne vaut rien, il dit encore qu'elle vaut autant que l'eau Paola." },
      { titre: "Défi de la terrasse",
        texte: "Sur la terrasse, cherche le phare blanc offert par les Italiens partis vivre en Argentine. Puis longe l'allée des bustes et trouve celui de Goffredo Mameli, et celui d'un combattant qui porte un chapeau ou une moustache impressionnante. Sur le socle de la statue de Garibaldi à cheval, lis la devise gravée : « Roma o Morte », Rome ou la mort. Enfin, repère dans la vue le Panthéon, avec sa coupole plate, et l'immense monument blanc du Vittoriano." },
      { titre: "Le quiz",
        texte: "Question : le Janicule fait-il partie des sept collines de Rome ? Réponse : non ! Les sept collines sont toutes sur l'autre rive du Tibre : le Palatin, le Capitole, l'Aventin, le Caelius, l'Esquilin, le Viminal et le Quirinal. Le Janicule, lui, est sur la rive droite, comme le Vatican, et il est plus haut que toutes les sept." }
    ]
  },
  {
    id: "villa-borghese",
    nom: "Villa Borghèse",
    categorie: "quartier",
    lat: 41.913, lon: 12.485,
    duree: 90,
    conseil: "Galerie Borghèse : réservation obligatoire plusieurs semaines à l'avance, visite limitée à 2 h. Location de rosalies près de la Casina dell'Orologio.",
    adultes: [
      { titre: "Le cardinal collectionneur",
        texte: "En 1605, Camillo Borghese devient pape sous le nom de Paul V et fait aussitôt cardinal son neveu de vingt-sept ans, Scipione. Riche, cultivé et sans scrupules, celui-ci achète dès 1606 les vignes qui couvrent la colline du Pincio pour y créer une « villa de délices ». Le casino, c'est-à-dire le pavillon principal, est bâti entre 1613 et 1616 par Flaminio Ponzio, puis Giovanni Vasanzio. Il n'est pas fait pour y habiter, mais pour y exposer une collection et y donner des fêtes. Scipione fait enlever de nuit la Déposition de Raphaël dans une église de Pérouse, et jette en prison le peintre Cavalier d'Arpin pour s'emparer de ses toiles. Il passe aussi commande à un jeune sculpteur encore inconnu, Gian Lorenzo Bernini, le futur Bernin. Énée et Anchise, l'Enlèvement de Proserpine, Apollon et Daphné et le David naissent ici entre 1618 et 1625. Des tableaux du Caravage, du Titien, d'Antonello da Messina et du Corrège rejoignent les murs. Une plaque à l'entrée invitait tout visiteur honnête à entrer librement : la villa a été l'un des premiers musées ouverts au public." },
      { titre: "Du domaine princier au parc public",
        texte: "Au dix-huitième siècle, le prince Marcantonio IV Borghese transforme les jardins à la mode anglaise. Le jardin du Lac et son temple d'Esculape datent de 1786. Puis viennent la place de Sienne, une piste de course entourée de verdure, et la fontaine des Chevaux marins. En 1807, Camillo Borghese, époux de Pauline Bonaparte, vend à son beau-frère Napoléon plus de trois cents sculptures antiques, aujourd'hui au Louvre. Sa femme, en revanche, reste à Rome : Canova l'a sculptée en Vénus victorieuse, allongée à demi nue sur un divan. En 1901, l'État italien achète le domaine, puis le confie à la ville de Rome, qui l'ouvre au public en 1903. Avec le Pincio dessiné par Valadier, il forme aujourd'hui un parc d'environ quatre-vingts hectares." },
      { titre: "À voir dans le parc",
        texte: "La Galerie Borghèse reste le joyau du parc. Le rez-de-chaussée présente les sculptures du Bernin et de Canova, et l'étage les tableaux, dont six toiles du Caravage. Autour, le parc réserve des surprises. L'horloge à eau, inventée par le moine dominicain Giovanni Battista Embriaco et présentée à l'Exposition universelle de Paris en 1867, tourne toujours au milieu d'un bassin du Pincio. Le Cinema dei Piccoli, une maisonnette de bois de 1934, projette des dessins animés. Le zoo Bioparco, créé en 1911 par Carl Hagenbeck, a été l'un des premiers à remplacer les barreaux par des fossés. La terrasse du Pincio, bordée de plus de deux cents bustes d'Italiens illustres, domine la Piazza del Popolo. On peut aussi visiter le musée Carlo Bilotti et ses toiles de Giorgio De Chirico, ou pousser jusqu'à la Villa Giulia, le grand musée étrusque." },
      { titre: "Petites histoires",
        texte: "Le Bernin a sculpté Apollon et Daphné avant ses vingt-cinq ans. Le cardinal Maffeo Barberini, futur pape Urbain VIII, a fait graver sur le socle deux vers latins qui rappellent que celui qui court après les plaisirs ne récolte que des feuilles. Pauline Bonaparte, à qui l'on demandait comment elle avait pu poser nue devant Canova, aurait répondu que l'atelier était bien chauffé. Quant aux bustes du Pincio, c'est Mazzini qui a fait poser les premiers en 1849, pendant la brève République romaine, pour célébrer les gloires de l'Italie." }
    ],
    enfants: [
      { titre: "Imagine le jardin d'un cardinal",
        texte: "Imagine un jardin si grand qu'on y circule à cheval, avec des bois, des fontaines, des paons qui se pavanent, des cerfs et des oiseaux exotiques dans une immense volière. C'est ce que le cardinal Scipione Borghese a fait construire il y a quatre cents ans. Il voulait recevoir ses amis et leur montrer les statues et les tableaux qu'il collectionnait. Il n'y dormait même pas : c'était un palais uniquement fait pour épater. Aujourd'hui, ce jardin est devenu le parc préféré des enfants de Rome, avec ses barques, ses vélos, son zoo et ses pelouses." },
      { titre: "Le cardinal voleur d'art",
        texte: "Scipione voulait tellement posséder les plus belles œuvres qu'il ne reculait devant rien. Un peintre célèbre, le Cavalier d'Arpin, refusait de lui vendre ses tableaux ? Le cardinal l'a fait accuser de posséder des armes interdites et l'a fait jeter en prison. Puis il a fait saisir sa collection : plus de cent toiles, dont plusieurs d'un jeune inconnu nommé Caravage. Un grand tableau de Raphaël lui plaisait dans une église de Pérouse ? Il l'a fait décrocher en pleine nuit et transporter à Rome. Les habitants de Pérouse ont tellement protesté que le pape leur a envoyé une copie pour les calmer." },
      { titre: "Le zoo sans barreaux",
        texte: "Le zoo du parc, le Bioparco, a été inventé en 1911 par un Allemand qui avait une idée révolutionnaire : plus de cages ! Carl Hagenbeck voulait que les animaux vivent dans des décors qui ressemblent à leur pays, séparés des visiteurs par des fossés et des rochers plutôt que par des barreaux. C'était l'un des premiers zoos de ce genre au monde. Aujourd'hui, il abrite plus de mille animaux et s'occupe surtout de protéger les espèces en danger." },
      { titre: "Une princesse en marbre",
        texte: "Pauline Bonaparte, la sœur de Napoléon, a épousé le prince Camillo Borghese. Elle a demandé au sculpteur Canova de la représenter en Vénus, la déesse de la beauté, à demi nue sur un divan. Son mari a été tellement gêné qu'il a caché la statue et ne la montrait à ses invités que la nuit, à la lueur d'une torche. Aujourd'hui, elle trône au milieu de la Galerie Borghèse. Le divan de marbre cache un mécanisme : autrefois, on pouvait le faire tourner pour admirer la princesse sous tous les angles." },
      { titre: "Défi du Pincio",
        texte: "Sur la terrasse du Pincio, longe les bustes de marbre et cherche ceux qui ont le nez cassé : des farceurs les ont abîmés pendant des années. Trouve ensuite l'horloge à eau au milieu de son petit étang, et observe l'eau qui remplit tour à tour deux petits récipients pour faire aller et venir le balancier. Sur le lac, compte les colonnes du temple d'Esculape. Et devant la fontaine des Chevaux marins, compte les chevaux : ils ont une queue de poisson." },
      { titre: "Le quiz",
        texte: "Question : quel âge avait le Bernin quand il a sculpté Apollon et Daphné, la statue où la nymphe se transforme en laurier ? Réponse : environ vingt-quatre ans. Il avait commencé à sculpter enfant dans l'atelier de son père, et le cardinal Scipione a été le premier à croire en lui." }
    ]
  },
  {
    id: "chateau-saint-ange",
    nom: "Château Saint-Ange",
    categorie: "vatican",
    lat: 41.9031, lon: 12.4663,
    duree: 75,
    conseil: "Billet en ligne pour éviter la file. Le café sur la terrasse haute est l'un des plus beaux points de vue de Rome. Comptez 1 h 30 avec les enfants.",
    adultes: [
      { titre: "Le mausolée d'Hadrien",
        texte: "Vers 135, l'empereur Hadrien, qui a bâti le Panthéon et le mur qui porte son nom dans le nord de l'Angleterre, entreprend son propre tombeau. Il le fait élever sur la rive droite du Tibre, en face du Champ de Mars. L'édifice est achevé en 139, un an après sa mort, par son successeur Antonin le Pieux. Sur une base carrée de près de quatre-vingt-dix mètres de côté s'élevait un énorme cylindre de soixante-quatre mètres de diamètre, revêtu de marbre. Il était couronné d'une butte de terre plantée de cyprès et d'un char de bronze à quatre chevaux conduit par l'empereur. Une rampe en spirale de cent vingt-cinq mètres montait vers la chambre des urnes, où ont été déposées les cendres des empereurs jusqu'à Caracalla, en 217. Le pont Aelius, l'actuel pont Saint-Ange, a été bâti en 134 pour y conduire." },
      { titre: "Forteresse et refuge des papes",
        texte: "Intégré aux murailles d'Aurélien à la fin du troisième siècle, le mausolée devient un bastion. En 537, les soldats byzantins qui le défendent contre les Goths brisent les statues de marbre pour les jeter sur les assaillants. Son nom actuel vient d'une procession de 590 : selon la tradition, le pape Grégoire le Grand a vu au sommet l'archange Michel remettre son épée au fourreau, signe que la peste prenait fin. Au Moyen Âge, les grandes familles romaines se le disputent, puis les papes en font leur citadelle. Nicolas III construit en 1277 le Passetto, le couloir fortifié qui le relie au Vatican. Alexandre VI Borgia et ses successeurs ajoutent bastions, fossés et appartements. En mai 1527, pendant le sac de Rome par les troupes de Charles Quint, Clément VII s'y réfugie et y reste enfermé pendant sept mois avant de s'enfuir déguisé. Paul III Farnèse fait ensuite décorer la salle Pauline par Perin del Vaga, entre 1545 et 1547." },
      { titre: "Prison et scène d'opéra",
        texte: "Le château a aussi été la prison la plus redoutée de Rome. L'orfèvre Benvenuto Cellini, le comte Cagliostro, accusé de sorcellerie, et des centaines d'inconnus y ont été enfermés. En 1599, la jeune Beatrice Cenci, coupable d'avoir fait tuer un père monstrueux, a été décapitée sur la place devant le pont. Puccini y situe le dernier acte de Tosca, en 1900 : l'héroïne se jette du haut des remparts. Les feux d'artifice de la Girandola, tirés depuis les terrasses lors des fêtes papales, ont inspiré des générations d'artistes. La statue de bronze de l'archange qui couronne l'édifice est l'œuvre de Peter Anton von Verschaffelt, installée en 1753. Celle qui l'a précédée, en marbre, sculptée par Raffaello da Montelupo, est visible dans la cour." },
      { titre: "Le pont des anges",
        texte: "Le pont Saint-Ange conserve trois arches antiques. En 1450, lors du jubilé, la foule y était si dense que les parapets ont cédé et que près de deux cents pèlerins se sont noyés. Entre 1667 et 1669, le Bernin a dessiné les dix anges qui portent les instruments de la Passion. Il en a sculpté deux lui-même, jugés si beaux que le pape les a gardés : ils sont aujourd'hui dans l'église Sant'Andrea delle Fratte. Les copies qui les remplacent, comme les huit autres, sont l'œuvre de ses élèves." },
      { titre: "Parcours de visite",
        texte: "On monte par la rampe antique et on traverse la cour des boulets de pierre. On découvre ensuite les appartements peints, la salle du trésor avec ses coffres de fer, la petite salle de bains chauffée de Clément VII et les cachots. Tout en haut, la terrasse au pied de l'ange offre une vue qui embrasse la coupole de Saint-Pierre et toute la ville." }
    ],
    enfants: [
      { titre: "Imagine une tombe devenue château",
        texte: "Imagine un tombeau si énorme qu'il ressemble à une montagne de marbre blanc, avec un jardin de cyprès sur le toit. Tout en haut, une statue de l'empereur trône sur un char à quatre chevaux. C'est ainsi que l'empereur Hadrien voulait dormir pour l'éternité. Mais Rome a eu besoin d'une forteresse, alors on a arraché le marbre, bouché les ouvertures et ajouté des murailles, des tours et des canons. Le tombeau est devenu un château, puis un palais pour les papes, puis une prison, et aujourd'hui un musée où tu peux grimper jusqu'au sommet." },
      { titre: "Des statues comme boulets",
        texte: "En 537, une armée de Goths attaque Rome. Les soldats qui défendent le château n'ont plus assez de flèches ni de pierres à lancer. Alors ils cassent les magnifiques statues de marbre qui décoraient le tombeau et les jettent du haut des murs sur les assaillants ! Des chefs-d'œuvre vieux de quatre cents ans transformés en boulets. Bien plus tard, au dix-septième siècle, en creusant le fossé, on a retrouvé une superbe statue de satyre endormi, une créature mi-homme mi-bouc. Elle est aujourd'hui dans un musée de Munich, et on pense qu'elle faisait partie de ces projectiles." },
      { titre: "La salle de bains du pape",
        texte: "Au cœur du château, le pape Clément VII s'est fait construire vers 1530 une minuscule salle de bains, avec une baignoire de marbre et des murs peints de fresques. L'eau chaude arrivait par un tuyau depuis une chaudière cachée derrière le mur : un vrai spa privé au milieu d'une forteresse ! Juste à côté, la salle du trésor gardait dans des coffres de fer l'or et les papiers secrets du Vatican. Le pape, lui, dormait dans une chambre dont les fenêtres donnaient sur le fleuve, pour surveiller l'arrivée des ennemis." },
      { titre: "Une héroïne qui saute du toit",
        texte: "Dans l'opéra Tosca, écrit par Puccini en 1900, une chanteuse, Tosca, essaie de sauver l'homme qu'elle aime, prisonnier au château. À la fin, tout va mal, et elle se jette du haut des remparts. Depuis, des milliers de spectateurs ont pleuré sur cette scène. Quand tu seras sur la terrasse, tu verras l'endroit : sous l'ange, au-dessus du fleuve. Les papes, eux, préféraient les feux d'artifice. Pour les grandes fêtes, on tirait depuis le château la Girandola, une pluie de fusées si spectaculaire que les peintres venaient de toute l'Europe pour la dessiner." },
      { titre: "Défi des dix anges",
        texte: "Sur le pont, compte les anges : il y en a dix, et chacun porte un objet de la Passion du Christ. Trouve celui qui tient la couronne d'épines, celui qui tient les clous, celui qui porte l'éponge au bout d'un bâton et celui qui tient les dés des soldats. Dans le château, cherche les tas de boulets de pierre dans la cour, puis l'ancien ange de marbre qui a longtemps veillé au sommet. Tout en haut, regarde l'ange de bronze qui range son épée." },
      { titre: "Le quiz",
        texte: "Question : quel empereur a fait construire ce bâtiment, et pourquoi ? Réponse : Hadrien, pour en faire son tombeau. C'est le même empereur qui a reconstruit le Panthéon et fait bâtir, tout au nord de l'Angleterre, un mur de cent dix-sept kilomètres pour protéger la frontière de l'Empire." }
    ]
  },
  {
    id: "place-saint-pierre",
    nom: "Place Saint-Pierre",
    categorie: "vatican",
    lat: 41.9022, lon: 12.4573,
    duree: 30,
    conseil: "Entrée gratuite après un contrôle de sécurité (file variable). Le mercredi matin, la place est fermée pour l'audience papale.",
    adultes: [
      { titre: "Le cirque de Néron",
        texte: "Au premier siècle, un cirque s'étendait sous la place actuelle : commencé par Caligula et achevé par Néron, il accueillait les courses de chars. Après le grand incendie de 64, Néron a accusé les chrétiens et en a fait exécuter un grand nombre dans ce cirque et ses jardins. Selon la tradition, l'apôtre Pierre y a été crucifié la tête en bas, puis enterré dans le cimetière voisin, sur la pente de la colline. L'obélisque qui trône aujourd'hui au centre de la place se dressait au milieu de cette piste. Rapporté d'Égypte par Caligula en 37, il ne porte aucun hiéroglyphe, et c'est le seul obélisque de Rome qui ne soit jamais tombé." },
      { titre: "L'obélisque déplacé",
        texte: "En 1586, le pape Sixte Quint confie à l'architecte Domenico Fontana la tâche de transporter l'obélisque jusqu'au centre de la nouvelle place. Le bloc, taillé d'une seule pièce, mesure vingt-cinq mètres et pèse environ trois cent trente tonnes. Il faut quatre mois, neuf cents hommes, cent quarante chevaux et quarante-quatre treuils. Le jour du levage, le 10 septembre, le silence est imposé à la foule sous peine de mort. Lorsque les cordes chauffent et risquent de céder, un marin de Sanremo, Benedetto Bresca, crie de les arroser. Loin d'être puni, il obtient pour sa famille le privilège de fournir chaque année les palmes tressées du dimanche des Rameaux, un droit encore exercé aujourd'hui." },
      { titre: "Les bras de l'Église",
        texte: "Entre 1656 et 1667, à la demande du pape Alexandre VII, le Bernin dessine la place actuelle. C'est un grand ovale de deux cent quarante mètres de large, enserré par deux colonnades en quart de cercle. Elles comptent deux cent quatre-vingt-quatre colonnes et quatre-vingt-huit piliers, disposés en quatre rangées, et portent cent quarante statues de saints hautes de plus de trois mètres. Le Bernin voulait que ces bras accueillent les catholiques, ramènent les hérétiques et éclairent les infidèles. Deux fontaines encadrent l'obélisque : celle de Carlo Maderno, de 1613, et sa jumelle ajoutée par le Bernin en 1677. Un troisième bras, prévu pour fermer la place, n'a jamais été construit. À sa place, la Via della Conciliazione, percée entre 1936 et 1950 à travers les vieilles maisons du quartier du Borgo, ouvre la vue depuis le Tibre." },
      { titre: "Le plus petit État du monde",
        texte: "Le traité du Latran, signé le 11 février 1929 entre Mussolini et le pape Pie XI, crée l'État de la Cité du Vatican. Il couvre quarante-quatre hectares, et sa frontière suit le bord de la place. La Garde suisse pontificale, fondée par Jules II le 22 janvier 1506, compte environ cent trente-cinq hommes. Leur uniforme bariolé, souvent attribué à Michel-Ange, a en fait été dessiné en 1914 par le commandant Jules Repond. La loggia centrale de la façade est le balcon d'où l'on annonce l'élection d'un nouveau pape et d'où il bénit la ville et le monde à Noël et à Pâques. La fenêtre du pape, d'où il récite la prière de l'Angélus le dimanche à midi, est la deuxième en partant de la droite, au dernier étage du palais apostolique." },
      { titre: "À voir sur le pavé",
        texte: "Entre l'obélisque et chaque fontaine, un disque de marbre marque un point précis de l'ovale : de là, les quatre rangées de colonnes se confondent en une seule. Autour de l'obélisque, seize plaques de marbre nomment les vents, de la Tramontane au Sirocco. Une ligne de méridienne tracée en 1817 permet aussi de lire, grâce à l'ombre de la pointe, la position du soleil dans le zodiaque. Sur le socle, les lions de bronze tenant des poires sont l'emblème de Sixte Quint, né Peretti." }
    ],
    enfants: [
      { titre: "Un stade sous la place",
        texte: "Imagine qu'il y a deux mille ans, à l'endroit de cette immense place et de la basilique, se trouvait un stade où des chars tirés par quatre chevaux tournaient à toute vitesse. L'empereur Néron adorait s'y montrer, et il lui arrivait même de conduire un char en personne. Au milieu de la piste se dressait un obélisque venu d'Égypte. C'est toujours le même que tu vois au centre de la place aujourd'hui, à quelques centaines de mètres de son ancien emplacement. Il a vu passer les chars, les martyrs et vingt siècles d'histoire sans jamais tomber." },
      { titre: "Les palmes du marin",
        texte: "Quand on a déplacé l'obélisque en 1586, un marin a sauvé l'opération en criant de mouiller les cordes, alors que parler était interdit. Le pape, au lieu de le punir, lui a demandé ce qu'il voulait comme récompense. Le marin, Benedetto Bresca, a répondu qu'il aimerait que sa famille fournisse les palmes du dimanche des Rameaux, qui poussaient dans sa ville de Sanremo. Accordé ! Plus de quatre cents ans plus tard, ce sont encore les descendants de Bresca qui livrent chaque printemps les palmes tressées que le pape bénit sur cette place." },
      { titre: "Les soldats aux costumes rayés",
        texte: "Les gardes suisses sont les soldats du pape depuis 1506, quand cent cinquante hommes ont marché à pied depuis la Suisse jusqu'à Rome. Leur uniforme bleu, rouge et jaune est cousu de plus de cent cinquante morceaux de tissu, et ils portent une hallebarde, une longue lance à hache, comme il y a cinq siècles. Mais ne t'y trompe pas : ce sont de vrais soldats entraînés, et ils ont aussi des armes modernes bien cachées. Ils jurent de protéger le pape jusqu'à la mort, et l'histoire a prouvé qu'ils le pensaient vraiment." },
      { titre: "Défi sur la place",
        texte: "Autour de l'obélisque, trouve les plaques de marbre avec le nom des vents et cherche le Sirocco, le vent chaud qui vient d'Afrique. Sur le socle, repère les lions de bronze : que tiennent-ils dans leurs pattes ? Des poires, l'emblème du pape Sixte Quint. Puis lève les yeux vers le haut de la façade de la basilique et compte les statues géantes : il y en a treize. Sauras-tu dire qui manque ? C'est saint Pierre lui-même : sa statue est en bas, au pied des marches, à gauche." },
      { titre: "Le quiz",
        texte: "Question : où se trouvait l'obélisque avant 1586 ? Réponse : au milieu du cirque de Néron, à gauche de la basilique actuelle, à l'endroit où saint Pierre a été martyrisé. Il est resté là pendant mille cinq cents ans, à moitié enfoui, à côté de la vieille basilique, avant qu'on ne le déplace au prix d'un effort colossal." }
    ]
  },
  {
    id: "basilique-saint-pierre",
    nom: "Basilique Saint-Pierre",
    categorie: "vatican",
    lat: 41.9022, lon: 12.4539,
    duree: 90,
    conseil: "Épaules et genoux couverts obligatoires, même pour les enfants. Coupole : montée à faire tôt le matin, éviter avec de jeunes enfants claustrophobes. Entrée gratuite, la file de sécurité est commune avec la place.",
    adultes: [
      { titre: "De Constantin à Michel-Ange",
        texte: "Vers 320, l'empereur Constantin fait bâtir une première basilique sur la tombe présumée de l'apôtre, en aplanissant le cimetière antique et la pente de la colline. Cette église à cinq nefs, longue de plus de cent mètres, a vu le couronnement de Charlemagne à Noël de l'an 800 et le premier jubilé, en 1300. Au quinzième siècle, elle tombe en ruine et risque de s'écrouler. Le 18 avril 1506, Jules II pose la première pierre du nouvel édifice dessiné par Bramante, en forme de croix aux quatre bras égaux, sous une coupole immense. Raphaël, Peruzzi et Antonio da Sangallo se succèdent. Puis Michel-Ange, nommé en 1547 à plus de soixante-dix ans, simplifie le plan et conçoit la coupole, que Giacomo della Porta achève en 1590. Carlo Maderno allonge la nef et élève la façade entre 1607 et 1614. Urbain VIII consacre la basilique le 18 novembre 1626, cent vingt ans après la première pierre. Entre-temps, la vente d'indulgences, ces pardons payants pour les péchés, destinée à financer le chantier, avait déclenché en 1517 la révolte de Luther." },
      { titre: "Des chiffres vertigineux",
        texte: "La nef intérieure mesure cent quatre-vingt-six mètres de long. La façade fait cent quatorze mètres de large et quarante-cinq de haut. La coupole, elle, mesure quarante-deux mètres de diamètre à l'intérieur et s'élève à cent trente-six mètres jusqu'à la croix. La surface dépasse un hectare et demi et la basilique peut accueillir soixante mille fidèles. Les lettres de la frise dorée mesurent près d'un mètre et demi, et les angelots des bénitiers près de deux mètres. Tout est calculé pour que l'œil ne se rende pas compte de la taille réelle. La coupole est double : deux coques emboîtées, entre lesquelles grimpe l'escalier des visiteurs. Della Porta l'a rehaussée par rapport au projet de Michel-Ange pour la rendre plus élancée." },
      { titre: "Parcours à l'intérieur",
        texte: "Sous le portique, la Porte sainte n'est ouverte que les années de jubilé. Dans la nef, le disque de porphyre rouge sur lequel Charlemagne s'est agenouillé vient de l'ancienne basilique. À droite, la Pietà, sculptée en 1499 par Michel-Ange, est protégée par une vitre depuis qu'un déséquilibré l'a attaquée au marteau en 1972. Sous la coupole, le baldaquin de bronze du Bernin a été élevé entre 1624 et 1633 avec du métal arraché au portique du Panthéon. Il surmonte la confession, l'espace ouvert qui descend vers la tombe de l'apôtre. Au fond, la chaire de saint Pierre, elle aussi du Bernin, semble flotter devant un immense rayonnement doré. Presque tous les tableaux sont en réalité des mosaïques, car l'humidité détruisait les toiles. Dans le transept gauche, le tombeau d'Alexandre VII montre un squelette doré brandissant un sablier sous un drapé de marbre rouge." },
      { titre: "Sous la basilique",
        texte: "Les grottes vaticanes, entre le sol actuel et celui de la basilique de Constantin, abritent les tombes de nombreux papes, dont Benoît XVI. Plus bas encore, les fouilles menées de 1940 à 1949 sous le pape Pie XII ont mis au jour une rue bordée de tombeaux païens. Juste sous l'autel, elles ont révélé un petit monument du deuxième siècle entouré de graffitis grecs, dont l'un se lit « Pierre est ici ». En 1968, Paul VI a annoncé que les ossements retrouvés dans une niche, ceux d'un homme robuste de soixante à soixante-dix ans, étaient très probablement ceux de l'apôtre." },
      { titre: "La vie de la basilique",
        texte: "Des dizaines de milliers de visiteurs et de pèlerins la traversent chaque jour. Les sampietrini, les ouvriers chargés de l'entretien de Saint-Pierre, veillent depuis quatre siècles sur ses marbres et ses mosaïques. Autrefois, jusqu'à l'arrivée de l'électricité, ils escaladaient la coupole pour l'illuminer de centaines de lanternes les soirs de fête. Au sommet, après cinq cent cinquante et une marches, la vue s'étend jusqu'à la mer." }
    ],
    enfants: [
      { titre: "La plus grande église du monde",
        texte: "Imagine un bâtiment si grand que la statue de la Liberté, avec son socle, tiendrait debout sous la coupole. Presque deux terrains de football mis bout à bout tiendraient dans la nef. Les lettres dorées qui courent tout en haut des murs sont aussi grandes que toi. Les bébés anges qui tiennent les bénitiers à l'entrée, ces grandes coupes d'eau bénite, sont plus grands qu'un adulte. Pourtant, quand tu entres, tout paraît normal : les architectes ont tout agrandi dans les mêmes proportions pour tromper ton œil. Pour comprendre la vraie taille, regarde les gens tout au fond : de vraies fourmis." },
      { titre: "Le squelette au sablier",
        texte: "Dans le transept de gauche, cherche un grand drapé de marbre rouge qui semble soulevé par un vent invisible. Dessous, un squelette doré sort la tête et brandit un sablier, pour rappeler au pape Alexandre VII, agenouillé au-dessus, que le temps passe. C'est le Bernin, à quatre-vingts ans, qui a sculpté ce tombeau. Le plus étonnant, c'est que sous le drapé se trouve une vraie porte. Le Bernin ne pouvait pas la déplacer, alors il l'a transformée en porte de la mort." },
      { titre: "La chasse au trésor sous terre",
        texte: "En 1939, en creusant pour aménager la tombe d'un pape, des ouvriers tombent sur un mur ancien. Le pape Pie XII lance alors des fouilles discrètes qui durent dix ans, sous l'autel. On découvre une rue romaine bordée de tombeaux peints, puis un mur couvert de graffitis en grec, dont un qui dit « Pierre est ici ». Dans une cachette du mur, on trouve des ossements enveloppés dans un tissu rouge pourpre brodé de fil d'or : ceux d'un homme âgé et costaud. Depuis, on pense que c'est vraiment le pêcheur de Galilée qui repose là, sous la coupole." },
      { titre: "La porte murée",
        texte: "À droite, sous le portique, une porte de bronze est fermée de l'intérieur par un mur de briques. C'est la Porte sainte : on ne l'ouvre en principe qu'une fois tous les vingt-cinq ans, pour le jubilé. Le pape frappe alors le mur, on le démonte, et des millions de pèlerins passent par cette porte pendant un an. Elle a été ouverte pour la dernière fois en décembre 2024 et refermée en janvier 2026. Dans le mur, les ouvriers cachent un coffret avec les clés et un parchemin, qu'on retrouvera à l'ouverture suivante." },
      { titre: "Défi dans la nef",
        texte: "Trouve le grand disque rond de pierre rouge sombre, près de l'entrée, sur lequel Charlemagne s'est agenouillé pour être couronné empereur il y a plus de mille deux cents ans. Cherche ensuite, tout au fond, la colombe dorée dans la fenêtre au-dessus de la chaire : elle a l'air petite, mais elle mesure près de deux mètres. Enfin, compte les colonnes torsadées du baldaquin de bronze, cette sorte de tente géante au-dessus de l'autel. Il y en a quatre, décorées de branches de laurier et d'abeilles, l'emblème de la famille du pape." },
      { titre: "Le quiz",
        texte: "Question : pourquoi presque tous les tableaux de Saint-Pierre ne sont-ils pas de vrais tableaux ? Réponse : parce que l'humidité de l'immense église abîmait les toiles. On les a donc remplacées par des mosaïques, faites de millions de petits morceaux de verre coloré, si fins qu'il faut s'approcher tout près pour s'en apercevoir." }
    ]
  },
  {
    id: "musees-vatican",
    nom: "Musées du Vatican et Chapelle Sixtine",
    categorie: "vatican",
    lat: 41.9065, lon: 12.4536,
    duree: 180,
    conseil: "Réservation en ligne indispensable, sur le site officiel uniquement. Fermé le dimanche sauf le dernier du mois (gratuit mais bondé). Demandez le parcours famille ou l'audioguide enfants.",
    adultes: [
      { titre: "Cinq siècles de collections",
        texte: "Tout commence le 14 janvier 1506, quand un vigneron découvre sur l'Esquilin un groupe de marbre spectaculaire, le Laocoon. Michel-Ange et Giuliano da Sangallo accourent, Jules II l'achète et l'installe dans la cour du Belvédère, à côté de l'Apollon : le premier musée du Vatican est né. Au dix-huitième siècle, Clément XIV et Pie VI créent le musée Pio-Clementino pour les statues antiques. Pie VII confie à Canova le musée Chiaramonti. Grégoire XVI ouvre le musée étrusque en 1837 et le musée égyptien en 1839. Pie XI inaugure la pinacothèque, la galerie de peintures, en 1932, et Paul VI ajoute en 1973 l'art religieux moderne. Aujourd'hui, l'ensemble aligne sept kilomètres de salles et environ vingt mille œuvres exposées, sur un total de soixante-dix mille, et accueille plus de six millions de visiteurs par an." },
      { titre: "Le parcours",
        texte: "La visite commence par la pinacothèque, où se côtoient la Transfiguration de Raphaël, la Déposition du Caravage et le Saint Jérôme inachevé de Léonard de Vinci. On traverse ensuite la cour de la Pigna, dominée par une pomme de pin de bronze du premier siècle, une ancienne fontaine du Champ de Mars, et par la sphère de bronze d'Arnaldo Pomodoro. Le musée Pio-Clementino présente le Laocoon, l'Apollon du Belvédère et le Torse du Belvédère, que Michel-Ange appelait son maître. On arrive ensuite dans la salle ronde, avec sa grande vasque de porphyre de treize mètres de tour. On passe devant les momies du musée égyptien, la galerie des Candélabres et celle des Tapisseries tissées d'après Raphaël. Puis on entre dans la galerie des Cartes géographiques : cent vingt mètres de fresques peintes entre 1580 et 1583 par le mathématicien Ignazio Danti, qui a parcouru l'Italie pour dresser ses quarante cartes. Les chambres de Raphaël, décorées de 1508 à 1524, culminent avec l'École d'Athènes, où Platon désigne le ciel et Aristote la terre." },
      { titre: "La chapelle Sixtine",
        texte: "Construite entre 1473 et 1481 pour le pape Sixte IV, la chapelle mesure quarante mètres de long, treize de large et vingt de haut. Ce sont les proportions que l'on attribuait au temple de Salomon. Ses murs ont été peints dès 1481 par Botticelli, Pérugin, Ghirlandaio et Signorelli. En 1508, Jules II impose à Michel-Ange, qui se disait sculpteur et non peintre, de décorer la voûte, près de cinq cents mètres carrés. En quatre ans, seul ou presque, il y peint plus de trois cents personnages, de la Création à Noé, entourés de prophètes et de sibylles, les prophétesses de l'Antiquité. Vingt-cinq ans plus tard, Paul III lui commande le Jugement dernier, achevé en 1541. La restauration de 1980 à 1994 a rendu aux fresques des couleurs éclatantes que personne n'imaginait plus. C'est ici que les cardinaux s'enferment pour élire le pape, avec deux poêles dont la fumée annonce le résultat." },
      { titre: "Petites histoires",
        texte: "Jules II, impatient, menaçait de faire tomber Michel-Ange de son échafaudage s'il ne terminait pas. L'artiste répondait qu'il finirait quand il pourrait. Le maître de cérémonies Biagio da Cesena avait jugé le Jugement dernier indécent. Michel-Ange l'a donc peint en Minos, le juge des Enfers, avec des oreilles d'âne. Le pape a refusé d'intervenir, en disant que son pouvoir ne s'étendait pas à l'enfer. En 1564, Daniele da Volterra a été chargé de couvrir de voiles les nudités, ce qui lui a valu le surnom de Braghettone, le culottier. Dans l'École d'Athènes, Raphaël a ajouté après coup, sur un morceau d'enduit posé plus tard, le portrait de Michel-Ange en Héraclite pensif : un hommage à la voûte qu'il venait de découvrir. Quant au bras droit du Laocoon, reconstitué tendu au seizième siècle, on l'a retrouvé plié chez un marbrier romain en 1906, exactement comme Michel-Ange l'avait prédit." }
    ],
    enfants: [
      { titre: "Imagine sept kilomètres de trésors",
        texte: "Imagine un musée si grand que, si tu t'arrêtais une minute devant chaque œuvre, il te faudrait plusieurs semaines pour tout voir. Sept kilomètres de couloirs, de galeries et de salles remplis de momies, de statues géantes, de cartes peintes et de plafonds dorés. Chaque matin, avant l'ouverture, un homme parcourt tout ce chemin avec un trousseau de près de trois mille clés. Il ouvre environ trois cents portes, en commençant par les plus anciennes. Sa dernière clé, la plus précieuse, ouvre la chapelle Sixtine." },
      { titre: "Le bras perdu du Laocoon",
        texte: "En 1506, un paysan qui creusait sa vigne a trouvé une statue extraordinaire : un père et ses deux fils étranglés par des serpents de mer. Il manquait un bras au père. Michel-Ange, venu voir la découverte, a affirmé que ce bras devait être replié derrière la tête. Les autres artistes n'étaient pas d'accord, et on a sculpté un bras tout droit, tendu vers le ciel. Quatre cents ans plus tard, en 1906, un archéologue a retrouvé le vrai bras de marbre chez un tailleur de pierre de Rome : il était plié, exactement comme Michel-Ange l'avait dit !" },
      { titre: "Vengeance en peinture",
        texte: "Quand Michel-Ange peignait le Jugement dernier, un homme du pape, Biagio da Cesena, s'est plaint que les personnages nus étaient scandaleux. Michel-Ange s'est vengé : il l'a peint en bas à droite, en juge des Enfers, avec des oreilles d'âne et un serpent enroulé autour du corps. Biagio a couru se plaindre au pape, qui a répondu en riant qu'il n'avait aucun pouvoir en enfer. Michel-Ange s'est aussi caché dans la fresque : cherche saint Barthélemy, qui tient une peau humaine toute molle. Le visage dessiné sur cette peau est celui de Michel-Ange !" },
      { titre: "Défi des cartes géantes",
        texte: "Dans la galerie des Cartes, cherche la botte de l'Italie et retrouve Rome, la Sicile et la Sardaigne. Ces cartes ont été peintes il y a plus de quatre cents ans, sans avion ni satellite, par un savant qui a parcouru le pays à cheval. Dans la cour, trouve la pomme de pin géante et les deux paons de bronze qui l'encadrent. Dans la chapelle Sixtine, lève la tête et trouve les deux doigts qui se touchent presque, celui de Dieu et celui d'Adam. Puis cherche, sur le mur du fond, en bas à droite, l'homme aux oreilles d'âne." },
      { titre: "Le quiz",
        texte: "Question : Michel-Ange se considérait-il comme un peintre ? Réponse : non ! Il se disait sculpteur et signait ses lettres « Michel-Ange sculpteur ». Il a tout fait pour refuser le plafond de la Sixtine, persuadé que ses rivaux voulaient le voir échouer. Il l'a finalement peint presque seul, en quatre ans, et c'est devenu la peinture la plus célèbre du monde." }
    ]
  },

  /* ------------------------------------------------------------------
     OÙ MANGER — restaurants, street food, bars (source : content/restos.json)
     ------------------------------------------------------------------ */
  {
    "categorie": "manger",
    "id": "armando-pantheon",
    "nom": "Armando al Pantheon",
    "type": "trattoria",
    "quartier": "Panthéon",
    "budget": "€€",
    "prix": "30 à 40 € par personne",
    "lat": 41.89906,
    "lon": 12.4762,
    "duree": 90,
    "resume": "La trattoria familiale historique à vingt mètres du Panthéon, tenue par la famille Gargioli depuis 1961.",
    "pourquoi": "Trouver une vraie trattoria de famille à côté d'un monument aussi visité tient du miracle, et c'est pourtant le cas ici. Depuis 1961, les Gargioli servent la cuisine romaine telle qu'on la fait à la maison, dans une petite salle aux murs couverts de photos et de dédicaces. Les portions sont généreuses, les serveurs ont vu passer trois générations de clients, et rien n'a été aménagé pour les touristes : la carte est la même pour tout le monde.",
    "commander": "Les classiques romains sont tous là et tous réussis : rigatoni alla gricia, carbonara, cacio e pepe, saltimbocca alla romana. Pour changer, essayez le lapin ou l'agneau au four. En dessert, la tarte ricotta et cerises griottes est la spécialité de la maison.",
    "enfants": "Des pâtes au beurre ou à la sauce tomate se demandent sans problème, et les enfants adorent regarder la file de touristes devant le Panthéon depuis la fenêtre. Prévoyez de venir à l'ouverture, à 12 h 30, quand la salle est encore calme.",
    "pratique": {
      "adresse": "Salita de' Crescenzi 31, 00186 Roma",
      "horaires": "Lundi au samedi 12 h 30 à 15 h et 19 h à 23 h",
      "fermeture": "Dimanche, et généralement une partie du mois d'août",
      "reservation": "Indispensable, uniquement en ligne sur le site, deux à trois semaines à l'avance. Pas de tables de plus de six personnes.",
      "tel": "",
      "site": "https://armandoalpantheon.it"
    },
    "conseil": "Sans réservation, tentez votre chance à 12 h 30 pile en semaine. La salle est minuscule, il n'y a pas de terrasse."
  },
  {
    "categorie": "manger",
    "id": "da-enzo-al-29",
    "nom": "Da Enzo al 29",
    "type": "trattoria",
    "quartier": "Trastevere",
    "budget": "€€",
    "prix": "25 à 35 € par personne",
    "lat": 41.88809,
    "lon": 12.47781,
    "duree": 90,
    "resume": "La trattoria de poche la plus célèbre de Trastevere : dix tables, une file sur le trottoir et une carbonara de référence.",
    "pourquoi": "Enzo, puis ses enfants, tiennent cette minuscule adresse de la partie calme de Trastevere, loin des rues à touristes. Les produits viennent de petits fermiers du Latium et tout est fait sur place, ce qui se sent dès la première bouchée. L'ambiance est bruyante et joyeuse, les tables sont collées les unes aux autres, et la file d'attente sur la Via dei Vascellari fait partie du spectacle.",
    "commander": "La carbonara et la cacio e pepe sont parmi les meilleures de Rome. Commencez par la burrata ou, de novembre à avril, les artichauts à la juive, croustillants comme des chips. Terminez par le tiramisu servi dans un bocal.",
    "enfants": "Les boulettes de viande à la sauce tomate et les pâtes simples plaisent à coup sûr. Le temps d'attente peut être long : venez pour le premier service de 12 h 30 ou réservez le créneau de 19 h 30, le seul qui se réserve.",
    "pratique": {
      "adresse": "Via dei Vascellari 29, 00153 Roma",
      "horaires": "Lundi au samedi 12 h 30 à 15 h et 19 h 30 à 23 h",
      "fermeture": "Dimanche",
      "reservation": "Par téléphone, uniquement pour le service de 19 h 30. Sinon, file d'attente sur place, qui se forme dès 19 h.",
      "tel": "06 5812260",
      "site": "https://www.daenzoal29.com"
    },
    "conseil": "Arrivez vers 12 h 15 pour être dans les premiers du déjeuner. L'île Tibérine et le Ghetto sont à cinq minutes à pied."
  },
  {
    "categorie": "manger",
    "id": "flavio-velavevodetto",
    "nom": "Flavio al Velavevodetto",
    "type": "trattoria",
    "quartier": "Testaccio",
    "budget": "€€",
    "prix": "25 à 35 € par personne",
    "lat": 41.87663,
    "lon": 12.47609,
    "duree": 90,
    "resume": "Une trattoria creusée dans le Monte Testaccio, la colline d'amphores cassées de la Rome antique, visibles à travers les vitres.",
    "pourquoi": "Le nom veut dire « je te l'avais bien dit », et Flavio De Maio a raison : sa trattoria est l'une des plus solides de Rome pour la cuisine romaine traditionnelle. Le lieu est unique : la salle du fond est taillée dans le Monte Testaccio, et des parois vitrées laissent voir les millions de tessons d'amphores romaines qui forment la colline. On mange donc littéralement dans un site archéologique, avec une terrasse ombragée à la belle saison.",
    "commander": "Les rigatoni alla carbonara et les tonnarelli cacio e pepe sont les stars. Les boulettes de viande en sauce, les artichauts et les légumes de saison sont excellents. Pour les amateurs, la queue de bœuf mijotée est l'un des grands plats du quartier.",
    "enfants": "Les boulettes de viande à la sauce tomate sont le plat préféré des enfants ici, et l'idée de manger dans une montagne de poteries vieilles de deux mille ans les amuse beaucoup. Demandez une table côté vitrine sur les amphores.",
    "pratique": {
      "adresse": "Via di Monte Testaccio 97, 00153 Roma",
      "horaires": "Tous les jours 12 h 30 à 15 h et 19 h 30 à 23 h",
      "fermeture": "Aucune fermeture hebdomadaire",
      "reservation": "Recommandée, par téléphone ou via le site.",
      "tel": "06 5744194",
      "site": "https://www.ristorantevelavevodetto.it"
    },
    "conseil": "Combinez avec la Pyramide de Cestius et le marché de Testaccio, à moins de dix minutes à pied. Métro B, station Piramide."
  },
  {
    "categorie": "manger",
    "id": "trattoria-monti",
    "nom": "Trattoria Monti",
    "type": "trattoria",
    "quartier": "Esquilin, près de Sainte-Marie-Majeure",
    "budget": "€€€",
    "prix": "35 à 45 € par personne",
    "lat": 41.89569,
    "lon": 12.50207,
    "duree": 90,
    "resume": "La table familiale des Camerucci, cuisine des Marches raffinée et sans chichis, à deux pas de Sainte-Marie-Majeure.",
    "pourquoi": "Tenue par la famille Camerucci depuis les années 1970, cette trattoria propose la cuisine des Marches, la région d'origine de la famille, avec une finesse rare à ce prix. La salle est petite et élégante, le service chaleureux, et les habitués du quartier se mêlent aux voyageurs bien renseignés. C'est l'adresse idéale pour un dîner un peu plus soigné sans quitter l'esprit trattoria.",
    "commander": "Le plat culte est le tortello al rosso d'uovo, un immense raviolo qui libère un jaune d'œuf coulant quand on le coupe. Les vincisgrassi, la version des Marches des lasagnes, et le lapin en porchetta sont d'autres valeurs sûres. Les desserts maison, dont la crème brûlée, méritent une place.",
    "enfants": "Le tortello au jaune d'œuf est un vrai spectacle à table, et il existe toujours des pâtes simples pour les plus prudents. Le cadre est calme, plutôt pour un dîner tranquille que pour une pause pressée.",
    "pratique": {
      "adresse": "Via di San Vito 13a, 00185 Roma",
      "horaires": "Mardi au samedi 13 h à 14 h 45 et 20 h à 22 h 45, dimanche midi seulement",
      "fermeture": "Lundi toute la journée et dimanche soir",
      "reservation": "Indispensable, par téléphone, plusieurs jours à l'avance.",
      "tel": "06 4466573",
      "site": ""
    },
    "conseil": "À cinq minutes à pied de Sainte-Marie-Majeure et dix minutes de la gare Termini. Réservez avant de partir en voyage."
  },
  {
    "categorie": "manger",
    "id": "cesare-al-casaletto",
    "nom": "Trattoria da Cesare al Casaletto",
    "type": "trattoria",
    "quartier": "Monteverde, terminus du tram 8",
    "budget": "€€",
    "prix": "25 à 30 € par personne",
    "lat": 41.87685,
    "lon": 12.44077,
    "duree": 90,
    "resume": "La trattoria de quartier préférée des Romains, sous une pergola au bout de la ligne de tram, avec un rapport qualité-prix imbattable.",
    "pourquoi": "Aucun touriste ne tombe ici par hasard : il faut prendre le tram 8 jusqu'au terminus, et c'est justement ce qui préserve l'adresse. Le chef Leonardo Vignoli y sert depuis 2009 une cuisine romaine précise, avec des produits choisis, à des prix de trattoria de quartier. La grande terrasse sous la pergola est pleine de familles romaines le dimanche midi, ce qui en dit long.",
    "commander": "Commencez par les fritti, la spécialité du lieu : boulettes de bouilli, gnocchetti frits cacio e pepe, supplì. Puis fettuccine au ragoût, tonnarelli cacio e pepe ou poulet à la chasseur. Les vins naturels du Latium sont servis au verre à petit prix.",
    "enfants": "Les fritures du début de repas sont une fête pour les enfants, les gnocchis et le poulet plaisent ensuite. La terrasse laisse de la place pour bouger, et le trajet en tram est une petite aventure en soi.",
    "pratique": {
      "adresse": "Via del Casaletto 45, 00151 Roma",
      "horaires": "12 h 45 à 15 h et 19 h 45 à 23 h",
      "fermeture": "Mercredi",
      "reservation": "Fortement recommandée, via le site ou par téléphone, surtout le week-end.",
      "tel": "06 536015",
      "site": "https://trattoriadacesare.it"
    },
    "conseil": "Tram 8 depuis Largo di Torre Argentina ou Trastevere jusqu'au terminus Casaletto, environ 25 minutes. Le restaurant est juste à côté de l'arrêt."
  },
  {
    "categorie": "manger",
    "id": "trattoria-pennestri",
    "nom": "Trattoria Pennestri",
    "type": "trattoria",
    "quartier": "Ostiense, près de la Pyramide",
    "budget": "€€€",
    "prix": "35 à 45 € par personne",
    "lat": 41.87335,
    "lon": 12.47988,
    "duree": 90,
    "resume": "La trattoria romaine moderne du quartier Ostiense, ouverte en 2016 et devenue une référence pour les Romains qui aiment bien manger.",
    "pourquoi": "Tommaso Pennestri et Valeria Payero ont ouvert cette adresse en 2016 dans le quartier Ostiense, entre le Testaccio et les anciens entrepôts couverts de fresques de street art. La cuisine part des classiques romains mais les allège et les affine, avec des produits de saison et des desserts très soignés. Le cadre est simple et lumineux, le service attentif, les prix restent raisonnables pour ce niveau.",
    "commander": "La carte change avec les saisons : pâtes fraîches du jour, viandes mijotées, légumes travaillés avec soin. Laissez-vous conseiller sur les entrées, souvent les plats les plus créatifs, et gardez de la place pour les desserts, qui sont l'une des fiertés de la maison.",
    "enfants": "L'accueil est bienveillant avec les familles et la cuisine s'adapte volontiers pour un plat de pâtes simple. C'est plutôt une adresse pour un dîner posé, à privilégier le week-end quand elle ouvre aussi le midi.",
    "pratique": {
      "adresse": "Via Giovanni da Empoli 5, 00154 Roma",
      "horaires": "Mardi au jeudi 19 h à 23 h ; vendredi, samedi et dimanche 12 h à 15 h et 19 h à 23 h",
      "fermeture": "Lundi",
      "reservation": "Indispensable, par téléphone.",
      "tel": "06 5742418",
      "site": "https://trattoriapennestri.it"
    },
    "conseil": "À cinq minutes à pied de la Pyramide de Cestius et du métro Piramide. Faites un détour par la Via del Porto Fluviale pour les fresques géantes sur les entrepôts."
  },
  {
    "categorie": "manger",
    "id": "supplizio",
    "nom": "Supplizio",
    "type": "street",
    "quartier": "Centre historique, près de Campo de' Fiori",
    "budget": "€",
    "prix": "5 à 12 € par personne",
    "lat": 41.89747,
    "lon": 12.4679,
    "duree": 30,
    "resume": "Le temple du supplì, la boulette de riz frite des Romains, revisitée par un chef dans un petit salon aux canapés de cuir.",
    "pourquoi": "Le supplì est le goûter de rue de Rome depuis toujours : une boulette de riz au ragoût, farcie de mozzarella, panée et frite. Le chef Arcangelo Dandini en a fait ici une spécialité d'orfèvre, avec la recette classique et des variantes qui changent selon les saisons. On mange debout au comptoir ou installé dans de vieux fauteuils de cuir, dans une rue d'antiquaires très jolie.",
    "commander": "Le supplì classique, à la sauce tomate et au fil de mozzarella qu'on étire « comme un téléphone », est indispensable. Essayez aussi le supplì cacio e pepe ou carbonara, les croquettes de pommes de terre et le mini sandwich au bouilli. Deux ou trois pièces suffisent pour un déjeuner léger.",
    "enfants": "Le jeu consiste à casser le supplì en deux et à voir le fil de mozzarella s'étirer le plus loin possible. Le classique est le préféré des enfants, sans surprise et sans piquant.",
    "pratique": {
      "adresse": "Via dei Banchi Vecchi 143, 00186 Roma",
      "horaires": "Lundi au samedi environ 12 h à 16 h et 17 h à 21 h 30",
      "fermeture": "Dimanche, selon la saison",
      "reservation": "Sans réservation, on commande au comptoir.",
      "tel": "06 89871920",
      "site": ""
    },
    "conseil": "À mi-chemin entre Piazza Navona et le Château Saint-Ange : parfait pour un déjeuner rapide entre les deux."
  },
  {
    "categorie": "manger",
    "id": "antico-forno-roscioli",
    "nom": "Antico Forno Roscioli",
    "type": "street",
    "quartier": "Campo de' Fiori",
    "budget": "€",
    "prix": "3 à 8 € par personne",
    "lat": 41.89465,
    "lon": 12.47426,
    "duree": 20,
    "resume": "La boulangerie mythique de la famille Roscioli, pour la pizza bianca et la pizza rossa qui font courir tout le quartier.",
    "pourquoi": "Depuis 1972, la famille Roscioli tient ce four à deux pas de Campo de' Fiori, et la file qui déborde sur le trottoir à midi ne ment pas. La pizza bianca, une pâte fine, huilée et salée, et la pizza rossa, à la tomate, sortent du four toute la journée et se vendent au poids. Le comptoir propose aussi des dizaines de pizzas garnies, des pains et des biscuits.",
    "commander": "La pizza bianca nature, chaude, est l'expérience de base. La version garnie de mortadelle, coupée en deux et fourrée sur place, est le sandwich préféré des Romains. Ajoutez une part de pizza aux pommes de terre ou aux fleurs de courgette selon la saison.",
    "enfants": "Un carré de pizza bianca ou rossa dans la main, à manger en marchant vers le marché de Campo de' Fiori : c'est le goûter romain par excellence, et il coûte quelques euros. Montrez-leur le four à bois derrière le comptoir.",
    "pratique": {
      "adresse": "Via dei Chiavari 34, 00186 Roma",
      "horaires": "Lundi au samedi environ 8 h à 20 h, dimanche 8 h à 18 h",
      "fermeture": "Ouvert tous les jours, sauf jours fériés",
      "reservation": "Sans réservation, on prend un ticket et on commande au poids.",
      "tel": "06 6864045",
      "site": "https://anticofornoroscioli.it"
    },
    "conseil": "Évitez 13 h, l'heure de pointe. Vers 11 h ou 16 h, la pizza sort du four et il n'y a presque personne."
  },
  {
    "categorie": "manger",
    "id": "pizzarium-bonci",
    "nom": "Pizzarium de Gabriele Bonci",
    "type": "street",
    "quartier": "Prati, près des Musées du Vatican",
    "budget": "€",
    "prix": "8 à 14 € par personne",
    "lat": 41.9067,
    "lon": 12.44666,
    "duree": 30,
    "resume": "La pizza al taglio la plus célèbre du monde, à huit minutes à pied de l'entrée des Musées du Vatican.",
    "pourquoi": "Gabriele Bonci a révolutionné la pizza à la coupe romaine : une pâte fermentée 72 heures, légère et alvéolée, garnie de produits d'artisans, avec des dizaines de recettes qui changent chaque jour. Le lieu est un petit comptoir sans tables, on mange debout devant la boutique, et les chefs du monde entier viennent y faire la queue. C'est l'adresse idéale avant ou après les Musées du Vatican.",
    "commander": "On choisit au comptoir, on montre la taille voulue et on paie au poids. Les incontournables : la pizza aux pommes de terre, la margherita, celle à la mortadelle. Les supplì et les fritures sont excellents aussi. Comptez trois ou quatre morceaux différents pour deux.",
    "enfants": "La margherita et la pizza aux pommes de terre sont les valeurs sûres des enfants, et le principe du « on montre ce qu'on veut avec le doigt » leur plaît. Il n'y a pas de chaises : prévoyez de manger sur les petits bancs devant ou dans la rue.",
    "pratique": {
      "adresse": "Via della Meloria 43, 00136 Roma",
      "horaires": "Lundi au samedi 11 h à 22 h ; dimanche 11 h à 15 h et 17 h à 22 h",
      "fermeture": "Ouvert tous les jours",
      "reservation": "Sans réservation, comptoir.",
      "tel": "06 39745416",
      "site": "https://bonci.it"
    },
    "conseil": "Métro A, station Cipro, à deux minutes. Prévoyez 10 à 15 minutes de file à midi : venez à 11 h 30 ou vers 15 h."
  },
  {
    "categorie": "manger",
    "id": "trapizzino-trastevere",
    "nom": "Trapizzino",
    "type": "street",
    "quartier": "Trastevere, Piazza Trilussa",
    "budget": "€",
    "prix": "5 à 12 € par personne",
    "lat": 41.89146,
    "lon": 12.46991,
    "duree": 30,
    "resume": "L'invention romaine de 2008 : un triangle de pizza bianca fourré des plats mijotés de la grand-mère, à manger sur les marches de la Piazza Trilussa.",
    "pourquoi": "En 2008, le pizzaiolo Stefano Callegari a eu l'idée de couper un coin de pizza bianca en poche et de le remplir de plats traditionnels romains : poulet à la chasseur, boulettes en sauce, aubergines à la parmesane. Le trapizzino était né, et il est devenu un classique de la ville. Cette adresse de Trastevere a une petite salle et un comptoir à emporter, mais le mieux est de manger sur les marches de la place, au bord du Tibre.",
    "commander": "Le poulet à la chasseur et la boulette en sauce tomate sont les deux grands classiques. La parmigiana d'aubergines est parfaite pour les végétariens. Complétez avec un supplì et une bière artisanale du Latium.",
    "enfants": "La boulette à la sauce tomate dans son triangle de pain est un sans-faute chez les enfants, et le format se tient d'une main en marchant. Attention aux taches : prévoyez des serviettes.",
    "pratique": {
      "adresse": "Piazza Trilussa 46, 00153 Roma",
      "horaires": "Tous les jours à partir de 12 h jusque tard dans la soirée",
      "fermeture": "Ouvert tous les jours, sauf jours fériés",
      "reservation": "Sans réservation.",
      "tel": "06 5817312",
      "site": "https://www.trapizzino.it"
    },
    "conseil": "Il existe aussi un Trapizzino à Testaccio, l'original, Via Giovanni Branca 88. Celui de Trastevere est le plus pratique en balade."
  },
  {
    "categorie": "manger",
    "id": "pizzeria-da-remo",
    "nom": "Pizzeria da Remo",
    "type": "street",
    "quartier": "Testaccio",
    "budget": "€",
    "prix": "10 à 15 € par personne",
    "lat": 41.88093,
    "lon": 12.47535,
    "duree": 60,
    "resume": "La pizzeria romaine à l'ancienne, pizza ultrafine et croustillante, service au pas de course et tables sur la place du quartier.",
    "pourquoi": "Da Remo est la pizzeria populaire de Testaccio depuis des décennies, et rien n'y a changé : des tables serrées, des serveurs qui crient les commandes, une salle bruyante et une terrasse sur la place. La pizza y est celle de Rome, à pâte très fine et bords croustillants, cuite en deux minutes dans un four brûlant. On commande en cochant un bout de papier, on paie une somme dérisoire, et on repart heureux.",
    "commander": "Margherita, marinara ou capricciosa : les pizzas simples sont les meilleures. Avant, prenez les fritures : supplì, fleurs de courgette farcies d'anchois et de mozzarella, croquettes de pommes de terre. Une bière ou un pichet de vin, et c'est tout.",
    "enfants": "Une margherita à partager, un supplì chacun, et les enfants adorent le côté « cantine » où tout va vite et fort. Venez à l'ouverture, à 19 h, pour éviter la file et le bruit du plein service.",
    "pratique": {
      "adresse": "Piazza di Santa Maria Liberatrice 44, 00153 Roma",
      "horaires": "Lundi au samedi 19 h à 1 h, le soir uniquement",
      "fermeture": "Dimanche, et une partie du mois d'août",
      "reservation": "Pas de réservation, file d'attente sur place.",
      "tel": "06 5746270",
      "site": ""
    },
    "conseil": "Espèces conseillées. Le soir, la place est pleine de familles du quartier et les enfants jouent au ballon : idéal après une journée de visites."
  },
  {
    "categorie": "manger",
    "id": "mordi-e-vai",
    "nom": "Mordi e Vai, marché de Testaccio",
    "type": "street",
    "quartier": "Testaccio, marché couvert",
    "budget": "€",
    "prix": "5 à 9 € par personne",
    "lat": 41.87757,
    "lon": 12.47335,
    "duree": 45,
    "resume": "Le stand d'un ancien boucher au marché couvert de Testaccio, qui fourre ses sandwichs des plats mijotés de la cuisine romaine.",
    "pourquoi": "Sergio Esposito a tenu une boucherie pendant quarante ans avant d'ouvrir ce petit stand, le numéro 15, dans le marché couvert de Testaccio. Il y cuisine les plats de sa famille et les sert dans du pain : bouilli de bœuf aux chicorées, boulettes en sauce, bœuf aux oignons. Le marché lui-même est une visite en soi, avec ses étals de fruits, ses pâtes fraîches et ses stands de cuisine de rue, sur les vestiges d'une route antique visibles sous une vitre.",
    "commander": "Le sandwich au bouilli de bœuf et chicorée, l'allesso, est celui qui a rendu le stand célèbre. Le panino aux boulettes de viande en sauce tomate est le plus simple et le plus réconfortant. Les amateurs de cuisine romaine rustique trouveront aussi les tripes et le picchiapò, mais rien n'oblige.",
    "enfants": "Le sandwich aux boulettes est fait pour eux, et le marché regorge de trouvailles : jus de fruits pressés, pâtes fraîches en spectacle, pizza à la coupe au stand voisin. Il y a des tables communes au centre du marché.",
    "pratique": {
      "adresse": "Mercato di Testaccio, box 15, Via Beniamino Franklin 12e, 00153 Roma",
      "horaires": "Lundi au samedi, le matin et le midi, environ 9 h à 15 h",
      "fermeture": "Dimanche",
      "reservation": "Sans réservation, on commande au stand.",
      "tel": "339 1343344",
      "site": "https://www.mordievai.it"
    },
    "conseil": "Déjeuner uniquement, le marché ferme l'après-midi. À combiner avec la Pyramide de Cestius, à dix minutes à pied."
  },
  {
    "categorie": "manger",
    "id": "bar-del-fico",
    "nom": "Bar del Fico",
    "type": "bar",
    "quartier": "Centre historique, derrière Piazza Navona",
    "budget": "€€",
    "prix": "8 à 15 € par personne pour l'apéritif",
    "lat": 41.89942,
    "lon": 12.47066,
    "duree": 60,
    "resume": "Le bar historique de la petite place du figuier, avec ses joueurs d'échecs en terrasse et son apéritif à l'ombre, à deux pas de Piazza Navona.",
    "pourquoi": "Depuis 1922, ce bar occupe une placette cachée derrière Piazza Navona, avec un figuier au milieu et des habitués qui jouent aux échecs sur les tables de la terrasse. L'endroit vit du petit-déjeuner jusqu'à la nuit, et l'heure de l'apéritif est la plus agréable : on s'installe dehors avec un verre, des olives et des chips, et on regarde passer le quartier. Le restaurant attenant sert aussi une cuisine simple et correcte.",
    "commander": "Un spritz, un negroni ou un verre de blanc du Latium pour les parents, accompagnés des petites assiettes à partager. Le café du matin y est bon aussi, et le tiramisu maison a ses fans.",
    "enfants": "Les enfants ont droit à un spritz sans alcool ou à un jus pressé, et ils peuvent regarder les parties d'échecs, voire en commencer une. La place est piétonne et tranquille, ils peuvent bouger sans risque.",
    "pratique": {
      "adresse": "Piazza del Fico 26, 00186 Roma",
      "horaires": "Tous les jours, environ 8 h 30 à 2 h",
      "fermeture": "Ouvert tous les jours",
      "reservation": "Sans réservation pour l'apéritif en terrasse.",
      "tel": "06 68891373",
      "site": "https://www.bardelfico.online"
    },
    "conseil": "Venez vers 18 h, avant la foule du soir. Piazza Navona est à trois minutes : idéal avant d'aller y admirer les fontaines illuminées."
  },
  {
    "categorie": "manger",
    "id": "freni-e-frizioni",
    "nom": "Freni e Frizioni",
    "type": "bar",
    "quartier": "Trastevere, au bord du Tibre",
    "budget": "€€",
    "prix": "10 à 14 € par personne, buffet compris",
    "lat": 41.89128,
    "lon": 12.47067,
    "duree": 60,
    "resume": "L'apéritif le plus célèbre de Trastevere : pour le prix d'un verre, un grand buffet à volonté dans un ancien garage, sur une placette au-dessus du Tibre.",
    "pourquoi": "Le nom signifie « freins et embrayages » : c'était un atelier de mécanique, transformé en bar avec ses murs bruts et ses lampes industrielles. La formule qui a fait sa réputation est l'apéritif à l'italienne : on achète une boisson et on se sert librement au buffet, principalement végétarien, avec pâtes, salades, couscous, légumes. La terrasse déborde sur la placette, au-dessus du fleuve, et l'ambiance est jeune et joyeuse.",
    "commander": "Un cocktail de la carte, très soignée, ou un spritz, puis direction le buffet. Prenez une assiette pour chacun et faites plusieurs passages, le buffet se renouvelle pendant tout l'apéritif.",
    "enfants": "Avec un soda ou un jus, les enfants ont le même accès au buffet, et ils adorent choisir eux-mêmes. Venez à 18 h 30, à l'ouverture : c'est calme, les tables sont libres, et ce dîner déguisé en apéritif remplace facilement un restaurant.",
    "pratique": {
      "adresse": "Via del Politeama 4, 00153 Roma",
      "horaires": "Tous les jours 18 h 30 à 2 h, apéritif avec buffet de 18 h 30 à 21 h",
      "fermeture": "Ouvert tous les jours",
      "reservation": "Sans réservation.",
      "tel": "06 45497499",
      "site": "https://www.freniefrizioni.com"
    },
    "conseil": "Après 20 h le lieu devient bondé et très bruyant. Tôt, c'est parfait en famille ; ensuite, c'est plutôt pour les grands."
  },
  {
    "categorie": "manger",
    "id": "necci-dal-1924",
    "nom": "Necci dal 1924",
    "type": "bar",
    "quartier": "Pigneto, quartier du street art",
    "budget": "€€",
    "prix": "8 à 25 € par personne selon le moment",
    "lat": 41.88918,
    "lon": 12.53029,
    "duree": 75,
    "resume": "Le café-jardin centenaire du Pigneto, ancien repaire de Pasolini, où les familles du quartier passent du petit-déjeuner à l'apéritif.",
    "pourquoi": "Ouvert en 1924 comme laiterie, Necci est devenu le cœur du Pigneto, un ancien quartier ouvrier aujourd'hui couvert de fresques de street art et plein de petits bars. Le cinéaste Pasolini y avait ses habitudes et y a tourné des scènes de son premier film. Le grand jardin sous les arbres, avec ses tables dépareillées, accueille tout le monde, poussettes comprises, de 8 h du matin jusqu'à la nuit : café, déjeuner, gâteaux maison, apéritif.",
    "commander": "À l'apéritif, un spritz ou un vin nature avec les planches à partager. Au déjeuner ou au dîner, les pâtes fraîches maison et les plats du jour sont simples et bons, et les gâteaux de la vitrine valent le détour.",
    "enfants": "Le jardin est un terrain de jeu où les enfants peuvent bouger pendant que les parents prennent l'apéritif, et la carte propose des pâtes et des gâteaux qui font l'unanimité. Le quartier se visite ensuite comme un musée de rue, à la recherche des fresques.",
    "pratique": {
      "adresse": "Via Fanfulla da Lodi 68, 00176 Roma",
      "horaires": "Tous les jours 8 h à 1 h, vendredi et samedi jusqu'à 2 h",
      "fermeture": "Ouvert tous les jours",
      "reservation": "Conseillée le soir et le dimanche midi, par téléphone.",
      "tel": "06 97601552",
      "site": "https://www.necci1924.com"
    },
    "conseil": "Métro C, station Pigneto, ou tram 5 et 14 depuis Termini. Le samedi, un marché se tient sur la Via del Pigneto, la rue piétonne voisine."
  }
];

/* Export pour un éventuel usage en module (scripts Node) ; sans effet dans le navigateur. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MONUMENTS, CATEGORIES };
}
