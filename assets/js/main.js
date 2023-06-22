function test() {
  alert("test");
}

function getWeatherData() {

  //TODO:本番用と切り替える
  //const API_URL = "https://bejewelled-arithmetic-214844.netlify.app/.netlify/functions/GetWeather";
  const API_URL = "http://localhost:9000/.netlify/functions/getweather";


  fetch(API_URL, {
    method: "GET",
  })

    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      var comment_area = document.getElementById("comment");
      var obj_area = document.getElementsByClassName("area");
      var obj_weather = document.getElementsByClassName("weather");
      var obj_icon = document.getElementsByClassName("weather_icon");
      var obj_wind = document.getElementsByClassName("wind");
      var obj_wave = document.getElementsByClassName("wave");

      for (var i = 0; i < data.weather.length; i++) {
        var Code = data.weather[i].weather_code;

        obj_area[i].textContent = data.weather[i].area + "：" + data.weather[i].time;
        obj_weather[i].textContent = data.weather[i].weather;
        obj_wind[i].textContent = data.weather[i].wind;
        obj_wave[i].textContent = "波：" + data.weather[i].wave;

        obj_icon[i].src = getWeatherIconURL(Number(Code));

      }
      comment_area.textContent = data.comment;

    })
    .catch(error => {
      console.log(error);
      alert("通信エラーが発生しました。再度送信ください。");
    });

}

async function getAmedasData() {

  //TODO:本番用と切り替える
  //const API_URL = "https://bejewelled-arithmetic-214844.netlify.app/.netlify/functions/GetAmedasData";
  const API_URL = "http://localhost:9000/.netlify/functions/getamedasdata";

  await fetch(API_URL, {
    method: "GET",
  })

    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      
      let context = document.querySelector("#okayama_chart").getContext('2d')
      //var chartdata = getAmedasData();

      var chartdata = {
        labels: data.time,
        datasets: [{
          label: "降水量",
          data: data.precipitation,
          borderColor: ['#4169e1'],
          backgroundColor: ['#4169e1'],
          type: 'bar',
        },
        {
          label: "気温",
          data: data.temp,
          backgroundColor: ['#FFC20F'],
          borderColor: ['#FFC20F'],
          type: 'line',
        }
        ],
      }
     
      window.myChart = new Chart(context, {

      data:chartdata,
      options: {
        responsive: false,
      }
    }); 
      

    })
    .catch(error => {
      console.log(error);
      alert("通信エラーが発生しました。再度送信ください。");
    });

}

function sendSlack(){
   //TODO:本番用と切り替える
   //const API_URL = "https://bejewelled-arithmetic-214844.netlify.app/.netlify/functions/SlackNotice";
   const API_URL = "http://localhost:9000/.netlify/functions/SlackNotice";


  var comment_area = document.getElementById("comment");
  var msg = comment_area.textContent;

  //コメントをスラックに送信する
  let body = {
    msg: msg,
  };

  // バックエンドAPIへPOST
  const payload = JSON.stringify(body);

  fetch(API_URL, {
    method: "POST",
    body: payload,
  })

    .then((response) => {
      alert("Slackへ送信しました")
    })
    
    .catch(error => {
      console.log(error);
      alert("通信エラーが発生しました。再度送信ください。");
    });
}

function getWeatherIconURL(weather_code) {

  var code = ""

  switch(weather_code){
    //--------Clear（晴れ）-----------------
    case 100:
    case 123:
    case 124:
    case 130:
    case 131:
      code="100";
      break;
 
    //--------晴れ時々（一時）曇り----------------
    case 101:
    case 132:
      code="101";
      break;
 
    //--------晴れ時々（一時）雨----------------
    case 102:
    case 103:
    case 106:
    case 107:
    case 108:
    case 120:
    case 121:
    case 140:
      code="102";
      break;
 
    //--------晴れ時々（一時）雪----------------
    case 104:
    case 105:
    case 160:
    case 170:
      code="104";
      break;
 
    //--------晴れ後曇り----------------
    case 110:
    case 111:
      code="110";
      break;
 
    //--------晴れ後雨----------------
    case 112:
    case 113:
    case 114:
    case 118:
    case 119:
    case 122:
    case 125:
    case 126:
    case 127:
    case 128:
      code="112";
      break;
 
    //--------晴れ後雪----------------
    case 115:
    case 116:
    case 117:
    case 181:
      code="115";
      break;
     
    //--------曇り-----------------
    case 200:
    case 209:
    case 231:
      code="200";
      break;
 
    //--------曇り時々晴れ-----------------
    case 201:
    case 223:
      code="201";
      break;
     
    //--------曇り時々雨-----------------
    case 202:
    case 203:
    case 206:
    case 207:
    case 208:
    case 220:
    case 221:
    case 240:
      code="202";
      break;
     
    //--------曇り一時雪-----------------
    case 204:
    case 205:
    case 250:
    case 260:
    case 270:
      code="204";
      break;
 
    //--------曇り後晴れ-----------------
    case 210:
    case 211:
      code="210";
      break;
 
    //--------曇り後雨-----------------
    case 212:
    case 213:
    case 214:
    case 218:
    case 219:
    case 222:
    case 224:
    case 225:
    case 226:
      code="212";
      break;
     
    //--------曇り後雪-----------------
    case 215:
    case 216:
    case 217:
    case 228:
    case 229:
    case 230:
    case 281:
      code="215";
      break;
     
    //--------雨-----------------
    case 300:
    case 304:
    case 306:
    case 328:
    case 329:
    case 350:
      code="300";
      break;
 
    //--------雨時々晴れ-----------------
    case 301:
      code="301";
      break;
     
    //--------雨時々曇り-----------------
    case 302:
      code="302";
      break;
     
    //--------雨時々雪-----------------
    case 303:
    case 309:
    case 322:
      code="303";
      break;
     
    //--------暴風雨-----------------
    case 308:
      code="308";
      break;
     
    //--------雨後晴れ-----------------
    case 311:
    case 316:
    case 320:
    case 323:
    case 324:
    case 325:
      code="311";
      break;
 
    //--------雨後曇り-----------------
    case 313:
    case 317:
    case 321:
      code="313";
      break;
 
    //--------雨後雪-----------------
    case 314:
    case 315:
    case 326:
    case 327:
      code="314";
      break;
     
    //--------雪-----------------
    case 340:
    case 400:
    case 405:
    case 425:
    case 426:
    case 427:
    case 450:
      code="400";
      break;
     
    //--------雪時々晴れ-----------------
    case 401:
      code="401";
      break;
     
    //--------雪時々曇り-----------------
    case 402:
      code="402";
      break;
     
    //--------雪時々雨-----------------
    case 403:
    case 409:
      code="403";
      break;
     
    //--------暴風雪-----------------
    case 406:
    case 407:
      code="406";
      break;
     
    //--------雪後晴れ-----------------
    case 361:
    case 411:
    case 420:
      code="411";
      break;
     
    //--------雪後曇り-----------------
    case 371:
    case 413:
    case 421:
      code="413";
      break;
 
    //--------雪後雨-----------------
    case 414:
    case 422:
    case 423:
      code="414";
      break;
 
    default:
      break;
  }

  var link = "https://www.jma.go.jp/bosai/forecast/img/" + code + ".svg"

  return link;
}