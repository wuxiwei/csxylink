//成绩爬虫查询数据处理
var cheerio = require('cheerio');

var MAP = {
	'0': '课程性质',
	'1': '课程号',
	'2': '课程名称',
	'3': '考试类型',
	'4': '学时',
	'5': '学分',
	'6': '平时成绩',
	'7': '期末成绩',
	'8': '课程成绩',
};

function parse(html) {
	var $ = cheerio.load(html);
	var output = [];
	$('tr[height=25]').each(function(i, element) {
		var per_grade = {};
		var flag = true;
		if (i !== 0) {
			$(this).find('td').each(function(i1, element1) {
				if ($(this).text().trim() === "") {
					flag = false;
					return;
				}
				per_grade[MAP[i1]] = $(this).text().trim();
			});
			if (flag) output.push(per_grade);
		}
	});
	return output;
}

exports.parse = parse;

