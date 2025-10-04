const apiKey = "AIzaSyCzXEsaBNRMWyCe-OEP591I_tULrktxZfI";
const useProxy = true;
const proxy = "https://cors-anywhere.herokuapp.com";

function getLocation() {
  const cache = JSON.parse(localStorage.getItem('cachedLocation') || '{}');
  const now = Date.now();

if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) 
{
  useLocation(cache.lat, cache.lng);
}
else {
  navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;

localStorage.setItem('cachedLocation', JSON.stringify({ lat, lng, timestamp: now }));
  useLocation(lat, lng);
}, () => alert("Location access denied or unavailable."));

  async function useLocation(lat, lng) {
  const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe&key=${apiKey}`;
  const url = useProxy ? proxy + endpoint : endpoint;
  try {
  const response = await fetch(url);
  const data = await response.json();
  if (data.results) {
      displayCards(data.results);
    } else {
      alert("No cafes found.");
    }
  } catch (e) {
    console.error("Error fetching Places API:", e);
    alert("Error fetching cafes.");
  }
}
  function displayCards(cafes) {
    const container = document.querySelector('.cards');
    container.innerHTML = '';
    cafes.forEach((cafe, i) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'swipe-wrapper';
  wrapper.style.zIndex = 200 - i;

  var newCards = document.querySelectorAll('.location-card:not(.removed)');
  var allCards = document.querySelectorAll('.location-card');
  });
}
  const card = document.createElement('div');
card.className = 'location-card';

const imgUrl = cafe.photos?.[0]?.photo_reference
  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${cafe.photos[0].photo_reference}&key=${apiKey}`
  : 'https://via.placeholder.com/250x150?text=No+Image';
  const cafeData = {
  name: cafe.name,
  place_id: cafe.place_id,
  photo: imgUrl,
  rating: cafe.rating || 'N/A'
};
  card.innerHTML = `
  <img src="${imgUrl}" alt="${cafe.name}" />
  <h3>${cafe.name}</h3>
  <p>⭐️ Rating: ${cafe.rating || 'N/A'}</p>
  <p><small>Swipe right to save 💖</small></p>
`;

wrapper.appendChild(card);
container.appendChild(wrapper);
  
