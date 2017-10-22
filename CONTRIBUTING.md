# Contributing guide for vikserver projects
### Thanks for contributing!
This guide is for projects from the vikserver organization

## How to contribute
- To contribute, you have to be aware of the needs of the project
- Pull Request
  - Pull request messages must follow the template made for this purpose. If the PR don't follow the template won't be accepted but exceptions
  - The template can be edited with a PR. 
  - If new dependencies are added, the way to load them must follow the Dependencies rules 
  - When crypto.js or socketctl.js are modified, you must read the Criptogrphy and Communications section
  - When changes involve what the user sees and reads, you must read the User communications section 
- Issues
  - When a error ocurrs on the program, you have to report it in order to solve the incidence
  - There is a beautiful template made with a big effort that will guide you throught the Incidence report process and will save much time. The template can be modified throush a PR
  - You can use incidence reports to make feature requests 

## Actual project needs
- You can see more about the project needs visiting [our project page on GitHub](https://github.com/orgs/vikserver/projects)
- Things we'll always need:
  - Test the new features
  - Report incidences
  - Little modifications in the docs

## Dependencies rules
- Dependencies can be included by
  - Pull Requests on [mrvik/jsloader](https://github.com/mrvik/jsloader) adding a new definition (a CDN URL)
  - Adding a submodule on [vikserver/vikserver2](https://github.com/vikserver/vikserver-backend)
  - Fonts can be put on /fonts
  - Modifying package*.json
- Dependencies must be loaded on the same way
  - JS and CSS files
    - Throught `load()` function from [mrvik/jsloader](https://github.com/mrvik/jsloader)
    - Fonts
      - Thought style sheets
    - Other files (like HTML)
      - With the `fetch()` API
      - Other load methods can be introduced if
        - are asynchronous (we prefer Promise)
        - they don't block script execution
        - why are introduced is well documented

## Criptogrphy and Communications rules
When socketctl.js is modified, the way the frontend communicates with the backend changes
Many of the modifications on crypto.js requires a modification on the [backend](https://github.com/vikserver/vikserver-backend)
So it's fundamental to follow this rules in order to keep the speed and security
- Criptography
  - The framework used for encryption is openpgp and cannot be replaced
  - The framework used for verifying is js-sha256 and also cannot be replaced
  - When this frameworks can be changed?
    - When there is another framework that implements more required features, is faster or more secure
- Communications
  - If the new feature or fix isn't full compatible with the existent server,
    - changes must be documented in order to fix it,
    - or a Pull Request can be open on [vikserver/vikserver-backend](https://github.com/vikserver/vikserver-backend)
  - Every communication with sensitive information must be encrypted. To do this, there are funcions that will do the required tasks. Also will encrypt or sign the data in the way the server can recognize it

## User communication rules
- When communication with the user is necessary, there are a few recommendations that will help. There are clear instructions about this at [google's guidelines about material design](https://material.io/guidelines/style/writing.html#writing-language)
- You can use icons from material icons library (loaded in the project) to give the UI a fresh style. Keep it in mind
