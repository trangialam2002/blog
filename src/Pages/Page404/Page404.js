import { Link } from 'react-router-dom';
import styles from './page404.module.scss'
import Button from '../../Component/Button/Button';
function Page404() {
    return ( 
        <div className={styles.notFound}>
            <Link to="/">
                <img src='/logoMonkey.png'/>
            </Link>
            <h3>404! Not found page</h3>
            <Button height="40px" width="200px" isTo="/">Back to home</Button>
        </div>
     );
}

export default Page404;