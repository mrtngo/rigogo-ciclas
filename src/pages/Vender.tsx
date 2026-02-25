import React, { useRef, useState } from 'react';
import { Camera, Tag, CheckCircle, ChevronRight, ChevronLeft, Upload, Bike, Check } from 'lucide-react';
import './Vender.css';
import { Link, useLocation } from 'react-router-dom';
import { doc, collection, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { db, storage, functions } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { LISTING_PLANS } from '../constants/plans';
import type { ListingPlan } from '../constants/plans';
import { useUserListings } from '../hooks/useUserListings';

interface FormData {
    brand: string;
    model: string;
    year: string;
    category: string;
    size: string;
    condition: string;
    description: string;
    price: string;
}

const Vender: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const locationPlan = (location.state as { plan?: ListingPlan } | null)?.plan;
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<ListingPlan>(locationPlan ?? 'escarabajo');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { activeCount } = useUserListings();

    const [formData, setFormData] = useState<FormData>({
        brand: '',
        model: '',
        year: '',
        category: 'Ruta',
        size: 'M',
        condition: 'Como nuevo',
        description: '',
        price: '',
    });

    const setField = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

    const handleNext = () => setStep(s => Math.min(s + 1, 6));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(Array.from(e.target.files));
        }
    };

    const uploadImages = async (listingId: string, maxPhotos: number): Promise<string[]> => {
        const urls: string[] = [];
        for (const file of imageFiles.slice(0, maxPhotos)) {
            try {
                const storageRef = ref(storage, `listings/${listingId}/${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                urls.push(url);
            } catch {
                // Storage not configured or failed — skip
            }
        }
        return urls;
    };

    const buildDoc = (uid: string, imageUrls: string[], plan: ListingPlan, status: string) => ({
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year) || new Date().getFullYear(),
        price: parseInt(formData.price) || 0,
        size: formData.size,
        condition: formData.condition,
        category: formData.category,
        images: imageUrls,
        description: formData.description,
        specs: { frame: '', groupset: '', wheels: '' },
        seller: {
            uid,
            name: user?.displayName ?? user?.email ?? 'Vendedor',
            location: 'Colombia',
            rating: 0,
        },
        plan,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    const handleSubmitFree = async () => {
        if (!user) return;
        setSubmitting(true);
        setSubmitError('');
        try {
            const listingRef = doc(collection(db, 'listings'));
            const imageUrls = await uploadImages(listingRef.id, 4);
            await setDoc(listingRef, buildDoc(user.uid, imageUrls, 'escarabajo', 'active'));
            setStep(6);
        } catch {
            setSubmitError('Ocurrió un error al publicar. Intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitPaid = async () => {
        if (!user) return;
        setSubmitting(true);
        setSubmitError('');
        try {
            const listingRef = doc(collection(db, 'listings'));
            const imageUrls = await uploadImages(listingRef.id, 8);
            await setDoc(listingRef, buildDoc(user.uid, imageUrls, selectedPlan, 'draft'));

            const createCheckout = httpsCallable<
                { listingId: string; plan: string },
                { checkoutUrl: string; reference: string }
            >(functions, 'createWompiCheckout');

            const result = await createCheckout({ listingId: listingRef.id, plan: selectedPlan });
            const { checkoutUrl, reference } = result.data;

            sessionStorage.setItem('wompiReference', reference);
            window.location.href = checkoutUrl;
        } catch {
            setSubmitError('Error al iniciar el pago. Intenta de nuevo.');
            setSubmitting(false);
        }
    };

    const handlePlanSubmit = () => {
        if (selectedPlan === 'escarabajo') {
            handleSubmitFree();
        } else {
            handleSubmitPaid();
        }
    };

    const isPaywalled = selectedPlan === 'escarabajo' && activeCount >= 1;

    // ── Landing ──
    if (step === 0) {
        return (
            <div className="vender-page animate-fade-in">
                <section className="vender-hero">
                    <div className="container">
                        <h1>Vende tu bici en <span className="highlight">minutos</span></h1>
                        <p>Llega a miles de ciclistas apasionados. Es rápido, seguro y fácil.</p>
                        <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => setStep(1)}>
                            Empezar a Vender
                        </button>
                    </div>
                </section>

                <section className="container vender-steps">
                    <div className="step-card">
                        <div className="step-icon"><Bike size={32} /></div>
                        <h3>1. Datos Básicos</h3>
                        <p>Dinos la marca, modelo y año de tu máquina.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon"><Camera size={32} /></div>
                        <h3>2. Sube fotos</h3>
                        <p>Toma fotos reales donde se aprecie bien el estado y los componentes.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon"><Tag size={32} /></div>
                        <h3>3. Pon un precio</h3>
                        <p>Elige cuánto quieres recibir. Nosotros hacemos el resto.</p>
                    </div>
                </section>
            </div>
        );
    }

    // ── Success ──
    if (step === 6) {
        return (
            <div className="vender-page container action-container animate-fade-in">
                <div className="success-wrapper">
                    <CheckCircle size={64} className="success-icon" />
                    <h2>¡Publicación Exitosa!</h2>
                    <p>Tu bicicleta ya está publicada y visible en el catálogo.</p>
                    <Link to="/marketplace" className="btn-primary">Ver Catálogo</Link>
                </div>
            </div>
        );
    }

    // ── Form (steps 1–5) ──
    return (
        <div className="vender-page container form-container animate-fade-in">
            <div className="form-header">
                <button className="btn-back" onClick={handleBack}>
                    <ChevronLeft size={20} /> Atrás
                </button>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>
                <span>Paso {step} de 5</span>
            </div>

            <div className="form-content">
                {step === 1 && (
                    <div className="form-step animate-slide-in">
                        <h2>Empecemos con lo básico</h2>
                        <p className="text-muted">Cuéntanos sobre tu bicicleta.</p>

                        <div className="form-group">
                            <label>Marca</label>
                            <select className="form-input" value={formData.brand} onChange={setField('brand')}>
                                <option value="">Selecciona una marca</option>
                                <option value="Specialized">Specialized</option>
                                <option value="Trek">Trek</option>
                                <option value="Giant">Giant</option>
                                <option value="Pinarello">Pinarello</option>
                                <option value="Otra">Otra</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Modelo</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej. Tarmac SL7"
                                value={formData.model}
                                onChange={setField('model')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Año</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Ej. 2022"
                                value={formData.year}
                                onChange={setField('year')}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-step animate-slide-in">
                        <h2>Detalles y Estado</h2>
                        <p className="text-muted">Información clave para los compradores.</p>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Categoría</label>
                                <select className="form-input" value={formData.category} onChange={setField('category')}>
                                    <option value="Ruta">Ruta</option>
                                    <option value="MTB">MTB</option>
                                    <option value="Gravel">Gravel</option>
                                    <option value="Urbana">Urbana</option>
                                    <option value="E-Bike">E-Bike</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Talla</label>
                                <select className="form-input" value={formData.size} onChange={setField('size')}>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Estado General</label>
                            <select className="form-input" value={formData.condition} onChange={setField('condition')}>
                                <option value="Nuevo">Nuevo</option>
                                <option value="Como nuevo">Como nuevo</option>
                                <option value="Excelente">Excelente</option>
                                <option value="Buen estado">Buen estado</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                className="form-input"
                                placeholder="Cuéntanos más sobre tu bici: mantenimiento, accesorios incluidos, historial..."
                                rows={4}
                                value={formData.description}
                                onChange={setField('description')}
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-step animate-slide-in">
                        <h2>Sube las mejores fotos</h2>
                        <p className="text-muted">Las fotos de buena calidad venden más rápido. Podrás subir hasta 8 con planes de pago.</p>

                        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                            <Upload size={48} className="upload-icon" />
                            {imageFiles.length > 0 ? (
                                <>
                                    <h3>{imageFiles.length} foto{imageFiles.length !== 1 ? 's' : ''} seleccionada{imageFiles.length !== 1 ? 's' : ''}</h3>
                                    <p>{imageFiles.map(f => f.name).join(', ')}</p>
                                </>
                            ) : (
                                <>
                                    <h3>Arrastra y suelta tus fotos aquí</h3>
                                    <p>o</p>
                                </>
                            )}
                            <button
                                className="btn-secondary"
                                type="button"
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            >
                                Seleccionar Archivos
                            </button>
                            <span className="upload-hint">Formatos soportados: JPG, PNG. Máx 5MB por foto.</span>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>
                )}

                {step === 4 && (
                    <div className="form-step animate-slide-in">
                        <h2>Define el precio</h2>
                        <p className="text-muted">¿Cuánto esperas recibir por ella?</p>

                        <div className="form-group">
                            <label>Precio de Venta (COP)</label>
                            <div className="price-input-wrapper">
                                <span className="currency">$</span>
                                <input
                                    type="number"
                                    className="form-input price-input"
                                    placeholder="0"
                                    value={formData.price}
                                    onChange={setField('price')}
                                />
                            </div>
                        </div>

                        <div className="summary-box">
                            <p>Ten en cuenta que RIGOMARKET cobra una pequeña comisión por la transacción segura y logística técnica.</p>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="form-step animate-slide-in">
                        <h2>Elige tu plan</h2>
                        <p className="text-muted">Selecciona cómo quieres publicar tu bicicleta.</p>

                        <div className="plan-grid">
                            {LISTING_PLANS.map(plan => (
                                <div
                                    key={plan.id}
                                    className={`plan-card${selectedPlan === plan.id ? ' plan-card--selected' : ''}`}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    role="radio"
                                    aria-checked={selectedPlan === plan.id}
                                >
                                    <p className="plan-card-name">{plan.name}</p>
                                    <p className="plan-card-price">
                                        {plan.price === 0
                                            ? 'Gratis'
                                            : `$${plan.price.toLocaleString('es-CO')}`}
                                        {plan.price > 0 && <span>/mes</span>}
                                    </p>
                                    <ul className="plan-card-features">
                                        {plan.features.map(f => (
                                            <li key={f}>
                                                <Check size={13} className="plan-check" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {isPaywalled && (
                            <p className="paywall-note">
                                Ya tienes {activeCount} publicación{activeCount !== 1 ? 'es' : ''} activa{activeCount !== 1 ? 's' : ''} en el plan gratuito.{' '}
                                <Link to="/precios">Actualiza tu plan</Link> para publicar más.
                            </p>
                        )}

                        {submitError && (
                            <p className="submit-error">{submitError}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="form-actions">
                {step < 5 ? (
                    <button className="btn-primary" onClick={handleNext}>
                        Siguiente Paso <ChevronRight size={20} />
                    </button>
                ) : (
                    <button
                        className="btn-primary"
                        onClick={handlePlanSubmit}
                        disabled={submitting || isPaywalled}
                    >
                        {submitting
                            ? (selectedPlan === 'escarabajo' ? 'Publicando...' : 'Iniciando pago...')
                            : (selectedPlan === 'escarabajo' ? 'Publicar gratis' : 'Continuar con pago')
                        }
                        {!submitting && <ChevronRight size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Vender;
