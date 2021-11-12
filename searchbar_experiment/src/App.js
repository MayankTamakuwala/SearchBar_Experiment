import { React, Component } from "react";
import Banner from "./Banner";
import ReactSearchBox from "react-search-box";
import PlaceFinder from "./PlaceFinder";
import Place from "./Place";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoLocation: {},
      geoError: null,
      searchResults: [],
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (e) => {
        this.setState({
          geoLocation: e.coords,
        });
      },
      async (err) => {
        this.setState({
          geoError: err,
        });
      }
    );
  }

  async onSearchChange(query) {
    if (query.length > 0) {
      let placeFinder = new PlaceFinder("4eBblkmwkVijDgbyiAkPhdjp3pkfQjlv");
      let results = await placeFinder.getNearbyPlaces(
        query,
        this.state.geoLocation.latitude,
        this.state.geoLocation.longitude
      );
      this.setState({
        searchResults: results,
      });
    }
  }

  setPlace(key) {
    let place = this.state.searchResults.find((p) => p.id === key);
    this.setState({
      selectedPlace: place,
    });
  }

  render() {
    return (
      <div>
        <Banner
          geoLocation={this.state.geoLocation}
          geoError={this.state.geoError}
        />

        <ReactSearchBox
          onSelect={(place) => this.setPlace(place.key)}
          placeholder="Search for nearby places"
          matchedRecords={this.state.searchResults
            .map((result) => ({
              key: result.id,
              name: result.poi.name,
              dist: result.dist,
              value: `${result.poi.name} | ${(result.dist / 1000).toFixed(
                2
              )}km `,
            }))
            .sort((a, b) => a.dist - b.dist)}
          data={this.state.searchResults
            .map((result) => ({
              key: result.id,
              name: result.poi.name,
              dist: result.dist,
              value: result.poi.name,
            }))
            .sort((a, b) => a.dist - b.dist)}
          onSelect={(place) => console.log(place)}
          autoFocus={true}
          onChange={(query) => this.onSearchChange(query)}
          fuseConfigs={{
            minMatchCharLength: 0,
            threshold: 1,
            distance: 100000,
            sort: false,
          }}
          keys={["name"]}
        />
        <Place className="place-box" data={this.state.selectedPlace}></Place>
      </div>
    );
  }
}
