function indexjsonchange(name, path, foldername, level, necessarymaterial) {
    var fs = require("fs");
    fs.readFile(path + "/index.json", "utf-8", function(err, data) {
        if (err){
            console.log(err);
        } else {
            var json = JSON.parse(data);
            writefile(path + "/index.json", replaceinjson(json, foldername, name, level, necessarymaterial, "changename")); 
        }
    });
}

function replaceinjson (data, foldername, name, level, necessarymaterial, command){
    var v;
    for (var i = 0; i < data.list.length; i+=1){
        v = data.list[i];
        if(v.foldername == foldername){
            switch (command){
                case "changename":
                    data.list[i].elementname = name;
                    data.list[i].level = level;
                    data.list[i].necessarymaterial = necessarymaterial;
                    break;
                case "moveup":
                    if(i > 0){
                        var hold = data.list[i - 1];
                        data.list[i -1] = data.list[i];
                        data.list[i] = hold;
                    }
                    break;
                case "movedown":
                    if(i < data.list.length - 1){
                        var hold = data.list[i + 1];
                        data.list[i + 1] = data.list[i];
                        data.list[i] = hold;
                    }
                    break;
                case "remove":
                    data.list.splice(i, 1);
                    break;
                default:
                    return "done";
            }
            break;
        }
    }
    return data;
}

function writefile(path, data){
    var fs = require("fs");
    fs.writeFileSync(path, JSON.stringify(data), "utf-8");
}

function save() {
    path = FORMER_LOCATION_PATH;
    if (path != null){
        var fs = require("fs");
        fs.writeFileSync(path + "/text1.html", $("#summernote1").summernote('code'), "utf-8", function (err) {
            if(err){
                console.log(err);
            }
        });
        fs.writeFileSync(path + "/text2.html", $("#summernote2").summernote('code'), "utf-8", function (err) {
            if(err){
                console.log(err);
            }
        });
        fs.writeFileSync(path + "/qs1.json", JSON.stringify(jsonify("qs1")), "utf-8", function (err) {
            if(err){
                console.log(err);
            }
        });
        fs.writeFileSync(path + "/qs2.json", JSON.stringify(jsonify("qs2")), "utf-8", function (err) {
            if(err){
                console.log(err);
            }
        });
    }
    
}

function jsonify(id){
    var json = {};
    json.questions = [];
    var list = $("#" + id).children("div.q"),
        current = null;
    for (var i = 0; i < list.length; i+=1){
        current = $($(list[i]).children("ul"));
        var content = {};
        content.question = $(current.find("div.editable")[0]).html();
        content.goodansewer = $(current.find("div.editable")[1]).html();
        content.badansewers = [];
        var badies = current.find("li.editable");
        for (var j = 0; j < badies.length; j+=1){
            var jsonstruct = {};
            jsonstruct.ans = $(badies[j]).html();
            content.badansewers.push(jsonstruct);
        }
        json.questions.push(content);
    }
    
    return json;
}

$(document).keypress("s", function (e){
    if(e.ctrlKey){
        save();
    }
});

function moveup(button, path){
    $(button).prop("disabled", true);
    $(button).next().prop("disabled", true);
    var listelement = $($("#sidebar-options").find(".active")[0]);
    var $before = listelement.prev();
    listelement.insertBefore($before);
    var fs = require("fs");
    var json = JSON.parse(fs.readFileSync(path + "/index.json", "utf-8"));
    var filname = FORMER_LOCATION_PATH.substring(FORMER_LOCATION_PATH.lastIndexOf("/") + 1);
    writefile(path + "/index.json", replaceinjson(json, filname, null, null, null, "moveup"));
    $(button).prop("disabled", false);
    $(button).next().prop("disabled", false);
}

function movedown(button, path){
    $(button).prop("disabled", true);
    $(button).prev().prop("disabled", true);
    var listelement = $($("#sidebar-options").find(".active")[0]);
    var $after = listelement.next();
    listelement.insertAfter($after);
    var fs = require("fs");
    var json = JSON.parse(fs.readFileSync(path + "/index.json", "utf-8"));
    var filname = FORMER_LOCATION_PATH.substring(FORMER_LOCATION_PATH.lastIndexOf("/") + 1);
    console.log(FORMER_LOCATION_PATH);
    writefile(path + "/index.json", replaceinjson(json, filname, null, null, null, "movedown"));
    $(button).prop("disabled", false);
    $(button).prev().prop("disabled", false);
}

function newtosfos(path){
    var fs = require("fs");
    var json = JSON.parse(fs.readFileSync(path + "/index.json", "utf-8"));
    var numlist = [],
        finalnum = 0;
    for (var i = 0; i < json.list.length; i+=1){
        numlist.push(parseInt((json.list[i].foldername).substring(6)));
    }
    numlist.sort();
    for (i = 0; i < numlist.length; i+=1){
        if (i < numlist[i]){
            finalnum = i;
            break;
        }
        if (i == numlist.length - 1){
            finalnum = numlist.length;
        }
    }
    
    var foldername = "folder" + finalnum;
    var elementname = "תוספות" + finalnum;
    var level = "easy";
    var necessarymaterial = "";
    
    var qjson = {"questions": []};
    json.list.push({"foldername":foldername, "elementname":elementname, "level":level, "necessarymaterial":necessarymaterial});
    writefile(path + "/index.json", json);
    fs.mkdirSync(path + "/" + foldername);
    fs.mkdirSync(path + "/" + foldername + "/images");
    fs.writeFileSync(path + "/" + foldername + "/qs1.json", JSON.stringify(qjson), "utf-8");
    fs.writeFileSync(path + "/" + foldername + "/qs2.json", JSON.stringify(qjson), "utf-8");
    fs.writeFileSync(path + "/" + foldername + "/text1.html", "<div></div>", "utf-8");
    fs.writeFileSync(path + "/" + foldername + "/text2.html", "<div></div>", "utf-8");
    
    var $a = $("<a>", {"href": "#main", "data-toggle": "tab", "name": path + "/" + foldername}).html(elementname);
    $a.on('click', function () {
        start(this);  
    });
    var $li = $("<li>").append($a);
    $("#sidebar-options").append($li);
    $($("#sidebar-options li:last-child").children()[0]).trigger("click");
}

function removetosfos(path){
    var fs = require("fs");
    var json = JSON.parse(fs.readFileSync(path + "/index.json", "utf-8"));
    var listelement = $($("#sidebar-options").find(".active")[0]);
    var inner = $(listelement.children()[0]).attr("name");
    writefile(path + "/index.json", replaceinjson(json, inner.substring(inner.lastIndexOf("/") + 1), null, null, null, "remove"));
    deleteFolderRecursive(inner);
    listelement.remove();
    $("#main").empty();
    $(".note-popover").remove();
    FORMER_LOCATION_PATH = null;
}

var deleteFolderRecursive = function(path) {
  var fs = require("fs");
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};





