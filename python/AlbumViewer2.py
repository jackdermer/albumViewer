import spotipy
from spotipy.oauth2 import SpotifyOAuth
import webbrowser
import time
import wget
import os
import tkinter as T
from PIL import Image as Pil_image
from PIL import ImageTk as Pil_imageTk
import uuid

scope = "user-read-currently-playing"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id="c95e5112526c4dc1910849858a6a4ca6", 
client_secret="bd2a4e83886746c29d16769f14daf9bd",
redirect_uri="https://www.google.com/?client=safari",
scope=scope))

album_cover_url_prev = None
root_prev = None
image_filename_prev = None
root = None
mainloop_thread = None

def my_thread_func(root):
    track = sp.current_user_playing_track()
    album_cover_url = track['item']['album']['images'][0]['url']

    if album_cover_url != album_cover_url_prev:
        root.destroy()
        if image_filename_prev != None:
            os.remove(image_filename_prev)
    else:
        root.after(1000, my_thread_func, root)
        root.mainloop()




while True:
    while sp.current_user_playing_track():
        track = sp.current_user_playing_track()

        album_cover_url = track['item']['album']['images'][0]['url']
        image_filename = wget.download(album_cover_url, out=str(uuid.uuid4()))

        root = T.Tk()
        root.attributes('-fullscreen', True)
        img = Pil_imageTk.PhotoImage(Pil_image.open(image_filename).resize((512, 512)))
        img_label = T.Label(root, image=img) 
        img_label.pack()

        image_filename_prev = image_filename
        album_cover_url_prev = album_cover_url

        root.after(1000, my_thread_func, root)
        root.mainloop()

