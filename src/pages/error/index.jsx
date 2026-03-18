import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
const App = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={() => navigate(-1)}>返 回</Button>}
    />
  );
};
export default App;