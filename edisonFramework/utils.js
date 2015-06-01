module.exports = {

    date: {

        firstDayOfThisWeek: function() {
            var date = new Date;
            date = date.strtotime("last monday + 1 week");
            return date.setHours(0);
        },
        firstDayOfThisMonth: function() {
            var date = new Date;
            date = date.strtotime("last month + 1 month");
            return date.setHours(0);
        },
        today: function(dateObj) {
            var date = new Date;
            if (dateObj)
                return new Date(date.setHours(0))
            return date.setHours(0);
        }
    }

}
