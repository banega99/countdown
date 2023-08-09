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
let dugme = document.querySelector('button');
let dugmeZaustavi = document.querySelector('.end');
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

godinaIz.addEventListener('input', function () {
    if (mesec.value && danIz.value) dugme.removeAttribute('disabled')
})
danIz.addEventListener('input', function () {
    if (mesec.value && godinaIz.value) dugme.removeAttribute('disabled')
})
mesec.addEventListener('input', function () {
    if (godinaIz.value && danIz.value) dugme.removeAttribute('disabled')
})

// let mesecBroj = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

function startTimer() {
    function tick() {
        date = new Date()
        sati = date.getHours();
        minuti = date.getMinutes();
        sekunde = date.getSeconds();
        satiOd = 23 - sati;
        minutiOd = 59 - minuti;
        sekundeOd = 59 - sekunde;
        dan = 1000 * 60 * 60 * 24;
        kontis.innerHTML = `${String(Math.floor((odbrojavanje - date) / dan)).padStart(2, 0)}d: ${String(satiOd).padStart(2, 0)}č: ${String(minutiOd).padStart(2, 0)}m: ${sekundeOd == 60 ? '00' : String(sekundeOd).padStart(2, 0)}s`;
        // if ((Math.floor((odbrojavanje - date) / dan)) == '0' && satiOd == '0' && minutiOd == '0' & sekundeOd == '0') {
        if (odbrojavanje.getTime() == date.getTime()) {
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
    
    if (timer) clearInterval(timer)
    switch (mesec.value) {
        case 'Januar':
        case 'januar':
            mesec.value = 1;
            break;
        case 'Februar':
        case 'februar':
            mesec.value = 2;
            break;
        case 'Mart':
        case 'mart':
            mesec.value = 3;
            break;
        case 'April':
        case 'april':
            mesec.value = 4;
            break;
        case 'Maj':
        case 'maj':
            mesec.value = 5;
            break;
        case 'Jun':
        case 'jun':
            mesec.value = 6;
            break;
        case 'Jul':
        case 'jul':
            mesec.value = 7;
            break;
        case 'Avgust':
        case 'avgust':
            mesec.value = 8;
            break;
        case 'Septembar':
        case 'septembar':
            mesec.value = 9;
            break;
        case 'Oktobar':
        case 'oktobar':
            mesec.value = 10;
            break;
        case 'Novembar':
        case 'novembar':
            mesec.value = 11;
            break;
        case 'Decembar':
        case 'decembar':
            mesec.value = 12;
            break;
        default:
            break;
    };
    var date = new Date();
    odbrojavanje = new Date(Number(godinaIz.value), Number(mesec.value) - 1, Number(danIz.value));
    if (odbrojavanje.getTime() < date.getTime()) {
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
    godinaIz.focus()
}
