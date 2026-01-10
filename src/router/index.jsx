import { createHashRouter, Navigate } from "react-router-dom";
import { lazy } from 'react'
const Login = lazy(() => import("@/pages/login"));
const Layout = lazy(() => import("@/pages/layout"));
const Home = lazy(() => import("@/pages/home"));
const AccountAdd = lazy(() => import("@/pages/account/add"));
const AccountList = lazy(() => import("@/pages/account/list"));
const AccountCenter = lazy(() => import("@/pages/account/center"));
const AccountEdit = lazy(() => import("@/pages/account/edit"));
const GoodsAdd = lazy(() => import("@/pages/goods/add"));
const GoodsList = lazy(() => import("@/pages/goods/list"));
const GoodsTypes = lazy(() => import("@/pages/goods/types"));
const Order = lazy(() => import("@/pages/order"));
const Shop = lazy(() => import("@/pages/shop"));
const GoodsStatistics = lazy(() => import("@/pages/statistics/goods"));
const OrderStatistics = lazy(() => import("@/pages/statistics/order"));


const routes = createHashRouter([
    {
        path: "/",
        //一级路由，默认跳转到登录页，重定向
        element: <Navigate to='/login' />,
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: "/home",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            ]
    },
    {
        //path属性可以自定义值
        path: "/account",
        //访问path就去layout，再去访问子路由
        element: <Layout />,
        children: [
            {
                path:"",
                element:<Navigate to='/account/list' />,
            },
            {
                //访问/account就去AccountList
                // index: true,
                path: "/account/list",
                element: <AccountList />
            },
            {
                path: "/account/add",
                element: <AccountAdd />
            },
            {
                path: "/account/center",
                element: <AccountCenter />
            },
            {
                path: "/account/edit",
                element: <AccountEdit />
            },
        ]
    },
    {
        path: "/goods",
        element: <Layout />,
        children: [
            {
                // index: true,
                path:"",
                element:<Navigate to='/goods/list' />,
            },
            {
                path: "/goods/list",
                element: <GoodsList />
            },
            {
                path: "/goods/add",
                element: <GoodsAdd />
            },
            {
                path: "/goods/types",
                element: <GoodsTypes />
            },
        ]
    },
    {
        path: "/order",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Order />
            },
        ]
    },
    {
        path: "/shop",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Shop />
            },
        ]
    },
    {
        path: "/statistics",
        element: <Layout />,
        children: [
            {
                path:"",
                element:<Navigate to='/statistics/goods' />,
            },
            {
                path: "/statistics/goods",
                element: <GoodsStatistics />
            },
            {
                path: "/statistics/order",
                element: <OrderStatistics />
            },
        ]
    }
]);

export default routes;