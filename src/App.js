import './App.css';
import imagen from './Flecha.png'
import React from 'react';


function Incorporar(props) {
  if(localStorage.getItem("usuario")==props.id){
    return(    
      <div>
        <p id='mensajes' class="yo">
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
        <p id='mensajes' class="otro">
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

    this.cambio=this.cambio.bind(this);
    this.escribir=this.escribir.bind(this);
    this.consultar=this.consultar.bind(this);
  }

  

  cambio(event){
    this.setState({aux:event.target.value});
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
          this.consultar();
          this.setState({aux:""})

        }, 
        (error) => {
          console.log(error);
        }
      )
  }

  render(){
    return (
      <div className="App" onLoad={this.consultar}>
        <header className="App-header">
          <h1>Hola {localStorage.getItem("usuario")}</h1>
        </header>
        <div id="cuadro_texto" onLoad={this.consultar} >
            {this.state.comentarios.map((comentario)=><Incorporar id={comentario.Nombre_usuario} comentario={comentario.Comentario}/>)}
        </div>
        <input type="text" id="campo_texto" value={this.state.aux}  onChange={this.cambio} />
        <img src={imagen} id="imagen" onClick={this.escribir}/>
          <a href="/login">Cjat</a>
      </div>
    );
  }
}

export default Chat;
