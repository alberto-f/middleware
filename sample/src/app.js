import middleware from '@alberto-f/middleware';

middleware([function(data, next){
  next(data + 1);
}, function(value){
  console.log(value);
}])(0);
