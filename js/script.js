var mymap = L.map('mapid').setView([51.4000, 21.1500], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(mymap);

var markers = L.layerGroup().addTo(mymap);
var tripList = document.getElementById('trip-list');
var addPlaceBtn = document.getElementById('add-place-btn');
var downloadPdfBtn = document.getElementById('download-pdf-btn'); 
var placeLatInput = document.getElementById('place-lat');
var placeLngInput = document.getElementById('place-lng');

mymap.on('click', function(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    placeLatInput.value = lat.toFixed(5);
    placeLngInput.value = lng.toFixed(5);
});

addPlaceBtn.addEventListener('click', function() {
    var name = document.getElementById('place-name').value;
    var lat = parseFloat(placeLatInput.value);
    var lng = parseFloat(placeLngInput.value);
    var notes = document.getElementById('place-notes').value;

    if (name && !isNaN(lat) && !isNaN(lng)) {
        var marker = L.marker([lat, lng]).addTo(markers);
        marker.bindPopup(`<b>${name}</b><br>${notes}`).openPopup();

        var listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${name}</strong>
            <p>${notes}</p>
            <p>Szerokosc: ${lat.toFixed(5)}, Wysokosc: ${lng.toFixed(5)}</p>
            <button class="remove-btn">Usuń</button>
        `;
        tripList.appendChild(listItem);

        listItem.querySelector('.remove-btn').addEventListener('click', function() {
            tripList.removeChild(listItem);
            markers.removeLayer(marker);
        });

        document.getElementById('place-name').value = '';
        placeLatInput.value = '';
        placeLngInput.value = '';
        document.getElementById('place-notes').value = '';
    } else {
        alert('Proszę wypełnić wszystkie pola i podać poprawne współrzędne.');
    }
});

downloadPdfBtn.addEventListener('click', function() {
    if (tripList.children.length === 0) {
        alert('Twój plan podróży jest pusty!');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Plan Podrozy", 15, 15);
    doc.setFontSize(12);

    let y = 30;
    
    for (let i = 0; i < tripList.children.length; i++) {
        const item = tripList.children[i];
        const name = item.querySelector('strong').innerText;
        const notes = item.querySelector('p').innerText;
        const coords = item.querySelectorAll('p')[1].innerText;

        doc.setFontSize(14);
        doc.text(`Miejsce ${i + 1}: ${name}`, 15, y);
        y += 7;
        doc.setFontSize(10);
        doc.text(notes, 15, y);
        y += 7;
        doc.text(coords, 15, y);
        y += 15;
    }

    doc.save("plan_podrozy.pdf");
});
