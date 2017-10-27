var Xray = require('x-ray');
var fs = require('fs');
var json2csv = require('json2csv');

var dir = './data';
var myData = [];
var x = Xray();
var time = new Date().toLocaleTimeString();
var fields = ['details.title', 'details.price', 'details.image', 'link', 'timestamp'];
var fieldNames = ['Title', 'Price', 'ImageURL', 'URL', 'Time'];


//check to see if data directory exits--if not create the director
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

//scrape the content, push to myData array and write to CSV file
x('http://shirts4mike.com/shirts.php', '.products li', [{
  link: 'a@href',
  details: x('a@href', {price: '.price', title:'title', image: '.shirt-picture img@src' })
}])

(function(err, obj) {
    if (err){
       console.log("There’s been a 404 error. Cannot connect to the to http://shirts4mike.com.");
    } else {
      for ( var i = 0, l = obj.length; i < l; i++ ) {
        myData.push(obj[i]);
    }
      for (var t=0; t<myData.length; t++){
        myData[t].timestamp = time;
    }
      var csv = json2csv({ data: myData, fields: fields, fieldNames: fieldNames });
      var now = new Date();
      fs.writeFile("./data/" + now.toISOString().substring(0,10) + ".csv", csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
    }
    });


