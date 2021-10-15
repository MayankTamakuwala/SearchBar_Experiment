import axios from "axios";

export default class PlaceFinder {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async getNearbyPlaces(query, lat, long, limit = 5, radius = 10000) {
    let baseUrl = "https://api.tomtom.com/search/2/poiSearch";
    let queryString = `limit=${limit}&lat=${lat}&lon=${long}&radius=${radius}&key=${this.apiKey}`;
    let response = await axios.get(`${baseUrl}/${query}.json?${queryString}`);
    return response.data.results;
  }
}
