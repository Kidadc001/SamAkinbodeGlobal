import { createRouter, createWebHistory } from 'vue-router'
import landing from '../views/landing.vue'

// Check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('user');
}

// Check if user is admin
function isAdmin() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.email === "otulajafavour@gmail.com" && user.role === "admin";
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: landing,
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/userdashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('../views/books.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/cart.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    // Optional: catch-all route to redirect unknown paths
    { path: '/:pathMatch(.*)*', redirect: '/auth' }
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  // Only allow access to /admin if admin is logged in
  if (to.meta.requiresAdmin) {
    if (!isLoggedIn() || !isAdmin()) {
      return next({ name: 'auth' });
    }
    return next();
  }
  // Only allow access to user routes if logged in
  if (to.meta.requiresAuth) {
    if (!isLoggedIn()) {
      return next({ name: 'auth' });
    }
    return next();
  }
  // Allow access to public routes
  return next();
});

export default router