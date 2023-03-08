import CircularProgress from '@mui/material/CircularProgress';
import styles from '../styles/Explore.module.css'
const Loading = () => {
    return (
      <div className={styles.loadingOverlay}>
        <CircularProgress color="primary" size={'6rem'}/>
      </div>
    );
  };
  
  export default Loading;