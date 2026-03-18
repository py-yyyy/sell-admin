import PageHeader from "@/components/pageHeader/pageHeader";
import style from "./edit.module.scss";
import { Form, Input, Button, message } from "antd";
import { checkOldPwdApi, editPwdApi } from "@/api/accountEdit";
import { useNavigate } from "react-router-dom";
function AccountEdit() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    console.log("1");
    const oldPassword = form.getFieldValue("oldPassword");
    const newPassword = form.getFieldValue("newPassword");
    const confirmPassword = form.getFieldValue("confirmPassword");
    if (newPassword !== confirmPassword) {
      message.error("两次输入密码不一致");
      return;
    }
    const id = JSON.parse(localStorage.getItem("user")).id;
    const res = await checkOldPwdApi({ id, oldPwd: oldPassword });
    if (res.code === 0) {
      await editPsw(id, newPassword, oldPassword);
    } else {
      message.error(res.msg);
    }
  };
  const editPsw = async (id, newPwd, oldPwd) => {
    const res = await editPwdApi({ id, newPwd, oldPwd });
    if (res.code === 0) {
      message.success(res.msg);
      navigate("/login", { replace: true });
    } else {
      message.error(res.msg);
    }
  };
  return (
    <>
      <div>
        <PageHeader icon="icon-zhanghao" title="修改密码"></PageHeader>
        <div className={style.editContent}>
          <Form
            form={form}
            style={{ width: "550px", textAlign: "right" }}
            labelCol={{ span: 4 }}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="旧密码"
              name="oldPassword"
              rules={[{ required: true, message: "请输入旧密码" }]}
            >
              <Input.Password placeholder="请输入旧密码" />
            </Form.Item>
            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[
                { required: true, message: "请输入新密码" },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]:;"'<>,.?/~`|\\])[A-Za-z\d!@#$%^&*()_\-+={}[\]:;"'<>,.?/~`|\\]{8,20}$/,
                  message:
                    "密码必须8-20位，且必须包含大小写字母、数字和至少1种特殊字符",
                  trigger: ["blur"],
                },
              ]}
            >
              <Input.Password placeholder="请输入新密码" />
            </Form.Item>
            <Form.Item
              label="确认新密码"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[{ required: true, message: "请确认新密码" }]}
            >
              <Input.Password placeholder="请确认新密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
export default AccountEdit;
