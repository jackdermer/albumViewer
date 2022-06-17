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

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      setTextVis(false);

      var spotifyApi = new SpotifyWebApi();

      // window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`
      // spotifyApi.setAccessToken(hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]);

      const handleKeyDown = (event) => {
        console.log("hello");
        switch (event.key) {
          case 'f':
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            } 
            break;
          case 'l':
            if (token) {
              logout()
            } else {
              window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`
            }
            break;
          default:
            break;
        }
      }

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }
      spotifyApi.setAccessToken(token);

      document.addEventListener("keypress", handleKeyDown);

      const getCurrentTrack = setInterval(() => {
        spotifyApi.getMyCurrentPlayingTrack().then(function(data) {
          setAlbum(data.item.album.images[0].url);
          setSong(data.item.name);
          setArist(data.item.artists[0].name);
          console.log("updated track");
        }, function(err) {
          console.log(err);
        });
      }, 300);

      // const updateCreds = setInterval(() => {
      //   window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`
      //   spotifyApi.setAccessToken(hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]);
      //   console.log("updated creds");
      // }, 10000)

      return () => {
        clearInterval(getCurrentTrack);
        // clearInterval(updateCreds);
      }
  }, [])

  const logout = () => {
      window.localStorage.removeItem("token")
  }

  const flipTextVis = () => {
    if (isTextVis) {
      setTextVis(false);
    } else {
      setTextVis(true);
    }
  }

  return (
      <div onClick={flipTextVis} className="App">
        {isTextVis ? 
        <div className="album-box">
          <img className='my-image my-image-opc' alt="" src={album}/>
          <h1 className='centered'><i>{song}</i><br/><h2>{artist}</h2></h1>
        </div>
        : 
        <div className="album-box">
          <img className='my-image' alt="" src={album}/>
        </div>
        }
      </div>
  );
}

export default App;