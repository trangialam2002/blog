import { Link, useNavigate } from 'react-router-dom';
import Button from '../../Component/Button/Button';
import ItemDashboard from './ItemDashboard/ItemDashboard';
import styles from './dashboard.module.scss'
import {faCube,faBookOpen,faSitemap,faUsers,faSignOut} from '@fortawesome/free-solid-svg-icons'

import { loginContext } from '../../App';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebase-config';

function Dashboard({children}) {
    const user=useContext(loginContext)
    const navigate=useNavigate()
    const [avatar,setAvatar]=useState('')

    !user.displayName&&navigate('/sign-in')
    console.log('tên',user.email);
    if(user.email){
        const colRef=collection(db,'users')
        const q=query(colRef,where('mail','==',user.email.trim()))
        getDocs(q).then((snap)=>{
            setAvatar(snap.docs[0]?.data()?.avatar)
        })
    }
    return ( 
        <div className={styles.dashboard}>
            <div className={styles.top}>
                <Link to='/' className={styles.logo}>
                    <img src='/logoMonkey.png' alt=''/>
                    <p>Monkey Blogging</p>
                </Link>
                <Button width="135px" height="40px" isTo="/dashboard-add-post" marginLeft='70%'>Write new post</Button>
                <img src={`images/${avatar}`} alt='' onClick={()=>navigate('/dashboard-profile')}/>
            </div>
            <div className={styles.body}>
                <div className={styles.left}>
                    <div className={styles.itemParent}>
                        <ItemDashboard icon={faCube} title='Dashboard' to="/dashboard"/>
                        <ItemDashboard icon={faBookOpen} title='Post' 
                        to="/dashboard-post" 
                        />
                        <ItemDashboard icon={faSitemap} title='Category' 
                        to="/dashboard-category"

                        />
                        <ItemDashboard icon={faUsers} title='Users' 
                        to="/dashboard-user"

                        />
                        <ItemDashboard icon={faSignOut} title='Logout' 
                        to="/"
                        onClick={()=>auth.signOut()}
                        />
                    </div>
                </div>
                <div className={styles.right}>
                     {children}
                </div>
            </div>
        </div>
     );
}

export default Dashboard;