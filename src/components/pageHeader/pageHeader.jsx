import React from 'react';
import style from './index.module.scss';
function PageHeader(props) {
  return (
    <>
        <div className={style.pageHeader}>
          <p>
            <i className={`iconfont ${props.icon}`} style={{ marginRight: 10 }}></i>
            {props.title}
          </p>
          <div className={style.child}>
            {props.children}
          </div>
        </div>
    </>
  );
}
export default PageHeader;