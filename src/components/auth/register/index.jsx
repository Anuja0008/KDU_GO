/*import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import './register.css'; // Import the CSS file

const Register = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (isRegistering) return;

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setIsRegistering(true);
        try {
            await doCreateUserWithEmailAndPassword(email, password);
            navigate('/home');
        } catch (error) {
            setErrorMessage('Failed to create account. Please try again.');
        } finally {
            setIsRegistering(false);
        }
    };

    if (userLoggedIn) {
        return <Navigate to='/home' replace />;
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2 className="register-title">
                        <span className="register-title-black">KDU_</span>
                        <span className="register-title-green">g</span>
                        <span className="register-title-orange">o</span>
                    </h2>
                    <p className="register-subtitle">Create a new account</p>
                </div>
                <form onSubmit={onSubmit} className="register-form">
                    <div>
                        <label className="register-label">Email</label>
                        <input
                            type="email"
                            autoComplete='email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="register-input"
                        />
                    </div>

                    <div>
                        <label className="register-label">Password</label>
                        <input
                            disabled={isRegistering}
                            type="password"
                            autoComplete='new-password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="register-input"
                        />
                    </div>

                    <div>
                        <label className="register-label">Confirm Password</label>
                        <input
                            disabled={isRegistering}
                            type="password"
                            autoComplete='off'
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="register-input"
                        />
                    </div>

                    {errorMessage && (
                        <div className='register-error'>{errorMessage}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isRegistering}
                        className={`register-submit-btn ${isRegistering ? 'disabled' : ''}`}
                    >
                        {isRegistering ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="register-divider">
                    <div className="register-divider-line"></div>
                    <span className="register-divider-text">OR</span>
                    <div className="register-divider-line"></div>
                </div>

                <p className="register-signup-text">
                    Already have an account? <Link to='/login' className="register-signup-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;*/
