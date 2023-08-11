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
let allVal = []
let kontis = document.querySelector('.odbrojavanje');
let h1 = document.getElementById('countText');
let countToText = document.getElementById('countToText')
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
let timer

getDate(currentYear, currentMonth)

if (localStorage.getItem('allVal')) {
    allVal = JSON.parse(localStorage.getItem('allVal'))
    let [a, b, c, d, e] = allVal
    godinaIz.value = a
    mesec.value = b
    danIz.value = c
    satiIz.value = d
    minutiIz.value = e
    countdown()
}

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
    if (Number(godinaIz.value) > todaysDate.getFullYear()) mesec.setAttribute('min', 1)
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
            if (td.innerText == '') td.classList.remove('dan')
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

function setHoursAndMinutes() {
    if (todaysDate.getFullYear() == godinaIz.value &&
        todaysDate.getMonth() == mesec.value - 1 &&
        todaysDate.getDate() == danIz.value) {
        satiIz.value = todaysDate.getHours()
        minutiIz.value = todaysDate.getMinutes() + 1
    } else{
        satiIz.value = ''
        minutiIz.value = ''
    }
    
}

function tableClick(e) {
    if (e.target.classList.contains('dan') && e.target.innerText != '') {
        let tdDan = e.target
        document.querySelectorAll('.dan').forEach(dan => dan.classList.remove('active'))
        tdDan.classList.add('active')
        godinaIz.value = yearDropdown.value
        mesec.value = String(Number(monthDropdown.value) + 1).padStart(2, '0')
        danIz.value = tdDan.innerText.padStart(2, '0')
        setHoursAndMinutes()
        dugme.removeAttribute('disabled')
    }
}

table.addEventListener('click', tableClick)

dugme.addEventListener('click', countdown)

if (danIz.value == '' || mesec.value == '' || godinaIz.value == '') {
    dugme.setAttribute('disabled', true)
}

