module.exports = {
  model:{
    artisan: require('../models/artisan'),
    intervention: require('../models/intervention'),
    user: require('../models/user')
  },
  getModel:function(modelStr) {
    for (k in this.model) {
      if (k === modelStr) {
        return (this.model[k]);
      }
    }
    return (null);
  }
}
