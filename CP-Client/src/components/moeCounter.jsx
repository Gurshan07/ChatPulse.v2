import React, { useState, useEffect } from 'react';
import { useGetCounterQuery, useUpdateCounterMutation } from '../redux/api/api';  

const MoecounterComponent = () => {
  const { data, error, isLoading } = useGetCounterQuery();
  const [updateCounter] = useUpdateCounterMutation();
  const [hasIncremented, setHasIncremented] = useState(false);  

  useEffect(() => {
    if (data && !hasIncremented) {
      const newNumber = data.value + 1;
      updateCounter(newNumber);
      setHasIncremented(true);  
    }
  }, [data, updateCounter, hasIncremented]);

  return (
    <div style={{ display: 'flex' }}>
      {/* <img src={link} alt={`Count : ${number}`} style={{ userSelect: 'none' }} /> */}
    </div>
  );
};

export default MoecounterComponent;
