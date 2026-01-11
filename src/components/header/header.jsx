import style from './index.module.scss'
import { Breadcrumb } from 'antd';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Space } from 'antd';
import { getAccountInfoApi } from '@/api/accountAdd';
import { serverURL } from '@/utils/request';
import { useMatches } from 'react-router-dom';
import routes from '@/router';
function Header() {
    const matches = useMatches();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [accountInfo, setAccountInfo] = useState({});
    const [breadNav, setBreadNav] = useState([]);
    const navigateTo = (path) => {
        if(path === matches[0].pathname) return;
        navigate(path);
    }
    useEffect(() => {
        async function getInfo() {
            const res = await getAccountInfoApi({ id: user.id });
            setAccountInfo({ ...res.accountInfo });
        }
        getInfo();
    }, [user.id])
    useEffect(() => {
        function getNav() {
            const navList = routes.routes.flatMap(route => route.children || []);
            const nav = [];
            matches.forEach(item => {
                const navItem = navList.find(nav => nav.data.path === item.pathname);
                if (navItem) {
                    nav.push({ title: <span onClick={() => navigateTo(navItem.data.path)}>{navItem.data.page}</span>});
                    if (navItem.data?.fatherPage) {
                        nav.unshift({ title: <span onClick={() => navigateTo(navItem.data.fatherPagePath)}>{navItem.data.fatherPage}</span>});
                    }
                }
            })
            setBreadNav(nav);
            console.log(breadNav);
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
                <Breadcrumb
                    items={[{ title: <span onClick={() => navigateTo('/home')}>首页</span>, goPath: '/home' }, ...breadNav]}
                    style={{ cursor: 'pointer' }}
                />
                <div className={style.headerUser}>
                    <Dropdown menu={{ items }}>
                        <a onClick={e => e.preventDefault()}>
                            <Space style={{ cursor: 'pointer' }}>
                                欢迎 <span style={{ color: '#4495F6', fontWeight: 'bold' }}>{accountInfo.account}</span> 登录
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                    <div className={style.headerUserImg}>
                        <img src={serverURL + accountInfo.imgUrl} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header