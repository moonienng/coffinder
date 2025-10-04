const apiKey = "AIzaSyCzXEsaBNRMWyCe-OEP591I_tULrktxZfI";
const useProxy = true;
const proxy = "https://corsproxy.io/?";

function getLocation() {
  const cache = JSON.parse(localStorage.getItem('cachedLocation') || '{}');
  const now = Date.now();

  if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
    useLocation(cache.lat, cache.lng);
  } else {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      localStorage.setItem('cachedLocation', JSON.stringify({ lat, lng, timestamp: now }));
      useLocation(lat, lng);
    }, () => alert("Permissão de localização negada ou indisponível."));
  }
}

async function useLocation(lat, lng) {
  const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe&key=${apiKey}`;
  const url = useProxy ? proxy + encodeURIComponent(endpoint) : endpoint;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      displayCards(data.results);
    } else {
      alert("Nenhuma cafeteria encontrada na sua área.");
    }
  } catch (e) {
    console.error("Error fetching Places API:", e);
    alert("Erro ao buscar cafés. Tente novamente.");
  }
}

function displayCards(cafes) {
  const container = document.querySelector('.cards');
  container.innerHTML = '';
  
  cafes.forEach((cafe, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'swipe-wrapper';
    wrapper.style.zIndex = 200 - i;

    const imgUrl = cafe.photos?.[0]?.photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${cafe.photos[0].photo_reference}&key=${apiKey}`
      : 'https://via.placeholder.com/250x150?text=No+Image';
    
    const cafeData = {
      name: cafe.name,
      place_id: cafe.place_id,
      photo: imgUrl,
      rating: cafe.rating || 'N/A'
    };

    const card = document.createElement('div');
    card.className = 'location-card';
    card.innerHTML = `
      <img src="${imgUrl}" alt="${cafe.name}" />
      <h3>${cafe.name}</h3>
      <p>⭐️ Rating: ${cafe.rating || 'N/A'}</p>
      <p><small>Swipe right to save 💖</small></p>
    `;

    wrapper.appendChild(card);
    container.appendChild(wrapper);
    
    const hammertime = new Hammer(wrapper);
    hammertime.on('swipeleft', () => {
      wrapper.style.transform = 'translateX(-150%) rotate(-15deg)';
      wrapper.style.opacity = 0;
      setTimeout(() => wrapper.remove(), 300);
    });
    
    hammertime.on('swiperight', () => {
      saveCafe(cafeData);
      wrapper.style.transform = 'translateX(150%) rotate(15deg)';
      wrapper.style.opacity = 0;
      setTimeout(() => wrapper.remove(), 300);
    });
  });
}

function saveCafe(cafe) {
  let saved = JSON.parse(localStorage.getItem('savedCafes') || '[]');
  
  if (!saved.find(c => c.place_id === cafe.place_id)) {
    saved.push(cafe);
    localStorage.setItem('savedCafes', JSON.stringify(saved));
    alert(`${cafe.name} salvo! 💖`);
  } else {
    alert(`${cafe.name} já está salvo.`);
  }
}

function showSaved() {
  const container = document.querySelector('.cards');
  container.innerHTML = '';
  const saved = JSON.parse(localStorage.getItem('savedCafes') || '[]');
  
  if (saved.length === 0) {
    container.innerHTML = '<p>Nenhum café salvo ainda 😢</p>';
    return;
  }
  
  saved.forEach(cafe => {
    const card = document.createElement('div');
    card.className = 'location-card';
    card.innerHTML = `
      <img src="${cafe.photo}" alt="${cafe.name}" />
      <h3>${cafe.name}</h3>
      <p>⭐️ Rating: ${cafe.rating}</p>
    `;
    container.appendChild(card);
  });
}
