![](https://github.com/jordandlaman/gemini-tests/workflows/.github/workflows/github-ci.yml/badge.svg)

**  TESTS RUN WITH CYPRESS.IO **

REQUIRED DEPS

* NODE 10.x.x +
* NPM

INSTALL INSTRUCTIONS
( This assumes you have node and npm already installed )

* ```cd gemini-tests```
* ```npm install```

RUN INSTRUCTIONS

* ```npm run cypress:open``` opens the cypress gui which allows you more debugging access and browser access if we were interacting with front end tests
* ```npm run cypress:run``` runs the tests headlessly
* ```npm run cypress:ci``` runs the tests headlessly and pushes results + outputs (terminal and videos) to cypress.io dashboard (the project is public will need to login to view the dashboard)


THOUGHTS

* Fun exercise in node/javascript land.  Hadn't done tests using the crypto library and was good learning exp translating the python snippets to JS
* I didn't go into all the valid test cases as I was getting up there in cases and didn't want to load up too many per the brief
* api-key and api-secret are located in cypress.json and being passed as CYPRESS env vars.  Usually you wouldn't want to leave creds in plain text so just assume they are being managed by a secrets vault and coming in as env vars.
* The custom command simplified things which allowed me to have a more flexible runtime for my payloads as Cypress tests are en-queued at runtime so only one nonce was being invoked in the original spec file (order-header-validation) which blocked it from having variable payloads that were valid in one test file.  

