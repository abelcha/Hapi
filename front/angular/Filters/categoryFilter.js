angular.module("edison").filter('categoryFilter', function(){
  return function(sst, categorie){
    return (sst.categories.indexOf(categorie) > 0);
  }
});