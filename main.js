
//Кнопки
const gameBtn = document.getElementById("gameBtn");
let points = 1000;
let USERNAME;

//Слушатели событий
gameBtn.addEventListener("click", startOrStopGame);
document.querySelector("#loginWrapper form").addEventListener("submit", (event) => {
    event.preventDefault()
    auth()
});


[...document.getElementsByClassName("point")].forEach((elem) => {
    elem.addEventListener("click", addPoint);
}
)
function addPoint(event) {
    let target = event.target;
    points = +target.innerHTML;
    const activeBtn = document.querySelector(".point.active");
    activeBtn.classList.remove("active");

    target.classList.add("active");
}


function startOrStopGame() {
    if (gameBtn.innerHTML == "ИГРАТЬ") {
        //НАЧАТЬ ИГРУ
        gameBtn.innerHTML = "ЗАВЕРШИТЬ ИГРУ";
        gameBtn.style.backgroundColor = "red";
        startGame()
    }
    else {
        // ЗАВЕРШИТЬ ИГРУ 
        gameBtn.innerHTML = "ИГРАТЬ";
        gameBtn.style.backgroundColor = "#66a663";
        stopGame()
    }
}
async function startGame() {
    console.log(points);
    let response = await sendRequest("new_game", "POST", {
        username: USERNAME,
        points

    });
    if (response.error) {
        //ЕСТЬ ОШИБКА 
        gameBtn.innerHTML = "ИГРАТЬ";
        alert(response.message);
    } else {
        game_id = response.game_id;
        updateUSerBalance();
        activeArea()
       
    }
}

async function stopGame() {
    
    let response = await sendRequest("stop_game", "POST", {
        username: USERNAME,
        game_id

    });
    if (response.error) {
        //ЕСТЬ ОШИБКА 
        gameBtn.innerHTML = "ЗАВЕРШИТЬ ИГРУ";
        alert(response.message);
    } else {
        game_id = response.game_id;
        updateUSerBalance();
        resetField() ;
       
    }
}




function activeArea() {
    const field = document.getElementsByClassName("field");
    //["field","field",.....]
    // gameBtn.innerHTML = "ЗАВЕРШИТЬ ИГРУ"
    //    gameBtn.style.backgroundColor = "red" 
    for (let i = 0; i < field.length; i++) {
        field[i].addEventListener("contextmenu", setFlag)    // (ctrl+?=comment)
        setTimeout(() => {
            field[i].classList.add("active");
        }, 20 * i);
    }

}
function setFlag(event) {
    event.preventDefault()
    let target = event.target;
    target.classList.toggle("flag");
}
function resetField() {
    const gameField = document.querySelector(".gameField");
    gameField.innerHTML = "";
    for (let i = 0; i < 80; i++) {
        let cell = document.createElement("div")
        cell.classList.add("field");
        gameField.appendChild(cell);
    }
}
resetField()

async function auth() {
    const loginWrapper = document.getElementById("loginWrapper")
    const login = document.getElementById("login").value
    let response = await sendRequest("user", "GET", {
        username: login,
    });
    if (response.error) {
        //ПОльзователь не зарегался
        let registration = await sendRequest("user", "POST", { username: login });
        if (registration.error) {
            alert(registration.message);
        } else {
            USERNAME = login;
            loginWrapper.style.display = "none";
            updateUSerBalance();
        }



    }
    else {
        USERNAME = login;
        loginWrapper.style.display = "none";
        updateUSerBalance()
    };
}











async function updateUSerBalance() {
    let response = await sendRequest("user", "GET", {
        username: USERNAME
    })
    if (response.error) {
        //Если есть ошибка
        alert(response.message)
    } else {
        const user = document.querySelector("header span")
        user.innerHTML = `Пользователь ${response.username} c балансом ${response.balance}`

    }
    console.log(response);
}



updateUSerBalance()


async function sendRequest(url, method, data) {
    url = `https://tg-api.tehnikum.school/tehnikum_course/minesweeper/${url}`

    if (method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        response = await response.json()
        return response
    } else if (method == "GET") {
        url = url + "?" + new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        response = await response.json()
        return response
    }
}
