import PageHeader from "@/components/pageHeader/pageHeader";
import style from './types.module.scss';
import { useState } from 'react';
import { Form, Input, Switch, Table, Popconfirm, Pagination, message, Modal, Button } from 'antd';
import { useEffect } from 'react';
import React from 'react';
import { getGoodsTypesListApi, deleteGoodsTypeApi, editGoodsTypeApi, addGoodsTypeApi } from "@/api/goodsType";

function GoodsTypes() {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  async function getTypeList() {
    const res = await getGoodsTypesListApi({ pageSize, currentPage });
    setTotal(res.total);
    res.data.map(item => {
      item.key = item.id;
      item.isEdit = false;
      item.editText = item.cateName;
    })
    setTableData(res.data);
  }
  useEffect(() => {
    getTypeList();
  }, [pageSize, currentPage])
  const onChange = (page, pageSize) => {
    //修改currentPage和pageSize，useEffect会自动触发
    setCurrentPage(page);
    setPageSize(pageSize);
  }
  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除吗?',
      okText: '确认',
      okType: 'danger',
      onOk: async () => {
        const res = await deleteGoodsTypeApi({ id });
        if (res.code === 0) {
          getTypeList();
          message.success('删除成功');
        } else {
          message.error('删除失败');
        }
      },
    });
  };
  const defaultColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '30%',
    },
    {
      title: '分类名',
      dataIndex: 'cateName',
      editable: true,  // 标记该列为可编辑
    },
    {
      title: '是否启用',
      dataIndex: 'state',
      render: (_, record) => {
        return <Switch defaultChecked onChange={() => onChangeSwitch(record)} value={record.state} />
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) =>
        tableData.length >= 1 ? (
          <>
            {!record.isEdit && <Button color="blue" variant="filled" style={{ marginRight: 10 }} onClick={() => handleEdit(record)}>编辑</Button>}
            {record.isEdit && <Button color="blue" variant="filled" style={{ marginRight: 10 }} onClick={() => handleSave(record)}>完成</Button>}
            <Popconfirm title="确认删除吗?" onConfirm={() => handleDelete(record.id)}>
              <Button color="pink" variant="filled">删除</Button>
            </Popconfirm>
          </>
        ) : null,
    },
  ];
  const onChangeSwitch = async (record) => {
    const res = await editGoodsTypeApi({ id: record.id, cateName: record.cateName, state: record.state === 0 ? 1 : 0 });
    if (res.code === 0) {
      getTypeList();
      message.success(res.msg);
    } else {
      message.error(res.msg);
    }
  };
  const handleEdit = (record) => {
    const newData = [...tableData];
    newData.find(item => item.id === record.id).isEdit = true;
    setTableData([...newData]);
  }
  const handleSave = async (record) => {
    const res = await editGoodsTypeApi({ id: record.id, cateName: record.editText, state: record.state });
    if (res.code === 0) {
      getTypeList();
      message.success(res.msg);
    } else {
      message.error(res.msg);
    }
  };
  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      render: (text, record) => {
        if (record.isEdit) {
          return (
            <Input value={record.editText} onChange={(e) => setTableData(tableData.map(item => item.id === record.id ? { ...item, editText: e.target.value } : item))} />
          );
        }
        return text;
      }
    }
  });
  const handleOk = async () => {
    const cateName = await form.getFieldValue('cateName')
    const state = await form.getFieldValue('state')
    if (!cateName) {
      message.error('请输入分类名');
      return;
    }
    const res = await addGoodsTypeApi({ cateName, state })
    if (res.code === 0) {
      getTypeList();
      message.success(res.msg);
      setVisible(false);
    } else {
      message.error(res.msg);
    }
    form.resetFields();
  }
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  }
  return (
    <>
      <div className={style.goodsTypes}>
        <PageHeader title="商品类型" icon="icon icon-shangpin2" >
          <Button color="primary" variant="outlined" onClick={() => setVisible(true)}>
            添加分类
          </Button>
        </PageHeader>
        <div className={style.goodsTypesContent}>
          <div className={style.goodsTypesTbale}>
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
        title="添加分类"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} >
          <Form.Item name="cateName" label="分类名" rules={[{ required: true, message: '请输入分类名' }]}  style={{ margin: '40px 20px'}}>
            <Input placeholder="请输入分类名" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item name="state" label="是否启用" style={{ margin: '40px 20px', display: 'flex'}}>
            <Switch defaultChecked value={1} />
          </Form.Item>
        </Form>
      </Modal>
    </>

  );
}
export default GoodsTypes;