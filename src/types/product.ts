import type { Timestamp } from 'firebase/firestore';

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

export interface Listing {
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
        uid: string;
        name: string;
        location: string;
        rating: number;
    };
    status: 'pending' | 'active' | 'sold';
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export function listingToProduct(listing: Listing): Product {
    return {
        id: listing.id,
        brand: listing.brand,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        size: listing.size,
        condition: listing.condition,
        category: listing.category,
        images: listing.images,
        description: listing.description,
        specs: listing.specs,
        seller: {
            name: listing.seller.name,
            location: listing.seller.location,
            rating: listing.seller.rating,
        },
    };
}
