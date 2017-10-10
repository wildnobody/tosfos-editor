var FORMER_LOCATION_PATH = null;
function start(object) {
    var path = $(object).attr("name");
    console.log($(object).attr("name"));
    save();
    FORMER_LOCATION_PATH = path;
    $("#main").empty();
    $(".note-popover").remove();
    
    var $title = $("<h1>").html($(object).html());
    $("#main").append($title);
    
    var $menutop = $("<ul>", {"class": "nav nav-tabs"});
    $menutop.append($("<li>", {"class": "pull-right"}).append($("<a>", {"data-toggle": "tab", "href": "#general"}).html("כללי")));
    $menutop.append($("<li>", {"class": "pull-right"}).append($("<a>", {"data-toggle": "tab", "href": "#qs1"}).html("שאלות פתיחה")));
    $menutop.append($("<li>", {"class": "pull-right"}).append($("<a>", {"data-toggle": "tab", "href": "#text1"}).html("הסבר")));
    $menutop.append($("<li>", {"class": "pull-right"}).append($("<a>", {"data-toggle": "tab", "href": "#qs2"}).html("שאלות סיכום")));
    $menutop.append($("<li>", {"class": "pull-right"}).append($("<a>", {"data-toggle": "tab", "href": "#text2"}).html("סיכום")));
    $("#main").append($menutop);
    
    var $tabscontent = $("<div>", {"class": "tab-content"});
    $tabscontent.append(make_general(object, path));
    $tabscontent.append(make_qs1(path));
    $tabscontent.append(make_text1());
    $tabscontent.append(make_qs2(path));
    $tabscontent.append(make_text2());
    $("#main").append($tabscontent);
    
    summernote_init(path);
    set_questionlistener();
}

function make_general(object, path){
    var $tab = $("<div>", {"id": "general", "class": "tab-pane fade"});
    var $namelabel = $("<label>", {"for": "rename"}).html("הכנס שם"),
        $rename = $("<input>", {"type": "text", "id": "rename", "class": "form-control", "value": $(object).html()}),
        $materiallabel = $("<label>", {"for": "material"}).html("הכנס חומר"),
        $material = $("<input>", {"type": "text", "id": "material", "class": "form-control"}),
        $selectlabel = $("<label>", {"for": "selectlevel"}).html("הכנס רמה"),
        $update = $("<input>", {"type": "button", "value": "שנה", "class": "btn btn-default general-button"}),
        $br = $("<br>");
    var $select = $("<select>", {"class": "form-control", "id": "selectlevel"});
    $select.append($("<option>", {"value": "easy"}).html("קל"));
    $select.append($("<option>", {"value": "medium"}).html("בינוני"));
    $select.append($("<option>", {"value": "hard"}).html("קשה"));
    
    $update.click( function () {
        $(object).html($("#rename").val());
        $($("#main").children().get(0)).html($("#rename").val());
        indexjsonchange($("#rename").val(),
                 path.substring(0, path.lastIndexOf("/")), 
                 path.substring(path.lastIndexOf("/") + 1), 
                 $("#selectlevel option:selected").val(), 
                 $("#material").val()
        );
    });
    $tab.append($namelabel);
    $tab.append($rename);
    $tab.append($materiallabel);
    $tab.append($material);
    $tab.append($selectlabel);
    $tab.append($select);
    $tab.append($update);
    $tab.append($br);
    return $tab;
}

function make_qs1(path) {
    var $tab = questions_init(path + "/qs1.json", "qs1");
    return $tab;

}

function make_text1() {
    var $tab = $("<div>", {"id": "text1", "class": "tab-pane fade"});
    var $summernote = $("<div>", {"id": "summernote1"}).html("hello world");
    $tab.append($summernote);
    return $tab;

}

function make_qs2(path) {
    var $tab = questions_init(path + "/qs2.json", "qs2");
    return $tab;

}

function make_text2() {
    var $tab = $("<div>", {"id": "text2", "class": "tab-pane fade"});
    var $summernote = $("<div>", {"id": "summernote2"});
    $tab.append($summernote);
    return $tab;

}

function questions_init(path, id){
    var $tab = $("<div>", {"id": id, "class": "tab-pane fade qustionspanel"}),
        $title = $("<h1>", {"class": "q"}).html("שאלות רגילות");
    $tab.append($title);
    
    var $ul = null,
        $li = null,
        $ul2 = null,
        a = null,
        $div = null,
        $button = null,
        fs = require("fs");
    
    var json = JSON.parse(fs.readFileSync(path));
    for (var i = 0; i < json.questions.length; i+=1){
        $div = $("<div>", {"class": "q"});
        $ul = $("<ul>");
        $ul.append($("<li>").html("שאלה: ").append($("<div>", {"class": "editable"}).html(json.questions[i].question)));
        $ul.append($("<li>").html("תשובה: ").append($("<div>", {"class": "editable"}).html(json.questions[i].goodansewer)));
        
        a = json.questions[i];
        $ul2 = $("<ul>");
        for (var j = 0; j < a.badansewers.length; j+=1){
            $ul2.append($("<li>", {"class": "editable"}).html(a.badansewers[j].ans));
        }
        $li = $("<li>").append($("<p>").html("תשובות לא נכונות: "));
        $ul.append($li.append($ul2));
        $div.append($ul);
        
        $button = $("<button>", {"class": "btn btn-default"}).html("הסר");
        $button.click( function () {
            $(this).parent().remove();
        });
        $div.append($button);
        $button = $("<button>", {"class": "btn btn-default"}).html("הוסף הטעיה");
        $button.click(function () {
            var $listitem  = $(this).parent().find("li");
            //console.log($listitem);
            $("<li>", {"class": "editable"}).html("הכנס משהו").insertAfter($listitem[$listitem.length - 1]);
            set_questionlistener();
        });
        $div.append($button);
        $div.append($("<hr>", {"class": "fade"}));
        $tab.append($div);
            
            
    }
    
    $button = $("<button>", {"class": "btn btn-default"}).html("הוסף שאלה");
    $button.click( function () {
        question_add(id);
    });
    var $div2 = $("<div>").append($button);
    $tab.append($div2);
    
    return $tab;
}

