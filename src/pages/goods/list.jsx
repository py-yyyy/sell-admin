import style from './list.module.scss';
import PageHeader from '@/components/pageHeader/pageHeader';
import { createStyles } from 'antd-style';
import { Table, Pagination, Button } from 'antd';
import { getGoodsListApi, delGoodsItemApi } from '@/api/goodsList';
import { useEffect, useState } from 'react';
import { serverURL } from '@/utils/request';
import { timeFormat } from '@/utils/date';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
          }
        }
      }
    `,
  };
});
function GoodsList() {
  const navigate = useNavigate();
  const { styles } = useStyle();
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
    { title: '商品图片', dataIndex: 'imgUrl', render: imgUrl => <img src={serverURL + imgUrl} alt={imgUrl} style={{ width: 50, height: 50 }} /> },
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
              scroll={{ y: 50 * 10 }} className={styles.customTable}
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