# React-Twitter

Create backend and frontend folders

    cd .\frontend\
    npm create vite@latest .


√ Select a framework: » React
√ Select a variant: » JavaScript


    npm install


--Root--

    npm init -y
    npm install express mongoose jsonwebtoken bcryptjs dotenv cors cookie-parser cloudinary
    npm i -D nodemon

package.json => 
    "type": "module" 
    "main": "backend/server.js" 
    "dev": "nodemon backend/server.js" 
    "start": "node backend/server.js"

backend/server.js => 
    import express ...
    app.listen(...)

create folders
    backend/controllers
    backend/routes
    backend/models
