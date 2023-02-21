import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content' }}>
        <CircularProgress />
      </div>
    );
  };
  
  export default Loading;