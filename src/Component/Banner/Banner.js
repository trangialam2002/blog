import { useEffect } from 'react';
import Button from '../Button/Button';
import styles from './banner.module.scss'
function Banner() {
    return ( 
        <div className={styles.banner}>
            <div className={styles.left}>
                <h3>Monkey Blogging</h3>
                <span>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
                </span>
                <Button isTo='/sign-up' isBanner width="150px" height="40px">Get Started</Button>
            </div>
            <img src="/banner.png" alt=''/>
        </div>
     );
}

export default Banner;