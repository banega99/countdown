//Kalendar
const table = document.querySelector('table')
const tableBody = document.querySelector('tbody')
const title = document.querySelector('#title')
const arrowLeft = document.querySelector('.left')
const arrowRight = document.querySelector('.right')
const arrows = document.querySelectorAll('.arrow')
let todaysDate = new Date()
let currentMonth = todaysDate.getMonth() + 1
let currentYear = todaysDate.getFullYear()
let monthDropdown = document.querySelector('#month')
let yearDropdown = document.querySelector('#year')
//Odbrojavanje
let kontis = document.querySelector('.odbrojavanje');
let h1 = document.getElementById('countText');
let form = document.querySelector('form')
let godinaIz = document.querySelector('#godina');
let mesec = document.querySelector('#mesec');
let danIz = document.querySelector('#dan');
let satiIz = document.querySelector('#sati');
let minutiIz = document.querySelector('#minuti');
let dugme = document.querySelector('button');
let dugmeZaustavi = document.querySelector('.end');
let satiVal
let minutiVal
let sati
let minuti
let sekunde
let satiOd
let minutiOd
let sekundeOd
let dan = 1000 * 60 * 60 * 24;
let odbrojavanje


getDate(currentYear, currentMonth)

monthDropdown.addEventListener('change', function (e) {
    currentMonth = + monthDropdown.value + 1
    getDate(currentYear, currentMonth)
})
yearDropdown.addEventListener('change', function (e) {
    currentYear = + yearDropdown.value
    getDate(currentYear, currentMonth)
})

arrows.forEach(arrow => {
    arrow.addEventListener('click', function (e) {
        if (arrow.classList.contains('left')) {
            currentMonth--
            if (currentMonth <= 0) {
                currentMonth = 12
                currentYear--
            }
            getDate(currentYear, currentMonth)
        } else if (arrow.classList.contains('right')) {
            if (currentMonth > 11) {
                currentMonth = 0
                currentYear++
            }
            currentMonth++
            getDate(currentYear, currentMonth)
        }
    })
})

function getDate(year, month) {
    godinaIz.setAttribute('min', year)
    mesec.setAttribute('min', todaysDate.getMonth())
    mesec.setAttribute('max', 12 + 1)
    danIz.setAttribute('min', todaysDate.getDate())
    if(Number(godinaIz.value) > todaysDate.getFullYear()) mesec.setAttribute('min', 1)
    monthDropdown.innerHTML = ''
    yearDropdown.innerHTML = ''
    currentMonth = month
    currentYear = year
    monthNames = [
        "Januar", "Februar", "Mart", "April", "Maj", "Jun",
        "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
    ]
    chosenMonth = monthNames[month - 1]

    for (let i = 0; i < monthNames.length; i++) {
        monthDropdown.insertAdjacentHTML('beforeend', `<option value="${i}" ${i == currentMonth - 1 ? 'selected="selected"' : ''} value="">${monthNames[i]}</option>`);
    }
    for (let i = 1980; i < 2100; i++) {
        yearDropdown.insertAdjacentHTML('beforeend', `<option value="${i}" ${i == currentYear ? 'selected="selected"' : ''} value="">${i}</option>`);
    }
    let firstDay = new Date(year, month - 1, 1)
    let lastDay = new Date(year, month, 0)
    danIz.setAttribute('max', lastDay.getDate() + 1)
    let FDM = firstDay.getDay()
    let LDM = lastDay.getDay()

    if (LDM == 0) LDM = 7
    if (FDM == 0) FDM = 7

    let days = []
    for (let i = 1; i < FDM; i++) {
        days.push('')
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(i)
    }
    for (let i = LDM; i < 7; i++) {
        days.push('')
    }

    let weeks = []
    while (days.length > 0) {
        let nextWeek = days.splice(0, 7)
        weeks.push(nextWeek)
    }
    drawCalendar(weeks)
}

function drawCalendar(weeks) {
    tableBody.innerHTML = ''
    for (let i = 0; i < weeks.length; i++) {
        let week = weeks[i]
        let tr = document.createElement('tr')
        for (let j = 0; j < week.length; j++) {
            let td = document.createElement('td')
            td.textContent = week[j]
            td.classList.add('dan')
            if(td.innerText == '')td.classList.remove('dan')
            td.setAttribute('data-id', week[j])
            tr.appendChild(td)
            tableBody.appendChild(tr)
        }
    }
    let tds = document.querySelectorAll('td')
    tds.forEach(td => {
        if (td.dataset.id == todaysDate.getDate() &&
            currentYear == todaysDate.getFullYear() &&
            currentMonth == todaysDate.getMonth() + 1
        ) td.classList.add('current-day')
    })
}

table.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dan') && e.target.innerText == '') return
    let tdDan = e.target
    document.querySelectorAll('.dan').forEach(dan => dan.classList.remove('active'))
    tdDan.classList.add('active')
    godinaIz.value = yearDropdown.value
    mesec.value = Number(monthDropdown.value) + 1
    danIz.value = tdDan.innerText
    dugme.removeAttribute('disabled')
})


dugme.addEventListener('click', brojac)

