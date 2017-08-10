Element.prototype.setAttributes = function (attrs) {
    for (var idx in attrs) {
        if ((idx === 'styles' || idx === 'style') && typeof attrs[idx] === 'object') {
            for (var prop in attrs[idx]){this.style[prop] = attrs[idx][prop];}
        } else if (idx === 'html') {
            this.innerHTML = attrs[idx];
        } else {
            this.setAttribute(idx, attrs[idx]);
        }
    }
};

function make_nav_bar(){
    var $navbar = $("<nav>", {"class": "navbar navbar-inverse navbar-fixed-top"}),
        $div = $("<div>", {"class": "container-fluid pull-right"}),
        $div2 = $("<div>", {"class": "navbar-header"}),
        $a = $("<a>", {"class": "navbar-brand", "href": "#"});
    $a.html("כותרת");
    $div2.append($a);
    $div.append($div2);
    $navbar.append($div);
    $("#content").append($navbar);   
}

function content_make_sidebar(){
    var path = "project",
        fs = require("fs");
    var $sidebar = $("<div>", {"class": "col-sm-3 col-md-2 col-lg-2 sidebar"}),
        $list = $("<div>", {"class": "top"}),
        $buttons = $("<div>", {"class": "bottom"}),
        $ul = $("<ul>", {"class": "nav nav-pills nav-stacked", "id": "sidebar-options"}),
        $li = null,
        $a = null;
    var json = JSON.parse(fs.readFileSync(path + "/index.json"));
    for (var i = 0; i < json.list.length; i += 1){
        var finalpath = path + "/" + json.list[i].foldername;
        $a = $("<a>", {"href": "#main", "data-toggle": "tab", "name": finalpath}).html(json.list[i].elementname);
        $li = $("<li>").append($a);
        $a.on('click', function () {
            start(this);  
        });
        $ul.append($li);
    }
    $list.append($ul);
    
    $buttons.append($("<button>", {"class": "btn btn-primary controlbutton", "type": "button"}).html("+").click(function (){newtosfos(path)}));
    $buttons.append($("<button>", {"class": "btn btn-primary controlbutton", "type": "button"}).html("-").click(function (){removetosfos(path)}));
    $buttons.append($("<br>"));
    $buttons.append($("<button>", {"class": "btn btn-default controlbutton", "type": "button"}).html("&uarr;").click(function (){moveup(this, path)}));
    $buttons.append($("<button>", {"class": "btn btn-default controlbutton", "type": "button"}).html("&darr;").click(function (){movedown(this, path)}));
    
    $sidebar.append($list);
    $sidebar.append($buttons);
    return $sidebar;
}

function content_make_content(){
    var $maincontent = $("<div>", {"class": "col-sm-9 col-md-10 col-lg-10 main", "id": "main"});
    
    return $maincontent;
}

function make_content(){
    var $cont = $("<div>", {"class": "container"}),
        $row = $("<div>", {"class": "row"});
    
    $row.append(content_make_sidebar());
    $row.append(content_make_content());
    $cont.append($row);
    $("#content").append($cont);
    
}

$(document).ready( function () {
    make_nav_bar();
    make_content();
});