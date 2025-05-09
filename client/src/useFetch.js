import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch(url, {
          credentials: 'include',
          method: 'GET',
        })
          .then(res => {
            if(!res.ok) {
              throw Error('Could not fetch data');
            }
            return res.json();
          })
          .then((data) => {
            setData(data['data'])
            setIsPending(false);
            setError(null);
          })
          .catch(err => {
            setError(err.message);
          });
      },[url]);

      return { data, isPending, error }
}
 
export default useFetch;