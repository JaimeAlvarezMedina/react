import './App.css';
import imagen_flecha from './Flecha.png';
import imagen_fondo from './Boton.png';
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
    this.state={value:"", aux : "", comentarios : [], url:"", url_fondo:[]}

    this.cambiar=this.cambio.bind(this);
    this.cambiar_url=this.url_cambio.bind(this);
    this.enviar_mensaje=this.escribir.bind(this);
    this.consulta=this.consultar.bind(this);
    this.cerrar=this.cerrar_sesion.bind(this);
    this.vaciar_chat=this.borrar_todo.bind(this);
    this.cambiar_fondo=this.fondo.bind(this);
    this.mostrar=this.muestra.bind(this);
    this.consulta_fondo=this.mostrar_fondo.bind(this);
    this.envio_tecla=this.enter.bind(this);
  }

  

  cambio(event){
    this.setState({aux:event.target.value});
  }

  url_cambio(event){
    this.setState({url:event.target.value});
  }

  muestra(){//Para mostrar el input para el fondo
    document.getElementById("poner_fondo").style.display="block";
    document.getElementById("cuadro_texto").style.marginLeft="2%";
    document.getElementById("imagen_compartir").style.display="none";
  }

  fondo(){//Para insertar el fondo en la base de datos
    var datos = new FormData();
    
    datos.append('url', this.state.url);
    datos.append('usuario', localStorage.getItem("usuario"));
    fetch("http://localhost/php_react/poner_fondo.php" ,{
      method : 'POST',
      body: datos
    })
    .then(res => res.json())
      .then(
        (result) => {
          if(result='Disponible'){
            this.consulta_fondo();
          }
        },
        (error) => {
          console.log(error);
        }
      )
  }

  mostrar_fondo(){//Para mostrar el fondo en el chat de cada uno
    document.getElementById("poner_fondo").style.display="none";
    document.getElementById("cuadro_texto").style.marginLeft="10%";
    document.getElementById("imagen_compartir").style.display="block";

    var datos = new FormData();

    datos.append('usuario', localStorage.getItem("usuario"));
    fetch("http://localhost/php_react/consultar_fondo.php" ,{
      method : 'POST',
      body: datos
    })
    .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            url_fondo : result[0]
          });
          document.getElementById("cuadro_texto").style.background='url('+this.state.url_fondo.Fondo+') no-repeat center center fixed';
          document.getElementById("cuadro_texto").style.backgroundSize='cover';
          this.setState({url:""});
        },
        (error) => {
          console.log(error);
        }
      )
  }

  borrar_todo(){//Borra todo el chat
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

  consultar(){//Consulta los mensajes de toda la base de datos
    
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
          var scroll = document.getElementById("cuadro_texto");
          scroll.scrollTop = scroll.scrollHeight;//Para que el scroll este abajo
        },
        (error) => {
          console.log("Error leyendo" + error);
        }
      )
  }

  escribir(){//Para mandar los mensajes a la base de datos
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

  cerrar_sesion(){//Cierra la sesion y te manda al login
    localStorage.setItem("usuario","");
    window.location.href="/login";
  }

  enter(e){//Para que se envie el mensaje al darle al enter
    if (e.key === 'Enter') {this.enviar_mensaje()}
  }

  componentDidMount(){//Componentes que se van a ejecutar en cuanto se cargue la pagina
    if(localStorage.getItem("usuario")==""){
      window.location.href="/login";
    }
    this.consulta_fondo();
    this.consulta();
    
  }

  render(){
    
    return (
      <div className="App">
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
            <input type="text" id="campo_texto" value={this.state.aux}  onChange={this.cambiar} onKeyPress={this.envio_tecla} autoFocus />
            <img src={imagen_flecha} id="imagen_flecha" onClick={this.enviar_mensaje}/>
            <img src={imagen_fondo} id="imagen_compartir" onClick={this.mostrar}/>
            <div id="poner_fondo">
              <input type="text" id="fondo_url" placeholder="Pon la url de la foto" onChange={this.cambiar_url} value={this.state.url}/>
              <button className="btn btn-outline-warning" id="boton_fondo" onClick={this.cambiar_fondo}>Enviar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
