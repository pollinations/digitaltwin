import { useEffect, useCallback, useState } from 'react';

/**
 * Custom hook to get and set URL parameters
 * @param {string} key - The key of the URL parameter
 * @returns {Array} - An array containing the URL parameter value and a function to set the URL parameter
 */
const useUrlParams = (key) => {
    const getUrlParam = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return JSON.parse(urlParams.get(key));
    };

    const setUrlParam = (value) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set(key, JSON.stringify(value));
        window.history.pushState({}, '', "?" + urlParams.toString());
    };

    return [getUrlParam, setUrlParam];
};

export const useUrlState = (initialState, key) => {
    const [getUrlParam, setUrlParam] = typeof window === 'undefined' ? [() => null, () => { }] : useUrlParams(key);
    const [state, setState] = useState(getUrlParam() || initialState);

    useEffect(() => {
        if (typeof window === 'undefined' || !urlStateEnabled) return;
        const storedState = getUrlParam();
        setState(storedState && storedState !== 'undefined' ? storedState : initialState);
    }, []);

    const setUrlState = useCallback((newState) => {
        if (!urlStateEnabled || typeof window === 'undefined') {
            setState(newState);
            return;
        }
        setUrlParam(newState);
        setState(newState);
    }, [key]);

    useEffect(() => {
        if (typeof window === 'undefined' || !urlStateEnabled) return;
        const handlePopState = () => {
            const storedState = getUrlParam();
            setState(storedState ? storedState : initialState);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [key, initialState]);

    return [state, setUrlState];
};

// use context for this in the future
let urlStateEnabled = true;

export const setUrlStateEnabled = value => urlStateEnabled = value;