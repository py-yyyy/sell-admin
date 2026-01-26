import { Outlet } from 'react-router-dom'
import style from './index.module.scss'
import React from 'react';
import Menu from '@/components/menu/menu'
import Header from '@/components/header/header'
import { useEffect } from 'react';
import { checkToken } from '@/utils/token';
import { useNavigate } from 'react-router-dom';
function Layout() {
  const navigate = useNavigate();
  useEffect(() => {
    async function checkTokenValidity() {
      const isValid = await checkToken();
      if (!isValid) {
        navigate('/login', { replace: true });
      }
    }
    checkTokenValidity();
  }, [navigate]);
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
