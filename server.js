console.log("server is starting"); 

var fs = require('fs');

var data = fs.readFileSync('score.json');
var score = JSON.parse(data);
var afinnFile = fs.readFileSync('afinn.json');
var afinnData = JSON.parse(afinnFile);




const { response, json, request } = require('express');
var express = require('express');
var cors = require('cors')
const fetch = require("node-fetch");

const { stringify } = require('querystring');
const { finished } = require('stream');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

var app = express();
// var server = app.listen(8000, listening);
var server = app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));
function listening() {
    console.log("listening...");
}

 
app.use(cors())


var corsOptions = {
    origin: ['http://127.0.0.1:5500','http://127.0.0.1:5501',"https://requip.herokuapp.com/"],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    
}

var postCorsOptions = {
	"origin": ['http://127.0.0.1:5500','http://127.0.0.1:5501'],
	"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
	"preflightContinue": false,
	"optionsSuccessStatus": 204,
    "Content-Type":"appllication/json"
}



app.use(express.static('website'));
app.use(express.json())


app.options('/data', cors(postCorsOptions)) // enable pre-flight 
app.post("/data", cors(postCorsOptions) , (request, response) => {
    var file = request.body;
    console.log(file.value);
    console.log("post request recieved in server");
    reply = {
        'status': 'success',
        'data_recieved' : {
            'key': request.body.key,
            'value': request.body.value
        }
    }
    score[request.body.key]=request.body.value;
    try{
        fs.writeFile('score.json', JSON.stringify(score, null, 2), err => {
            console.log("writing into the file from post request");
        });
    } catch(error){
        console.error(error);
    }
    
    response.send(reply);
});


app.get("/ping",cors(corsOptions), get_ping);
app.get("/search/:flower/:num?", get_sunflower);
app.get("/all",cors(corsOptions) ,sendall);
app.get("/add/:flower/:num", addNew);

app.get("/delete/:flower", deleteEntry);



function get_ping(request, response){
    console.log("recieved ping from requip.herokuapp.com");
    var reply = {
        "ping":"recieved",
        "active":"true"
    };
    
    function ping(){
        setTimeout(() => {
            console.log("pinging requip/herokuapp.com");
            fetch("https://requip.herokuapp.com/ping").then(response => {
                return response.json();
        }).then(json => {
            return JSON.stringify(json);
        });
        
        }, 1000*60*10);

    }
    ping();
    response.send(reply);
}


function deleteEntry(request, response) {
    var data = request.params;
    var flower = data.flower;

    if(score[flower]!=undefined)
    {   
        delete score[flower];
        fs.writeFile('score.json', JSON.stringify(score, null, 2), finished);
        function finished(err) {
            console.log(`deleting ${flower} from database`);
        }
    }
    else    
        console.log(`element with key "${flower}" not in database`);
    response.send(score);
    
}

function addNew(request, response) {
    
    var data = request.params;
    var flower = data.flower;
    var num = data.num;
    var reply = {
        "word": flower,
        "status": "successful"
    };
    score[flower] = Number(num);
    try {
        fs.writeFile('score.json' , JSON.stringify(score, null, 2), err => {
            console.log("writing into the file\n");
        });
       
    } catch (error) {
        response.send("error while writing into file");   
    }
  
    response.send(reply); 
    

}

function sendall(request, response) {
    
    
    var head = response['req']['headers']['origin'];
    console.log("===========================================================================");
    console.log(head);
    console.log("===========================================================================");


    reply = {
        "score": score,
        "afinn data":afinnData
    }

    response.send(reply);
}

function get_sunflower(request, response) {
    
    var data=request.params;
    var num =data.num ;
    if(!num)
        num=1;
    var reply='';
    for(var i=0;i<num;i++)
        reply+=`<h1>I love ${data.flower} ${i}\n</h1>`;

    response.send(reply);

}
