import { memo } from 'react';
import styles from './label.module.scss'
import clsx from 'clsx';

function Label({title,...props}) {
    return ( 
        <>
            <label htmlFor={props.id} className={clsx(styles.label)}>{title}</label>
            <input className={clsx(styles.input)} {...props}
                    />
        </>
     );
}

export default memo(Label);