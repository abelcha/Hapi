module.exports = {
    date: {
        firstDayOfThisWeek: function(dateObj) {
            var tmp = new Date;
            tmp = tmp.setHours(0);
            var day = tmp.getDay() || 7;
            if (day !== 1)
                tmp.setHours(-24 * (day - 1));
            return date ? tmp : tmp.getTime();
        },
        firstDayOfThisMonth: function(dateObj) {
            var tmp = new Date;
            var date = new Date(tmp.getFullYear(), tmp.getMonth(), 1)
            return dateObj ? date : date.getTime();
        },
        today: function(dateObj) {
            var date = new Date;
            if (dateObj)
                return new Date(date.setHours(0))
            return date.setHours(0);
        }
    }

}