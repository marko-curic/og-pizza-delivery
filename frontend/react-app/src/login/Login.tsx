import React, {useContext, useState} from "react";
import {login} from "../api/authApi";
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import "./Login.css";
import useOutsideClick from "../webhook/useOutsideClick";

type FormData = {
    username: string;
    password: string;
};

const Login = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginInProgress, setIsLoginInProgress] = useState(false);

    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormData>();
    const dropdownRef = useOutsideClick(() => setIsOpen(false));

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            setIsLoginInProgress(!isLoginInProgress);
            const token = await login(data.username, data.password);
            authContext?.login(token);
            reset();
            toggleForm();
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    const toggleForm = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="login-container">
            <button onClick={toggleForm} className="login-button">
                Login
            </button>

            {isOpen && (
                <div className="login-dropdown" ref={dropdownRef}>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        <div>
                            <input
                                type="text"
                                placeholder="Username"
                                {...register("username", {required: "Username is required"})}
                                className="login-input"
                            />
                            {errors.username && <p className="error-message">{errors.username.message}</p>}
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("password", {required: "Password is required"})}
                                className="login-input"
                            />
                            {errors.password && <p className="error-message">{errors.password.message}</p>}
                        </div>
                        <button type="submit" className="login-submit" disabled={isLoginInProgress}>
                            {isLoginInProgress ? "Login in.." : "Login"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Login;
