import {useEffect, useState} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import './index.css';

function App() {
  const CLIENT_ID = "c95e5112526c4dc1910849858a6a4ca6"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [album, setAlbum] = useState("")

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      var spotifyApi = new SpotifyWebApi();

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
        }, function(err) {
          console.log(err);
        });
      }, 300);

      return () => clearInterval(getCurrentTrack);
  }, [])

  const logout = () => {
      window.localStorage.removeItem("token")
  }

  return (
      <div className="App">
        <div className="album-box">
          <img alt="" src={album}/>
        </div>
      </div>
  );
}

export default App;