if (danIz.value == '' || mesec.value == '' || godinaIz.value == '') {
    dugme.setAttribute('disabled', true)
}

function checkInputVal(val1, val2) {
    console.log('change')
    console.log(val1, val2)
    if (val1 && val2) dugme.removeAttribute('disabled')
}

godinaIz.addEventListener('change', function () {
    if (mesec.value && danIz.value) dugme.removeAttribute('disabled')
    if(Number(godinaIz.value) > todaysDate.getFullYear()) mesec.setAttribute('min', 0)
    else mesec.setAttribute('min', todaysDate.getMonth() + 1)
})
danIz.addEventListener('change', function () {
    if (mesec.value && godinaIz.value) dugme.removeAttribute('disabled')
    if(danIz.value == danIz.max) danIz.value = Number(danIz.min) + 1
    if(danIz.value == danIz.min) danIz.value = Number(danIz.max )- 1
})
mesec.addEventListener('change', function () {
    if (godinaIz.value && danIz.value) dugme.removeAttribute('disabled')
    console.log('change')
    danIz.setAttribute('max', new Date(currentYear, mesec.value, 0).getDate() + 1)
    if(Number(mesec.value) > todaysDate.getMonth() + 1) danIz.setAttribute('min', 0)
})

document.querySelectorAll('input').forEach((inp, i) => {
    inp.addEventListener('input', function(e){
        if(inp.value.length > 2 && inp.value[0] == '0') {
            inp.value = inp.value.slice(-2)
        }
        console.log(inp.value.slice(1, inp.value.length - 1))
        if(e.inputType != "deleteContentBackward" && inp.value.length == 1){
            inp.value = inp.value.padStart(2, 0)  
        } 
        console.log(inp.value.length)
        if(inp.value == inp.max && i > 0) inp.value = Number(inp.min) + 1
        if(inp.value == inp.min && i > 0) inp.value = Number(inp.max )- 1
        // if(inp.value.length > 1) inp.value = Array(inp.value).splice(0, 1)
        // if(i < 3 && inp.value == '00') inp.value = ''
        // if(Number(godinaIz.value) > todaysDate.getFullYear()) mesec.setAttribute('min', 1)
        // else mesec.setAttribute('min', todaysDate.getMonth + 1)
    })

})

function startTimer() {
    function tick() {
        todaysDate = new Date()
        sati = todaysDate.getHours();
        minuti = todaysDate.getMinutes();
        sekunde = todaysDate.getSeconds();
        satiOd = satiVal - sati;
        minutiOd = minutiVal - minuti;
        sekundeOd = 59 - sekunde;
        dan = 1000 * 60 * 60 * 24;
        kontis.innerHTML = `${String(Math.floor((odbrojavanje - todaysDate) / dan)).padStart(2, 0)}d: ${String(satiOd).padStart(2, 0)}č: ${String(minutiOd).padStart(2, 0)}m: ${sekundeOd == 60 ? '00' : String(sekundeOd).padStart(2, 0)}s`;
        // if ((Math.floor((odbrojavanje - date) / dan)) == '0' && satiOd == '0' && minutiOd == '0' & sekundeOd == '0') {
        if (odbrojavanje.getTime() == todaysDate.getTime()) {
            clearInterval(timer)
            h1.innerHTML = 'Dočekali ste!';
        }
    }
    tick()
    const timer = setInterval(tick, 1000)
    return timer
}
let timer

dugmeZaustavi.addEventListener('click', function () {
    clearInterval(timer)
    dugmeZaustavi.classList.add('d-none')
    form.classList.remove('d-none')
    kontis.classList.add('d-none')
    dugme.setAttribute('disabled', true)
    h1.innerText = 'Unesite željeni datum ili izaberite na kalendaru:'
    document.querySelector('.active').classList.remove('active')
})

function brojac() {
    satiVal = satiIz.value ? 23 + Number(satiIz.value) : 23
    minutiVal = minutiIz.value ? 59 + Number(minutiIz.value) : 59
    monthNames = [
        "januar", "februar", "mart", "april", "maj", "jun",
        "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"
    ]
    if (timer) clearInterval(timer)
    for (let i = 0; i < monthNames.length; i++) {
        if(mesec.value.toLowerCase() == monthNames[i]) mesec.value = i+1
    }
    
    console.log( new Date(Number(godinaIz.value), Number(mesec.value) - 1, Number(danIz.value), Number(satiIz.value), Number(minutiIz.value)))
    odbrojavanje = new Date(Number(godinaIz.value), Number(mesec.value) - 1, Number(danIz.value), Number(satiIz.value), Number(minutiIz.value));
    if (odbrojavanje.getTime() < todaysDate.getTime()) {
        alert('Ne možete uneti datum koji je već prošao!')
        // clearInterval(timer)
        return false
    }
    h1.innerText = 'Ostalo je još tačno:'
    dugmeZaustavi.classList.remove('d-none')
    form.classList.add('d-none')
    kontis.classList.remove('d-none')
    timer = startTimer()
    godinaIz.value = ''
    mesec.value = ''
    danIz.value = ''
    satiIz.value = ''
    minutiIz.value = ''
}
