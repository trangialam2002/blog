import styles from './author.module.scss'
import parse from 'html-react-parser'

function Author({src,authorName,desAuthor}) {
    return ( 
        <div className={styles.author}>
            <img src={src} alt=''/>
            <div className={styles.info}>
                <p>{authorName}</p>
                <span>{parse(desAuthor)}</span>
            </div>
        </div>
     );
}

export default Author;