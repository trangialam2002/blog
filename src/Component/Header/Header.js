import clsx from 'clsx'
import styles from './header.module.scss'
import {Link,NavLink} from 'react-router-dom'
import Search from '../Search/Search';
import { useEffect, useRef, useState } from 'react';
function Header() {
    const [change,setChange]=useState(false)
    const headerRef=useRef({})
    useEffect(()=>{
        const header=headerRef.current.offsetHeight
        const handleScroll=()=>{
            if(window.scrollY>header){
                setChange(true)
            }
            else setChange(false)
            
        }
        window.addEventListener('scroll',handleScroll)

        return ()=>{
            window.removeEventListener('scroll',handleScroll)
        }
    },[])
    return ( 
        <div className={clsx(styles.head)} style={change?{background: 'linear-gradient(155deg, #00B4AA 6.67%, #A4D96C 84.1%)'}:{}} ref={headerRef}>
            <div className={clsx(styles.menu)}>
                <Link to="/"><img src="/logoMonkey.png" alt="logo"/></Link>
                <NavLink to="/" className={({isActive})=>isActive?change?styles.active:styles.active1:''}>Home</NavLink>
                <NavLink to="/blog" className={({isActive})=>isActive?styles.active:''}>Blog</NavLink>
                <NavLink to="/dashboard" className={({isActive})=>isActive?styles.active:''}>Dashboard</NavLink>
            </div>
            <Search placeholder="Search posts..." color={change?'#00B4AA':'#A4D96C'}/>
        </div>
     );
}

export default Header;