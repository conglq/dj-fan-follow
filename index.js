const app = require('./app');
const server = require('http').Server(app);
const config = require('./config');

server.listen(config.http.port, () => {
  console.info(`
  ,=""=,
  c , _,{
  /\\  @ )                 __
 /  ^~~^\\          <=.,__/ '}=
(_/ ,, ,,)          \\_ _>_/~
 ~\\_(/-\\)'-,_,_,_,-'(_)-(_)  -Naughty`);
  console.info('API is listening on port', server.address().port);
});