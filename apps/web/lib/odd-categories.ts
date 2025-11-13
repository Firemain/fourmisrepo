/**
 * ODD Categories Mapping
 * Maps ODD numbers to their general categories with official colors
 */

export type ODDCategory = 'ENVIRONMENT' | 'SOCIAL' | 'EDUCATION' | 'HEALTH' | 'CULTURE' | 'SPORT';

export interface ODDCategoryInfo {
  category: ODDCategory;
  color: string;
  nameEn: string;
  nameFr: string;
}

/**
 * Mapping des numéros d'ODD (1-17) vers leurs catégories
 * Basé sur les 17 Objectifs de Développement Durable de l'ONU
 */
export const oddToCategory: Record<number, ODDCategoryInfo> = {
  1: {
    category: 'SOCIAL',
    color: '#E5243B', // Pas de pauvreté
    nameEn: 'Social',
    nameFr: 'Social'
  },
  2: {
    category: 'SOCIAL',
    color: '#DDA63A', // Faim zéro
    nameEn: 'Social',
    nameFr: 'Social'
  },
  3: {
    category: 'HEALTH',
    color: '#4C9F38', // Bonne santé et bien-être
    nameEn: 'Health',
    nameFr: 'Santé'
  },
  4: {
    category: 'EDUCATION',
    color: '#C5192D', // Éducation de qualité
    nameEn: 'Education',
    nameFr: 'Éducation'
  },
  5: {
    category: 'SOCIAL',
    color: '#FF3A21', // Égalité entre les sexes
    nameEn: 'Social',
    nameFr: 'Social'
  },
  6: {
    category: 'ENVIRONMENT',
    color: '#26BDE2', // Eau propre et assainissement
    nameEn: 'Environment',
    nameFr: 'Environnement'
  },
  7: {
    category: 'ENVIRONMENT',
    color: '#FCC30B', // Énergie propre et d'un coût abordable
    nameEn: 'Environment',
    nameFr: 'Environnement'
  },
  8: {
    category: 'SOCIAL',
    color: '#A21942', // Travail décent et croissance économique
    nameEn: 'Social',
    nameFr: 'Social'
  },
  9: {
    category: 'SOCIAL',
    color: '#FD6925', // Industrie, innovation et infrastructure
    nameEn: 'Social',
    nameFr: 'Social'
  },
  10: {
    category: 'SOCIAL',
    color: '#DD1367', // Inégalités réduites
    nameEn: 'Social',
    nameFr: 'Social'
  },
  11: {
    category: 'SOCIAL',
    color: '#FD9D24', // Villes et communautés durables
    nameEn: 'Social',
    nameFr: 'Social'
  },
  12: {
    category: 'ENVIRONMENT',
    color: '#BF8B2E', // Consommation et production responsables
    nameEn: 'Environment',
    nameFr: 'Environnement'
  },
  13: {
    category: 'ENVIRONMENT',
    color: '#3F7E44', // Mesures relatives à la lutte contre les changements climatiques
    nameEn: 'Environment',
    nameFr: 'Environnement'
  },
  14: {
    category: 'ENVIRONMENT',
    color: '#0A97D9', // Vie aquatique
    nameEn: 'Environment',
    nameFr: 'Environnement'
  },
  15: {
    category: 'ENVIRONMENT',
    color: '#56C02B', // Vie terrestre
    nameEn: 'Environment',
    nameFr: 'Environnement'
  },
  16: {
    category: 'SOCIAL',
    color: '#00689D', // Paix, justice et institutions efficaces
    nameEn: 'Social',
    nameFr: 'Social'
  },
  17: {
    category: 'SOCIAL',
    color: '#19486A', // Partenariats pour la réalisation des objectifs
    nameEn: 'Social',
    nameFr: 'Social'
  }
};

/**
 * Récupère la catégorie d'un ODD par son numéro
 */
export function getODDCategory(oddNumber: number): ODDCategoryInfo | null {
  return oddToCategory[oddNumber] || null;
}

/**
 * Récupère la catégorie principale d'une mission basée sur ses ODDs
 * Retourne la catégorie du premier ODD, ou null si aucun ODD
 */
export function getMissionCategory(oddNumbers: number[]): ODDCategoryInfo | null {
  if (!oddNumbers || oddNumbers.length === 0) return null;
  return getODDCategory(oddNumbers[0]);
}

/**
 * Couleurs par défaut pour chaque catégorie (si pas de couleur ODD spécifique)
 */
export const categoryDefaultColors: Record<ODDCategory, string> = {
  ENVIRONMENT: '#56C02B', // Vert
  SOCIAL: '#DD1367', // Rose/Rouge
  EDUCATION: '#C5192D', // Rouge
  HEALTH: '#4C9F38', // Vert santé
  CULTURE: '#FD6925', // Orange
  SPORT: '#0A97D9' // Bleu
};

/**
 * Traductions des noms de catégories
 */
export const categoryTranslations = {
  ENVIRONMENT: { fr: 'Environnement', en: 'Environment' },
  SOCIAL: { fr: 'Social', en: 'Social' },
  EDUCATION: { fr: 'Éducation', en: 'Education' },
  HEALTH: { fr: 'Santé', en: 'Health' },
  CULTURE: { fr: 'Culture', en: 'Culture' },
  SPORT: { fr: 'Sport', en: 'Sport' }
};
