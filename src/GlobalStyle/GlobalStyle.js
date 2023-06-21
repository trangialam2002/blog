import styles from './globalStyle.module.scss'
import clsx from 'clsx'
function GlobalStyle({children}) {
    return ( 
        <div className={clsx(styles.global)}>
            {children}
        </div>
     );
}

export default GlobalStyle;