module.exports = {
    selectedFilter : 0,
    pageTitle: "Interventions",
    interFilters : [{
            title:"Interventions", 
            icon:'truck',
            list: [
                  {id:0, title:"Toutes les Interventions",  cleanTitle:'All', filter: {}},
                  {id:1, title:"Interventions en Cours", cleanTitle:'encours', filter: {etat:"ENC"}},
                  {id:2, title:"Interventions à Prog.", cleanTitle:'aprogr', filter: {etat:"APR"}},
                  {id:3, title:"Interventions Annulés", cleanTitle:'annules', filter: {etat:"ANN"}},
                  {id:4, title:"Interventions Confirmés", cleanTitle:'confirmes', filter: {etat:"INT"}},
                  {id:5, title:"A Vérifié", cleanTitle:'aVerifier', filter: {etat:"INT"}}, // et pas payé
            ]},{
             title:"Devis", 
             icon:'building-o',
             list: [
                  {id:6,title:"Tous les Devis", cleanTitle:'DevisEnCours', filter: {etat:"DEV"}},
                  {id:7,title:"Devis en cours", cleanTitle:'DevisEnCours', filter: {etat:"DEV"}},
                  {id:8, title:"Devis Acceptés", cleanTitle:'DevisAccepte'},
            ]},{
              title:"Relances",
              icon:'bell',
              list: [
                  {id:9, title:"Relances Clients", cleanTitle:'RelancesClients'},
                  {id:10, title:"Relances Artisan", cleanTitle:'RelancesArtisan'}
            ]}
    ],
      getFilter: function(cleanTitle) {
      var self = this;
      for (var k in self.interFilters) {
        for (var x in self.interFilters[k].list) {
          e = self.interFilters[k].list[x];
          if (e.cleanTitle === cleanTitle) {
            return (e.id);
          }
        }
      }
      return (0);
    },



    selectedTelepro: -1,
    telepro: [
      {name:"Benjamin", login:"boukris_b"},
      {name:"Tayeb", login:"tayeb"},
      {name:"Harald", login:"harald"},
      {name:"Jeremie", login:"jeremie"},
      {name:"Eliran", login:"eliran"},
      {name:"Thomas", login:"thomas"},
    ],

    getTelepro: function(name) {
      //  console.log("=>", name)
      for (var k in this.telepro) {

        if (this.telepro[k].login == name) {
          return (k);
        }
      }
      return (-1);
    },



    parseFilter: function(query) {
      var self = this;
      self.selectedFilter = 0;
      self.selectedTelepro = -1;
      query.forEach(function(e, i) {

        if (!self.selectedFilter)
          self.selectedFilter = self.getFilter(e);
        if (self.selectedTelepro == -1) {
          self.selectedTelepro = self.getTelepro(e);
          console.log(self.selectedTelepro);
        }
      });
    }
}