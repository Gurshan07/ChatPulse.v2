import  { useState, } from 'react';
import { useGetCounterQuery } from '../../redux/api/api'; 

const MoecounterComponentShow = () => {
  const { data, error, isLoading } = useGetCounterQuery();
  const [theme, setTheme] = useState(getRandomTheme());


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading counter value: {error.message}</div>;
  }

  const number = data ? data.value : 0; 

  const link = `https://api.sefinek.net/api/v2/moecounter?number=${number}&length=5&theme=${theme}&pixelated=true`;

  return (
   <div style={{ textAlign: 'center' }}>
  <img src={link} alt={`Count : ${number}`} style={{ display: 'block', margin: 'auto', userSelect: 'none' }} /> 
  <h4 style={{ color: 'white' ,height:'0vh'}}>Views!</h4>
</div>
  );
};

function getRandomTheme() {
  const themes = ['default', 'asoul', 'gelbooru', 'moebooru'];
  return themes[Math.floor(Math.random() * themes.length)];
}

export default MoecounterComponentShow;
