const express = require('express');
const app = express();
const path = require('path');
const moment = require('moment-timezone');
moment.locale('pt-BR')

app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'html');


app.use(function(req, res, next) {
  res.status(404).redirect(`https://webfoxy.repl.co/`);

});

function runWebsite(){

  app.listen(3000, ()=>{console.log(`[${moment().tz("America/Sao_Paulo").calendar()}] 👍 O servidor esta pronto!`)});

}
module.exports = runWebsite;