function a1(a) {
    $("#"+a).remove();
}

var idx = 1;

function a2(a){
    var array =[
        [""],
    ]
    array.forEach(function (value, index) {
        console.log(index + value)
        var text = ""
        var output = $("#"+a)
        var item = document.createElement("div")
        output.append('<li id="row-'+idx+'"><input id="1-1" class="1-5" type="text" name="example1"></input><button class=1-4 onclick="a1(\'row-'+idx+'\')">削除</button></li>')
        idx++;
    })
    }

function a3(a) {
    $(".1-4").each(function(i, elem) {
        $(elem).replaceWith('<input type="checkbox" class="check">');
    });
    $(".1-5").each(function(i, elem) {
        $(elem).prop('disabled', true);
    });
    $("#1-6").replaceWith('<h3 style="text-align:right" id="2-1"><button id="2-2" onclick="b1()">完了</button></h3>');
    $("#1-7").prop('disabled', true);
    createItem()
}

//location.href="index2.html"　disabled $("#1-4").replaceWith('<input type="checkbox">');

function b1() {
    location.href="index3.html"
    createHistory()
}

function d1() {
    location.href="index.html"
}