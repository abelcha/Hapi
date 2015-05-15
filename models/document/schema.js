module.exports = function(db) {

  return new db.Schema({
    date: {
      type: Date,
      default: Date.now()
    },
    name: String,
    type: String,
    id: String,
    link: Number,
    extension: String,
    deleted: {
      type: Boolean,
      default: false
    },
    login: {
      type: String,
      default: 'Inconnu'
    }
  })
}
