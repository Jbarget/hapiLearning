var qs = require('querystring');

module.exports = function(context){
  console.log(context.data.root.query);
  return context.data.root.query.name + context.data.root.query.suffix;
};
