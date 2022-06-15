import spotipy
from spotipy.oauth2 import SpotifyOAuth
import webbrowser
import time
import PIL.Image
import PIL.ImageTk
import wget
import os
import tkinter as T
import PIL as P
import uuid
import threading

def mainloop_thread_func(root):
    root.mainloop()
    print("in thread")



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

# songName = track['item']['name']

while True:
    track = sp.current_user_playing_track()
    if track == None:
        continue

    album_cover_url = track['item']['album']['images'][0]['url']

    if album_cover_url != album_cover_url_prev:
        image_filename = wget.download(album_cover_url, out=str(uuid.uuid4()))

        print(image_filename)

        # if root_prev != None:
        #     root_prev.destroy()
        #     mainloop_thread.join()

        root = T.Tk()
        img = P.ImageTk.PhotoImage(P.Image.open(image_filename).resize((512, 512)))
        img_label = T.Label(root, image=img)
        img_label.pack()
        # root.attributes('-fullscreen', True)
        # root.mainloop()

        mainloop_thread = threading.Thread(target=mainloop_thread_func, args = (root,))
        mainloop_thread.start()

        print("\ntest test")

        if image_filename_prev != None:
            os.remove(image_filename_prev)

        album_cover_url_prev = album_cover_url
        root_prev = root
        image_filename_prev = image_filename

    time.sleep(1)








# webbrowser.open(albumCoverURL)
