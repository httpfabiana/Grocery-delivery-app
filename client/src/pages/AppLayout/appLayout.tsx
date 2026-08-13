import { Outlet } from "react-router-dom";
import Banner from "../../components/Banner/Banner";
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CartSidebar from "../../components/CartSidebar/CartSidebar";

const AppLayout = () => {
  return(
    <>
     <Banner/>
     <NavBar/>
     <main className="min-h-screen">
       <Outlet/>
     </main>
     <Footer/>
     <CartSidebar/>
    </>
  )
}

export default AppLayout;