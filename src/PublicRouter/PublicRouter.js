import SignUp from "../Pages/SignUp/SignUp";
import SignIn from "../Pages/SignIn/SignIn";
import HomePage from "../Pages/HomePage/HomePage";
import Page404 from "../Pages/Page404/Page404";
import Contact from "../Pages/Contact/Contact"
import Blog from "../Pages/Blog/Blog"
import Detail from "../Pages/Detail/Detail";
import DashboardHome from "../Component/DashboardHome/DashboardHome";
import DashboardPost from '../Component/DashboardPost/DashboardPost'
import DashboardCategory from '../Component/DashboardCategory/DashboardCategory'
import DashboardUser from '../Component/DashboardUser/DashboardUser'
import AddPost from "../Component/AddPost/AddPost";
import AddCategory from "../Component/AddCategory/AddCategory";
import UpdateCategory from "../Component/UpdateCategory/UpdateCategory";
import DashboardProfile from "../Component/DashboardProfile/DashboardProfile";
import UpdateProfile from "../Component/UpdateProfile/UpdateProfile";
import UpdatePost from "../Component/UpdatePost/UpdatePost";
import FilterCategory from "../Component/FilterCategory/FilterCategory";
import FilterAuthor from "../Component/FilterAuthor/FilterAuthor";

export const publicRouter=[
    {
        path:'/sign-up',
        component:SignUp,
        header:false
    },
    {
        path:'/sign-in',
        component:SignIn,
        header:false
    },
    {
        path:'/',
        component:HomePage
    },
    {
        path:'/blog',
        component:Blog
    },
    {
        path:'/blog/:detail',
        component:Detail
    },
    {
        path:'/contact',
        component:Contact,
    },
    {
        path:'*',
        component:Page404,
        header:false
    },
    {
        path:'/dashboard',
        component:DashboardHome
    },
    {
        path:'/dashboard-post',
        component:DashboardPost
    },
    {
        path:'/dashboard-category',
        component:DashboardCategory
    },
    {
        path:'/dashboard-user',
        component:DashboardUser
    },
    {
        path:'/dashboard-add-post',
        component:AddPost
    },
    
    {
        path:'/dashboard-add-category',
        component:AddCategory
    },
    {
        path:'/dashboard-update-category',
        component:UpdateCategory
    },
    {
        path:'/dashboard-profile',
        component:DashboardProfile
    },
    {
        path:'/dashboard-update-profile',
        component:UpdateProfile
    },
    {
        path:'/dashboard-update-post',
        component:UpdatePost
    },
    {
        path:'/category/:name',
        component:FilterCategory
    },
    {
        path:'/author/:name',
        component:FilterAuthor
    },
    
]
