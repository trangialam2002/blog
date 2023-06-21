import { Link } from 'react-router-dom';
import styles from './itemTippy.module.scss'

function ItemTippy({src,cate,title,slug}) {
    return ( 
        <div className={styles.item}>
            <Link to={`/blog/${slug}`}><img src={`/images/${src}`} alt=''/></Link>
            <div className={styles.child}>
                <Link to={`/category/${cate}`}>{cate.slice(0,5)+'...'}</Link>
                <Link to={`/blog/${slug}`}>
                    <p>{title.slice(0,20)+'...'}</p>
                </Link>
            </div>
        </div>
     );
}

export default ItemTippy;