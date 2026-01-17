import PageHeader from '@/components/pageHeader/pageHeader';
import style from './center.module.scss';
import { getAccountCenterApi, uploadAvatarApi,updateAvatarApi } from '@/api/accountCenter';
import { useEffect, useState } from 'react';
import { timeFormat } from '@/utils/date';
import { serverURL } from '@/utils/request';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
function AccountCenter() {
  //获取个人中心信息
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    async function getAccountCenter() {
      const id = JSON.parse(localStorage.getItem('user')).id;
      const res = await getAccountCenterApi({ id });
      setUserInfo(res.accountInfo);
    }
    getAccountCenter();
  }, [])
  //上传头像
    const updateAvatar = async (imgUrl) => {
    const res = await updateAvatarApi({ id: userInfo.id, imgUrl });
    if(res.code === 0){
      message.success(res.msg);
      setUserInfo({ ...userInfo, imgUrl: imgUrl });
    } else {
      message.error(res.msg);
    }
  }
  const [loading, setLoading] = useState(false);
  const customUpload = async (option) => {
    const { file } = option;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', userInfo.id);
    const res = await uploadAvatarApi(formData);
    if(res.code === 0){
      // setUserInfo({ ...userInfo, imgUrl: res.imgUrl });
      await updateAvatar(res.imgUrl);
    } else {
      message.error(res.msg);
    }
    setLoading(false);
  }
  const uploadButton = (
    <button style={{ border: 0, background: 'none', width: '100%' }} type="button">
      <div style={{ marginTop: 8, width: '100%' }}>
        {loading ? <LoadingOutlined /> : <PlusOutlined style={{ fontSize: 24, color: '#333' }} />}
      </div>
    </button>
  );
  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG格式的图片！');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB！');
      return false;
    }
    return isJpgOrPng && isLt2M;
  };
  return (
    <>
      <div className={style.AccountCenter}>
        <PageHeader icon="icon-zhanghao" title="个人中心">
        </PageHeader>
        <div className={style.centerContent}>
          <div className={style.avatarBox}>
            <Upload
              beforeUpload={beforeUpload}
              customRequest={customUpload}
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              style={{ width: '200px', height: '200px', marginRight: 50 }}
            >
              {userInfo.imgUrl ? (
                <img draggable={false} src={serverURL + userInfo.imgUrl} alt="avatar" style={{ width: '100%' ,borderRadius: 10}} />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
          <div>
            <p>管理员ID：{userInfo.id}</p>
            <p>账号：{userInfo.account}</p>
            <p>用户组：{userInfo.userGroup}</p>
            <p>创建时间：{timeFormat(userInfo.ctime)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
export default AccountCenter;