'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};

function sqlParserCols(obj, sql){
  var f, p, a;
  var arr = []
  var arr_r = []

  p = sql.lastIndexOf('from');
  a = sql.replace(/select/g,'').trim().split('from');
  a.pop();
  sql = a.join(' ').replace(/ +(?= )/g,'');

  for (f in obj){
    p = sql.indexOf(f)
    if (p>=0){
      arr.push({
        index: p,
        field: f
      });
    }
  }

  arr.sort(function(v1,v2){
    if (v1.index < v2.index) return -1;
    if (v1.index > v2.index) return 1;
    return 0;
  })

  arr.forEach(function(item){
    arr_r.push(item.field)
  })

  return arr_r;
}