import style from './list.module.scss';
import PageHeader from '@/components/pageHeader/pageHeader';
import { Table, Pagination, Button, Image } from 'antd';
import { getGoodsListApi, delGoodsItemApi } from '@/api/goodsList';
import { useEffect, useState } from 'react';
import { serverURL } from '@/utils/request';
import { timeFormat } from '@/utils/date';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

function GoodsList() {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState([]);
  async function getGoodsList() {
    const res = await getGoodsListApi({
      pageSize,
      currentPage,
    })
    res.data.map(item => {
      item.key = item.id;
      item.description = `
        <p>商品ID：${item.id}</p>
        <p>商品名称：${item.name}</p>
        <p>商品分类：${item.category}</p>
        <p>商品价格：￥${item.price}</p>
        <p>商品描述：${item.goodsDesc}</p>
        <p>创建时间：${timeFormat(item.ctime)}</p>
        <p>商品评价：${item.rating}</p>
        <p>商品销量：${item.sellCount}</p>
        `
    })
    setTotal(res.total);
    setTableData(res.data);
  }
  useEffect(() => {
    getGoodsList();
  }, [currentPage, pageSize])
  const delGoodsItem = async (id) => {
    Modal.confirm({
      title: '确认删除该商品吗？',
      okText: '确认',
      okType: 'danger',
      onOk: async () => {
        await delGoodsItemApi({ id });
        //删除成功后刷新商品列表
        getGoodsList();
      },
    });
  }
  //分页变化时触发onChange函数
  const onChange = (page, pageSize) => {
    //修改currentPage和pageSize，useEffect会自动触发
    setCurrentPage(page);
    setPageSize(pageSize);
  }
  const columns = [
    { title: '商品名称', dataIndex: 'name' },
    { title: '商品分类', dataIndex: 'category' },
    { title: '商品价格', dataIndex: 'price' },
    { title: '商品图片', dataIndex: 'imgUrl', render: imgUrl => <Image src={serverURL + imgUrl} alt={imgUrl} style={{ width: 50, height: 50 }} fallback="data:image/png;base64,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" /> },
    { title: '商品描述', dataIndex: 'goodsDesc' },
    {
      title: '操作',
      render: (item) => (
        <>
          <Button color="primary" variant="filled" style={{ marginRight: 10 }} onClick={() => {
            navigate(`/goods/edit?id=${item.id}`);
          }}>
            编辑
          </Button>
          <Button color="pink" variant="filled" onClick={() => delGoodsItem(item.id)}>
            删除
          </Button>
        </>
      )
    },
  ];
  return (
    <>
      <div className={style.goodsList}>
        <PageHeader title="商品列表" icon="icon icon-shangpin2" />
        <div className={style.goodsListContent}>
          <div className={style.goodsListTbale}>
            <Table
              columns={columns}
              expandable={{
                expandedRowRender: record => <div style={{ margin: 0, height: 200, display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }} dangerouslySetInnerHTML={{ __html: record.description }}></div>,
                rowExpandable: record => record.name !== 'Not Expandable',
              }}
              dataSource={tableData}
              sticky={{ top: 0 }}
              pagination={false}
            />
          </div>
          {/* antd默认设置当total小于50时不显示分页器，使用showSizeChanger属性显示分页器 */}
          <Pagination
            onChange={onChange}
            total={total}
            showTotal={total => `共 ${total} 条数据`}
            defaultPageSize={pageSize}
            defaultCurrent={1}
            style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}
            showSizeChanger={true}
          />
        </div>
      </div>
    </>
  );
}
export default GoodsList;