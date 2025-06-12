import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Categories from '../pages/Categories';

export const routes = {
  home: {
    id: 'home',
    label: 'Shop',
    path: '/',
    icon: 'Store',
    component: Home
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Grid3X3',
    component: Categories
  },
  orders: {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: 'Package',
    component: Orders
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    path: '/cart',
    icon: 'ShoppingCart',
    component: Cart
  },
  product: {
    id: 'product',
    label: 'Product',
    path: '/product/:id',
    icon: 'Package',
    component: ProductDetail,
    hidden: true
  },
  checkout: {
    id: 'checkout',
    label: 'Checkout',
    path: '/checkout',
    icon: 'CreditCard',
    component: Checkout,
    hidden: true
  },
  orderDetail: {
    id: 'orderDetail',
    label: 'Order Detail',
    path: '/order/:id',
    icon: 'Package',
    component: OrderDetail,
    hidden: true
  }
};

export const routeArray = Object.values(routes);