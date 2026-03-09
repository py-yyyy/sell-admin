import { createBrowserRouter, Navigate } from "react-router-dom";
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
const GoodsEdit = lazy(() => import("@/pages/goods/edit"));
const GoodsTypes = lazy(() => import("@/pages/goods/types"));
const Order = lazy(() => import("@/pages/order"));
const Shop = lazy(() => import("@/pages/shop"));
const GoodsStatistics = lazy(() => import("@/pages/statistics/goods"));
const OrderStatistics = lazy(() => import("@/pages/statistics/order"));

const routes = createBrowserRouter([
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
        data: {
            page: '首页',
            path: '/home',
        },
        children: [
            {
                index: true,
                element: <Home />,
                data: {
                    page: '首页',
                    path: '/home',
                },
            },
        ]
    },
    {
        //path属性可以自定义值
        path: "/account",
        //访问path就去layout，再去访问子路由
        element: <Layout />,
        data: {
            page: '账号管理',
            path: '/account',
        },
        children: [
            {
                path:"",
                element:<Navigate to='/account/list' />,
                data: {
                    page: '账号列表',
                    path: '/account/list',
                    fatherPage: '账号管理',
                    fatherPagePath: '/account',
                },
            },
            {
                //访问/account就去AccountList
                // index: true,
                path: "/account/list",
                element: <AccountList />,
                data: {
                    page: '账号列表',
                    path: '/account/list',
                    fatherPage: '账号管理',
                    fatherPagePath: '/account',
                },
            },
            {
                path: "/account/add",
                element: <AccountAdd />,
                data: {
                    page: '添加账号',
                    path: '/account/add',
                    fatherPage: '账号管理',
                    fatherPagePath: '/account',
                },
            },
            {
                path: "/account/center",
                element: <AccountCenter />,
                data: {
                    page: '个人中心',
                    path: '/account/center',
                    fatherPage: '账号管理',
                    fatherPagePath: '/account',
                },
            },
            {
                path: "/account/edit",
                element: <AccountEdit />,
                data: {
                    page: '修改密码',
                    path: '/account/edit',
                    fatherPage: '账号管理',
                    fatherPagePath: '/account',
                },
            },
        ]
    },
    {
        path: "/goods",
        element: <Layout />,
        data: {
            page: '商品管理',
            path: '/goods',
        },
        children: [
            {
                // index: true,
                path:"",
                element:<Navigate to='/goods/list' />,
                data: {
                    page: '商品列表',
                    path: '/goods/list',
                    fatherPage: '商品管理',
                    fatherPagePath: '/goods',
                },
            },
            {
                path: "/goods/list",
                element: <GoodsList />,
                data: {
                    page: '商品列表',
                    path: '/goods/list',
                    fatherPage: '商品管理',
                    fatherPagePath: '/goods',
                },
            },
            {
                path: "/goods/edit",
                element: <GoodsEdit />,
                data: {
                    page: '编辑商品',
                    path: '/goods/edit',
                    fatherPage: '商品管理',
                    fatherPagePath: '/goods',
                },
            },
            {
                path: "/goods/add",
                element: <GoodsAdd />,
                data: {
                    page: '添加商品',
                    path: '/goods/add',
                    fatherPage: '商品管理',
                    fatherPagePath: '/goods',
                },
            },
            {
                path: "/goods/types",
                element: <GoodsTypes />,
                data: {
                    page: '商品类型',
                    path: '/goods/types',
                    fatherPage: '商品管理',
                    fatherPagePath: '/goods',
                },
            },
        ]
    },
    {
        path: "/order",
        element: <Layout />,
        data: {
            page: '订单管理',
            path: '/order',
        },
        children: [
            {
                index: true,
                element: <Order />,
                data: {
                    page: '订单列表',
                    path: '/order',
                },
            },
        ]
    },
    {
        path: "/shop",
        element: <Layout />,
        data: {
            page: '店铺管理',
            path: '/shop',
        },
        children: [
            {
                index: true,
                element: <Shop />,
                data: {
                    page: '店铺列表',
                    path:'/shop'
                },
            },
        ]
    },
    {
        path: "/statistics",
        element: <Layout />,
        data: {
            page: '统计分析',
            path:'/statistics',
        },
        children: [
            {
                path:"",
                element:<Navigate to='/statistics/goods' />,
                data: {
                    page: '商品统计',
                    path:'/statistics/goods',
                    fatherPage: '统计分析',
                    fatherPagePath: '/statistics',
                },
            },
            {
                path: "/statistics/goods",
                element: <GoodsStatistics />,
                data: {
                    page: '商品统计',
                    path:'/statistics/goods',
                    fatherPage: '统计分析',
                    fatherPagePath: '/statistics',
                },
            },
            {
                path: "/statistics/order",
                element: <OrderStatistics />,
                data: {
                    page: '订单统计',
                    path:'/statistics/order',
                    fatherPage: '统计分析',
                    fatherPagePath: '/statistics',
                },
            },
        ]
    }
],{
    basename: import.meta.env.BASE_URL || '/',
});

export default routes;