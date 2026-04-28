import type { TranslationKey } from './en'

export const frTranslations: Partial<Record<TranslationKey, string>> = {
  // Header
  'header.browse': 'Parcourir',
  'header.findProfessionals': 'Trouver des professionnels',
  'header.professionalLogin': 'Connexion des professionnels',
  'header.createAd': 'Creer une annonce',
  'header.myProfile': 'Mon profil',
  'header.dashboard': 'Tableau de bord',
  'header.myListings': 'Mes annonces',
  'header.signOut': 'Se deconnecter',
  'header.account': 'Compte',
  'header.language': 'Langue',
  'header.currency': 'Devise',
  'header.jobRequests': 'Demandes de travaux',
  'header.favorites': 'Favoris',
  'header.messages': 'Messages',
  'header.postJob': 'Publier une demande',
  'header.brandTagline': 'Plateforme de construction gratuite',

  // Footer
  'footer.tagline':
    'Entrez en contact avec des professionnels du batiment de confiance et trouvez des materiaux de qualite.',
  'footer.forClients': 'Pour les clients',
  'footer.browseListings': 'Parcourir les annonces',
  'footer.postRequest': 'Publier une demande',
  'footer.forProfessionals': 'Pour les professionnels',
  'footer.signIn': 'Se connecter',
  'footer.register': 'S inscrire',
  'footer.howItWorks': 'Comment ca marche',
  'footer.allRightsReserved': 'Tous droits reserves.',
  'footer.brandText':
    'Dimarket est une plateforme mondiale gratuite de services de construction ou les clients publient des travaux et les professionnels repondent directement.',
  'footer.monetization':
    'Aucun frais pour les utilisateurs. Aucun abonnement. La plateforme gagne uniquement grace a la publicite.',
  'footer.platformTitleSimple': 'Plateforme',
  'footer.accountTitleSimple': 'Compte',
  'footer.adsTitle': 'Publicite',
  'footer.adsText':
    'Les marques de materiaux, d outils, de logistique et de services locaux peuvent atteindre une demande active dans les annonces et sur les pages professionnelles.',
  'footer.adsButton': 'Page publicitaire',
  'footer.legalRight':
    'Plateforme gratuite de services de construction avec monetisation uniquement par la publicite.',

  // Home old keys
  'home.heroTitle': 'Trouvez des professionnels de confiance',
  'home.heroSubtitle': 'Construisez vos reves',
  'home.heroDescription':
    'Marketplace de construction, renovation et services pour la maison reliant les clients a des professionnels verifies',
  'home.searchPlaceholder': 'Rechercher des services, des materiaux ou des professionnels...',
  'home.search': 'Rechercher',
  'home.findProfessionals': 'Trouver des professionnels',
  'home.postRequest': 'Publier une demande',
  'home.browseByCategory': 'Parcourir par categorie',
  'home.topRatedProfessionals': 'Professionnels les mieux notes',
  'home.topRatedDescription':
    'Entrez en contact avec des experts verifies dans la construction et les services pour la maison',
  'home.noProfessionals': 'Aucun professionnel inscrit pour le moment. Soyez le premier !',
  'home.viewAllProfessionals': 'Voir tous les professionnels',
  'home.recentListings': 'Annonces recentes',
  'home.recentListingsDescription': 'Dernieres opportunites et demandes',
  'home.noListings': 'Aucune annonce active pour le moment. Publiez la premiere !',
  'home.viewAllListings': 'Voir toutes les annonces',
  'home.whyChoose': 'Pourquoi choisir Dimarket ?',
  'home.verifiedProfessionals': 'Professionnels verifies',
  'home.verifiedDescription':
    'Tous les professionnels sont verifies avec des notes et avis de vrais clients',
  'home.quickEasy': 'Rapide et simple',
  'home.quickEasyDescription':
    'Publiez votre demande en quelques minutes sans inscription. Recevez des reponses rapidement',
  'home.directCommunication': 'Communication directe',
  'home.directCommunicationDescription':
    'Contactez directement les professionnels grace a notre messagerie integree',
  'home.areYouProfessional': 'Etes-vous professionnel ?',
  'home.joinProfessionals':
    'Rejoignez des milliers de professionnels qui developpent leur activite sur Dimarket',
  'home.registerAsProfessional': 'S inscrire comme professionnel',

  // Home new keys
  'home.globalEyebrow': 'Services de construction mondiaux',
  'home.heroSimpleTitle':
    'Trouvez un artisan pour une reparation, une installation ou des travaux de construction.',
  'home.heroSimpleDescription':
    'Les clients publient des demandes de travaux, les professionnels repondent directement et Dimarket reste gratuit pour les utilisateurs.',
  'home.whatNeedsToBeDone': 'Que faut-il faire ?',
  'home.cityOrCountry': 'Ville ou pays',
  'home.postJob': 'Publier une demande',
  'home.popularCategoriesTitle': 'Categories populaires',
  'home.popularCategoriesText':
    'Les domaines de construction et de renovation les plus demandes sur Dimarket.',
  'home.browseRequests': 'Parcourir les demandes de travaux',
  'home.freshRequestsTitle': 'Nouvelles demandes de travaux',
  'home.freshRequestsText':
    'Nouvelles demandes clients que les professionnels peuvent consulter et traiter immediatement.',
  'home.allRequests': 'Toutes les demandes de travaux',
  'home.popularProsTitle': 'Professionnels populaires',
  'home.popularProsText':
    'Profils avec experience visible, notes stables et contact direct.',
  'home.allPros': 'Tous les professionnels',
  'home.adTitle': 'Publicite',
  'home.adText':
    'Faites la promotion d outils, de materiaux, de services locaux ou de showrooms de construction aupres d une audience ciblee.',
  'home.adButton': 'Faire de la publicite sur Dimarket',
  'home.adCardOne': 'Partenaires materiaux',
  'home.adCardTwo': 'Marques d outils',
  'home.adCardThree': 'Showrooms locaux',
  'home.noJobs': 'Aucune demande de travaux active pour le moment.',
  'home.noCategories': 'Les categories apparaitront ici bientot.',
  'home.noLocation': 'Lieu non precise',
  'home.budgetLabel': 'Budget',
  'home.activeLabel': 'Actif',
  'home.unknownCategory': 'Service de construction',
  'home.noBio': 'Le profil de ce professionnel de la construction est en cours de completion.',
  'home.sponsoredPlacement':
    'Placement sponsorise pour outils, materiaux, logistique ou partenaires locaux de construction.',
  'home.sidebarAdOne': 'Placez votre marque a cote d une demande reelle en construction.',
  'home.sidebarAdTwo':
    'Touchez professionnels et clients pendant qu ils recherchent du travail et des services.',
  'home.loading': 'Chargement...',

  // Categories
  'category.construction': 'Construction',
  'category.constructionDesc': 'Nouvelle construction et projets de batiment',
  'category.renovation': 'Renovation',
  'category.renovationDesc': 'Renovation et reamenagement de la maison',
  'category.electrical': 'Electricite',
  'category.electricalDesc': 'Travaux et reparations electriques',
  'category.plumbing': 'Plomberie',
  'category.plumbingDesc': 'Services et installations de plomberie',
  'category.handyman': 'Bricolage',
  'category.handymanDesc': 'Services generaux de petit bricolage',
  'category.materials': 'Materiaux',
  'category.materialsDesc': 'Materiaux de construction a vendre',
  'category.tools': 'Outils',
  'category.toolsDesc': 'Outils et equipements',
  'category.name.construction': 'Construction',
  'category.name.renovation': 'Renovation',
  'category.name.electrical': 'Electricite',
  'category.name.plumbing': 'Plomberie',
  'category.name.handyman': 'Bricolage',
  'category.name.materials': 'Materiaux',
  'category.name.tools': 'Outils',

  // Listing Card
  'listing.serviceNeeded': 'Service recherche',
  'listing.serviceOffered': 'Service propose',
  'listing.forSale': 'A vendre',
  'listing.wanted': 'Recherche',
  'listing.contactForPrice': 'Contacter pour le prix',
  'listing.daysLeft': 'jours restants',
  'listing.views': 'vues',
  'listing.premium': 'PREMIUM',
  'listing.constructionService': 'Service de construction',
  'listing.locationNotSpecified': 'Lieu non precise',
  'listing.budget': 'Budget',

  // Professional Card
  'professional.contact': 'Contacter',
  'professional.reviews': 'avis',
  'professional.new': 'Nouveau',
  'professional.defaultName': 'Professionnel',
  'professional.global': 'Global',
  'professional.profileInProgress':
    'Le profil de ce professionnel de la construction est en cours de completion.',

  // Create Ad
  'createAd.title': 'Creer une demande de travaux de construction',
  'createAd.noRegistration': 'Aucune inscription requise',
  'createAd.eyebrow': 'Demande de travaux gratuite',
  'createAd.heroTitle': 'Creer une demande de travaux de construction',
  'createAd.heroDescription':
    'Decrivez le travail, ajoutez un lieu et laissez les professionnels vous contacter directement. Aucun abonnement et aucun frais de publication.',
  'createAd.detailsTitle': 'Details du travail',
  'createAd.detailsText':
    'Rendez la demande precise afin que les professionnels comprennent le travail et envoient une offre adaptee.',
  'createAd.locationTitle': 'Lieu et visibilite',
  'createAd.locationText':
    'Choisissez ou se situe le travail et a quel point il doit etre visible pour les professionnels.',
  'createAd.contactTitle': 'Coordonnees',
  'createAd.contactText':
    'Au moins un moyen de contact est requis pour que les professionnels puissent vous joindre directement.',
  'createAd.imagesTitle': 'Photos (optionnel)',
  'createAd.imagesText':
    'Ajoutez des photos de reference, des plans ou des exemples pour aider les professionnels a estimer le travail plus precisement.',
  'createAd.freeListTitle': 'Ce qui est inclus',
  'createAd.freeItemOne': 'Publication gratuite pour les clients',
  'createAd.freeItemTwo': 'Contact direct avec les professionnels',
  'createAd.freeItemThree': 'Photos et budget facultatifs',
  'createAd.freeItemFour': 'Modele de plateforme finance par la publicite',
  'createAd.adType': 'Type d annonce',
  'createAd.needService': 'Besoin d un service',
  'createAd.needServiceDesc': 'Je cherche de l aide',
  'createAd.offerService': 'Offrir un service',
  'createAd.offerServiceDesc': 'Je propose des services',
  'createAd.sellItem': 'Vendre un article',
  'createAd.sellItemDesc': 'Materiaux, outils',
  'createAd.wantItem': 'Acheter un article',
  'createAd.wantItemDesc': 'Je cherche a acheter',
  'createAd.titleLabel': 'Titre',
  'createAd.taskPlaceholder': 'Que faut-il faire ?',
  'createAd.titlePlaceholder': 'Ex. : Reparation de placo dans le salon',
  'createAd.titleHint': 'Exemple : Reparation de placo dans le salon',
  'createAd.descriptionLabel': 'Description',
  'createAd.descriptionPlaceholder':
    'Ecrivez ce qu il faut faire, l ampleur du travail, le delai souhaite et tous les details importants.',
  'createAd.descriptionHint':
    'Ecrivez ce qu il faut faire, l ampleur du travail, le delai souhaite et tous les details importants.',
  'createAd.categoryLabel': 'Categorie',
  'createAd.selectCategory': 'Choisir une categorie',
  'createAd.priceLabel': 'Budget',
  'createAd.pricePlaceholder': 'Budget optionnel',
  'createAd.budgetPlaceholder': 'Budget optionnel',
  'createAd.locationLabel': 'Lieu',
  'createAd.locationPlaceholder': 'Ville, district ou pays',
  'createAd.contactInfo': 'Informations de contact',
  'createAd.yourName': 'Votre nom',
  'createAd.phone': 'Telephone',
  'createAd.email': 'Email',
  'createAd.contactNote': 'Indiquez au moins un telephone ou un email',
  'createAd.contactRule':
    'Ajoutez un telephone ou un email pour que les professionnels puissent vous contacter.',
  'createAd.images': 'Images (optionnel)',
  'createAd.imagePlaceholder': 'https://example.com/photo.jpg',
  'createAd.addImage': 'Ajouter une autre image',
  'createAd.imageTip': 'Conseil : utilisez des liens directs vers les images',
  'createAd.imageHelp':
    'Utilisez pour l instant des URL directes d images. Le televersement local pourra etre ajoute plus tard sans modifier le modele de donnees.',
  'createAd.currentLocation': 'Utiliser ma position',
  'createAd.duration': 'Duree de la demande',
  'createAd.durationLabel': 'Duree de la demande',
  'createAd.days': 'jours',
  'createAd.popular': 'Populaire',
  'createAd.year': 'Annee',
  'createAd.adIncludes': 'Ce qui est inclus',
  'createAd.freeListLegacyTitle': 'Votre demande comprend :',
  'createAd.daysVisibility': 'jours de visibilite',
  'createAd.contactDisplayed': 'coordonnees affichees',
  'createAd.upToImages': 'jusqu a 10 images',
  'createAd.premiumBadge': 'badge premium et mise en avant en haut',
  'createAd.createButton': 'Publier la demande de travaux',
  'createAd.creating': 'Publication de la demande...',
  'createAd.success': 'Demande de travaux publiee avec succes. Redirection...',
  'createAd.contactRequired':
    'Ajoutez au moins un telephone ou un email avant de publier la demande.',
  'createAd.locationDetectError': 'Impossible de detecter votre position actuelle.',
  'createAd.locationLookupError':
    'La recherche de lieu a echoue. Veuillez saisir la ville manuellement.',
  'createAd.publishError': 'Impossible de publier la demande de travaux.',
  'createAd.locationHelp':
    'Commencez a saisir une ville ou une zone pour obtenir des suggestions.',
  'createAd.visibilityRadius': 'Rayon de visibilite',
  'createAd.visibilityRadiusDesc':
    'Choisissez a quel point votre annonce sera visible',
  'createAd.radius.city': 'Ville',
  'createAd.radius.district': 'District',
  'createAd.radius.region': 'Region',
  'createAd.radius.country': 'Pays',
  'createAd.radius.state': 'Etat',
  'createAd.radius.land': 'Land (DE)',
  'createAd.radius.global': 'Tous les utilisateurs',

  // Login
  'login.title': 'Connexion des professionnels',
  'login.subtitle': 'Connectez-vous pour gerer votre profil et vos annonces',
  'login.email': 'Adresse email',
  'login.emailPlaceholder': 'you@example.com',
  'login.password': 'Mot de passe',
  'login.passwordPlaceholder': '********',
  'login.signIn': 'Se connecter',
  'login.signingIn': 'Connexion...',
  'login.noAccount': 'Vous n avez pas encore de compte ?',
  'login.registerLink': 'S inscrire comme professionnel',
  'login.lookingToPost': 'Vous voulez publier une annonce ?',
  'login.noRegistrationRequired': 'Aucune inscription requise',

  // Register
  'register.title': 'Inscription professionnel',
  'register.subtitle': 'Rejoignez Dimarket et developpez votre activite',
  'register.fullName': 'Nom complet',
  'register.fullNamePlaceholder': 'Jean Dupont',
  'register.passwordMin': 'Minimum 6 caracteres',
  'register.phonePlaceholder': '+33 6 12 34 56 78',
  'register.locationPlaceholder': 'Ville, region',
  'register.createAccount': 'Creer un compte professionnel',
  'register.creating': 'Creation du compte...',
  'register.success': 'Inscription reussie ! Redirection vers le tableau de bord...',
  'register.alreadyHave': 'Vous avez deja un compte ?',
  'register.afterRegistration': 'Apres l inscription :',
  'register.choosePlan': 'Vous choisirez une formule',
  'register.completeProfile': 'Vous completerez votre profil et portfolio',
  'register.receiveRequests': 'Vous commencerez a recevoir des demandes clients',
  'register.buildReputation': 'Vous construirez votre reputation grace aux avis',

  // Listings old keys
  'listings.title': 'Parcourir les annonces',
  'listings.searchPlaceholder': 'Rechercher des annonces...',
  'listings.filters': 'Filtres',
  'listings.allCategories': 'Toutes les categories',
  'listings.allTypes': 'Tous les types',
  'listings.clearFilters': 'Effacer les filtres',
  'listings.loading': 'Chargement des annonces...',
  'listings.noFound': 'Aucune annonce trouvee',
  'listings.createFirst': 'Creer la premiere annonce',
  'listings.category': 'Categorie',
  'listings.listingType': 'Type d annonce',
  'listings.typeServiceRequest': 'Besoin d un service',
  'listings.typeServiceOffer': 'Service propose',
  'listings.typeItemSale': 'A vendre',
  'listings.typeItemWanted': 'Recherche',
  'listings.search': 'Rechercher',

  // Listings new keys
  'listings.eyebrow': 'Demandes de travaux',
  'listings.simpleTitle': 'Travaux de construction publies par les clients',
  'listings.simpleDescription':
    'Parcourez les demandes actives des clients, filtrez par categorie ou lieu et repondez directement quand un travail correspond a vos competences.',
  'listings.whatNeedsToBeDone': 'Que faut-il faire ?',
  'listings.cityOrCountry': 'Ville ou pays',
  'listings.findRequests': 'Trouver des demandes',
  'listings.filtersButton': 'Filtres',
  'listings.categoryLabel': 'Categorie',
  'listings.allCategoriesSimple': 'Toutes les categories',
  'listings.clearFiltersSimple': 'Effacer les filtres',
  'listings.postJob': 'Publier une demande',
  'listings.countSuffix': 'demandes trouvees',
  'listings.loadingRequests': 'Chargement des demandes de travaux...',
  'listings.emptyTitle': 'Aucune demande ne correspond a ces filtres',
  'listings.emptyText':
    'Essayez un autre mot-cle, choisissez une autre categorie ou retirez le filtre de lieu.',

  // Professionals old keys
  'professionals.title': 'Trouver des professionnels',
  'professionals.subtitle':
    'Entrez en contact avec des experts verifies en construction et services a domicile',
  'professionals.searchPlaceholder': 'Rechercher par nom, lieu ou services...',
  'professionals.loading': 'Chargement des professionnels...',
  'professionals.noFound': 'Aucun professionnel trouve',
  'professionals.beFirst': 'Soyez le premier a vous inscrire comme professionnel !',
  'professionals.joinTitle': 'Etes-vous professionnel ?',
  'professionals.joinDesc':
    'Rejoignez notre plateforme et trouvez des clients qui recherchent vos services',
  'professionals.getStartedToday': 'Commencer aujourd hui',
  'professionals.sortBy': 'Trier par',
  'professionals.topRated': 'Meilleure note',
  'professionals.mostViewed': 'Les plus vus',
  'professionals.newest': 'Les plus recents',
  'professionals.minRating': 'Note minimale',
  'professionals.anyRating': 'Toute note',
  'professionals.location': 'Lieu',
  'professionals.locationPlaceholder': 'Filtrer par lieu...',
  'professionals.found': 'professionnels trouves',
  'professionals.registerAsProfessional': 'S inscrire comme professionnel',

  // Professionals new keys
  'professionals.eyebrow': 'Professionnels / Artisans',
  'professionals.simpleTitle':
    'Professionnels du batiment prets pour un contact direct',
  'professionals.simpleDescription':
    'Recherchez des artisans par ville, competence ou note et contactez-les directement apres consultation de leur profil public.',
  'professionals.nameSkillService': 'Nom, competence ou service',
  'professionals.cityOrCountry': 'Ville ou pays',
  'professionals.filtersButton': 'Filtres',
  'professionals.categoryLabel': 'Categorie',
  'professionals.allCategoriesSimple': 'Toutes les categories',
  'professionals.sortLabel': 'Tri',
  'professionals.minRatingLabel': 'Note minimale',
  'professionals.anyRatingSimple': 'Toute note',
  'professionals.sortRating': 'Note la plus elevee',
  'professionals.sortReviews': 'Le plus d avis',
  'professionals.sortNewest': 'Profils les plus recents',
  'professionals.clearFiltersSimple': 'Effacer les filtres',
  'professionals.countSuffix': 'professionnels trouves',
  'professionals.loadingSimple': 'Chargement des professionnels...',
  'professionals.postJob': 'Publier une demande',
  'professionals.emptyTitle': 'Aucun professionnel ne correspond a ces filtres',
  'professionals.emptyText':
    'Essayez un autre lieu, retirez le filtre de categorie ou baissez la note minimale.',

  // Ads
  'ads.adSpace': 'Espace publicitaire',
  'ads.advertiseHere': 'Faites la promotion de votre activite ici',
  'ads.bannerAd': 'Banniere publicitaire',
  'ads.premiumPlacement': 'Placement publicitaire premium',
  'ads.contactRates': 'Contactez-nous pour les tarifs',
  'ads.stickyAdBlock': 'Bloc publicitaire fixe',
  'ads.close': 'Fermer la publicite',

  // Common
  'common.loading': 'Chargement...',
  'common.error': 'Erreur',
  'common.success': 'Succes',

  // Visibility
  'visibility.city': 'Ville',
  'visibility.district': 'District',
  'visibility.region': 'Region',
  'visibility.country': 'Pays',
  'visibility.state': 'Etat',
  'visibility.land': 'Land (DE)',
  'visibility.global': 'Tous les utilisateurs',

  // Route placeholders
  'route.professionalProfileEyebrow': 'Profil professionnel',
  'route.professionalProfileTitle': 'La page de profil professionnel est en preparation',
  'route.professionalProfileDescription':
    'Ici, les clients pourront consulter le profil du professionnel, sa note, ses avis et ses travaux realises.',
  'route.jobRequestEyebrow': 'Demande de travaux',
  'route.jobRequestTitle': 'Les details de la demande sont en preparation',
  'route.jobRequestDescription':
    'Cette page affichera la demande complete, les pieces jointes, le budget et le contact direct pour les professionnels.',
  'route.messagesEyebrow': 'Messages',
  'route.messagesTitle': 'Les messages directs apparaitront ici',
  'route.messagesDescription':
    'Les clients et les professionnels pourront communiquer directement dans une seule conversation pour chaque demande.',
  'route.notFoundEyebrow': 'Page introuvable',
  'route.notFoundTitle': 'Cette page n existe pas encore',
  'route.notFoundDescription':
    'La route est reservee pour l evolution de la plateforme, mais aucun ecran finalise n est encore disponible ici.',

  // Favorites
  'favorites.title': 'Favoris',
  'favorites.description':
    'Enregistrez des demandes de travaux et des professionnels auxquels vous souhaitez revenir plus tard.',
  'favorites.loginTitle': 'Connectez-vous pour enregistrer vos favoris',
  'favorites.loginText':
    'Les demandes enregistrees et les professionnels enregistres ne sont disponibles que dans votre compte.',
  'favorites.loginButton': 'Aller a la connexion',
  'favorites.listingsTab': 'Demandes de travaux',
  'favorites.professionalsTab': 'Professionnels',
  'favorites.loading': 'Chargement des favoris...',
  'favorites.emptyListingsTitle': 'Aucune demande enregistree pour le moment',
  'favorites.emptyListingsText':
    'Ajoutez des demandes aux favoris pour y revenir rapidement plus tard.',
  'favorites.emptyListingsButton': 'Voir les demandes',
  'favorites.emptyProfessionalsTitle': 'Aucun professionnel enregistre pour le moment',
  'favorites.emptyProfessionalsText':
    'Enregistrez les professionnels que vous souhaitez comparer, contacter ou revoir plus tard.',
  'favorites.emptyProfessionalsButton': 'Voir les professionnels',

  // Footer stats
  'footerStats.title': 'Activite de la plateforme',
  'footerStats.subtitle':
    'Indicateurs en direct de l utilisation de Dimarket et de la demande en services de construction.',
  'footerStats.visits': 'Visites',
  'footerStats.listings': 'Demandes creees',
  'footerStats.successful': 'Demandes terminees',
  'footerStats.professionals': 'Professionnels',
  'footerStats.countries': 'Pays classes',
  'footerStats.rankingTitle': 'Classement des pays',
  'footerStats.rankingSubtitle':
    'Le score combine professionnels, demandes et activite par pays.',
  'footerStats.updatedPrefix': 'Mis a jour :',
  'footerStats.loading': 'Chargement des statistiques...',
  'footerStats.empty': 'Pas encore assez de donnees pour construire le classement des pays.',
  'footerStats.score': 'Score',
  'footerStats.prosShort': 'Pros',
  'footerStats.jobsShort': 'Travaux',
  'footerStats.repliesShort': 'Reponses',

  // Advertising
  'advertising.eyebrow': 'Publicite',
  'advertising.title': 'La publicite maintient Dimarket gratuit pour les utilisateurs',
  'advertising.description':
    'Dimarket gagne uniquement grace a la publicite. Les marques peuvent placer des campagnes pertinentes liees a la construction pendant que clients et professionnels continuent d utiliser la plateforme gratuitement.',
  'advertising.placementsTitle': 'Ou la publicite peut apparaitre',
  'advertising.placements.homeTitle': 'Page d accueil',
  'advertising.placements.homeText':
    'Blocs promotionnels chaleureux a cote de la recherche, des categories mises en avant et des nouvelles demandes.',
  'advertising.placements.listingsTitle': 'Flux des demandes',
  'advertising.placements.listingsText':
    'Placements integres entre les demandes de travaux, la ou les professionnels consultent activement les nouvelles opportunites.',
  'advertising.placements.sidebarTitle': 'Barre laterale et pied de page',
  'advertising.placements.sidebarText':
    'Visibilite permanente pour outils, materiaux, logistique et showrooms locaux.',
  'advertising.audienceTitle': 'Ideal pour les annonceurs',
  'advertising.audienceText':
    'Materiaux de construction, location d equipement, logistique, outils de chantier, magasins de renovation, services d entrepreneurs locaux et showrooms de renovation.',
  'advertising.principleTitle': 'Principe de la plateforme',
  'advertising.principleText':
    'Les clients ne paient pas pour publier des demandes. Les professionnels ne paient pas pour voir les opportunites de contact. La publicite est la seule couche de monetisation.',
  'advertising.primaryButton': 'Voir les demandes de travaux',
  'advertising.secondaryButton': 'Retour a l accueil',
}
