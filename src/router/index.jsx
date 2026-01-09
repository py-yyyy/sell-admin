import { createBrowserRouter  } from "react-router-dom";
import Login from "@/pages/login";
import Layout from "@/pages/layout";
import Home from "@/pages/home";
import Account from "@/pages/account";
import AccountAdd from "@/pages/account/add";
import AccountList from "@/pages/account/list";
import AccountCenter from "@/pages/account/center";
import AccountEdit from "@/pages/account/edit";
import Goods from "@/pages/goods";
import GoodsAdd from "@/pages/goods/add";
import GoodsList from "@/pages/goods/list";
import GoodsTypes from "@/pages/goods/types";
import Order from "@/pages/order";
import Shop from "@/pages/shop";
import Statistics from "@/pages/statistics";
import GoodsStatistics from "@/pages/statistics/goods";
import OrderStatistics from "@/pages/statistics/order";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/layout",
    element: <Layout />,
    children:[
        {
            index:true,
            element:<Home/>
        },
        {
            path:"account",
            element:<Account/>,
            children:[
                {
                    index:true,
                    element:<AccountList/>
                },
                {
                    path:"add",
                    element:<AccountAdd/>
                },
                {
                    path:"center",
                    element:<AccountCenter/>
                },
                {
                    path:"edit",
                    element:<AccountEdit/>
                }
            ]
        },
        {
            path:"goods",
            element:<Goods/>,
            children:[
                {
                    index:true,
                    element:<GoodsList/>
                },
                {
                    path:"add",
                    element:<GoodsAdd/>
                },
                {
                    path:"types",
                    element:<GoodsTypes/>
                }
            ]
        },
        {
            path:"order",
            element:<Order/>
        },
        {
            path:"shop",
            element:<Shop/>
        },
        {
            path:"statistics",
            element:<Statistics/>,
            children:[
                {
                    index:true,
                    element:<GoodsStatistics/>
                },
                {
                    path:"order",
                    element:<OrderStatistics/>
                }
            ]
        }
    ]
  }
]);

export default router;