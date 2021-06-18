

function setup() {
    ping();
    console.log("running");
    
    fetch('/all/').then(response => {
        console.log(response);
        return (response.json());
    }).then(json => {
        console.log(json);
        document.getElementById("123").innerHTML=JSON.stringify(json, null, 2);
        console.log(json);
    });    

    window.onload = foo => {
    var button = document.getElementById("submit");
    button.onclick = addElement ;

    function addElement() {
        var word = document.getElementById("word").value;
        var num = document.getElementById("value").value;
        fetch("/add/"+word+"/"+num).then(response => 
            {
                document.getElementById("status").innerHTML = JSON.stringify(response.json(), null , 2);
                console.log(response);
                return response.json();
            });
       
    }

    }
}








setup();