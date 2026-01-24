import PageHeader from "@/components/pageHeader/pageHeader";
import style from './index.module.scss';
import { Table, Pagination, message, Button, Form, Input, Select, DatePicker } from 'antd';
import { useState, useEffect } from "react";
import { getOrderListApi } from "@/api/order";

function Order() {
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const columns = [
    { title: '订单号', dataIndex: 'orderNo' },
    { title: '下单时间', dataIndex: 'orderTime' },
    { title: '联系电话', dataIndex: 'phone' },
    { title: '收货人', dataIndex: 'consignee' },
    { title: '送货地址', dataIndex: 'deliverAddress' },
    { title: '送达时间', dataIndex: 'deliveryTime' },
    { title: '备注', dataIndex: 'remarks' },
    {
      title: '订单金额', dataIndex: 'orderAmount', render: (text) => (
        <span style={{ color: 'red', fontWeight: 'bold' }}>￥{text}</span>
      )
    },
    { title: '订单状态', dataIndex: 'orderState' },
    {
      title: '操作', dataIndex: 'operation', width: 200, render: (text, record) => (
        <div>
          <Button variant="filled" onClick={() => handleDetail(record)}>查看</Button>
          <Button color="primary" variant="filled" onClick={() => handleEdit(record)} style={{ marginLeft: 10 }}>编辑</Button>
        </div>
      )
    },
  ];
  const getOrderList = async (params) => {
    const res = await getOrderListApi({ currentPage, pageSize, ...params, });
    setTableData(res.data.map(item => ({
      ...item,
      key: item.orderNo,
      orderTime: item.orderTime ? new Date(item.orderTime).toLocaleString() : '',
      deliveryTime: item.deliveryTime ? new Date(item.deliveryTime).toLocaleString() : '',
    })));
    console.log(params)
    setTotal(res.total || 0);
  }
  useEffect(() => {
    getOrderList();
  }, [currentPage, pageSize]);
  const onChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    getOrderList();
  }
  const handleEdit = (record) => {
    console.log(record);
  }
  const handleDetail = (record) => {
    console.log(record);
  }
  const handleSearch = () => {
    const values = form.getFieldsValue();
    setCurrentPage(1);
    if (values.orderTime) {
      const s_time = values.orderTime[0].$y + '-' + (Number(values.orderTime[0].$M) + 1) + '-' + values.orderTime[0].$D;
      const e_time = values.orderTime[1].$y + '-' + (Number(values.orderTime[1].$M) + 1) + '-' + values.orderTime[1].$D;
      getOrderList({ ...values, date: JSON.stringify([s_time, e_time]) });
      return;
    }
    getOrderList({ ...values});
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
            <Form.Item label="手机号" name="phone" style={{ margin: '0 20px 0 0' }}>
              <Input placeholder="请输入手机号" />
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
    </>
  );
}
export default Order;