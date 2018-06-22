function calcularMostrarRotas(servicoDirecoes, mostrarDirecoes, pontoOrigem, pontoDestino) {
  servicoDirecoes.route({
    origin: pontoOrigem,
    destination: pontoDestino,
    avoidTolls: true,
    avoidHighways: false,
    travelMode: google.maps.TravelMode.DRIVING
  }, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      mostrarDirecoes.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function buscarPontoSaida(pontoSaida) {
  return new Promise(resolve => {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address=" + pontoSaida + "&key=AIzaSyCwtTNljYAht0pb-AmCznyVV-ZI0ZbeG-c", true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        resolve(this.responseText)
      }
    }
  })
}

function buscarPontoChegada(pontoChegada) {
  return new Promise(resolve => {
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address=" + pontoChegada + "&key=AIzaSyCwtTNljYAht0pb-AmCznyVV-ZI0ZbeG-c", true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        resolve(this.responseText)
      }
    }
  })
}

function gerarCoordenadas () {
  let pontoSaida = document.getElementById('saida').value
  let pontoChegada = document.getElementById('chegada').value
  let coordenadasPontoSaida
  let coordenadasPontoChegada
  buscarPontoSaida(pontoSaida)
    .then(resultadoPontoSaida => {
      buscarPontoChegada(pontoChegada)
        .then(resultadoPontoChegada => {
          coordenadasPontoSaida = JSON.parse(resultadoPontoSaida).results[0].geometry.location
          coordenadasPontoChegada = JSON.parse(resultadoPontoChegada).results[0].geometry.location
          iniciarMapa(coordenadasPontoSaida, coordenadasPontoChegada)
        })
    })

}

function iniciarMapa(origem, destino) {
  let pontoOrigem = new google.maps.LatLng(origem.lat, origem.lng)
  let pontoDestino = new google.maps.LatLng(destino.lat, destino.lng)
  let opcoes = {
    zoom: 7,
    center: pontoOrigem
  }
  let mapa = new google.maps.Map(document.getElementById('mapa'), opcoes)
  let servicoDirecoes = new google.maps.DirectionsService
  let mostrarDirecoes = new google.maps.DirectionsRenderer({
      map: mapa
    })
  let marcadorA = new google.maps.Marker({
    position: pontoOrigem,
    title: "Origem",
    label: "A",
    map: mapa
  })
  let marcadorB = new google.maps.Marker({
    position: pontoDestino,
    title: "Destino",
    label: "B",
    map: mapa
  });
  calcularMostrarRotas(servicoDirecoes, mostrarDirecoes, pontoOrigem, pontoDestino)
}
