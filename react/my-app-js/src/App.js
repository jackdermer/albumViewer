import {useEffect, useState} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import './index.css';

function App() {
  const CLIENT_ID = "c95e5112526c4dc1910849858a6a4ca6"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  var spotifyApi = new SpotifyWebApi();

  const [token, setToken] = useState("")
  const [album, setAlbum] = useState("")

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }
      setToken(token)
      spotifyApi.setAccessToken(token);

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
      setToken("")
      window.localStorage.removeItem("token")
  }

  const getCurrentTrack = () => {
    console.log("called");
    console.log(spotifyApi.getAccessToken())

    spotifyApi.getMyCurrentPlayingTrack().then(function(data) {
      console.log(data);
      setAlbum(data.item.album.images[0].url);
    }, function(err) {
      console.log(err);
    });
  }

  const fullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }


  return (
      <div className="App">
          <header className="App-header">
              {!token ?
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                      to Spotify</a>
                  : <button onClick={logout} hidden>Logout</button>}
          </header>
          <div class="album-box">
            <img onClick={fullScreen} src={album}></img>
          </div>
      </div>
  );
}

export default App;