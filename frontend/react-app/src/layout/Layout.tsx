import React, {useContext} from 'react';
import './Layout.css';
import NavBar from "../navigation/NavBar";
import {AuthContext} from "../context/AuthContext";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const authContext = useContext(AuthContext);
    return (
        <div className="layout-container">
            <NavBar user={authContext?.user} />
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Layout;
