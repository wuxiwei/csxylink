var config = {
  port: 5000,
  term_schedule: 16,    //查课表看下拉框第几个,每学期维护
  term_grade : new Array(     //每学期维护
    "2008-2009学年第1学期",
    "2008-2009学年第2学期",
    "2009-2010学年第1学期",
    "2009-2010学年第2学期",
    "2010-2011学年第1学期",
    "2010-2011学年第2学期",
    "2011-2012学年第1学期",  
    "2011-2012学年第2学期",
    "2012-2013学年第1学期",
    "2012-2013学年第2学期",
    "2013-2014学年第1学期",
    "2013-2014学年第2学期",
    "2014-2015学年第1学期",
    "2014-2015学年第2学期",
    "2015-2016学年第1学期",
    "2015-2016学年第2学期"
  ),
  db: 'mongodb://127.0.0.1/city',
  db_name: 'city',
};

module.exports = config;
