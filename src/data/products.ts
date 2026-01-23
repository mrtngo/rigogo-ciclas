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
            wheels: 'Roval Rapide CLX'
        },
        seller: { name: 'Mijito Juan', location: 'Medellín', rating: 4.8 }
    },
    {
        id: '4',
        brand: 'POC',
        model: 'Ventral Air MIPS',
        year: 2024,
        price: 1200000,
        size: 'M',
        condition: 'Nuevo',
        category: 'Accesorio',
        images: ['https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=800'],
        description: 'Casco de alto rendimiento con ventilación extrema.',
        specs: { frame: 'EPS', groupset: 'MIPS', wheels: 'N/A' },
        seller: { name: 'Go Rigo Go Official', location: 'Bogotá', rating: 5.0 }
    },
    {
        id: '5',
        brand: 'Garmin',
        model: 'Edge 1040 Solar',
        year: 2023,
        price: 3500000,
        size: 'Unica',
        condition: 'Nuevo',
        category: 'Accesorio',
        images: ['https://images.unsplash.com/photo-1510250672151-5a022b79a02d?auto=format&fit=crop&q=80&w=800'],
        description: 'Ciclocomputador con carga solar para rutas interminables.',
        specs: { frame: 'Touchscreen', groupset: 'GPS', wheels: 'N/A' },
        seller: { name: 'Go Rigo Go Official', location: 'Medellín', rating: 5.0 }
    },
    {
        id: '6',
        brand: 'Oakley',
        model: 'Sutro Lite Sweep',
        year: 2024,
        price: 850000,
        size: 'Unica',
        condition: 'Nuevo',
        category: 'Accesorio',
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800'],
        description: 'Gafas de sol con tecnología Prizm para máxima claridad.',
        specs: { frame: 'O Matter', groupset: 'Prizm Road', wheels: 'N/A' },
        seller: { name: 'Mijito Juan', location: 'Cali', rating: 4.8 }
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
        specs: { frame: 'Carbon', groupset: 'Shimano XT', wheels: 'Giant TRX 2' },
        seller: { name: 'Bike Shop Cali', location: 'Cali', rating: 4.7 }
    }
];
