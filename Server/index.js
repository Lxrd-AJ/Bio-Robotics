const express = require('express');
const path = require('path')
const port = 8000;
const App = express();
const index_html_path = path.join(__dirname, 'webapp/flower/dist','index.html')

App.use(express.static(path.join(__dirname,'webapp/flower/dist/')))

App.get('/', (req,res) => res.sendFile(index_html_path));

App.listen(port, () => console.log(`SunFlower Server listening on ${port}`));

