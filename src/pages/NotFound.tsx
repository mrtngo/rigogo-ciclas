import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '10rem 0' }}>
            <h1 style={{ fontSize: '6rem', color: 'var(--color-primary)' }}>404</h1>
            <h2>¡Mijito, te perdiste en la curva!</h2>
            <p style={{ margin: '2rem 0', color: 'var(--color-text-muted)' }}>La página que buscas no existe o fue movida a otra etapa.</p>
            <Link to="/" className="btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
                <Home size={20} /> Volver al Inicio
            </Link>
        </div>
    );
};

export default NotFound;
