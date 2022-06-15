from tkinter import *
from PIL import ImageTk, Image
import time

root = Tk()

apply_img = ImageTk.PhotoImage(Image.open('test.png').resize((512, 512)))

apply_img_label = Label(root, image=apply_img)

apply_img_label.pack()

root.mainloop()

time.sleep(3)
root.destroy()