const habitsContainer = document.getElementById('habitcontainer')

const addButton = document.getElementById('addbtn')

const submitButton = document.getElementById('submitbtn')

const inputText = document.getElementById('inputtitle')

const inputTitleContainer = document.getElementById('titleparent')

let habits = loadHabits()

function loadHabits() {
    if (localStorage.getItem('habits') !== null) {
        return JSON.parse(localStorage.getItem('habits'))
    }
    return []
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits))
}

function countStreaks() {
    habits.forEach(habit => {
        if (habit.streak.number !== 0) {
            if ((Date.now() - habit.streak.date) / 86400000 >= 1) {
                habit.streak.number = 0
                habit.streak.date = -1
            }
        }
    })
    renderHabits()
}

function addHabit(title) {
    habits.push({
        id: Date.now(),
        title,
        streak: {
            number: 0,
            date: -1
        },
        doneButtonText: "Я выполнил!"
    })

    saveHabits()

    inputTitleContainer.style.display = 'none'
    inputText.value = ''

    renderHabits()
}

function titleHabit() {
    inputTitleContainer.style.display = 'flex'
}

function getTitle() {
    if (inputText.value) {
        addHabit(inputText.value)
    }
    else {
        addHabit('Без названия')
    }
}

function makeStreak(index) {
    const dateNow = Date.now()
    if (habits[index].streak.number === 0 || dateNow.getDate() !== habits[index].streak.date.getDate()) {
        return {
            number: habits[index].streak.number + 1,
            date: dateNow
        }
    }
    return habits[index].streak
}

function deleteHabit(id) {
    habits = habits.filter(habit => habit.id !== id)
    saveHabits()
    renderHabits()
}

function completeHabit(id) {
    const habitIndex = habits.findIndex(habit => habit.id === id)
    habits[habitIndex].streak = makeStreak(habitIndex)
    habits[habitIndex].doneButtonText = "Выполнено"
    saveHabits()
    renderHabits()
}

function renderHabits() {
    habitsContainer.innerHTML = ""
    habits.forEach(habit => {
        const card = document.createElement("div")
        card.classList.add("habit")
        card.innerHTML = `
            <div class="habit-name">${habit.title}</div>
            <div class="streak">
                <div class="streak-icon-container"><img src="images/streakicon.png"></div>
                <div class="streak-number">${habit.streak.number}</div>
            </div>
            <div class="btns">
                <div class="done-btn"><button type="button" class="done" data-id = "${habit.id}">${habit.doneButtonText}</button></div>
                <div class="del-btn"><button type="button" class="delete" data-id = "${habit.id}">Удалить привычку</button></div>
            </div>
        `
        habitsContainer.append(card)
    })
}

addButton.addEventListener('click', titleHabit)

submitButton.addEventListener('click', getTitle)

habitsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete')) {
        deleteHabit(Number(event.target.dataset.id))
    }
    
    if (event.target.classList.contains('done')) {
        completeHabit(Number(event.target.dataset.id))
    }
})

countStreaks()
renderHabits()