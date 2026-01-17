import PageHeader from '@/components/pageHeader/pageHeader';
import style from './add.module.scss';
import { Form, Input, Button, message,Select } from 'antd';
import { postAccountApi } from '@/api/accountAdd';
function AccountAdd() {
  const [form] = Form.useForm();
  const add = async() => {
    const data = {
      account: form.getFieldValue('account'),
      password: form.getFieldValue('password'),
      userGroup: form.getFieldValue('userGroup'),
    }
    if(!data.account || !data.password || !data.userGroup){
      message.error('请填写完整信息');
      return;
    }
    const res = await postAccountApi(data);
    if(res.code == 0){
      message.success('添加账号成功');
      form.resetFields();
    }else{
      message.error(res.msg);
    }
  }
  return (
    <>
      <div className={style.AccountAdd}>
        <PageHeader icon="icon-zhanghao" title="添加账号">
        </PageHeader>
        <div className={style.addContent}>
          <Form
            form={form}
            style={{ width: 600 }}
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="账&nbsp;&nbsp;&nbsp;号"
              name="account"
              rules={[{ required: true, message: '请输入账号!' }]}
            >
              <Input placeholder='请输入账号'/>
            </Form.Item>

            <Form.Item
              label="密&nbsp;&nbsp;&nbsp;码"
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password placeholder='请输入密码'/>
            </Form.Item>
            <Form.Item
              label="用户组"
              name="userGroup"
              rules={[{ required: true, message: '请选择用户组!' }]}
            >
              <Select placeholder='请选择用户组' options={[{ label: '普通管理员', value: '普通管理员' }, { label: '超级管理员', value: '超级管理员' }]} />
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button color="primary" variant="filled" style={{ marginRight: 10 }} onClick={add}>
                添加账号
              </Button>
              <Button color="default" variant="filled" onClick={() => form.resetFields()}>
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
export default AccountAdd;