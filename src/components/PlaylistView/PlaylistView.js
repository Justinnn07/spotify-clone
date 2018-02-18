import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

import PlaylistDescription from '../PlaylistDescription';
import PlaylistDescriptionWrapper from '../PlaylistDescriptionWrapper';
import PlaylistImage from '../PlaylistImage';
import PlaylistPlayButton from '../PlaylistPlayButton';
import PlaylistTracksWrapper from '../PlaylistTracksWrapper';
import TrackContainer from '../../containers/TrackContainer';
import Loading from '../Loading';
import { Wrapper } from './styled';

import { rootUrl } from '../../variables';

class PlaylistView extends Component {
  componentDidMount() {
    this.props.fetchPlaylistView(this.props.currentPlaylistHref);
  }

  componentWillUnmount() {
    this.props.clearPlaylistView();
  }

  handleButton = () => {
    const {
      isPaused,
      isPlaying,
      isActivePlaylist,
      setPause,
      unpause,
      startPlay,
    } = this.props;
    if (isActivePlaylist && isPlaying && !isPaused) {
      return setPause();
    }
    if (isActivePlaylist && isPlaying && isPaused) {
      return unpause();
    }
    if (!isActivePlaylist) {
      return startPlay();
    }
  };

  render() {
    const {
      activeTrackId,
      isPaused,
      isPlaying,
      playlist,
      setPause,
      startPlay,
      tracklist,
      isActivePlaylist,
    } = this.props;

    if (!tracklist) return <Loading />;

    return (
      <Wrapper>
        <PlaylistDescriptionWrapper>
          <PlaylistImage src={playlist.imageUrl} alt={playlist.name} />
          <PlaylistDescription
            name={playlist.name}
            description={playlist.description}
            length={tracklist.length}
          >
            <PlaylistPlayButton
              isPlaying={isActivePlaylist && isPlaying && !isPaused}
              onClick={this.handleButton}
            />
          </PlaylistDescription>
        </PlaylistDescriptionWrapper>
        <PlaylistTracksWrapper>
          {tracklist.map(({ track }, i) => {
            return (
              <TrackContainer
                key={track.id}
                artists={track.artists}
                nr={+i}
                track={track}
                playlistId={playlist.id}
                isPlaying={isPlaying && !isPaused}
                isActiveTrack={isActivePlaylist && +i === activeTrackId}
                playTrack={() => startPlay(+i)}
                pauseTrack={() => setPause()}
                unpause={this.props.unpause}
                activeTrackId={isActivePlaylist ? activeTrackId : null}
              />
            );
          })}
        </PlaylistTracksWrapper>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, props) => ({
  activeTrackId: state.activeTrackId,
  isPaused: state.isPaused,
  isPlaying: state.isPlaying,
  isActivePlaylist:
    state.playlist.href === rootUrl + props.history.location.pathname,
  playlist: state.playlistView,
  tracklist: state.tracklistView,
  currentPlaylistHref: rootUrl + props.history.location.pathname,
});

const mapDispatchToProps = (dispatch, getState) => ({
  clearPlaylistView: () => {
    dispatch(actions.clearPlaylistView());
  },
  fetchPlaylistView: href => {
    dispatch(actions.fetchPlaylistView(href));
  },
  startPlay: track => {
    dispatch(actions.startPlayFromTracklist(track));
  },
  setPause: () => {
    dispatch(actions.setPause());
  },
  unpause: () => {
    dispatch(actions.unpause());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistView);
