import type { Product } from '../types/product';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        brand: 'Specialized',
        model: 'Tarmac SL7',
        year: 2023,
        price: 18500000,
        size: '54',
        condition: 'Como nuevo',
        category: 'Ruta',
        images: ['https://images.unsplash.com/photo-1532298229144-0ee051198296?auto=format&fit=crop&q=80&w=800'],
        description: 'Bicicleta de alta gama, poco uso. Mantenimiento al día.',
        specs: {
            frame: 'Carbono FACT 12r',
            groupset: 'Shimano Ultegra Di2',
            wheels: 'Roval Rapide CLX',
            weight: '7.2kg'
        },
        seller: {
            name: 'Mijito Juan',
            location: 'Medellín, Antioquia',
            rating: 4.8
        }
    },
    {
        id: '2',
        brand: 'Trek',
        model: 'Madone SLR 9',
        year: 2022,
        price: 22000000,
        size: '56',
        condition: 'Excelente',
        category: 'Ruta',
        images: ['https://images.unsplash.com/photo-1571068316341-75042c1ef002?auto=format&fit=crop&q=80&w=800'],
        description: 'Impecable Madone con pintura Project One.',
        specs: {
            frame: 'OCLV 800 Carbon',
            groupset: 'SRAM Red eTap AXS',
            wheels: 'Bontrager Aeolus RSL 51',
            weight: '7.5kg'
        },
        seller: {
            name: 'Ciclo Tienda',
            location: 'Bogotá, DC',
            rating: 4.9
        }
    },
    {
        id: '3',
        brand: 'Giant',
        model: 'Trance X Advanced',
        year: 2023,
        price: 12500000,
        size: 'M',
        condition: 'Nuevo',
        category: 'MTB',
        images: ['https://images.unsplash.com/photo-1576433248835-646f5bb93b47?auto=format&fit=crop&q=80&w=800'],
        description: 'Lista para el trail. Suspensión Fox Factory.',
        specs: {
            frame: 'Advanced-Grade Composite',
            groupset: 'Shimano XT',
            wheels: 'Giant TRX 2 Carbon',
            weight: '13.8kg'
        },
        seller: {
            name: 'Bike Shop Cali',
            location: 'Cali, Valle',
            rating: 4.7
        }
    }
];
