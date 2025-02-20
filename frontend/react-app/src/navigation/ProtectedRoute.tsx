import {Navigate, Outlet} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

const ProtectedRoute = ({ allowedRole }: { allowedRole?: string }) => {
    const authContext = useContext(AuthContext);

    if (!authContext?.user) {
        return <Navigate to="/" />;
    }

    if (allowedRole && authContext.user.role !== allowedRole) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
