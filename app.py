from flask import Flask,render_template,request,redirect,url_for
import os
import smtplib
from email.mime.text import MIMEText
import time

EMAIL = "rp892422@gmail.com"
APP_PASSWORD = "uwkm dtiw isai ypoo"

app = Flask(__name__)

@app.route("/",methods=['GET','POST'])
def home():
    return render_template("index.html")


@app.route("/submit",methods=['POST'])
def Submit():

    # user = request.form.get("name")
    # mail = request.form.get("email")
    # userMSG = request.form.get("message")
    
    # data = f"name:{user},mail:{mail},msg:{userMSG}\n"
    
    
    # with open("user_detail.txt","a") as f:
    #     f.write(data)
    # return redirect(url_for("home"))
    
    user = request.form.get("name")
    mail = request.form.get("email")
    userMSG = request.form.get("message")

    # 📩 Email content
    subject = "New Form Message 🚀"
    body = f"""
    New Contact Form Portfolio Submission:

    Name: {user}
    Email: {mail}
    Message: {userMSG}
    """

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL
    msg["To"] = EMAIL

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL, APP_PASSWORD)
            server.send_message(msg)
        print("Email sent ✅")

    except Exception as e:
        print("Error:", e)

    return redirect(url_for("home") + "#hero")
        
 


@app.route("/index  ")
def portfolio():
    return render_template("index.html")




# port = int(os.environ.get("PORT", 5000))

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=port)

if __name__ == "__main__":
    app.run(debug=True)

