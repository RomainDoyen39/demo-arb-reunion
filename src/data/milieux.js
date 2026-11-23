export const milieux = [
  {
    id: 'recifs',
    title: 'Récifs coralliens & Lagon',
    category: 'Milieu marin & côtier',
    kicker: '25 km de récifs frangeants sous haute surveillance',
    place: 'Saint-Gilles, Saint-Leu et l’Étang-Salé',
    image: '/images/biodiversite/recifs.webp',
    program: 'Programme Réserve Marine (RNMR)',
    actorId: 'rnmr',
    actorLabel: 'Réserve naturelle marine',
    excerpt:
      'Suivi continu des platiers de Saint-Gilles, Saint-Leu et l’Étang-Salé : calcification, algues macrophytes et retour des poissons herbivores.',
    paragraphs: [
      'Les 18 stations GCRMN sont relues chaque saison. Le recouvrement corallien se tient à 42,8 %. Le blanchissement de 2024 a touché surtout les petits fonds de la Saline, où la reprise dépend des poissons qui broutent les algues.',
      'La réserve publie les fiches de station et tient le détail des comptages. Les clubs et les sentinelles du lagon reprennent les mêmes layons, pour que la série reste comparable d’une année sur l’autre.',
    ],
    stats: [
      { label: 'Recouvrement', value: '42,8 %', note: 'Stable' },
      { label: 'Surveillance', value: '18', note: 'Stations GCRMN' },
      { label: 'Résilience', value: 'Modérée', note: 'Blanchissement 2024' },
    ],
  },
  {
    id: 'forets',
    title: 'Forêts d’altitude & Pitons',
    category: 'Cœur de Parc national',
    kicker: 'Reliques primaires classées au Patrimoine mondial',
    place: 'Cirques, remparts et forêts de nuages',
    image: '/images/biodiversite/forets.webp',
    program: 'Suivi ONF & Parc national',
    actorId: 'parc',
    actorLabel: 'Parc national de La Réunion',
    excerpt:
      'Les forêts de nuages et les maquis d’altitude concentrent les micro-endémismes du sud-ouest de l’océan Indien. La pression des plantes invasives y reste la plus forte.',
    paragraphs: [
      'Le cœur de parc couvre environ 100 000 hectares, soit 40 % de l’île, avec une intégrité encore proche de 89 %. Les fronts de goyaviers avancent par les ravines les moins accessibles.',
      'Les chantiers prioritaires sont choisis avec l’ONF là où un arrachage précoce peut encore tenir une lisière. Les coordonnées des stations les plus sensibles ne sont pas publiées.',
    ],
    stats: [
      { label: 'Surface relique', value: '100 000 ha', note: '40 % de l’île' },
      { label: 'Intégrité', value: '89 %', note: 'Peu fragmentée' },
      { label: 'Menace', value: 'Élevée', note: 'Pression des goyaviers' },
    ],
  },
  {
    id: 'zones-humides',
    title: 'Zones humides & Littoraux',
    category: 'Site Ramsar international',
    kicker: 'Étangs de Saint-Paul et du Gol, ripisylves et salines',
    place: 'Saint-Paul, Étang du Gol et embouchures',
    image: '/images/biodiversite/zones-humides.webp',
    program: 'RNN Étang de Saint-Paul',
    actorId: 'etang',
    actorLabel: 'Réserve de l’Étang de Saint-Paul',
    excerpt:
      'Ces 1 200 hectares d’eau douce servent à la reproduction des cabots bouche-ronde et de halte aux limicoles. Les niveaux d’eau et la jussie y sont suivis en continu.',
    paragraphs: [
      'Quarante-huit espèces d’oiseaux d’eau fréquentent les plans d’eau et les roselières. Depuis 2018, les surfaces restaurées ont progressé de 18 %, surtout sur les berges de l’étang de Saint-Paul.',
      'La régie ajuste les niveaux avec la commune et arrache la jussie avant qu’elle ne ferme les chenaux. Les ripisylves replantées servent aussi de corridor pour la faune qui vient du littoral.',
    ],
    stats: [
      { label: 'Surface', value: '1 200 ha', note: 'Milieux fragiles' },
      { label: 'Avifaune', value: '48 sp.', note: 'Oiseaux d’eau' },
      { label: 'Restauré', value: '+ 18 %', note: 'Depuis 2018' },
    ],
  },
  {
    id: 'mi-pentes',
    title: 'Espaces agricoles & Mi-pentes',
    category: 'Trame verte & bleue',
    kicker: 'Reconnexion écologique des ravines et agroécologie',
    place: 'Mi-pentes, de la canne aux ravines',
    image: '/images/biodiversite/mi-pentes.webp',
    program: 'Programme Ravines Vivantes',
    excerpt:
      'Cette zone tampon relie le littoral urbanisé au cœur sauvage. Les ripisylves et les haies limitent l’érosion cyclonique et offrent des refuges aux pollinisateurs.',
    paragraphs: [
      '310 ravines servent encore de corridors. Plus de 240 exploitations sont engagées dans une transition, et 45 km de haies mellifères ont été plantés le long des parcelles.',
      'Le programme aide les communes à remplacer l’enrochement par un couvert vivant là où la pente le permet, et à garder les ravines ouvertes pour la faune qui descend vers la mer.',
    ],
    stats: [
      { label: 'Ravines', value: '310', note: 'Corridors vitaux' },
      { label: 'Exploitations', value: '240+', note: 'En transition' },
      { label: 'Haies', value: '45 km', note: 'Espèces mellifères' },
    ],
  },
];
