import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "./NavBar.css";
import {ShoppingCart} from "lucide-react";
import {User} from "../model/user";
import Register from "../registration/Register";
import Login from "../login/Login";
import Notifications from "../notification/Notifications";
import {logout} from "../api/authApi";

interface NavbarProps {
    user: User | undefined;
}

function NavBar({user}: NavbarProps) {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const cartItems: { quantity: number }[] = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
    }, []);

    return (
        <nav className="navbar">
            <div className="nav-container-left">
                {user?.role === "ADMIN" ? (
                    <>
                        <Link to="/admin/sales" className="nav-item">Sales</Link>
                    </>
                ) : (
                    <Link to="/customer" className="nav-item">Menu</Link>
                )}
                <Link to="/orders" className="nav-item">{user?.role === "ADMIN" ? "Orders" : "My Orders"}</Link>
            </div>

            <div className="nav-container-right">
                {user && (
                    <div className="nav-icons">
                        <Notifications/>
                        {user?.role === "CUSTOMER" && (
                            <Link to="/cart" className="nav-item icon-container">
                                <ShoppingCart size={20}/>
                                {cartCount > 0 && <span className="badge">{cartCount}</span>}
                            </Link>
                        )}
                    </div>
                )}

                {!user ? (
                    <div className="navbar-auth-content">
                        <Register/>
                        <Login/>
                    </div>
                ) : (
                    <div className="navbar-auth-content">
                        <Link to="/" className="nav-item" onClick={logout}>Log Out</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
