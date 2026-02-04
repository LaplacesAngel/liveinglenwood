import csv
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import getpass
import os

def send_emails():
    print("==========================================")
    print("      GLENWOOD EMAIL UPDATE SENDER       ")
    print("==========================================")
    
    # 1. Get Credentials
    print("\n--- Step 1: Login Details ---")
    sender_email = input("Enter your Gmail address: ")
    # Note: This requires an App Password, not the regular password
    password = getpass.getpass("Enter your Gmail App Password (hidden): ")

    # 2. Get Message Details
    print("\n--- Step 2: Email Content ---")
    subject = input("Email Subject: ")
    print("Enter the body of your email (Press Enter then Ctrl+Z (Windows) or Ctrl+D (Mac/Linux) to finish):")
    body_lines = []
    try:
        while True:
            line = input()
            body_lines.append(line)
    except EOFError:
        pass
    body = "\n".join(body_lines)

    # 3. Read Subscribers
    print("\n--- Step 3: Reading Subscribers ---")
    subscribers = []
    csv_file = "subscribers.csv"
    
    if not os.path.exists(csv_file):
        print(f"ERROR: {csv_file} not found!")
        print("Please create a 'subscribers.csv' file with an 'email' column.")
        return

    try:
        with open(csv_file, mode='r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if 'email' in row and row['email']:
                    subscribers.append(row['email'].strip())
                elif 'Email' in row and row['Email']:
                     subscribers.append(row['Email'].strip())
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    count = len(subscribers)
    print(f"Found {count} subscribers.")
    
    if count == 0:
        print("No subscribers found. Exiting.")
        return

    confirm = input(f"\nReady to send to {count} people? (yes/no): ").lower()
    if confirm != 'yes':
        print("Cancelled.")
        return

    # 4. Send Emails
    print("\n--- Step 4: Sending... ---")
    
    port = 587  # For starttls
    smtp_server = "smtp.gmail.com"
    context = ssl.create_default_context()

    try:
        server = smtplib.SMTP(smtp_server, port)
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login(sender_email, password)
        
        # We will send as BCC to protect privacy involved in bulk emailing
        message = MIMEMultipart()
        message["From"] = sender_email
        message["Subject"] = subject
        # To field is required, usually we put the sender's own email or a generic one
        message["To"] = sender_email 
        
        message.attach(MIMEText(body, "plain"))
        
        # Add all subscribers to BCC
        # Note: Gmail has limits (usually 500/day and max recipients per message).
        # For small lists, a single BCC batch is fine. For larger, we'd need to loop.
        
        # Sending individually is safer for spam filters but slower.
        # Let's send individually for better deliverability on small lists.
        
        success_count = 0
        for email in subscribers:
            try:
                # Create a fresh message for each user to avoid exposing other emails in headers if we messed up BCC
                msg = MIMEMultipart()
                msg["From"] = sender_email
                msg["To"] = email
                msg["Subject"] = subject
                msg.attach(MIMEText(body, "plain"))
                
                server.sendmail(sender_email, email, msg.as_string())
                print(f"Sent to: {email}")
                success_count += 1
            except Exception as e:
                print(f"Failed to send to {email}: {e}")

        print(f"\nDone! Successfully sent {success_count}/{count} emails.")
        
    except Exception as e:
        print(f"\nCRITICAL ERROR: {e}")
        print("Tip: Ensure you are using an 'App Password', not your main Gmail password.")
        print("Go to Google Account > Security > 2-Step Verification > App Passwords.")
    finally:
        try:
            server.quit()
        except:
            pass

if __name__ == "__main__":
    send_emails()
