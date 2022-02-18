import React from 'react';
import './login.css';
import Imagen from './Logo.png'

class Login extends React.Component{
  constructor(props){
    super(props);
    this.state={value:"", usuario:"", contra:"",error:"",aux:"" }

    this.contrasena=this.c.bind(this);
    this.user=this.u.bind(this);
    this.iniciar=this.iniciar_sesion.bind(this);
    this.registra=this.registrar.bind(this);
  }

  componentDidMount(){
    if(localStorage.getItem("usuario")!=""){
      window.location.href="/chat";
    }
  }

  iniciar_sesion(){
      var datos= new FormData();
      datos.append('usuario', this.state.usuario);
      datos.append('contra', this.state.contra);
      fetch("http://localhost/php_react/iniciar_sesion.php",{
          method : "POST",
          body: datos
      })
      .then(res=>res.json())
          .then(
              (result)=>{
                  if(result=="Correcto"){
                    localStorage.setItem("usuario",this.state.usuario);
                    window.location.href="/chat";
                  }
                  else{
                    this.setState({contra:""});
                    this.setState({error:"El usuario o contraseña no son correctos"});
                  }
              },
              (error)=>{
                  console.log(error);
              }
          )
  }

  registrar(){
    var datos= new FormData();
    datos.append('usuario', this.state.usuario);
      datos.append('contra', this.state.contra);
    fetch("http://localhost/php_react/anadir_usuario.php",{
        method : "POST",
        body: datos
    })
    .then(res=>res.json())
        .then(
            (result)=>{
              
                if(result!="Disponible"){
                  this.setState({error:"El usuario no esta disponible"});
                }
                this.setState({contra:""});
            },
            (error)=>{
                console.log(error);
            }
        )
  }

  u(event){//Para modificar el usuario
    this.setState({usuario:event.target.value});
    console.log(this.state.usuario_inicio);
  }
  c(event){//Para modificar la contraseña contra
    this.setState({contra:event.target.value});
    console.log(this.state.contra_inicio);
  }

  

  render(){
    return (
      <div className="App" >
        <div><img id='imagen_logo' src={Imagen}></img></div>
            <div id='inicio_sesion'>
              <div className="col-md-4">
                <div className="card card-body">
                  <div className="form-group">
                    <input type="text" value={this.state.usuario} onChange={this.user} name="usuario" className="form-control" placeholder="Escriba su usuario" autoFocus required/>
                  </div>
                  <br/>
                  <div className="form-group">
                    <input type="password" value={this.state.contra} name="contra" onChange={this.contrasena} className="form-control" placeholder="Escriba su contraseña" required />
                  </div>
                  <br/>
                  <p className="text-danger">{this.state.error}</p>
                  <div className="btn-group " role="group" aria-label="Basic outlined button group">
                    <button onClick={this.iniciar} type="button" className="btn btn-outline-success">Iniciar sesion</button>
                    <button onClick={this.registra} type="button" className="btn btn-outline-success">Registrarse</button>                  
                  </div>
                </div>
              </div>  
          </div>
      </div>
    );
  }
}

export default Login;
