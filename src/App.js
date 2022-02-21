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
  }

  

  cambio(event){
    this.setState({aux:event.target.value});
  }

  url_cambio(event){
    this.setState({url:event.target.value});
  }

  muestra(){
    document.getElementById("poner_fondo").style.display="block";
    document.getElementById("cuadro_texto").style.marginLeft="2%";
    document.getElementById("imagen_compartir").style.display="none";
  }

  fondo(){
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

  mostrar_fondo(){
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
          console.log(this.state.url_fondo.Fondo);
          document.getElementById("cuadro_texto").style.background='url('+this.state.url_fondo.Fondo+')';
        },
        (error) => {
          console.log(error);
        }
      )
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
    this.consulta_fondo();

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
            <input type="text" id="campo_texto" value={this.state.aux}  onChange={this.cambiar} autoFocus />
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
