import os 

msg = "sir how are you"

if os.path.exists("user.txt") :
    with open("user.txt",'a') as f :
        f.write(msg)
else:
    with open("user.txt",'w') as f :
        f.write(msg)
        