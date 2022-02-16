import React from 'react';

class Login extends React.Component{
  constructor(props){
    super(props);
    this.state={value:"", usuario_inicio:"", contra_inicio:"",usuario_registrar:"",contra_registrar:"",error_ini:"",aux:"",error_regi:"" }

    this.c_i=this.c_i.bind(this);
    this.u_i=this.u_i.bind(this);
    this.u_r=this.u_r.bind(this);
    this.c_r=this.c_r.bind(this);
    this.iniciar_sesion=this.iniciar_sesion.bind(this);
    this.registrar=this.registrar.bind(this);
  }

  iniciar_sesion(){
      var datos= new FormData();
      datos.append('usuario', this.state.usuario_inicio);
      datos.append('contra', this.state.contra_inicio);
      fetch("http://localhost/php_react/iniciar_sesion.php",{
          method : "POST",
          body: datos
      })
      .then(res=>res.json())
          .then(
              (result)=>{
                  if(result=="Correcto"){
                    localStorage.setItem("usuario",this.state.usuario_inicio);
                    window.location.href="/chat";
                  }
                  else{
                    console.log(result);
                    this.setState({error_ini:"El usuario o contraseña no son correctos"});//--------------------------------------------------------------------------------
                  }
              },
              (error)=>{
                  console.log(error);
              }
          )
  }

  registrar(){
    var datos= new FormData();
    datos.append('usuario', this.state.usuario_registrar);
    datos.append('contra', this.state.contra_registrar);
    fetch("http://localhost/php_react/anadir_usuario.php",{
        method : "POST",
        body: datos
    })
    .then(res=>res.json())
        .then(
            (result)=>{
              console.log(result);
                if(result!="Disponible"){
                  this.setState({error_regi:"El usuario no esta disponible"});
                }
                
            },
            (error)=>{
                console.log(error);
            }
        )
  }

  u_i(event){//Para modificar el usuario_inicio
    this.setState({usuario_inicio:event.target.value});
    console.log(this.state.usuario_inicio);
  }
  c_i(event){//Para modificar el contra_inicio
    this.setState({contra_inicio:event.target.value});
    console.log(this.state.contra_inicio);
  }
  u_r(event){//Para modificar el usuario_registrar
    this.setState({usuario_registrar:event.target.value});
    console.log(this.state.usuario_registrar);
  }
  c_r(event){//Para modificar el contra_registrar
    this.setState({contra_registrar:event.target.value});
    console.log(this.state.contra_registrar);
  }

  render(){
    return (
      <div className="App">
          <div className="container p-4">
                <div className="row">
                    <div className="col-md-4">
                        <div className="card card-body">
                            Iniciar sesión:
                                <div className="form-group">
                                    <input type="text" value={this.state.usuario_inicio} onChange={this.u_i} name="usuario" className="form-control" placeholder="Escriba su usuario" autoFocus required/>
                                </div>
                                <br/>
                                <div className="form-group">
                                    <input type="password" value={this.state.contra_inicio} name="contra" onChange={this.c_i} className="form-control" placeholder="Escriba su contraseña" required />
                                </div>
                                <br/>
                                <p className="text-danger">{this.state.error_ini}</p>
                                <button onClick={this.iniciar_sesion} className="btn btn-success btn-block">Iniciar sesion</button>
                        </div>
                    </div>
                </div>
        </div>
        
        <div className="container p-4 ">
                <div className="row">
                    <div className="col-md-4">
                        <div className="card card-body">
                            Registrarse:
                                <div className="form-group">
                                    <input type="text" name="usuario" value={this.state.usuario_registrar} onChange={this.u_r} className="form-control" placeholder="Escriba su usuario" required/>
                                </div>
                                <br/>
                                <div className="form-group">
                                    <input type="password" name="contra" value={this.state.contra_registrar} onChange={this.c_r} className="form-control" placeholder="Escriba su contraseña" required />
                                </div>
                                <br/>
                                <p className="text-danger">{this.state.error_regi}</p>
                                <button onClick={this.registrar} className="btn btn-success btn-block">Registrarse</button>
                        </div>
                    </div>
                </div>
        </div>
          <a href="/chat">Chat</a>
      </div>
    );
  }
}

export default Login;
