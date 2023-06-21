import styles from './itemFeature.module.scss'
import {listImg} from '../../../../assets/images'
import { Link } from 'react-router-dom';
import { forwardRef, useEffect } from 'react';

function ItemFeature({type,fullType,time,author,fullAuthor,title,to,src},ref) {
    return ( 
        <div className={styles.item} draggable='false'
            style={{backgroundImage:`url(${src})`}}
            ref={ref}
            >
            <div className={styles.top} draggable='false'>
                <Link to={`/category/${fullType}`}>{type}</Link>
                <span>{time}</span>
                <ul>
                    <li>
                        <Link to={`/author/${fullAuthor}`}>{author}</Link>
                    </li>
                </ul>
            </div>
            <Link to={`/blog/${to}`}>{title}</Link>
        </div>
     );
}

export default forwardRef(ItemFeature);