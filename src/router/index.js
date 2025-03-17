import { createRouter, createWebHistory } from "vue-router";
import MainHome from '../views/pages/home/MainHome.vue'
import SignIn from '../views/pages/auth/SignIn.vue'
import SignUp from '../views/pages/auth/SignUp.vue'

//customer routes
import CategoryIndex from '../views/pages/products/categories/CategoriesIndex.vue'
import CategoriesDashboard from '../views/pages/products/categories/CategoriesDashboard.vue'
import ManageCOrders from '../views/pages/products/ManageCOrders.vue'
import CustomerProfile from '../views/pages/admin/users/CustomerDashboard.vue'
import UserCSettings from '../views/pages/admin/users/UserSettings.vue'


//staff routes
import CategoriesDashboardStaff from '../views/pages/products/categories/CategoriesDashboardStaff.vue'
import ManageSOrders from '../views/pages/admin/ManageOrders.vue'
import StaffDashboard from '../views/pages/admin/staff/StaffDashboard.vue'
import UserSSettings from '../views/pages/admin/staff/UserSettings.vue'


//admin routes
import AdminIndex from '../views/pages/admin/AdminIndex.vue'
import AdminDashboard from '../views/pages/admin/AdminDashboard.vue'
import AdminStock from '../views/pages/admin/AdminStock.vue' 
import ManageOrders from '../views/pages/admin/ManageOrders.vue' 
import AdminSettings from '../views/pages/admin/AdminSettings.vue' 
import QRComponent from '../views/pages/admin/QRComponent.vue' 


const routes =[
    {
        path:'/',
        component:MainHome
    },
    {
        path:'/customer',
        component:CategoryIndex,
        children:[
            {path:'/customer',redirect:'/customer/categories-dashboard'},
            {path:'profile',component:CustomerProfile},
            {path:'categories-dashboard',component:CategoriesDashboard},
            {path:'manageorders',component:ManageCOrders},
            {path:'settings',component:UserCSettings}
        ]
    }

    ,
    {
        path:'/admin',
        component:AdminIndex,
        children:[
            {path:'/admin',redirect:'/admin/admindashboard'},
            {path:'profile',component:AdminDashboard},
            {path:'adminstock',component:AdminStock },
            {path:'manageorders',component:ManageOrders},
            {path:'settings',component:AdminSettings},
            {path:'qrcode',component:QRComponent}
        ]
    },
    {
        path:'/staff',
        component:CategoryIndex,
        children:[
            {path:'/staff',redirect:'/staff/categories-dashboard'},
            {path:'profile',component:StaffDashboard},
            {path:'categories-dashboard',component:CategoriesDashboardStaff},
            {path:'manageorders',component:ManageSOrders},
            {path:'settings',component:UserSSettings}
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


