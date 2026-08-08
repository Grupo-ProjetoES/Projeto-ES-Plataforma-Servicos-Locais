import {Link} from "react-router-dom";

function Login() {
  return <>
    <h1> Login </h1>
    <Link to="/register">Ir para Registrar</Link>
    <Link to="/home"><button>Logar</button></Link>
  </>
}

export default Login;
