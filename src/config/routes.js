import HomePage from '@/components/pages/HomePage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import CartPage from '@/components/pages/CartPage';
import CheckoutPage from '@/components/pages/CheckoutPage';
import OrdersPage from '@/components/pages/OrdersPage';
import OrderDetailPage from '@/components/pages/OrderDetailPage';
import CategoriesPage from '@/components/pages/CategoriesPage';
import UserProfilePage from '@/components/pages/UserProfilePage';

export const routes = {
  home: {
    id: 'home',
    label: 'Shop',
    path: '/',
    icon: 'Store',
component: HomePage
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Grid3X3',
component: CategoriesPage
  },
orders: {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: 'Package',
    component: OrdersPage
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: UserProfilePage
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    path: '/cart',
    icon: 'ShoppingCart',
    component: CartPage
  },
  product: {
    id: 'product',
    label: 'Product',
    path: '/product/:id',
    icon: 'Package',
component: ProductDetailPage,
    hidden: true
  },
  checkout: {
    id: 'checkout',
    label: 'Checkout',
    path: '/checkout',
    icon: 'CreditCard',
component: CheckoutPage,
    hidden: true
  },
  orderDetail: {
    id: 'orderDetail',
    label: 'Order Detail',
    path: '/order/:id',
    icon: 'Package',
component: OrderDetailPage,
    hidden: true
  }
};

export const routeArray = Object.values(routes);