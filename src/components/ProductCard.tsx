import React from 'react';
import type { Product } from '../types/product';
import { MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();

    const formattedPrice = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(product.price);

    return (
        <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="product-image">
                <img src={product.images[0]} alt={product.model} />
                <span className="product-category">{product.category}</span>
                <span className="product-condition">{product.condition}</span>
            </div>
            <div className="product-info">
                <div className="product-header">
                    <h3>{product.brand} {product.model}</h3>
                    <span className="product-year">{product.year}</span>
                </div>
                <div className="product-specs">
                    <span>Talla: <strong>{product.size}</strong></span>
                    <span>Grupo: <strong>{product.specs.groupset.split(' ')[0]}</strong></span>
                </div>
                <div className="product-price">{formattedPrice}</div>
                <div className="product-footer">
                    <div className="product-location">
                        <MapPin size={14} />
                        <span>{product.seller.location.split(',')[0]}</span>
                    </div>
                    <div className="product-rating">
                        <Star size={14} fill="currentColor" />
                        <span>{product.seller.rating}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
