function question_add(id) {
    var $div = $("<div>", {"class": "q"});
    var $ul = $("<ul>"),
        $ul2 = $("<ul>");
    $ul.append($("<li>").html("שאלה: ").append($("<div>", {"class": "editable"}).html("הכנס שאלה")));
    $ul.append($("<li>").html("תשובה: ").append($("<div>", {"class": "editable"}).html("הכנס תשובה נכונה")));
    $ul2.append($("<li>",{"class": "editable"}).html("הכנס משהו"));
    $ul.append($("<li>").html("תשובות לא נכונות: ").append($ul2));
    $div.append($ul);
        
    var $button = $("<button>", {"class": "btn btn-default"}).html("הסר");
    $button.click( function () {
        $(this).parent().remove();
    });
    $div.append($button);
    $button = $("<button>", {"class": "btn btn-default"}).html("הוסף הטעיה");
    $button.click(function () {
        var $listitem  = $(this).parent().find("li");
        $("<li>", {"class": "editable"}).html("הכנס משהו").insertAfter($listitem[$listitem.length - 1]);
        set_questionlistener();
    });
    $div.append($button);
    
    var a = $("#" + id).children(".q");
    $div.append($("<hr>", {"class": "fade"}));
    $div.insertAfter(a[a.length - 1]);
    set_questionlistener();
}

function remove_qeditor(){
    try {
            var parent  = $("#editor").parent();
            var text = $("#editor").children("input")[0].value;
            $("#editor").remove();
            parent.html(text);
        } catch(TypeError) {
            //console.log(TypeError);
        }
}

function set_questionlistener(){
    $(".editable").dblclick( function () {
        var $domOb = $(this);
        remove_qeditor();
        
        text = $domOb.html();
        $(this).empty();
        var $div = $("<div>", {"class": "input-group input-group-sm col-xs-8 editable", "id": "editor"});
        var $input = $("<input>", {"type": "text", "class": "form-control", "value": text});
        var $span = $("<span>", {"class": "input-group-btn"});
        var $button = $("<button>", {"class": "btn btn-default"}).html("הסר");
        $button.click( function () {
            $domOb.remove();
        });
        if ($domOb.parent().children().length == 1){
            $button.prop("disabled", true);
        }
        $span.append($button);
        if ($(this)[0].tagName == "LI"){
            $div.append($input);
            $div.append($span);
            
        } else {
            $input.attr("size", "100");
            $div.append($input);
        }
        $(this).append($div);
    });
    
    $("#qs1").click(function (e) {
        if ($(e.target).is("div")){
                remove_qeditor();
            }
    });
    $("#qs2").click(function () {
        remove_qeditor();
    });
    $("#editor").click(function (e) {
        e.stopPropagation();
    });
}

