# FAQs
The project tries to be simple and to follow the google's guidelines to Material Design. Altrought, questions can surge. Make sure your question is here, else, you can ask your question in a incidence report. Then, your question can appear here.

## General questions
#### What is this project for?
The aim of this project is to create a safe and fast 'link vault' for your favourite links.

#### What can I do with this?
You can store your links and a description of them. Then they can be accessed from anywhere.

#### I've lost my password, how can I restore it?
Simply, you cannot. The password is essential to open your PGP key, and it cannot be recovered.
The only way to recover it is looking if you saved your password in any wallet. We don't store your password

#### The databases are stored in the cloud, how much secure is it?
The natural state of the databases is encrypted. The encryption is with your key, and nobody can decrypt it. 

#### The PGP key is stored in the cloud with the db, is secure?
The security of your key is the same of the lowest security between your computer, your navigator, and your passphrase strength

## Troubleshooting
If you find an issue, please, report it as soon as you can. This questions can help you.

#### When I do login, the login form doesn't dissapear and my links are not shown
It may be a problem with your internet connection. The homepage sheet is downloaded after successful login.
Reload the page and try again. If the problem persists, press F12 (open DevTools) and make a screenshot. Upload the screenshot to the issue.
#### When I finish typing the username, the password field keeps disabled
Reload the page and try again. If problem persists, press F12 (open DevTools) and make a screenshot. Then upload it to the GitHub issue.
#### When I write the username, the password field is enabled, but the `login` or `register` button doesn't appear
This is a problem with login.js or crypto.js Try reloading the page and if the problem persists, please, create an issue and upload a screenshot of the DevTools (open it with F12 key)
#### When I try to login, my account won't open and shows an alert
This alert is saying that the MySQL sever doesn't have a database that belongs to your user. This is a known issue. #3 issue on GitHub. If it's happening to you, please comment on the issue.
#### When I'm inside of my account, the link cards doesn't mutate on click
This is an issue from Materialize or home.js Try reloading, if problem persists create a issue and upload a screenshot from DevTools.