function summernote_init(path){
    var fs = require("fs");
    $("#summernote1").summernote({
        focus: true,
        hight: 400,
        minHeight: 400,
        maxHeight: 600,
        fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Arimo', 'FrankRuhlLibre', 'Rubik', 'VarelaRound'],
        fontNamesIgnoreCheck: ['Arimo', 'FrankRuhlLibre', 'Rubik', 'VarelaRound'],
        toolbar: [
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['fontname', ['fontname']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['insert',['ltr','rtl']],
          ['insert', ['link','picture', 'video', 'hr']],
          ['view', ['fullscreen', 'codeview']]
        ],
        callbacks:{
            onImageUpload: function (image) {
                console.log(image[0].path);
                var fs = require('fs');//needs some work
                var blah = fs.readdirSync(path + "/images");
                var name = "a0" + (image[0].path).substring(image[0].path.lastIndexOf('.'));
                for (var i = 0; i < blah.length; i+=1){
                    if (i < parseInt(blah[i].substring(1, blah[i].lastIndexOf('.')))){
                        name = "a" + i + (image[0].path).substring(image[0].path.lastIndexOf('.'));
                        break;
                    } else {
                        name = "a" + (i + 1) + (image[0].path).substring(image[0].path.lastIndexOf('.'));
                    }
                }
                console.log(blah);
                var image2 = path + "/images/" + name;
                var imagenew = fs.readFileSync(image[0].path);
                fs.writeFileSync(image2, imagenew, function (err){
                    if(err) { 
                      console.log('[write auth]: ' + err);
                    } else {
                      console.log('[write auth]: success');
                        if (success)
                          success();
                    }
                });
                $("#summernote1").summernote('insertImage', image2);
            },
            onMediaDelete : function($target, editor, $editable) {
                console.log($target[0].src);
                var str = $target[0].src;
                $target.remove();
                var fs = require('fs');
                fs.unlinkSync(str.substring(7));
                
            }
        }
    });
    fs.readFile(path + "/text1.html", "utf-8", function(err, data){
        if(err){
            console.log(data);
        } else {
            console.log(data);
            $("#summernote1").summernote('code', data);
        }
    });
    $("#summernote2").summernote({
        lang: 'he-IL',
        hight: 400,
        minHeight: 400,
        maxHeight: 600,
        fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Arimo', 'FrankRuhlLibre', 'Rubik', 'VarelaRound'],
        fontNamesIgnoreCheck: ['Arimo', 'FrankRuhlLibre', 'Rubik', 'VarelaRound'],
        toolbar: [
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['fontname', ['fontname']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['insert',['ltr','rtl']],
          ['insert', ['link','picture', 'video', 'hr']],
          ['view', ['fullscreen', 'codeview']]
        ],
        callbacks:{
            onImageUpload: function (image) {
                console.log(image[0].path);
                var fs = require('fs');//needs some work
                var blah = fs.readdirSync(path + "/images");
                var name = "a0" + (image[0].path).substring(image[0].path.lastIndexOf('.'));
                console.log(blah.length);
                for (var i = 0; i < blah.length; i+=1){
                    if (i < parseInt(blah[i].substring(1, blah[i].lastIndexOf('.')))){
                        name = "a" + i + (image[0].path).substring(image[0].path.lastIndexOf('.'));
                        break;
                    } else {
                        name = "a" + (i + 1) + (image[0].path).substring(image[0].path.lastIndexOf('.'));
                    }
                }
                
                var image2 = path + "/images/" + name;
                var imagenew = fs.readFileSync(image[0].path);
                fs.writeFileSync(image2, imagenew, function (err){
                    if(err) { 
                      console.log('[write auth]: ' + err);
                    } else {
                      console.log('[write auth]: success');
                        if (success)
                          success();
                    }
                });
                $("#summernote2").summernote('insertImage', image2);
            },
            onMediaDelete : function($target, editor, $editable) {
                console.log($target[0].src);
                var str = $target[0].src;
                $target.remove();
                var fs = require('fs');
                fs.unlinkSync(str.substring(7));
                
            }
        }
    });
    fs.readFile(path + "/text2.html", "utf-8", function(err, data){
        if(err){
            console.log(data);
        } else {
            $("#summernote2").summernote('code', data);
        }
    });
}