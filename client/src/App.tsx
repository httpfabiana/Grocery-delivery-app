import {Toaster} from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/login';
import AppLayout from './pages/AppLayout/appLayout';
import Home from './pages/Home/home';
import Product from './pages/Products.tsx/product';
import ProductPage from './pages/ProductPage/ProductPage';
import SearchResults from './pages/Search/Search';
import FlashDeals from './pages/FlashDeals/FlashDeal';
import Checkout from './pages/Checkout/checkout';
import MyOrders from './pages/MyOrders/MyOrders';
import OrderTracking from './pages/OrderTracking/OrderTracking';
import Addresses from './pages/Address/Address';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminDeliveryPartners from './pages/admin/AdminDeliveryPartners';
import DeliveryLogin from './pages/delivery/DeliveryLogin';
import DeliveryLayout from './pages/delivery/DeliveryLayout';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

const App = () => {
  return(
    <>
     <Toaster position='top-right' toastOptions={{duration: 3000, style: {
      background: "#1b3022", color: "#fff", borderRadius: "12px", fontSize: "14px"
     }}}/>

     <Routes>
       {}
      <Route path='/login' element={<Login/>}/>

      <Route path='/' element={<AppLayout/>}>
       <Route index element={<Home/>}/>
       <Route path='products' element={<Product/>}/>
       <Route path='products/:id' element={<ProductPage/>}/>
       <Route path='search' element={<SearchResults/>}/>
       <Route path='deals' element={<FlashDeals/>}/>

       <Route element={<ProtectedRoute/>}>
        <Route path='checkout' element={<Checkout/>}/>
        <Route path='orders' element={<MyOrders/>}/>
        <Route path='orders/:id' element={<OrderTracking/>}/>
        <Route path='addresses' element={<Addresses/>}/>
       </Route>
      </Route>

      <Route path='/admin' element={<AdminLayout/>}>
       <Route index element={<AdminDashboard/>}/>
       <Route path='products' element={<AdminProducts/>}/>
       <Route path='products/new' element={<AdminProductForm/>}/>
       <Route path='products/:id/edit' element={<AdminProductForm/>}/>
       <Route path='orders' element={<AdminOrders/>}/>
       <Route path='delivery-partners' element={<AdminDeliveryPartners/>}/>
      </Route>

      <Route path='/delivery/login' element={<DeliveryLogin/>}/>
      <Route path='/delivery' element={<DeliveryLayout/>}/>
      <Route index element={<DeliveryDashboard/>}/>
     </Routes>
    </>
  )
}

export default App;