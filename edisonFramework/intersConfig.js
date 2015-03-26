var getDaysInMillisec = function(dayNbr) {
      var d = new Date;
      var hoursToday = (d.getHours() * 3600000) + (d.getMinutes() * 60000);
      var day = 1000 * 60 * 60 * 24;
      return (dayNbr * day + hoursToday)
}

module.exports = {
    selectedFilter : 0,
    pageTitle: "Interventions",
    interFilters : [{
            title:"Interventions", 
            icon:'truck',
            list: [
                  {id:0, type:0, title:"Toutes les Interventions",  cleanTitle:'All', filter: {}},
                  {id:1, type:0, title:"Interventions en Cours", cleanTitle:'encours', filter: {etat:"ENC"}},
                  {id:2, type:0, title:"Interventions à Prog.", cleanTitle:'aprogr', filter: {etat:"APR"}},
                  {id:3, type:0, title:"Interventions Annulés", cleanTitle:'annules', filter: {etat:"ANN"}},
                  {id:4, type:0, title:"Interventions Confirmés", cleanTitle:'confirmes', filter: {etat:"INT"}},
                  {id:5, type:0, title:"A Vérifié", cleanTitle:'aVerifier', filter: {aVerifier:true}}, // et pas payé
            ]},{
             title:"Devis", 
             icon:'building-o',
             list: [
                  {id:6, type:1, title:"Tous les Devis", cleanTitle:'DevisEnCours', filter: {etat:"DEV"}},
                  {id:7, type:1, title:"Devis en cours", cleanTitle:'DevisEnCours', filter: {etat:"DEV"}},
                  {id:8, type:1, title:"Devis Acceptés", cleanTitle:'DevisAccepte'},
            ]},{
              title:"Relances",
              icon:'bell',
              list: [
                  {id:9 , type:2, title:"Relances Sst", cleanTitle:'RelancesSst', filter:{ClientPmntClass: "SP0"}, grouping:"artisan"},
                  {id:10 , type:2, title:"Relances Sst Urgentes", cleanTitle:'RelancesSstUrgent', filter:{ClientPmntClass: "SP03"}, grouping:"artisan"},
                  {id:11, type:2, title:"Relance Client", cleanTitle:'RelancesClient', filter:{ClientPmntClass: "FCT0", reglSP:false}},
                  {id:12, type:2, title:"Relance Client Urgentes", cleanTitle:'RelancesClientUrgent', filter:{ClientPmntClass: "FCT03", reglSP:false}}
            ]},{
              title:"Comptabilité",
              icon:'dollar',
              list: [
                  {id:13 , type:3, title:"Bordeau de remise", cleanTitle:'BordereauDeRemise', filter:{SstPmntClass:"OK"}, grouping: 'jourPmntSst', orderBy:'id'},
                  {id:14 , type:3, title:"SST à payer", cleanTitle:'SstAPayé', filter:{ClientPmntClass:"OK", SstPmntClass:"NO"}},
            ]}
    ],
      getFilter: function(cleanTitle) {
      var self = this;
      for (var k in self.interFilters) {
        for (var x in self.interFilters[k].list) {
          e = self.interFilters[k].list[x];
          if (e.cleanTitle === cleanTitle) {
            if (typeof e.grouping !== 'undefined')
              self.selectedGrouping = e.grouping;
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
      for (var k in this.telepro) {
        if (this.telepro[k].login == name)
          return (k);
      }
      return (-1);
    },





    selectedDate: 0,
    interDate: [
      {cleanTitle:"All",    fr:"Toutes", url:"ALL",   ts:0},
      {cleanTitle:"Today",  fr:"Jour", url:"Today",   ts:getDaysInMillisec(0)},
      {cleanTitle:"Week",   fr:"Semaine", url:"Week", ts:getDaysInMillisec(7)},
      {cleanTitle:"Month",  fr:"Mois", url:"Month",   ts:getDaysInMillisec(28)},
    ],
    getDate: function(name) {
      for (var k in this.interDate) {
        if (this.interDate[k].url == name)
          return (k);
      }
      return (0);
    },



    interGrouping: [
      {name: 'Aucun', grouping: 'NOPE'},
      {name: 'Artisan', grouping: 'artisan'},
      {name: 'Telepro', grouping: 'telepro'},
      {name: "Jour",    grouping: 'jour'}
    ],

    selectedGrouping: "NOPE",

    parseFilter: function(query) {
      var self = this;
      self.selectedFilter = 0;
      self.selectedTelepro = -1;
      self.selectedGrouping = "NOPE";
      query.forEach(function(e, i) {
        if (!self.selectedFilter)
          self.selectedFilter = self.getFilter(e);
        if (self.selectedTelepro == -1)
          self.selectedTelepro = self.getTelepro(e);
        if (!self.selectedDate)
          self.selectedDate = self.getDate(e);
      });
    }
}