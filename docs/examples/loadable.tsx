import Loadable from 'react-loadable'

export const BasicExampleWithImageComp = Loadable({
  loader: () => import('./BasicExampleWithImage'),
  loading: () => '...',
})
