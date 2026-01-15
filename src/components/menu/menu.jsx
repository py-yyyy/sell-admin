import React, { useState,useEffect } from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation, useMatches } from 'react-router-dom';
import logo from '@/assets/sell-logo.png'
const items = [
    {
        key: '/home',
        icon: <i className="iconfont icon-shouye1" />,
        label: '首页',
    },
    {
        key: '/account',
        icon: <i className="iconfont icon-zhanghao" />,
        label: '账号管理',
        children: [
            { key: '/account/list', label: '账号列表' },
            { key: '/account/add', label: '添加账号' },
            { key: '/account/center', label: '个人中心' },
            { key: '/account/edit', label: '修改密码' },
        ],
    },
    {
        key: '/goods',
        icon: <i className="iconfont icon-shangpin2" />,
        label: '商品管理',
        children: [
            { key: '/goods/list', label: '商品列表' },
            { key: '/goods/add', label: '添加商品' },
            { key: '/goods/types', label: '商品类型' },
        ],
    },
    {
        key: '/order',
        icon: <i className="iconfont icon-dingdan" />,
        label: '订单管理',
    },
    {
        key: '/shop',
        icon: <i className="iconfont icon-jinrudianpu" />,
        label: '店铺管理',
    },
    {
        key: '/statistics',
        icon: <i className="iconfont icon-shuju1" />,
        label: '统计数据',
        children: [
            { key: '/statistics/goods', label: '商品统计' },
            { key: '/statistics/order', label: '订单统计' },
        ],
    },
];
const getLevelKeys = items1 => {
    const key = {};
    const func = (items2, level = 1) => {
        items2.forEach(item => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};
const levelKeys = getLevelKeys(items);
function MenuComponent() {
    const navigate = useNavigate();
    //获取当前路由匹配到的 所有层级路由信息
    const location = useLocation();
    //获取当前路由的完整信息（路径、参数、状态等）
    const matches = useMatches();
    //获取当前路由匹配信息[当前路由，子路由]
    const currentPath = [matches[0].pathname, location.pathname];
    const [stateOpenKeys, setStateOpenKeys] = useState(currentPath);
    // 当路由改变时，更新打开项，保持当前层级打开
    useEffect(() => {
        function setOpenKeys() {
            if (location.pathname) {
                setStateOpenKeys([matches[0].pathname, location.pathname]);
            }
        }
        setOpenKeys();
    }, [location.pathname, matches]);


    const onOpenChange = openKeys => {
        const currentOpenKey = openKeys.find(key => !stateOpenKeys.includes(key));
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter(key => key !== currentOpenKey)
                .findIndex(key => levelKeys[key] === levelKeys[currentOpenKey]);
            setStateOpenKeys(
                openKeys
                    // 移除重复键
                    .filter((_, index) => index !== repeatIndex)
                    // 移除当前层级所有子项
                    .filter(key => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };
    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#001529', height: '60px' }}>
                <img src={logo} alt="" style={{ width: '40px', height: '40px', margin: '0 10px' }} />
                <p style={{ color: '#a6adb4' }}>外卖管理系统</p>
            </div>
            {/* 使用 selectedKeys 替代 defaultSelectedKeys ,当路由改变时，自动更新选中项*/}
            {/* 使用 defaultSelectedKeys存在当在header中跳转到个人中心时无法更新选中项的问题*/}
            <Menu
                onClick={({ key }) => {
                    navigate(key);
                }}
                theme='dark'
                mode="inline"
                selectedKeys={currentPath}
                openKeys={stateOpenKeys}
                onOpenChange={onOpenChange}
                style={{ width: 200, height: 'calc(100% - 60px)' }}
                items={items}
            />
        </>
    );
}
export default MenuComponent;
