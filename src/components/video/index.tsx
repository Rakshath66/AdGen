import { registerRoot } from '@remotion/player';
import { Composition } from 'remotion';
import React from 'react';
import { AdVideo } from './AdVideo';

const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AdVideo"
      component={AdVideo}
      durationInFrames={450} // 15 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        script: 'VISUAL: Default visual\nVO: Default voiceover',
      }}
    />
  );
};

registerRoot(RemotionRoot); 