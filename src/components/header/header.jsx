import style from './index.module.scss'
import { Breadcrumb } from 'antd';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Space } from 'antd';
import { getAccountInfoApi } from '@/api/accountAdd';
import { serverURL } from '@/utils/request';
function Header() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [accountInfo, setAccountInfo] = useState({});
    useEffect(() => {
        async function getInfo() {
            const res = await getAccountInfoApi({id: user.id});
            setAccountInfo({...res.accountInfo});
        }
        getInfo();
    },[user.id])
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
                    items={[
                        {
                            title: 'Home',
                        },
                        {
                            title: <a href="">Application Center</a>,
                        },
                        {
                            title: <a href="">Application List</a>,
                        },
                        {
                            title: 'An Application',
                        },
                    ]}
                />
                <div className={style.headerUser}>
                    <Dropdown menu={{ items }}>
                        <a onClick={e => e.preventDefault()}>
                            <Space style={{cursor: 'pointer'}}>
                                欢迎 {accountInfo.account} 登录
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                    <img src={serverURL + accountInfo.imgUrl} alt="" />
                </div>
            </div>
        </>
    )
}

export default Header