import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Img } from 'remotion';
import React from 'react';
import { Product } from '@/types/product';

interface AdVideoProps {
  script: string;
  product: Product;
}

const TextSection: React.FC<{
  text: string;
  image: string;
  style?: React.CSSProperties;
}> = ({ text, image, style }) => {
  const frame = useCurrentFrame();
  
  // Image animation - single smooth scale animation
  const imageScale = interpolate(
    frame,
    [0, 15, 75, 90],
    [0.95, 1, 1, 0.95],
    {
      extrapolateRight: 'clamp',
    }
  );

  // Text animation
  const textOpacity = interpolate(
    frame,
    [0, 15, 75, 90],
    [0, 1, 1, 0],
    {
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '40px',
      }}
    >
      {/* Left side - Image */}
      <div
        style={{
          flex: '1',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${imageScale})`,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Img
          src={image}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            maxWidth: '1200px',
            maxHeight: '1200px',
            imageRendering: '-webkit-optimize-contrast',
            WebkitFontSmoothing: 'antialiased'
          }}
        />
      </div>

      {/* Right side - Text */}
      <div
        style={{
          flex: '1',
          padding: '40px',
          opacity: textOpacity,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#1a1a1a',
            lineHeight: 1.2,
          }}
        >
          {text}
        </h1>
      </div>
    </AbsoluteFill>
  );
};

export const AdVideo: React.FC<AdVideoProps> = ({ script, product }) => {
  // Filter out 360 view images and get all available images
  const allImages = [product.image, ...product.images].filter(img => 
    !img.includes('360') && !img.toLowerCase().includes('spin')
  );
  
  const sections = script
    .split('\n\n')
    .filter(Boolean)
    .map((section) => {
      const visual = section.split('\nVO:')[0].replace('VISUAL:', '').trim();
      return visual;
    });

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      {sections.map((text, index) => (
        <Sequence
          key={index}
          from={index * 90} // 3 seconds per section
          durationInFrames={90}
        >
          <TextSection
            text={text}
            image={allImages[index % allImages.length]} // Cycle through available images
            style={{ opacity: 1 }}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Export just the component, let the API handle composition configuration
export default AdVideo; 