document.querySelectorAll('input').forEach((inp, i) => {
    inp.addEventListener('input', function (e) {
        if (inp.value.length > 2 && inp.value[0] == '0') {
            inp.value = inp.value.slice(-2)
        }
        if (e.inputType != "deleteContentBackward" && inp.value.length == 1) {
            inp.value = inp.value.padStart(2, 0)
        }
        if (Number(inp.value) == Number(inp.max) && i > 0) inp.value = Number(inp.min) + 1
        if (Number(inp.value) == Number(inp.min) && i > 0) inp.value = Number(inp.max) - 1
        if (i < 3) {
            setHoursAndMinutes()
        }
        if (i > 2 && godinaIz.value == '' && mesec.value == '' && danIz.value == '') {
            godinaIz.value = todaysDate.getFullYear()
            mesec.value = todaysDate.getMonth() + 1
            danIz.value = todaysDate.getDate()
            satiIz.value = todaysDate.getHours()
            dugme.removeAttribute('disabled')
        }
        if (i == 0) {
            if (mesec.value && danIz.value) dugme.removeAttribute('disabled')
            if (Number(godinaIz.value) == todaysDate.getFullYear()) mesec.setAttribute('min', todaysDate.getMonth())
            else mesec.setAttribute('min', 0)
        }
        if (i == 1) {
            if (godinaIz.value && danIz.value) dugme.removeAttribute('disabled')
            danIz.setAttribute('max', new Date(currentYear, mesec.value, 0).getDate() + 1)
            if (Number(mesec.value) == todaysDate.getMonth() + 1 && Number(godinaIz.value) == todaysDate.getFullYear()) danIz.setAttribute('min', todaysDate.getDate() - 1)
            else danIz.setAttribute('min', 0)
        }
        if (i == 2) {
            if (mesec.value && godinaIz.value) dugme.removeAttribute('disabled')
        }

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
        if (minutiOd >= 60) {
            minutiOd = minutiOd - 60
            satiOd = satiOd + 1
        }
        sekundeOd = 59 - sekunde;
        kontis.innerHTML = `${String(Math.floor((odbrojavanje - todaysDate) / dan)).padStart(2, 0)}d : ${String(satiOd).padStart(2, 0)}č : ${String(minutiOd).padStart(2, 0)}m : ${sekundeOd == 60 ? '00' : String(sekundeOd).padStart(2, 0)}s`;
        if (kontis.innerText == '00d : 00č : 00m : 00s') {
            clearInterval(timer)
            h1.innerHTML = 'Dočekali ste!';
        }
    }
    tick()
    const timer = setInterval(tick, 1000)
    return timer
}


dugmeZaustavi.addEventListener('click', function () {
    getDate(new Date().getFullYear(), new Date().getMonth() + 1)
    clearInterval(timer)
    dugmeZaustavi.classList.add('d-none')
    form.classList.remove('d-none')
    kontis.classList.add('d-none')
    dugme.setAttribute('disabled', true)
    h1.innerText = 'Unesite željeni datum ili izaberite na kalendaru:'
    countToText.classList.add('d-none')
    table.addEventListener('click', tableClick)
    table.style.pointerEvents = 'all'
    arrows.forEach(arrow => arrow.style.display = 'inline-block')
    localStorage.removeItem('allVal')
})

function countdown() {
    satiVal = satiIz.value ? 23 + Number(satiIz.value) : 23
    minutiVal = minutiIz.value ? 59 + Number(minutiIz.value) : 59
    if (todaysDate.getFullYear() == godinaIz.value &&
        todaysDate.getMonth() == mesec.value - 1 &&
        todaysDate.getDate() == danIz.value) {
        satiVal = Number(satiIz.value) - 1
    }
    if (todaysDate.getFullYear() == godinaIz.value &&
        todaysDate.getMonth() == mesec.value - 1 &&
        todaysDate.getDate() == danIz.value &&
        todaysDate.getHours() == satiIz.value) {
        satiOd = 0
    }
    monthNames = [
        "januar", "februar", "mart", "april", "maj", "jun",
        "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"
    ]
    for (let i = 0; i < monthNames.length; i++) {
        if (mesec.value.toLowerCase() == monthNames[i]) mesec.value = i + 1
    }

    odbrojavanje = new Date(Number(godinaIz.value), Number(mesec.value) - 1, Number(danIz.value), Number(satiIz.value), Number(minutiIz.value));
    if (odbrojavanje.getTime() < todaysDate.getTime()) {
        alert('Ne možete uneti datum koji je već prošao!')
        document.querySelectorAll('.dan').forEach(dan => {
            dan.classList.remove('active')
        })
        return
    }
    getDate(Number(godinaIz.value), Number(mesec.value))
    document.querySelectorAll('.dan').forEach(dan => {
        if (Number(dan.innerText) == Number(danIz.value)) dan.classList.add('active')
        else dan.classList.remove('active')
    })
    allVal = [godinaIz.value, mesec.value, danIz.value, satiIz.value, minutiIz.value]
    localStorage.setItem('allVal', JSON.stringify(allVal))
    h1.innerText = 'Ostalo je još tačno:'
    let locale = navigator.language
    countToText.classList.remove('d-none')
    countToText.innerText = `do ${Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        day: '2-digit',
        minute: 'numeric',
        month: '2-digit',
        year: 'numeric',
        weekday: 'long',
    }).format(odbrojavanje)}`
    dugmeZaustavi.classList.remove('d-none')
    form.classList.add('d-none')
    kontis.classList.remove('d-none')
    table.removeEventListener('click', tableClick)
    table.style.pointerEvents = 'none'
    arrows.forEach(arrow => arrow.style.display = 'none')
    timer = startTimer()
    godinaIz.value = ''
    mesec.value = ''
    danIz.value = ''
    satiIz.value = ''
    minutiIz.value = ''
}
