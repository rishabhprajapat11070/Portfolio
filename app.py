import os
import smtplib
from email.mime.text import MIMEText
from flask import Flask, request, redirect, url_for, render_template
from threading import Thread

EMAIL = "rp892422@gmail.com"
APP_PASSWORD = "uwkm dtiw isai ypoo"

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


def send_email(user, mail, userMSG):
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
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
            server.starttls()
            server.login(EMAIL, APP_PASSWORD)
            server.send_message(msg)
        print("Email sent ✅")

    except Exception as e:
        print("Error:", e)


@app.route("/submit", methods=["POST"])
def submit():
    user = request.form.get("name")
    mail = request.form.get("email")
    userMSG = request.form.get("message")

    # background thread
    Thread(target=send_email, args=(user, mail, userMSG)).start()

    return redirect(url_for("home") + "#hero")
        
 


@app.route("/index  ")
def portfolio():
    return render_template("index.html")




port = int(os.environ.get("PORT", 5000))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)

# if __name__ == "__main__":
#     app.run(debug=True)

