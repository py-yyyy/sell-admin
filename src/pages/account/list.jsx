import style from './list.module.scss';
import { Divider, Button, Table, Pagination, Modal, Form, Input, Select,message } from 'antd';
import { useState, useEffect,useCallback } from 'react';
import { getAccountListApi,editAccountApi,delAccountApi,batchDelAccountApi } from '@/api/accountList';
function AccountList() {
  //选中行
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  //表格数据
  const [tableData, setTableData] = useState([]);
  //总页数、当前页码、每页显示条数
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  //获取账号列表
  const getAccountList = useCallback(async() => {
    const res = await getAccountListApi({ currentPage, pageSize });
      //拿到的ctime是ISO 8601 国际标准格式 的时间（UTC 时间字符串）
      //转换为北京时间
      res.data.map(item => {
        //为表格数据添加唯一key
        item.key = item.id;
        item.ctime = new Date(item.ctime).toLocaleString();
      })
      setTableData(res.data);
      setTotal(res.total);
  },[currentPage, pageSize])
  useEffect(() => {
    getAccountList();
    //当currentPage或pageSize变化时重新获取账号列表
  }, [currentPage, pageSize,getAccountList])
  //选中行变化时修改选中行的key
  const onSelectChange = newSelectedRowKeys => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  //表格行选择配置
  const rowSelection = {
    //选中行key
    selectedRowKeys,
    //选中行变化时触发onSelectChange函数
    onChange: onSelectChange,
  };
  //表格列配置
  const columns = [
    { title: '账号', dataIndex: 'account' },
    { title: '用户组', dataIndex: 'userGroup' },
    { title: '创建时间', dataIndex: 'ctime' },
    {
      //text：操作列的文本内容，item：当前行的数据
      title: '操作', render: (text, item) => (
        <>
          <Button color="primary" variant="filled" style={{ marginRight: 10 }} onClick={() => openEditModal(item)}>
            编辑
          </Button>
          <Button color="pink" variant="filled" onClick={() => delAccount(item)}>
            删除
          </Button>
        </>
      )
    },
  ];
  //分页变化时触发onChange函数
  const onChange = (page, pageSize) => {
    //修改currentPage和pageSize，useEffect会自动触发
    setCurrentPage(page);
    setPageSize(pageSize);
  }
  //编辑弹窗
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  //编辑弹窗表单实例
  const [form] = Form.useForm();
  //打开编辑弹窗
  const openEditModal = (item) => {
    const data = {
      id: item.id,
      account: item.account,
      userGroup: item.userGroup,
    };
    setEditForm(data);
    form.setFieldsValue(data); // 使用 form.setFieldsValue() 动态更新表单
    setIsModalOpen(true);
  }
  //编辑弹窗确认按钮
  const handleOk = async() => {
    // 校验表单字段
    const values = await form.validateFields();
    const res = await editAccountApi({...values,id:editForm.id});
    if(res.code === 0){
      //编辑成功后刷新账号列表
      getAccountList();
      setIsModalOpen(false);
      }else{
        message.error(res.msg);
      }
  };
  //删除账号
  const delAccount = async(item) => {
    //确认删除
     Modal.confirm({
      title: '确认删除该账号吗？',
      okText: '确认',
      okType: 'danger',
      onOk: async() => {
        const res = await delAccountApi({id:item.id});
        if(res.code === 0){
          //删除成功后刷新账号列表
          getAccountList();
          message.success(res.msg);
          }else{
            message.error(res.msg);
          }
      },
    })
  };
  //批量删除账号
  const batchDelAccount = async() => {
    console.log(selectedRowKeys);
    //确认删除
     Modal.confirm({
      title: '确认删除选中的账号吗？',
      okText: '确认',
      okType: 'danger',
      onOk: async() => {
        //文档要求：ids参数为json字符串
        const res = await batchDelAccountApi({ids:JSON.stringify(selectedRowKeys)});
        if(res.code === 0){
          //删除成功后刷新账号列表
          getAccountList();
          message.success(res.msg);
          }else{
            message.error(res.msg);
          }
      },
    })
  };
  return (
    <>
      <div className={style.accountList}>
        <div className={style.accountListHeader}>
          <p>
            <i className="iconfont icon-zhanghao" style={{ marginRight: 10 }}></i>
            账号列表
          </p>
          <div>
            <Button color="pink" variant="filled" style={{ marginRight: 10 }} disabled={!(selectedRowKeys.length > 0)} onClick={batchDelAccount}>
              批量删除
            </Button>
            <Button color="default" variant="filled" onClick={() => { setSelectedRowKeys([]) }}>
              取消选择
            </Button>
          </div>
        </div>
        <div className={style.accountListContent}>
          <div className={style.accountListTable}>
            <Table rowSelection={rowSelection} columns={columns} dataSource={tableData} pagination={false} sticky={{ top: 0 }} />
          </div>
          {/* antd默认设置当total小于50时不显示分页器，使用showSizeChanger属性显示分页器 */}
          <Pagination
            onChange={onChange}
            total={total}
            showTotal={total => `共 ${total} 条数据`}
            defaultPageSize={10}
            defaultCurrent={1}
            style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}
            showSizeChanger={true}
          />
        </div>
      </div>
      <Modal
        title=" 编辑账号"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form}>
          <Form.Item label="账&nbsp;&nbsp;&nbsp;号" name="account" style={{ margin: '40px 20px' }} >
            <Input placeholder="请输入账号" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item label="用户组" name="userGroup" style={{ margin: '40px 20px' }}>
            <Select placeholder="请选择用户组" style={{ width: 400 }} defaultValue={editForm.userGroup} options={
              [
                { value: '普通用户', label: '普通用户' },
                { value: '管理员', label: '管理员' },
                { value: '超级管理员', label: '超级管理员' },
              ]
            } />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
export default AccountList;