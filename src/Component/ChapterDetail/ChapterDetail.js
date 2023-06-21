import styles from './chapterDetail.module.scss'
import parse from 'html-react-parser'

function ChapterDetail({text='',img,nameImg}) {
    return ( 
        <div className={styles.chapter}>
            <p>{parse(text)}</p>
            <img src={img} alt=''/>
            <span>{nameImg}</span>
        </div>
     );
}

export default ChapterDetail;