export type BikeCondition = 'Nuevo' | 'Como nuevo' | 'Excelente' | 'Buen estado' | 'Para restaurar';

export interface Product {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    size: string;
    condition: BikeCondition;
    category: 'Ruta' | 'MTB' | 'Urbana' | 'Gravel' | 'E-Bike' | 'Accesorio' | 'Componente';
    images: string[];
    description: string;
    specs: {
        frame: string;
        groupset: string;
        wheels: string;
        weight?: string;
    };
    seller: {
        name: string;
        location: string;
        rating: number;
    };
}
