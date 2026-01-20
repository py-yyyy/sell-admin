import PageHeader from '@/components/pageHeader/pageHeader';
import style from './edit.module.scss'
import { Button, Form, Input, Select, InputNumber, message, Upload } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getGoodsItemInfoApi, uploadGoodsImgApi, editGoodsItemApi } from '@/api/goodsEdit';
import { getGoodsCategoriesApi } from '@/api/goodsType';
import { useEffect, useState } from 'react';
import { serverURL } from '@/utils/request';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

function GoodsEdit() {
    const navigate = useNavigate();
    //获取传参
    const [params] = useSearchParams();
    const id = params.get('id');
    // 表单
    const [form] = Form.useForm();
    // 图片url
    const [imgUrl, setImgUrl] = useState('');
    // 商品分类
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // 获取当前商品详情
        async function getGoodsInfo() {
            const res = await getGoodsItemInfoApi({ id });
            if (res.code === 0) {
                // 初始化表单值
                form.setFieldsValue(res.data)
                // 初始化图片url
                setImgUrl(res.data.imgUrl);
            }
        }
        getGoodsInfo();
        // 获取商品分类
        async function getCategories() {
            const res = await getGoodsCategoriesApi();
            // 初始化商品分类
            setCategories([...res.categories])
        }
        getCategories();
    }, [id])
    //数字输入框配置
    const sharedProps = {
        mode: 'spinner',
        min: 0,
        max: Infinity,
        style: { width: 150 },
    };
    // 上传图片按钮
    const uploadButton = (
        <button style={{ border: 0, background: 'none', width: '100%' }} type="button">
            <div style={{ marginTop: 8, width: '100%' }}>
                {loading ? <LoadingOutlined /> : <PlusOutlined style={{ fontSize: 24, color: '#333' }} />}
            </div>
        </button>
    );
    //格式检查
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
    // 上传图片
    const customUpload = async (option) => {
        //option：上传文件的选项
        //解构file
        const { file } = option;
        setLoading(true);
        //创建formData对象
        const formData = new FormData();
        // 向formData对象添加文件
        formData.append('file', file);
        const res = await uploadGoodsImgApi(formData)
        if(res.code === 0){
            // 上传成功，更新表单值和图片url
            form.setFieldValue('imgUrl', res.imgUrl);
            setImgUrl(res.imgUrl);
            message.success(res.msg);
        }
        else{
            message.error(res.msg);
        }
        setLoading(false);
    }
    // 提交表单
    const handleSubmit = async (data) => {
        if(!data.name||!data.category||!data.price||!data.imgUrl||!data.goodsDesc) {
            message.error('请填写完整商品信息！');
            return;
        }
        const res = await editGoodsItemApi({...data,id:id})
        if(res.code === 0){
            message.success(res.msg);
            navigate('/goods/list');
        }
        else{
            message.error(res.msg);
        }
    }
    return (
        <>
            <div className={style.goodsEdit}>
                <PageHeader title="编辑商品" icon="icon icon-shangpin2" >
                    <Button color="default" variant="outlined" onClick={() => navigate('/goods/list')}>
                        返回
                    </Button>
                </PageHeader>
                <div className={style.goodsEditContent}>
                    {/* onFinish：表单提交时调用的函数 */}
                    <Form form={form} style={{ width: 600 }} onFinish={handleSubmit}>
                        <Form.Item name="name" label="商品名称">
                            <Input />
                        </Form.Item>
                        <Form.Item name="category" label="商品分类">
                            <Select options={categories.map(item => ({
                                value: item.cateName,
                                label: item.cateName
                            }))} />
                        </Form.Item>
                        <Form.Item name="price" label="商品价格">
                            <InputNumber {...sharedProps} placeholder="Outlined" />
                        </Form.Item>
                        <Form.Item name="imgUrl" label="商品图片">
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
                                style={{ width: '200px', height: '200px', marginRight: 50 }}
                                fileList={[]}
                                // 禁用自动上传
                                autoUpload={false}
                            >
                                {imgUrl ? (
                                    <img draggable={false} src={serverURL + imgUrl} alt="image" style={{ width: '200px', height: '200px', borderRadius: 10 }} />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Form.Item>
                        <Form.Item name="goodsDesc" label="商品描述">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" >
                                立即修改
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default GoodsEdit;