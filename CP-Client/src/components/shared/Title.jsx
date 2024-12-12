/* eslint-disable react/prop-types */
import React from 'react'
import {Helmet} from 'react-helmet-async'

// const Title=({title='ChatPulse',description='this is Chat Pulse!'})=> {
   
//     return <Helmet>
        
//         <title>{title}</title>
//         <meta name='description' content={description}/>
//     </Helmet>
// }

const Title = ({
  title = "ChatPulse",
  description = "this is Chat Pulse!",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};
export default Title
