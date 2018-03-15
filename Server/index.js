const express = require('express');
const port = 8000;
const App = express();

App.get('/', (req,res) => res.send("Hello World"));

App.listen(port, () => console.log(`SunFlower Server listening on ${port}`));

