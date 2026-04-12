// Simple i18n configuration
export const translations = {
  en: {
    // Common
    home: 'Home',
    menu: 'Menu',
    booking: 'Booking',
    logout: 'Logout',
    login: 'Login',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    submit: 'Submit',
    'view-details': 'View Details',
    'back': 'Back',

    // Menu
    'menu-title': 'Our Menu',
    'category': 'Category',
    'price': 'Price',
    'availability': 'Availability',
    'dietary-info': 'Dietary Information',
    'vegetarian': 'Vegetarian',
    'vegan': 'Vegan',
    'gluten-free': 'Gluten Free',
    'dairy-free': 'Dairy Free',
    'allergens': 'Allergens',
    'add-to-order': 'Add to Order',

    // Reviews
    'reviews': 'Reviews',
    'leave-review': 'Leave a Review',
    'rating': 'Rating',
    'food': 'Food',
    'service': 'Service',
    'ambiance': 'Ambiance',
    'overall': 'Overall',
    'comment': 'Comment',
    'submit-review': 'Submit Review',
    'helpful': 'Helpful',
    'unhelpful': 'Not Helpful',

    // Loyalty
    'loyalty-program': 'Loyalty Program',
    'points': 'Points',
    'tier': 'Tier',
    'total-spent': 'Total Spent',
    'total-bookings': 'Total Bookings',
    'redeem-points': 'Redeem Points',
    'birthday-bonus': 'Birthday Bonus',

    // Promotions
    'promo-code': 'Promo Code',
    'apply-promo': 'Apply Promo Code',
    'discount': 'Discount',
    'referral-program': 'Referral Program',
    'share-code': 'Share Code',

    // Events
    'events': 'Events',
    'group-booking': 'Group Booking',
    'event-type': 'Event Type',
    'number-of-guests': 'Number of Guests',
    'event-date': 'Event Date',
    'create-event': 'Create Event',

    // Orders
    'orders': 'Orders',
    'order-id': 'Order ID',
    'order-status': 'Order Status',
    'total-amount': 'Total Amount',
    'payment-status': 'Payment Status',

    // Staff
    'staff': 'Staff',
    'staff-rating': 'Staff Rating',
    'performance': 'Performance',

    // Inventory
    'low-stock': 'Low Stock',
    'restock': 'Restock',
  },
  es: {
    // Spanish translations
    home: 'Inicio',
    menu: 'Menú',
    booking: 'Reserva',
    logout: 'Cerrar Sesión',
    'menu-title': 'Nuestro Menú',
    'category': 'Categoría',
    'price': 'Precio',
    'dietary-info': 'Información Dietética',
    'vegetarian': 'Vegetariano',
    'vegan': 'Vegano',
    'gluten-free': 'Sin Gluten',
    'dairy-free': 'Sin Lácteos',
  },
  fr: {
    // French translations
    home: 'Accueil',
    menu: 'Menu',
    booking: 'Réservation',
    logout: 'Se Déconnecter',
    'menu-title': 'Notre Menu',
    'category': 'Catégorie',
    'price': 'Prix',
    'dietary-info': 'Information Diététique',
    'vegetarian': 'Végétarien',
    'vegan': 'Végan',
    'gluten-free': 'Sans Gluten',
    'dairy-free': 'Sans Produits Laitiers',
  },
};

export type LanguageCode = 'en' | 'es' | 'fr';

let currentLanguage: LanguageCode = ('en' as LanguageCode) || localStorage.getItem('language') || 'en';

export const setLanguage = (lang: LanguageCode) => {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
};

export const getLanguage = (): LanguageCode => {
  return currentLanguage;
};

export const t = (key: string): string => {
  const lang = currentLanguage;
  const translationMap = translations[lang] || translations.en;
  return (translationMap as any)[key] || key;
};

export const supportedLanguages = [
  { code: 'en' as LanguageCode, name: 'English' },
  { code: 'es' as LanguageCode, name: 'Español' },
  { code: 'fr' as LanguageCode, name: 'Français' },
];
