import React, {useContext, useState} from "react";
import {register} from "../api/authApi";
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import "./Register.css";
import useOutsideClick from "../webhook/useOutsideClick";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isRegistrationInProgress, setIsRegistrationInProgress] = useState(false);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const dropdownRef = useOutsideClick(() => setIsOpen(false));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsRegistrationInProgress(!isRegistrationInProgress);
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const token = await register(username, password, firstName, lastName, address);
            authContext?.login(token);
            navigate("/");
        } catch (err) {
            setError("Registration failed");
            setIsRegistrationInProgress(false);
        }
    };

    return (
        <div className="register-container">
            <button onClick={() => setIsOpen(!isOpen)} className="register-button">
                Register
            </button>

            {isOpen && (
                <div className="register-dropdown" ref={dropdownRef}>
                    <h2>Register</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="register-input"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="register-input"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="register-input"
                        />
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="register-input"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="register-input"
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="register-input"
                        />
                        <button type="submit" className="register-submit" disabled={isRegistrationInProgress}>
                            {isRegistrationInProgress ? "Registration in progress.." : "Register"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Register;
