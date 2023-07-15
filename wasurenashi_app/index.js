function a1(a) {
    var msg = document.getElementById(a);
    alert(msg.value);
}

function a2(a){
    var array =[
        [<ol>
            <li><input id="1-1" type="text" name="example1"></input><button onclick="a1('1-1')">削除</button></li>
          </ol>],
    ]
    array.forEach(function (value, index) {
        console.log(index + value)
        var text = ""
        var output = document.getElementById(a)
        var item = document.createElement("div")
        output.appendChild(item)
        value.forEach(function (value2, index2) {
            text += value2+""
            item.textContent=text
        })
    
    })
    }

function a3(a) {
    var msg = document.getElementById(a);
    alert(msg.value);
}