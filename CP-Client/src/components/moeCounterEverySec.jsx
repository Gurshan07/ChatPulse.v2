import React, { useState, useEffect, useRef } from 'react';

const MoecounterComponentEverySec = () => {
  function getRandomTheme() {
    const themes = ['default', 'asoul', 'gelbooru', 'moebooru'];
    return themes[Math.floor(Math.random() * 4)];
  }

  const [number, setNumber] = useState(1);
  const [theme, setTheme] = useState(getRandomTheme());
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const prevImageSrcRef = useRef('');
  const imgRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNumber(prevNumber => prevNumber + 1);
      setTheme(getRandomTheme());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading) return; 

    const loadImage = async () => {
      setLoading(true);
      const length = number.toString().length;
      const newImageSrc = `https://api.sefinek.net/api/v2/moecounter?number=${number}&length=${length}&theme=${theme}&pixelated=true`;

      try {
        const img = new Image();
        img.src = newImageSrc;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        if (img.src === newImageSrc) {
          prevImageSrcRef.current = imageSrc;
          setImageSrc(newImageSrc);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setLoading(false);
      }
    };

    loadImage();
  }, [number, theme]);

  const renderMessage = () => {
    if (number > 80) return "Almost Done!";
    if (number > 65) return "Just a bit more!";
    if (number > 50) return "Making progress!";
    if (number > 35) return "Almost Done!";
    if (number > 20) return "Just a little more";
    if (number > 10) return "Giving Server a push!";
    return "";
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
        {prevImageSrcRef.current && <img ref={imgRef} src={prevImageSrcRef.current} alt={`Count : ${number}`} style={{ userSelect: 'none', maxWidth: '100%', maxHeight: '100%' }} />}
        {imageSrc && <img src={imageSrc} alt={`Count : ${number}`} style={{ userSelect: 'none', maxWidth: '100%', maxHeight: '100%', position: 'absolute', opacity: 0 }} />}
      </div>
      {number > 10 && <p className='unselectable' style={{ color: 'white', textAlign: 'center' }}>{renderMessage()}</p>}
    </>
  );
};

export default MoecounterComponentEverySec;
