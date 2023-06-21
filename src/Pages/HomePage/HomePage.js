import styles from './homePage.module.scss'
import clsx from 'clsx';
import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import { useContext } from "react";
import { loginContext } from "../../App";
import Banner from '../../Component/Banner/Banner';
import Content from '../../Component/Content/Content';
function HomePage() {
    const getContext=useContext(loginContext)
    
    return (  
        <>
            <Banner/>
            <Content uid={getContext.uid} authorName={getContext.displayName||''}/>
        </>
    );
}

export default HomePage;