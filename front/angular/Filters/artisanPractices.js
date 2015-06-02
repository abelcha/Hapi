angular.module("edison").filter('artisanPractice', function(){
  return function(sst, categorie){
    return (sst.categories.indexOf(categorie) > 0);
  }
});