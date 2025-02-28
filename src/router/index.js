import { createRouter, createWebHistory } from "vue-router";
import MainHome from '../views/pages/home/MainHome.vue'
import SignIn from '../views/pages/auth/SignIn.vue'
import SignUp from '../views/pages/auth/SignUp.vue'
import CategoryIndex from '../views/pages/products/categories/CategoriesIndex.vue'
import CategoriesDashboard from '../views/pages/products/categories/CategoriesDashboard.vue'


//admin routes
import AdminIndex from '../views/pages/admin/AdminIndex.vue'
import AdminDashboard from '../views/pages/admin/AdminDashboard.vue'
import AdminStock from '../views/pages/admin/AdminStock.vue' 
import ManageOrders from '../views/pages/admin/ManageOrders.vue' 


const routes =[
    {
        path:'/',
        component:MainHome
    },
    // {
    //     path:"/products",
    //     component:CategoryIndex,
    //     children:[
    //         {path:'/products',redirect:'/categories/categories-dashboard'},
    //         {path:'categories-dashboard',component:CategoriesDashboard}
    //     ]
    // },

    {
        path:'/customer',
        component:CategoryIndex,
        children:[
            {path:'/customer',redirect:'/customer/categories-dashboard'},
            {path:'categories-dashboard',component:CategoriesDashboard}
        ]
    }

    ,
    {
        path:'/admin',
        component:AdminIndex,
        children:[
            {path:'/admin',redirect:'/admin/admindashboard'},
            {path:'admindashboard',component:AdminDashboard},
            {path:'adminstock',component:AdminStock },
            {path:'manageorders',component:ManageOrders}
        ]
    },
    {
        path:'/signin',
        component:SignIn
    },
    {
        path:'/signup',
        component:SignUp
    }
]


export const router = createRouter({
    history:createWebHistory(),
    linkActiveClass:"active",
    routes
})

router.beforeEach((to, from, next) => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  
    // Continue with the navigation
    next();
  });


