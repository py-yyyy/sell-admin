import style from './index.module.scss'
import { Breadcrumb } from 'antd';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Space } from 'antd';
import { getAccountInfoApi } from '@/api/home';
import { serverURL } from '@/utils/request';
import { useMatches } from 'react-router-dom';
import routes from '@/router';
import { setUserInfo } from "@/store/modules/userStore";
import { useDispatch ,useSelector} from "react-redux";
function Header() {
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user.user);
    //获取当前路由匹配信息
    const matches = useMatches();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'))||{};
    // const [accountInfo, setAccountInfo] = useState({});
    const [breadNav, setBreadNav] = useState([]);
    const navigateTo = (path) => {
        //如果点击的是当前路由，不跳转
        if(path === matches[0].pathname) return;
        navigate(path);
    }
    useEffect(() => {
        //获取当前用户信息
        async function getInfo() {
            const res = await getAccountInfoApi({ id: user.id });
            // setAccountInfo({ ...res.accountInfo });
            //将用户信息存储到store中
            dispatch(setUserInfo({ ...res.accountInfo }));
        }
        getInfo();
    }, [user.id])
    useEffect(() => {
        //获取当前路由匹配的面包屑导航
        function getNav() {
            //获取所有路由配置中子路由
            const navList = routes.routes.flatMap(route => route.children || []);
            //存储面包屑导航
            const nav = [];
            //遍历当前路由匹配信息，获取面包屑导航
            matches.forEach(item => {
                //如果找到当前路由匹配的子路由，添加到面包屑导航
                const navItem = navList.find(nav => nav.data.path === item.pathname);
                if (navItem) {
                    //末尾添加子路由
                    nav.push({ title: <span onClick={() => navigateTo(navItem.data.path)}>{navItem.data.page}</span>});
                    //如果子路由有父路由，添加到面包屑导航
                    if (navItem.data?.fatherPage) {
                        nav.unshift({ title: <span onClick={() => navigateTo(navItem.data.fatherPagePath)}>{navItem.data.fatherPage}</span>});
                    }
                }
            })
            setBreadNav(nav);
        }
        getNav();
    }, [matches])
    const items = [
        {
            key: '1',
            label: (
                <p onClick={() => {
                    navigate('/account/center');
                }}>个人中心</p>
            ),
        },
        {
            key: '2',
            label: (
                <p onClick={() => {
                    navigate('/login');
                    localStorage.removeItem('user');
                }}>退出登录</p>
            ),
        }
    ];
    return (
        <>
            <div className={style.header}>
                {/* 默认添加首页 */}
                <Breadcrumb
                    items={[{ title: <span onClick={() => navigateTo('/home')}>首页</span>, goPath: '/home' }, ...breadNav]}
                    style={{ cursor: 'pointer' }}
                />
                <div className={style.headerUser}>
                    <Dropdown menu={{ items }}>
                        <a onClick={e => e.preventDefault()}>
                            <Space style={{ cursor: 'pointer' }}>
                                欢迎 <span style={{ color: '#4495F6', fontWeight: 'bold' }}>{userInfo?.account}</span> 登录
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                    <div className={style.headerUserImg}>
                        <img src={serverURL + userInfo?.imgUrl} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header