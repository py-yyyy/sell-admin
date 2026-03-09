import PageHeader from '@/components/pageHeader/pageHeader';
import style from './center.module.scss';
import { getAccountCenterApi, uploadAvatarApi,updateAvatarApi } from '@/api/accountCenter';
import { useEffect, useState } from 'react';
import { timeFormat } from '@/utils/date';
import { serverURL } from '@/utils/request';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { useDispatch } from 'react-redux';
import { setUserAvatar } from '@/store/modules/userStore';
function AccountCenter() {
  const dispatch = useDispatch();
  //获取个人中心信息
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    async function getAccountCenter() {
      const id = JSON.parse(localStorage.getItem('user')).id;
      const res = await getAccountCenterApi({ id });
      setUserInfo(res.accountInfo);

    }
    getAccountCenter();
  },[setUserInfo])
  // 上传头像
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
  // 自定义上传函数
  const customUpload = async (option) => {
    //option：上传文件的选项
    //解构file
    const { file } = option;
    setLoading(true);
    // 创建formData对象
    const formData = new FormData();
    formData.append('file', file);
    //这里向服务器上传头像时传入id，服务器会根据id更新用户头像，不用手动调用修改头像的接口
    const res = await uploadAvatarApi({formData,id:userInfo.id});
    if(res.code === 0){
      message.success(res.msg);
      setUserInfo({ ...userInfo, imgUrl: res.imgUrl });
      // await updateAvatar(res.imgUrl);
      // 头像上传成功后，更新Redux状态,同步header头像
      dispatch(setUserAvatar(res.imgUrl));
    } else {
      message.error(res.msg);
    }
    setLoading(false);
  }
  // 上传按钮
  const uploadButton = (
    <button style={{ border: 0, background: 'none', width: '100%' }} type="button">
      <div style={{ marginTop: 8, width: '100%' }}>
        {loading ? <LoadingOutlined /> : <PlusOutlined style={{ fontSize: 24, color: '#333' }} />}
      </div>
    </button>
  );
  // 上传前的校验
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