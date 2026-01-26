import PageHeader from "@/components/pageHeader/pageHeader";
import style from './index.module.scss';
import { Table, Pagination, message, Button, Form, Input, Select, DatePicker, Tag, Modal, Divider, TimePicker } from 'antd';
import { useState, useEffect } from "react";
import { getOrderListApi, getOrderDetailApi, editOrderApi } from "@/api/order";
import dayjs from "dayjs";

function Order() {
  //表格数据和分页
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  //搜索表单
  const [form] = Form.useForm();
  //详情和编辑弹窗
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [recordDetail, setRecordDetail] = useState({});
  const [visibleEdit, setVisibleEdit] = useState(false);
  //编辑表单
  const [formEdit] = Form.useForm();
  //表格列配置
  const columns = [
    { title: '订单号', dataIndex: 'orderNo' },
    { title: '联系电话', dataIndex: 'phone' },
    { title: '收货人', dataIndex: 'consignee' },
    { title: '备注', dataIndex: 'remarks' },
    { title: '送货地址', dataIndex: 'deliverAddress' },
    { title: '下单时间', dataIndex: 'orderTime' },
    { title: '送达时间', dataIndex: 'deliveryTime' },
    {
      title: '订单金额', dataIndex: 'orderAmount', render: (text) => (
        <span style={{ color: 'red', fontWeight: 'bold' }}>￥{text}</span>
      )
    },
    {
      title: '订单状态', dataIndex: 'orderState', render: (text) => {
        return <Tag color={text === '已完成' ? 'green' : text === '已受理' ? 'blue' : 'orange'}>{text}</Tag>
      }
    },
    {
      title: '操作', dataIndex: 'operation', width: 200, render: (text, record) => (
        <div>
          <Button variant="filled" onClick={() => handleDetail(record)}>查看</Button>
          <Button color="primary" variant="filled" onClick={() => handleEdit(record)} style={{ marginLeft: 10 }}>编辑</Button>
        </div>
      )
    },
  ];
  //获取订单列表
  const getOrderList = async (params) => {
    const res = await getOrderListApi({ currentPage, pageSize, ...params, });
    //添加key字段并格式化时间
    setTableData(res.data.map((item, index) => ({
      ...item,
      key: item.orderNo + index,
      orderTime: item.orderTime ? new Date(item.orderTime).toLocaleString() : '',
      deliveryTime: item.deliveryTime ? new Date(item.deliveryTime).toLocaleString() : '',
    })));
    setTotal(res.total || 0);
  }
  useEffect(() => {
    getOrderList();
  }, [currentPage, pageSize]);
  //分页改变时获取订单列表
  const onChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    getOrderList();
  }
  const handleEdit = (record) => {
    setVisibleEdit(true);
    //因为使用了DatePicker组件，所以需要将时间字符串转换为dayjs对象
    formEdit.setFieldsValue({ ...record, deliveryTime: dayjs(record.deliveryTime) });
  }
  const handleDetail = (record) => {
    setVisibleDetail(true);
    getOrderDetail(record.id);
  }
  const handleSearch = () => {
    const values = form.getFieldsValue();
    //搜索时重置页码为1
    setCurrentPage(1);
    if (values.orderTime) {
      const s_time = values.orderTime[0].$y + '-' + (Number(values.orderTime[0].$M) + 1) + '-' + values.orderTime[0].$D;
      const e_time = values.orderTime[1].$y + '-' + (Number(values.orderTime[1].$M) + 1) + '-' + values.orderTime[1].$D;
      getOrderList({ ...values, date: JSON.stringify([s_time, e_time]) });
      return;
    }
    getOrderList({ ...values });
  }
  const getOrderDetail = async (id) => {
    const res = await getOrderDetailApi({ id: id });
    //格式化时间显示，这里是单条数据
    setRecordDetail({ ...res.data, orderTime: res.data.orderTime ? new Date(res.data.orderTime).toLocaleString() : '', deliveryTime: res.data.deliveryTime ? new Date(res.data.deliveryTime).toLocaleString() : '', })
  }
  const handleCancelEdit = () => {
    setVisibleEdit(false);
  }
  const handleOkEdit = () => {
    const data = formEdit.getFieldsValue();
    //添加id字段，因为编辑接口需要id
    data.id = formEdit.getFieldValue('id');
    data.deliveryTime = data.deliveryTime ? data.deliveryTime.format('YYYY/MM/DD HH:mm:ss') : '';
    if (!data.consignee || !data.phone || !data.deliverAddress || !data.deliveryTime || !data.orderState) {
      message.error('请填写完整订单信息！');
      return;
    }
    editOrder(data);
  }
  const editOrder = async (data) => {
    const res = await editOrderApi(data);
    if (res.code === 0) {
      message.success(res.msg);
      getOrderList();
      setVisibleEdit(false);
    } else {
      message.error(res.msg);
    }

  }
  return (
    <>
      <div className={style.order}>
        <PageHeader title="订单管理" icon="icon icon-dingdan" >
          <Form form={form} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Form.Item label="订单号" name="orderNo" style={{ margin: '0 20px 0 0' }}>
              <Input placeholder="请输入订单号" />
            </Form.Item>
            <Form.Item label="收货人" name="consignee" style={{ margin: '0 20px 0 0' }}>
              <Input placeholder="请输入收货人" />
            </Form.Item>
            <Form.Item label="联系电话" name="phone" style={{ margin: '0 20px 0 0' }}>
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item label="订单状态" name="orderState" style={{ margin: '0 20px 0 0' }}>
              <Select placeholder="请选择订单状态" style={{ width: 100 }} options={[{ label: '已完成', value: '已完成' }, { label: '已受理', value: '已受理' }, { label: '派送中', value: '派送中' }]} />
            </Form.Item>
            <Form.Item label="选择时间" name="orderTime" style={{ margin: '0 20px 0 0' }}>
              <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item style={{ margin: '0 20px 0 0' }}>
              <Button type="primary" htmlType="submit" onClick={handleSearch}>查询</Button>
            </Form.Item>
          </Form>
        </PageHeader>
        <div className={style.orderContent}>
          <div className={style.orderTbale}>
            <Table
              bordered
              dataSource={tableData}
              columns={columns}
              sticky={{ top: 0 }}
              pagination={false}
            />
          </div>
          <Pagination
            onChange={onChange}
            total={total}
            showTotal={total => `共 ${total} 条数据`}
            defaultPageSize={pageSize}
            defaultCurrent={currentPage}
            style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}
            showSizeChanger={true}
          />
        </div>
      </div>
      <Modal
        title="订单详情"
        open={visibleDetail}
        footer={null}
        width={800}
        onCancel={() => setVisibleDetail(false)}
      >
        <div style={{ marginTop: 20,backgroundColor:'#fffbfc',padding:10,borderRadius:10 }}>
          <p>订单号：{recordDetail.orderNo}</p>
          <p>下单时间：{recordDetail.orderTime}</p>
          <p>订单金额：<span style={{ color: 'red', fontWeight: 'bold' }}>￥{recordDetail.orderAmount}</span></p>
          <p>订单状态：<Tag color={recordDetail.orderState === '已完成' ? 'green' : recordDetail.orderState === '已受理' ? 'blue' : 'orange'}>{recordDetail.orderState}</Tag></p>
        </div>
        <Divider dashed />
        <div style={{ backgroundColor:'#fffbfc',padding:10,borderRadius:10 }}>
          <p>收货人：{recordDetail.consignee}</p>
          <p>联系电话：{recordDetail.phone}</p>
          <p>备注：{recordDetail.remarks || '无'}</p>
          <p>送货地址：{recordDetail.deliverAddress}</p>
          <p>送达时间：{recordDetail.deliveryTime}</p>
        </div>
      </Modal>
      <Modal
        title="编辑订单"
        open={visibleEdit}
        onCancel={() => handleCancelEdit()}
        onOk={() => handleOkEdit()}
        width={800}
      >
        <Form form={formEdit} style={{ marginTop: 20 }}>
          <Form.Item label="订&nbsp;&nbsp;单&nbsp;&nbsp;号" name="orderNo" >
            <Input placeholder="请输入订单号" style={{ width: 400 }} disabled />
          </Form.Item>
          <Form.Item label="下单时间" name="orderTime" >
            <Input placeholder="请输入下单时间" style={{ width: 400 }} disabled />
          </Form.Item>
          <Form.Item label="订单金额" name="orderAmount" >
            <Input placeholder="请输入订单金额" style={{ width: 400 }} disabled />
          </Form.Item>
          <Form.Item label="收&nbsp;&nbsp;货&nbsp;&nbsp;人" name="consignee" >
            <Input placeholder="请输入收货人" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item label="联系电话" name="phone" >
            <Input placeholder="请输入联系电话" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item label="送货地址" name="deliverAddress" >
            <Input placeholder="请输入送货地址" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item label="送达时间" name="deliveryTime" >
            {/* showTime: true 显示时间选择器 */}
            {/* disabledDate 禁用过去的时间 */}
            <DatePicker style={{ width: 400 }} showTime disabledDate={currentDate => currentDate < dayjs(formEdit.getFieldValue('orderTime'))} />
          </Form.Item>
          <Form.Item label="订单状态" name="orderState" >
            <Select placeholder="请选择订单状态" style={{ width: 400 }} options={[{ label: '已完成', value: '已完成' }, { label: '已受理', value: '已受理' }, { label: '派送中', value: '派送中' }]} />
          </Form.Item>
          <Form.Item label="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注" name="remarks" >
            <Input.TextArea placeholder="请输入备注" style={{ width: 400 }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
export default Order;