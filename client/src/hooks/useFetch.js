import { useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
    data: [],
    loading: true,
    error: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: false,
            };
        case 'FETCH_ERROR':
            return {
                ...state,
                data: [],
                loading: false,
                error: true,
            };
        default:
            return state;
    }
}

export const useFetch = (url) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                if (isMounted) {
                    response.status === 200 ?
                        dispatch({ type: 'FETCH_SUCCESS', payload: response.data }) : dispatch({ type: 'FETCH_ERROR' });
                        console.log(response.data)
                }
            } catch (error) {
                if (isMounted) {
                    dispatch({ type: 'FETCH_ERROR' });
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return state;
}
