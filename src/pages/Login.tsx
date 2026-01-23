import React from 'react';
import './Login.css';

const Login: React.FC = () => {
    return (
        <div className="login-page container animate-fade-in">
            <div className="login-card">
                <h2>Bienvenido Mijito</h2>
                <p>Ingresa a tu cuenta de GO RIGO GO!</p>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="mijito@rigo.com" />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password" placeholder="••••••••" />
                    </div>
                    <button className="btn-primary" style={{ width: '100%' }}>Entrar</button>
                </form>
                <div className="login-footer">
                    <p>¿No tienes cuenta? <a href="#">Regístrate</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
