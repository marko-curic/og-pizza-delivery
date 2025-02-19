import { createContext, ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../model/user";
import { findUserByUsername } from "../api/userApi";
import Loader from "../loader/Loader";

interface AuthContextType {
    user: User | undefined;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

const TOKEN_EXPIRATION_MILLIS = 8 * 60 * 60 * 1000

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchUser = async () => {
            if (token && !isTokenExpired()) {
                try {
                    const decoded: any = jwtDecode(token);
                    const fetchedUser = await findUserByUsername(decoded.sub);
                    if(fetchedUser) {
                        setUser(fetchedUser);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                    logout();
                    window.location.href = "/";
                }
            } else {
                logout();
                window.location.href = "/";
            }
        };

        if(token) {
            fetchUser();
        } else {
            setUser(undefined);
            setLoading(false);
        }
    }, []);

    const login = async (token: any) => {
        const expiration = new Date().getTime() + TOKEN_EXPIRATION_MILLIS;
        localStorage.setItem("token", token.token);
        localStorage.setItem("tokenExpiration", expiration.toString());

        try {
            const decoded: any = jwtDecode(token.token);
            const loggedInUser = await findUserByUsername(decoded.sub);
            setUser(loggedInUser);
        } catch (error) {
            console.error("Token decoding failed:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        setUser(undefined);
    };

    const isTokenExpired = () => {
        const expiration: any = localStorage.getItem("tokenExpiration");
        return expiration && parseInt(expiration.expiration) < new Date().getTime();
    };

    if (loading) {
        return <Loader/>
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
