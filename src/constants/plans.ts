export type ListingPlan = 'escarabajo' | 'sprinter' | 'contrarreloj';

export interface PlanConfig {
  id: ListingPlan;
  name: string;
  price: number;        // COP/month, 0 = free
  amountCents: number;  // Wompi cents
  durationDays: number;
  maxPhotos: number;
  exposure: string;
  features: string[];
}

export const LISTING_PLANS: PlanConfig[] = [
  {
    id: 'escarabajo',
    name: 'Escarabajo',
    price: 0,
    amountCents: 0,
    durationDays: 30,
    maxPhotos: 4,
    exposure: 'Baja',
    features: [
      '1 publicación activa',
      '30 días de exposición',
      'Hasta 4 fotos',
      'Exposición estándar',
    ],
  },
  {
    id: 'sprinter',
    name: 'Sprinter',
    price: 29900,
    amountCents: 2990000,
    durationDays: 60,
    maxPhotos: 8,
    exposure: 'Media',
    features: [
      'Publicaciones ilimitadas',
      '60 días de exposición',
      'Hasta 8 fotos',
      'Destacado en catálogo',
    ],
  },
  {
    id: 'contrarreloj',
    name: 'Contrarreloj',
    price: 69900,
    amountCents: 6990000,
    durationDays: 60,
    maxPhotos: 8,
    exposure: 'Alta',
    features: [
      'Publicaciones ilimitadas',
      '60 días de exposición',
      'Hasta 8 fotos',
      'Máxima exposición + Instagram',
    ],
  },
];
