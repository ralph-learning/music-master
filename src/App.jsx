import React, { Component } from 'react';
import './App.css';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import Profile from './Profile.jsx';
import Gallery from './Gallery.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      artist: null,
      tracks: []
    }
  }

  async search() {
    const LIMIT_ARTIST = 1;
    const TYPE = 'artist';
    const BASE_URL = 'https://api.spotify.com/v1/search';
    const FETCH_URL = BASE_URL + '?q=' + this.state.query + '&type=' + TYPE + '&limit=' + LIMIT_ARTIST;
    const accessToken = 'BQC52yVYwky8wlxdCRxq3u4WWA1rKd3onrgoOgzGdiUwdbmWVy_LMRSBDGypnvBRxEXFkAyvEHRVS2I66nqQ1EX0GXVStWr8DmrW687EaU8aVx5oQaDGWFZmUaQkIjRl88NfIqWBb5kC3ZeEzjtFwyhs&refresh_token=AQBDXZRYEsGsdKqj2lVkBB0kptah81zWeo2cqySaS7E4JibBTfeV9OSwyskbUAODsIM1nOaVaNxawK6uTrEE-zMB3p2bwUZxuavwSctEJLwaDBX5G7F6zHG4I95LERdTsoM';

    try {
      let response = await fetch(FETCH_URL, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      })

      if (response.status === 401) throw 'Error 401: Token expired, renew your Token';

      let artistJson = await response.json();
      const artist = artistJson.artists.items[0];
      this.setState({artist});

      const FETCH_TOP_TRACKS = 'https://api.spotify.com/v1/artists/' + artist.id + '/top-tracks?country=BR';
      const responseTopTrack = await fetch(FETCH_TOP_TRACKS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      const tracksJson = await responseTopTrack.json();
      const {tracks} = tracksJson;
      this.setState({tracks})
    } catch (error) {
      console.error(`An error ocurred: ${error}`)
    }

  }

  render() {
    return (
      <div className="App">
        <div className="App-title">Music Master</div>
        <FormGroup>
          <InputGroup>
            <FormControl 
              type="Text"
              placeholder="Search for an Artist"
              value={this.state.query}
              onChange={event => this.setState({query: event.target.value})}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.search();
                }
              }}
            />
            <InputGroup.Addon onClick={ () => this.search() }>
              <Glyphicon glyph="search"></Glyphicon>
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        {
          this.state.artist !== null
          ?
          <div>
            <Profile
              artist={this.state.artist}
            />
          </div>
          : <div>Finding some music</div>
        }
        <Gallery
          tracks={this.state.tracks}
        />
      </div>
    )
  }
}

export default App;
