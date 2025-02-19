import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ProtectedRoute from "../navigation/ProtectedRoute";
import AdminDashboard from "../dashboard/AdminDashboard";
import CustomerDashboard from "../dashboard/CustomerDashboard";
import Orders from "../order/Orders";
import Sales from "../sales/Sales";
import Unauthorized from "../pages/Unauthorized";
import Home from "../pages/Home"
import Cart from "../pizza/Cart";
import Layout from "../layout/Layout";


function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/unauthorized" element={<Unauthorized/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/orders" element=<Orders/>/>

                    <Route element={<ProtectedRoute allowedRole={"ADMIN"}/>}>
                        <Route path="/admin" element={<AdminDashboard/>}/>
                        <Route path="/admin/sales" element=<Sales/>/>
                    </Route>

                    <Route element={<ProtectedRoute allowedRole={"CUSTOMER"}/>}>
                        <Route path="/customer" element={<CustomerDashboard/>}/>
                    </Route>

                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
