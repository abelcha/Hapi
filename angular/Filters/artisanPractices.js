angular.module("edison").filter('artisanPractice', function(){
  console.log("swag");
  return function(sst, categorie){
    console.log("sst, categorie");
    return (sst.categories.indexOf(categorie) > 0);
  }
});