import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent} from 'react-router-dom'



 const VisuallyHiddenInput =styled('input')({
    border:0,
    clip:'react(0 0 0 0)',
    height:1,
    margin:-1,
    overflow:'hidden',
    padding:0,
    position:'absolute',
    width:1
});

 const Link =styled(LinkComponent)`
text-decoration:none;
color:red;
padding:1rem;
&:hover{
    background-color:white;
}
`
 const InputBox = styled('input')`
  width: 100%;
  height: 100%;
  border: 1px solid grey;
  color: white;
  outline: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: rgb(138, 145, 165,0.05);

  &:focus {
    box-shadow: 0 0 2px 1px rgb(225, 225, 225);
    transition: box-shadow 0.3s ease-in-out;
  }
`;

 const SearchField =styled('input')`
padding:0.5rem 2rem;
width:15vmax;
border:2px solid grey;
outline:none;
border-radius:1.5rem;
background-color:#1d1d1d;
font-size:1rem;
color:white;
`

 const CurveButton=styled('button')`
border-radius:1.5rem;
padding:0.5rem 1rem;
width:10vmax;
border:none;
outline:none;
cursor:pointer;
background-color:grey;
font-size:1.1rem;
&:hover{
background-color:white;
}

`
const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
`;

const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}));

export {
  CurveButton,
  SearchField,
  InputBox,
  Link,
  VisuallyHiddenInput,
  BouncingSkeleton,
};