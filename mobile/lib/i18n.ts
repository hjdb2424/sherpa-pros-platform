// ---------------------------------------------------------------------------
// Lightweight i18n – EN / ES / PT
// ---------------------------------------------------------------------------

export type Language = 'en' | 'es' | 'pt';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.map': 'Map',
    'nav.jobs': 'Jobs',
    'nav.earnings': 'Earnings',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.emergency': 'Emergency',

    // Common
    'common.search': 'Search',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.submit': 'Submit',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.done': 'Done',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try Again',
    'common.signOut': 'Sign Out',
    'common.switchRole': 'Switch Role',

    // Auth
    'auth.signIn': 'Sign In',
    'auth.welcome': 'Welcome to',
    'auth.tagline': 'On-demand construction services',
    'auth.testAccounts': 'Test Accounts',
    'auth.continueApple': 'Continue with Apple',
    'auth.continueGoogle': 'Continue with Google',

    // Client
    'client.postJob': 'Post a Job',
    'client.findPros': 'Find Pros',
    'client.myJobs': 'My Jobs',
    'client.searchPro': 'Search for a pro or service...',
    'client.prosNearby': '{count} Pros Nearby',
    'client.noJobs': 'No projects yet',
    'client.approveMaterials': 'Approve Materials',
    'client.bidsReceived': '{count} bids received',
    'client.acceptBid': 'Accept Bid',
    'client.bidAccepted': 'Bid accepted! {name} will be notified.',

    // Pro
    'pro.browseJobs': 'Browse Jobs',
    'pro.placeBid': 'Place Bid',
    'pro.quickBid': 'Quick Bid',
    'pro.sendQuote': 'Send Quote',
    'pro.searchJobs': 'Search for jobs near you...',
    'pro.jobsAvailable': '{count} Jobs Available',
    'pro.yourBid': 'Your Bid',
    'pro.commission': 'Commission',
    'pro.youEarn': 'You Earn',
    'pro.bidSubmitted': 'Bid submitted!',
    'pro.bidSubmittedMessage': 'The client will be notified.',
    'pro.marketRate': 'Market rate: ${min} - ${max}',
    'pro.clientBudget': 'Client budget: ${min} - ${max}',
    'pro.estimatedDuration': 'Estimated Duration',
    'pro.includesMaterials': 'My bid includes materials cost',
    'pro.messageToClient': 'Message to Client',
    'pro.submitBid': 'Submit Bid',
    'pro.bidWarningHigh': 'Your bid is more than 30% above market range',
    'pro.bidWarningLow': 'Your bid is more than 30% below market range',

    // Emergency
    'emergency.title': 'Emergency',
    'emergency.findingPros': 'Finding nearby pros...',
    'emergency.proEnRoute': 'Pro is en route',
    'emergency.minAway': 'min away',

    // Reviews
    'reviews.writeReview': 'Write a Review',
    'reviews.rating': 'Rating',
    'reviews.wouldHireAgain': 'Would you hire again?',

    // Profile
    'profile.editProfile': 'Edit Profile',
    'profile.portfolio': 'Portfolio',
    'profile.reviews': 'Reviews',
    'profile.settings': 'Settings',
    'profile.memberSince': 'Member since {date}',
    'profile.language': 'Language',
  },
  es: {
    'nav.map': 'Mapa',
    'nav.jobs': 'Trabajos',
    'nav.earnings': 'Ganancias',
    'nav.messages': 'Mensajes',
    'nav.profile': 'Perfil',
    'nav.emergency': 'Emergencia',

    'common.search': 'Buscar',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.submit': 'Enviar',
    'common.close': 'Cerrar',
    'common.back': 'Atras',
    'common.next': 'Siguiente',
    'common.done': 'Listo',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.loading': 'Cargando...',
    'common.error': 'Algo salio mal',
    'common.retry': 'Reintentar',
    'common.signOut': 'Cerrar Sesion',
    'common.switchRole': 'Cambiar Rol',

    'auth.signIn': 'Iniciar Sesion',
    'auth.welcome': 'Bienvenido a',
    'auth.tagline': 'Servicios de construccion a demanda',
    'auth.testAccounts': 'Cuentas de Prueba',
    'auth.continueApple': 'Continuar con Apple',
    'auth.continueGoogle': 'Continuar con Google',

    'client.postJob': 'Publicar Trabajo',
    'client.findPros': 'Buscar Profesionales',
    'client.myJobs': 'Mis Trabajos',
    'client.searchPro': 'Buscar un profesional o servicio...',
    'client.prosNearby': '{count} Profesionales Cerca',
    'client.noJobs': 'Sin proyectos aun',
    'client.approveMaterials': 'Aprobar Materiales',
    'client.bidsReceived': '{count} ofertas recibidas',
    'client.acceptBid': 'Aceptar Oferta',
    'client.bidAccepted': 'Oferta aceptada! {name} sera notificado.',

    'pro.browseJobs': 'Ver Trabajos',
    'pro.placeBid': 'Hacer Oferta',
    'pro.quickBid': 'Oferta Rapida',
    'pro.sendQuote': 'Enviar Presupuesto',
    'pro.searchJobs': 'Buscar trabajos cerca de ti...',
    'pro.jobsAvailable': '{count} Trabajos Disponibles',
    'pro.yourBid': 'Tu Oferta',
    'pro.commission': 'Comision',
    'pro.youEarn': 'Tu Ganas',
    'pro.bidSubmitted': 'Oferta enviada!',
    'pro.bidSubmittedMessage': 'El cliente sera notificado.',
    'pro.marketRate': 'Precio de mercado: ${min} - ${max}',
    'pro.clientBudget': 'Presupuesto del cliente: ${min} - ${max}',
    'pro.estimatedDuration': 'Duracion Estimada',
    'pro.includesMaterials': 'Mi oferta incluye costo de materiales',
    'pro.messageToClient': 'Mensaje al Cliente',
    'pro.submitBid': 'Enviar Oferta',
    'pro.bidWarningHigh': 'Tu oferta es mas de 30% sobre el rango de mercado',
    'pro.bidWarningLow': 'Tu oferta es mas de 30% bajo el rango de mercado',

    'emergency.title': 'Emergencia',
    'emergency.findingPros': 'Buscando profesionales cercanos...',
    'emergency.proEnRoute': 'Profesional en camino',
    'emergency.minAway': 'min',

    'reviews.writeReview': 'Escribir Resena',
    'reviews.rating': 'Calificacion',
    'reviews.wouldHireAgain': 'Lo contratarias de nuevo?',

    'profile.editProfile': 'Editar Perfil',
    'profile.portfolio': 'Portafolio',
    'profile.reviews': 'Resenas',
    'profile.settings': 'Configuracion',
    'profile.memberSince': 'Miembro desde {date}',
    'profile.language': 'Idioma',
  },
  pt: {
    'nav.map': 'Mapa',
    'nav.jobs': 'Trabalhos',
    'nav.earnings': 'Ganhos',
    'nav.messages': 'Mensagens',
    'nav.profile': 'Perfil',
    'nav.emergency': 'Emergencia',

    'common.search': 'Buscar',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.submit': 'Enviar',
    'common.close': 'Fechar',
    'common.back': 'Voltar',
    'common.next': 'Proximo',
    'common.done': 'Feito',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.loading': 'Carregando...',
    'common.error': 'Algo deu errado',
    'common.retry': 'Tentar Novamente',
    'common.signOut': 'Sair',
    'common.switchRole': 'Trocar Funcao',

    'auth.signIn': 'Entrar',
    'auth.welcome': 'Bem-vindo ao',
    'auth.tagline': 'Servicos de construcao sob demanda',
    'auth.testAccounts': 'Contas de Teste',
    'auth.continueApple': 'Continuar com Apple',
    'auth.continueGoogle': 'Continuar com Google',

    'client.postJob': 'Publicar Trabalho',
    'client.findPros': 'Encontrar Profissionais',
    'client.myJobs': 'Meus Trabalhos',
    'client.searchPro': 'Buscar um profissional ou servico...',
    'client.prosNearby': '{count} Profissionais Proximos',
    'client.noJobs': 'Sem projetos ainda',
    'client.approveMaterials': 'Aprovar Materiais',
    'client.bidsReceived': '{count} propostas recebidas',
    'client.acceptBid': 'Aceitar Proposta',
    'client.bidAccepted': 'Proposta aceita! {name} sera notificado.',

    'pro.browseJobs': 'Ver Trabalhos',
    'pro.placeBid': 'Fazer Proposta',
    'pro.quickBid': 'Proposta Rapida',
    'pro.sendQuote': 'Enviar Orcamento',
    'pro.searchJobs': 'Buscar trabalhos perto de voce...',
    'pro.jobsAvailable': '{count} Trabalhos Disponiveis',
    'pro.yourBid': 'Sua Proposta',
    'pro.commission': 'Comissao',
    'pro.youEarn': 'Voce Ganha',
    'pro.bidSubmitted': 'Proposta enviada!',
    'pro.bidSubmittedMessage': 'O cliente sera notificado.',
    'pro.marketRate': 'Preco de mercado: ${min} - ${max}',
    'pro.clientBudget': 'Orcamento do cliente: ${min} - ${max}',
    'pro.estimatedDuration': 'Duracao Estimada',
    'pro.includesMaterials': 'Minha proposta inclui custo de materiais',
    'pro.messageToClient': 'Mensagem ao Cliente',
    'pro.submitBid': 'Enviar Proposta',
    'pro.bidWarningHigh': 'Sua proposta e mais de 30% acima da faixa de mercado',
    'pro.bidWarningLow': 'Sua proposta e mais de 30% abaixo da faixa de mercado',

    'emergency.title': 'Emergencia',
    'emergency.findingPros': 'Buscando profissionais proximos...',
    'emergency.proEnRoute': 'Profissional a caminho',
    'emergency.minAway': 'min',

    'reviews.writeReview': 'Escrever Avaliacao',
    'reviews.rating': 'Avaliacao',
    'reviews.wouldHireAgain': 'Contrataria novamente?',

    'profile.editProfile': 'Editar Perfil',
    'profile.portfolio': 'Portfolio',
    'profile.reviews': 'Avaliacoes',
    'profile.settings': 'Configuracoes',
    'profile.memberSince': 'Membro desde {date}',
    'profile.language': 'Idioma',
  },
};

let currentLanguage: Language = 'en';

// Event listeners for language changes
type LanguageListener = (lang: Language) => void;
const listeners: Set<LanguageListener> = new Set();

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  listeners.forEach((fn) => fn(lang));
}

export function onLanguageChange(fn: LanguageListener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function t(key: string, params?: Record<string, string | number>): string {
  let text = translations[currentLanguage]?.[key] ?? translations.en[key] ?? key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function getAvailableLanguages(): { code: Language; name: string; nativeName: string }[] {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Espanol' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Portugues' },
  ];
}
