import { useEffect } from 'react';
import Demo from './Demo/Demo';
import Feature from './Feature/Feature';
import Newest from './Newest/Newest';
import styles from './content.module.scss'

function Content({...props}) {
    return ( 
        <div className={styles.content}>
            <Feature {...props}/>
            <Newest />
        </div>
     );
}

export default Content;