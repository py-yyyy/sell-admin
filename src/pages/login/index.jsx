import { useNavigate } from "react-router-dom";
import { loginApi } from "@/api/login";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import style from './index.module.scss'
import { Button, Form, Input, message } from 'antd';
import logo from '@/assets/login/yaoshi.png'

function Login() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const res = await loginApi({
      account: values.account,
      password: values.password,
    });
    if (res.code === 0) {
      message.info(res.msg);
      localStorage.setItem('user', JSON.stringify({ ...res, user: values.account }));
      navigate('/home');
    } else {
      message.error(res.msg);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <div className={style.loginContainer}>
        <div className={style.loginLogo}>
          <img src={logo} alt="" />
        </div>
        <h1 className={style.loginTitle}>外卖管理系统</h1>
        <p>请输入您的账户信息</p>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className={style.loginForm}
        >
          <Form.Item
            label={<UserOutlined />}
            name="account"
            rules={[{ required: true, message: '请输入用户名' }]}
            className={style.loginInputBox}
          >
            <Input placeholder="请输入用户名" className={style.loginInput} />
          </Form.Item>

          <Form.Item
            label={<LockOutlined />}
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
            className={style.loginInputBox}
          >
            <Input.Password placeholder="请输入密码" className={style.loginInput} />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" className={style.loginBtn}>
              登&nbsp;&nbsp;&nbsp;&nbsp;录
            </Button>
          </Form.Item>
        </Form>
      </div>

    </>
  );
}
export default Login;