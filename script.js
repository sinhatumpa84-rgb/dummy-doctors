let doctorsData = []

fetch("doctors.json")
.then(res => res.json())
.then(data => {
doctorsData = data
displayDoctors(data)
})

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

<button class="book">Book</button>

</div>

</div>

`
})

}



document.getElementById("search").addEventListener("input", function(){

let value = this.value.toLowerCase()

let filtered = doctorsData.filter(doc =>
doc.name.toLowerCase().includes(value) ||
doc.specialization.toLowerCase().includes(value)
)

displayDoctors(filtered)

})



function openModal(){
document.getElementById("reportModal").style.display = "flex"
}

function closeModal(){
document.getElementById("reportModal").style.display = "none"
}



function sendToAI(){

let file = document.getElementById("reportFile").files[0]

if(!file){
alert("Please upload a medical report")
return
}

localStorage.setItem("reportName", file.name)

window.location.href = "ai-diagnosis.html"

}