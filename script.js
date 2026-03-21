let doctorsData = []

// ======================
// FETCH DATA
// ======================
fetch("doctors.json")
.then(res => res.json())
.then(data => {
    doctorsData = data
    displayDoctors(data)
})

// ======================
// DISPLAY DOCTORS
// ======================
function displayDoctors(data){
    const list = document.getElementById("doctorList")
    list.innerHTML = ""

    data.forEach(doc => {
        list.innerHTML += `
        <div class="doctor-card">

            <div class="doc-info">
                <img class="avatar" src="${doc.image}">
                <div>
                    <h3>${doc.name}</h3>
                    <p>${doc.specialization}</p>
                    <p>⭐ ${doc.rating} | ${doc.experience}</p>
                </div>
            </div>

            <div>
                <span class="status ${doc.status=="Available"?"available":"offline"}">
                    ${doc.status}
                </span>

                <button class="send" onclick="openModal()">Send Report</button>

                <button class="book" id="book-${doc.id}" onclick="openBooking(${doc.id})">
                    Book
                </button>

                <div id="dropdown-${doc.id}" class="dropdown" style="display:none;">
                    <select id="time-${doc.id}">
                        <option>${doc.time}</option>
                        <option>Tomorrow, 10:00 AM</option>
                        <option>Tomorrow, 5:00 PM</option>
                    </select>
                    <br>
                    <button onclick="confirmBooking(${doc.id})">Confirm</button>
                </div>
            </div>

        </div>
        `
    })

    restoreBookingState()
}

// ======================
// SEARCH
// ======================
document.getElementById("search").addEventListener("input", function(){
    const value = this.value.toLowerCase()

    const filtered = doctorsData.filter(doc =>
        doc.name.toLowerCase().includes(value) ||
        doc.specialization.toLowerCase().includes(value)
    )

    displayDoctors(filtered)
})

// ======================
// BOOKING FLOW
// ======================
function openBooking(id){
    const dropdown = document.getElementById(`dropdown-${id}`)
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block"
}

function confirmBooking(id){
    const time = document.getElementById(`time-${id}`).value

    localStorage.setItem(`appointment-${id}`, JSON.stringify({
        time: time,
        status: "waiting"
    }))

    showToast("Appointment booked at " + time)

    updateButtonToWaiting(id)
}

// ======================
// BUTTON STATES
// ======================
function updateButtonToWaiting(id){
    const btn = document.getElementById(`book-${id}`)
    if(!btn) return

    btn.innerText = "Waiting..."
    btn.disabled = true
}

function updateButtonToMeet(id){
    const btn = document.getElementById(`book-${id}`)
    if(!btn) return

    btn.innerText = "Meet"
    btn.disabled = false
    btn.onclick = () => startMeeting(id)
}

// ======================
// RESTORE STATE (IMPORTANT)
// ======================
function restoreBookingState(){
    doctorsData.forEach(doc => {
        const saved = localStorage.getItem(`appointment-${doc.id}`)
        if(!saved) return

        const data = JSON.parse(saved)

        if(data.status === "waiting"){
            updateButtonToWaiting(doc.id)
        }

        if(data.status === "meet"){
            updateButtonToMeet(doc.id)
        }
    })
}

// ======================
// AUTO CHANGE TO MEET
// ======================
setInterval(() => {
    doctorsData.forEach(doc => {
        const saved = localStorage.getItem(`appointment-${doc.id}`)
        if(!saved) return

        const data = JSON.parse(saved)

        if(data.status === "waiting"){
            // demo trigger (10 sec)
            data.status = "meet"
            localStorage.setItem(`appointment-${doc.id}`, JSON.stringify(data))

            updateButtonToMeet(doc.id)
            showToast("Doctor is ready to meet!")
        }
    })
}, 10000)

// ======================
// VIDEO CALL
// ======================
function startMeeting(id){
    window.location.href = "video.html"
}

// ======================
// MODAL
// ======================
function openModal(){
    document.getElementById("reportModal").style.display = "flex"
}

function closeModal(){
    document.getElementById("reportModal").style.display = "none"
}

// ======================
// SEND REPORT
// ======================
function sendToAI(){
    const file = document.getElementById("reportFile").files[0]

    if(!file){
        showToast("Please upload a medical report")
        return
    }

    localStorage.setItem("reportName", file.name)
    window.location.href = "ai-diagnosis.html"
}

// ======================
// TOAST NOTIFICATION (TOP RIGHT)
// ======================
function showToast(message){
    let toast = document.getElementById("toast")

    if(!toast){
        toast = document.createElement("div")
        toast.id = "toast"
        document.body.appendChild(toast)
    }

    toast.innerText = message
    toast.style.display = "block"

    setTimeout(() => {
        toast.style.display = "none"
    }, 3000)
}