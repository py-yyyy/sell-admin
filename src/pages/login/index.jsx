import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Login</h1>
      <button onClick={()=>navigate("/layout")}>登录</button>
    </div>
  );
}
export default Login;