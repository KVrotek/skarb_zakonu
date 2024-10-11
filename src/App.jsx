import React from 'react';
import VideoPlayer from './components/VideoPlayer';

const App = () => {
  return (
    <div className="App" style={{
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        overflowY: 'hidden',
        backgroundColor: 'black',
        }}>
      <VideoPlayer />
    </div>
  );
};

export default App;