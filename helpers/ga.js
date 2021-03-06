import ReactGA from 'react-ga';

export const initGA = () => {
  console.log('GA init');
  ReactGA.initialize('UA-99744966-1');
};
export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
