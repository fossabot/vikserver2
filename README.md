# Vikserver2
[![Build Status](https://travis-ci.org/vikserver/vikserver2.svg?branch=master)](https://travis-ci.org/vikserver/vikserver2)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fvikserver%2Fvikserver2.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fvikserver%2Fvikserver2?ref=badge_shield)

### This is the continuation of the Vikserver project
The vikserver project technologies were old fashioned, so this project has the same target reached with a newer technologies.
The most important objectives are:
- A easy to use app
- A fast movement inside the app
- A stable interface
- Keep the links safe from intruders

- Those objectives are reached by following the Material Design guidelines and the recommendations from the Lighthouse reports. This reports are uploaded to github when the code in the master branch changes.
- Over the security target is important to think on this:
  - We cannot secure your computer against a keylogger.
  - Also, when the link database is open, be careful with the extensions you use, they can read the decrypted DB.
  - Your password strength is also important. Your private key is secured with this password and if it is reached, your account is on risk.
  - The security of the project relies on:
    - The communications with the server are done over TLS, so nobody can touch the original scripts from the server.
    - If you forget your password, there's nothing to do, your private key cannot be decrypted anymore.
    - The database transactions with the server are also secured with Open-PGP, so it cannot be read although the TLS connection fails.

### Contributions to the project
- Contributions can be done on:
  - ... Documentation. There is a branch named _gh-pages_ that contains the docs accessible via [vikserver.github.com](https://vikserver.github.com)
  - ... Incidence solving or information gathering
  - ... New features (They could include modifications in the [backend](https://github.com/vikserver/vikserver-backend))
  - ... Cross-browser compatibility (Internet Explorer isn't supported and won't be a supported browser)


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fvikserver%2Fvikserver2.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fvikserver%2Fvikserver2?ref=badge_large)