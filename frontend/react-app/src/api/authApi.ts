import api from "./api"

export const login = async (username: string, password: string): Promise<string> => {
    try {
        const response = await api.post("/auth/login", { username, password });

        if (response.status !== 200) {
            throw new Error("Invalid credentials");
        }

        const token = response.data;
        const expiration = new Date().getTime() + 30 * 60 * 1000;
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", expiration.toString());
        return token;
    } catch (error) {
        console.error("Login error:", error);
        throw new Error("Login failed. Please check your credentials.");
    }
};

export const register = async (
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    address: string
): Promise<string> => {
    try {
        const response = await api.post("/auth/register", {
            username,
            password,
            firstName,
            lastName,
            address,
        });

        if (response.status !== 200) {
            throw new Error("Registration failed");
        }

        const token = response.data;
        const expiration = new Date().getTime() + 30 * 60 * 1000;
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", expiration.toString());
        return token;
    } catch (error) {
        console.error("Registration error:", error);
        throw new Error("Registration failed. Please try again.");
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    window.location.href = "/";
};
