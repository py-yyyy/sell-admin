import PageHeader from "@/components/pageHeader/pageHeader";
import styles from "./index.module.scss";
import { getShopInfoApi, uploadShopImgApi, editShopInfoApi } from "@/api/shop";
import { useState, useEffect } from "react";
import {
  message,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Modal,
  Upload,
  Image,
  TimePicker,
  Checkbox,
} from "antd";
import { serverURL } from "@/utils/request";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
function Shop() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [id, setId] = useState("");
  const getShopInfo = async () => {
    const res = await getShopInfoApi();
    //存id
    setId(res.data.id || "");
    // 处理日期字段
    let dateData = res.data.date || [];
    if (typeof dateData === "string") {
      try {
        dateData = JSON.parse(dateData);
      } catch (e) {
        console.error("解析日期数据失败:", e);
        dateData = [];
      }
    }
    res.data.date[0] = dayjs(dateData[0]);
    res.data.date[1] = dayjs(dateData[1]);
    form.setFieldsValue(res.data || {});
    setAvatarUrl(res.data.avatar || "");
    const pics = res.data.pics || [];
    // 处理图片字段
    if (typeof pics !== "object") {
      return;
    }
    setFileList(
      pics.map((url, index) => {
        return {
          uid: `pic-${index}`,
          name: `shop-pic-${index}`,
          status: "done",
          url: serverURL + url,
          // 用于在删除时识别图片
          response: { imgUrl: url },
        };
      }),
    );
  };
  useEffect(() => {
    getShopInfo();
  }, []);
  // 处理图片预览
  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  // 上传图片按钮
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <div
        style={{
          marginTop: 0,
          width: "200px",
          height: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <LoadingOutlined />
        ) : (
          <PlusOutlined style={{ fontSize: 24, color: "#333" }} />
        )}
      </div>
    </button>
  );
  //格式检查
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("请上传JPG/PNG格式的图片！");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过2MB！");
      return false;
    }
    return isJpgOrPng && isLt2M;
  };
  // 上传图片
  const customUpload = async (option) => {
    //option：上传文件的选项
    //解构file
    const { file } = option;
    setLoading(true);
    //创建formData对象
    const formData = new FormData();
    // 向formData对象添加文件
    formData.append("file", file);
    const res = await uploadShopImgApi(formData);
    if (res.code === 0) {
      // 上传成功，更新表单值和图片url
      form.setFieldValue("avatar", res.imgUrl);
      setAvatarUrl(res.imgUrl);
      message.success(res.msg);
    } else {
      message.error(res.msg);
    }
    setLoading(false);
  };
  const customUploadPics = async (option) => {
    const { file } = option;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadShopImgApi(formData);
    if (res.code === 0) {
      const currentPics = form.getFieldValue("pics") || [];
      // 将新图片URL添加到数组中
      const newPics = [...currentPics, res.imgUrl];
      // 更新表单值
      form.setFieldValue("pics", newPics);
      // 更新文件列表
      setFileList(
        fileList.concat({
          uid: file.uid,
          name: file.name,
          status: "done",
          url: serverURL + res.imgUrl,
          response: { imgUrl: res.imgUrl },
        }),
      );
      message.success(res.msg);
    } else {
      message.error(res.msg);
    }
    setLoading(false);
  };
  // 处理图片删除 - 使用onChange事件
  // 用户触发删除后，文件状态会变为"removed已删除"
  // 这里实在把"removed已删除"的文件从fileList中过滤掉
  // 然后重新赋值
  const handlePicsChange = ({ fileList: newFileList }) => {
    // 排除状态为"uploading上传中"和"removed已删除"的文件
    // 保留已上传且未删除的有效文件
    const filteredFileList = newFileList.filter(
      (file) => file.status !== "uploading" && file.status !== "removed",
    );
    // 从fileList中提取图片URL
    const newPicsUrl = filteredFileList.map(
      (file) => file.response?.imgUrl || file.url || file.uid,
    );

    // 更新状态和表单值
    setFileList(filteredFileList);
    form.setFieldValue("pics", newPicsUrl);
  };
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const data = form.getFieldsValue();
      data.avatar = data.avatar.slice(data.avatar.lastIndexOf("/") + 1);
      data.pics = data.pics.map((url) => {
        return url.slice(url.lastIndexOf("/") + 1);
      });
      //转json数组存储
      data.supports = JSON.stringify(data.supports || []);
      data.date = JSON.stringify(data.date || []);
      data.pics = JSON.stringify(data.pics || []);
      const res = await editShopInfoApi({ ...data, id: id });
      if (res.code === 0) {
        getShopInfo();
        message.success(res.msg);
      } else {
        message.error(res.msg);
      }
    } catch (error) {
      message.warning(error.message);
      return;
    }
  };
  return (
    <>
      <div className={styles.shop}>
        <PageHeader title="店铺信息" icon="icon-shangpin2">
          <Button
            type="primary"
            color="primary"
            variant="filled"
            onClick={handleSubmit}
          >
            保存店铺信息
          </Button>
        </PageHeader>
        <div className={styles.shopContent}>
          <Form
            form={form}
            labelCol={{ span: 2 }}
            scrollToFirstError={{
              behavior: "instant",
              block: "end",
              focus: true,
            }}
          >
            <Form.Item
              name="name"
              label="店铺名称"
              rules={[{ required: true, message: "请输入店铺名称" }]}
            >
              <Input
                size="large"
                placeholder="请输入店铺名称"
                style={{ width: "800px" }}
              />
            </Form.Item>
            <Form.Item
              name="bulletin"
              label="店铺公告"
              rules={[{ required: true, message: "请输入店铺公告" }]}
            >
              <Input.TextArea
                size="large"
                placeholder="请输入店铺公告"
                autoSize={{ minRows: 6, maxRows: 10 }}
                style={{ width: "800px" }}
              />
            </Form.Item>
            <Form.Item
              name="avatar"
              label="店铺头像"
              rules={[{ required: true, message: "请上传店铺头像" }]}
            >
              {/* filelist属性存上传的文件列表，如果需要预览，可以从filelist数组中取值 */}
              {/* 这里只上传一张图片，没有使用filelist取值， 所以给了空数组 */}
              <Upload
                beforeUpload={beforeUpload}
                // 自定义上传函数
                customRequest={customUpload}
                name="image"
                listType="picture-card"
                className="image-uploader"
                showUploadList={false}
                style={{ width: "102px", height: "102px", marginRight: 50 }}
                fileList={[]}
                // 禁用自动上传
                autoUpload={false}
              >
                {avatarUrl ? (
                  <img
                    draggable={false}
                    src={serverURL + avatarUrl}
                    alt="image"
                    style={{
                      width: "102px",
                      height: "102px",
                      borderRadius: 10,
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              name="pics"
              label="店铺图片"
              rules={[{ required: true, message: "请上传店铺图片" }]}
            >
              <div>
                {previewImage && (
                  <Image
                    src={previewImage}
                    style={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onOpenChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                  />
                )}
                <Upload
                  beforeUpload={beforeUpload}
                  customRequest={customUploadPics}
                  name="image"
                  listType="picture-card"
                  className="image-uploader"
                  style={{
                    width: "102px",
                    height: "102px",
                    marginRight: 50,
                    display: "inline-block",
                  }}
                  fileList={fileList}
                  onChange={handlePicsChange}
                  onPreview={handlePreview}
                  autoUpload={false}
                >
                  {uploadButton}
                </Upload>
              </div>
            </Form.Item>
            <Form.Item
              name="deliveryPrice"
              label="起送价格"
              rules={[{ required: true, message: "请输入起送价格" }]}
            >
              <Input
                size="large"
                placeholder="请输入起送价格"
                style={{ width: "800px" }}
              />
            </Form.Item>
            <Form.Item
              name="deliveryTime"
              label="送达时间"
              rules={[{ required: true, message: "请输入送达时间" }]}
            >
              <Input
                size="large"
                placeholder="请输入送达时间"
                style={{ width: "800px" }}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label="配送描述"
              rules={[{ required: true, message: "请输入配送描述" }]}
            >
              <Input
                size="large"
                placeholder="请输入配送描述"
                style={{ width: "800px" }}
              />
            </Form.Item>
            <Form.Item
              name="score"
              label="店铺好评率"
              rules={[{ required: true, message: "请输入店铺好评率" }]}
            >
              <Input
                size="large"
                placeholder="请输入店铺好评率"
                style={{ width: "800px" }}
              />
            </Form.Item>
            <Form.Item
              name="sellCount"
              label="店铺销量"
              rules={[{ required: true, message: "请输入店铺销量" }]}
            >
              <Input
                size="large"
                placeholder="请输入店铺销量"
                style={{ width: "800px" }}
              />
            </Form.Item>
            <Form.Item name="supports" label="活动支持">
              <Checkbox.Group>
                <Checkbox value="玉米浓浓堡上心">玉米浓浓堡上心</Checkbox>
                <Checkbox value="美团配送满25-5">美团配送满25-5</Checkbox>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              name="date"
              label="营业时间"
              rules={[{ required: true, message: "请输入营业时间" }]}
            >
              <TimePicker.RangePicker size="large" style={{ width: "800px" }} />
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
export default Shop;
