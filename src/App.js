import './App.css';
import imagen from './Flecha.png'
import React from 'react';


function Incorporar(props) {
  if(localStorage.getItem("usuario")==props.id){
    return(    
      <div>
        <p id='mensajes' className="yo">
          {props.id}:
          <br></br>
          {props.comentario}
        </p>
      </div>
    )
  }
  else{
    return(    
      <div>
        <p id='mensajes' className="otro">
          {props.id}:
          <br></br>
          {props.comentario}
        </p>
      </div>
    )
  }
  
}

class Chat extends React.Component{
  constructor(props){
    super(props);
    this.state={value:"", aux : "", comentarios : []}

    this.cambiar=this.cambio.bind(this);
    this.enviar_mensaje=this.escribir.bind(this);
    this.consulta=this.consultar.bind(this);
    this.cerrar=this.cerrar_sesion.bind(this);
    this.vaciar_chat=this.borrar_todo.bind(this);
  }

  

  cambio(event){
    this.setState({aux:event.target.value});
  }

  borrar_todo(){
    var datos = new FormData();
    
    fetch("http://localhost/php_react/borrar_todo.php" ,{
      method : 'POST',
      body: datos
    })
    .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          if(result=="Borrado"){
            console.log(result);
            this.consulta();
          }
        },
        (error) => {
          console.log("Error leyendo" + error);
        }
      )
  }

  consultar(){
    var datos = new FormData();
    
    fetch("http://localhost/php_react/consulta.php" ,{
      method : 'POST',
      body: datos
    })
    .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            comentarios : result
          });
        },
        (error) => {
          console.log("Error leyendo" + error);
        }
      )
  }

  escribir(){
    var datos = new FormData();
    datos.append('comentario', this.state.aux);
    datos.append("usuario",localStorage.getItem("usuario"))
    fetch("http://localhost/php_react/insercion.php" ,{
      method : 'POST',
      body: datos
    })
    .then(res => res.json())
      .then(
        (result) => {
          this.consulta();
          this.setState({aux:""})

        }, 
        (error) => {
          console.log(error);
        }
      )
  }

  cerrar_sesion(){
    localStorage.setItem("usuario","");
    window.location.href="/login";
  }

  componentDidMount(){
    if(localStorage.getItem("usuario")==""){
      window.location.href="/login";
    }
  }

  render(){
    
    return (
      <div className="App" onLoad={this.consulta}>
        <div>
          <header className="App-header">
            <button id='borrar' onClick={this.vaciar_chat} className="btn btn-outline-danger">Vaciar chat</button>
            <h1>Hola {localStorage.getItem("usuario")}</h1>
            <button id='cerrar' onClick={this.cerrar} className="btn btn-outline-light">Cerrar sesión</button>
          </header>
          <div id="cuadro_texto" onLoad={this.consulta} >
              {this.state.comentarios.map((comentario)=><Incorporar id={comentario.Nombre_usuario} comentario={comentario.Comentario}/>)}
          </div>
          <div id="enviar_mensaje">
            <input type="text" id="campo_texto" value={this.state.aux}  onChange={this.cambiar} />
            <img src={imagen} id="imagen" onClick={this.enviar_mensaje}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
