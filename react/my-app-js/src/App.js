import {useEffect, useState} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import './index.css';

function App() {
  const CLIENT_ID = "c95e5112526c4dc1910849858a6a4ca6"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [album, setAlbum] = useState("")
  const [song, setSong] = useState("")
  const [artist, setArist] = useState("")
  const [isTextVis, setTextVis] = useState("")
  const [isFS, setFS] = useState("");

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      setTextVis(false);
      setFS(false);

      var spotifyApi = new SpotifyWebApi();

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }
      spotifyApi.setAccessToken(token);

      const getCurrentTrack = setInterval(() => {
        spotifyApi.getMyCurrentPlayingTrack().then(function(data) {
          if (data) {
            setAlbum(data.item.album.images[0].url);
            setSong(data.item.name);
            setArist(data.item.artists[0].name);
          }
        }, function(err) {
          const status = JSON.parse(err.response).error.status;
          if (status == 401) {
            window.localStorage.removeItem("token")
            window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`
          }
        });
      }, 300);

      return () => {
        clearInterval(getCurrentTrack);
      }
  }, [])

  const flipTextVis = () => {
    if (isTextVis) {
      setTextVis(false);
    } else {
      setTextVis(true);
    }
  }

  const flipFullScreen = () => {
    console.log("flipping");
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFS(false);
    } else {
      document.documentElement.requestFullscreen();
      setFS(true);
    }
  }

  return (
    <div>
      {isFS ?
      <button className='full-screen-button-hidden' onClick={flipFullScreen}>x</button>
      :
      <button className='full-screen-button' onClick={flipFullScreen}>Full Screen</button>
      }
      {album != "" ? 
      <div className="App">
        {isTextVis ? 
        <div onClick={flipTextVis} className="album-box">
          <img className='my-image my-image-opc' draggable='false' alt="" src={album}/>
          <h1 className='text-in centered'><i>{song}</i><br/><h2>{artist}</h2></h1>
        </div>
        : 
        <div onClick={flipTextVis} className="album-box">
          <img className='my-image' draggable='false' alt="" src={album}/>
          <h1 className='text-out centered'><i>{song}</i><br/><h2>{artist}</h2></h1>
        </div>
        }
      </div>
      :
      <div/>
      }
    </div>
  );
}

export default App;