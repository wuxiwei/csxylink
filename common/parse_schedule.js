//课程表数据爬虫处理
var cheerio = require('cheerio');

var NUM_WEEK = {
  '1': 'Mon',
  '2': 'Tue',
  '3': 'Wed',
  '4': 'Thu',
  '5': 'Fri',
  '6': 'Sat',
  '7': 'Sun'
};
var NUM_CLASS = {
  '1': '1-2',
  '2': '3-4',
  '3': '5-6',
  '4': '7-8',
  '5': '9-10',
  '6': '11-12'
};



function parse_week(weekstr, week_kind) {
  var expand = function(strs) {
    var list = [];
    strs = strs.split('.');
    strs.forEach(function(data) {
      if (data.indexOf('-') == -1) {
        list.push(parseInt(data));
      } else {
        var start = parseInt(data.split('-')[0]);
        var end = parseInt(data.split('-')[1]);
        for (var i = start; i <= end; i++) {
          list.push(i);
        }
      }
    });
    return list;
  };
  var isOdd = function(num) {
    return num & 1;
  };
  var flag;
  var weeks = [];
  switch (week_kind) {
    case '整':
      flag = 0;
      break;
    case '单':
      flag = 1;
      break;
    case '双':
      flag = 2;
      break;
  }
  weeks = expand(weekstr);
  weeks = weeks.filter(function(obj) {
    if (!flag) return true;
    else if (flag == 1) {
      return isOdd(obj);
    } else if (flag == 2) {
      return !isOdd(obj);
    }
  });
  return weeks;
}

function parse_single_class(iter) {
  iter = iter.replace(/(\w) (\w)/g, '$1_$2');
  iter = iter.replace(/节|周/g, '');
  iter = iter.replace(/\s+/g, '|');
  var cols = iter.split('|');
  if (cols.length == 6) { //normal class
    var submap = {};
    submap['class_name'] = cols[0].replace(/(\w)_(\w)/g, '$1$2').trim();
    submap['teacher_name'] = cols[1].replace(/(\w)_(\w)/g, '$1$2').trim();
    submap['classrom'] = cols[2].trim();
    submap['weeks'] = parse_week(cols[3], cols[4]);
    submap['class_length'] = cols[5].trim();
    return submap;
  } else if (cols.length == 5) { //sport class
    var submap = {};
    submap['class_name'] = cols[0].replace(/(\w)_(\w)/g, '$1$2').trim();
    submap['teacher_name'] = cols[1].replace(/(\w)_(\w)/g, '$1$2').trim();
    submap['classrom'] = '';
    submap['weeks'] = parse_week(cols[2], cols[3]);
    submap['class_length'] = cols[4].trim();
    return submap;
  }
}

function parse(html) {
  html = html.replace(/<br/g, '|<br');
  var $ = cheerio.load(html);
  var output = {};
  for (var i = 1; i <= 7; i++) {
    output[NUM_WEEK[i]] = {};
    for (var j = 1; j <= 6; j++) {
      (output[NUM_WEEK[i]])[NUM_CLASS[j]] = [];
    }
  }
  /*
  5-2 5-3 5-4 5-5 5-6 5-7 5-8
  6-2 6-3 6-4 6-5 6-6 6-7 6-8
  7-2 7-3 7-4 7-5 7-6 7-7 7-8
  8-2 8-3 8-4 8-5 8-6 8-7 8-8
  9-2 9-3 9-4 9-5 9-6 9-7 9-8
  10-2 10-3 10-4 10-5 10-6 10-7 10-8
  */
  for (var i = 5; i <= 10; i++)
    for (var j = 2; j <= 8; j++) {
      var row = $('#grid > table > tr:nth-child(' + i + ') > td:nth-child(' + j + ')').text();
      var rows = row.split('节|');
      for (var k = 0; k < rows.length; k++) {
        output[NUM_WEEK[j - 1]][NUM_CLASS[i - 4]].push(parse_single_class(rows[k]));
      }
    }

  return output;
}


exports.parse = parse;
