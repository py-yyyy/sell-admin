import { Outlet } from 'react-router-dom'
import style from './index.module.scss'
import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import Menu from '@/components/menu/menu'
import Header from '@/components/header/header'
function Layout() {
  return (
    <>
      <div className={style.layout}>
        <div className={style.menuBox}>
          <Menu />
        </div>
        <div className={style.container}>
          <div className={style.header}>
            <Header />
          </div>
          <div className={style.content}>
              <Outlet className={style.menu} />
          </div>
        </div>
      </div>
    </>
  );
}
export default Layout;
