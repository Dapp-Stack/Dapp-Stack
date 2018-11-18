import { faTachometerAlt, faSign, faArchive } from '@fortawesome/free-solid-svg-icons';


export const NAV_ITEMS = [
  {
    icon: faTachometerAlt,
    to: '/blocks',
    tabKey: 'blocks',
    title: 'Blocks'
  },
  {
    icon: faSign,
    to: '/contracts',
    tabKey: 'contracts',
    title: 'Contracts'
  },
  {
    icon: faArchive,
    to: '/ipfs',
    tabKey: 'ipfs',
    title: 'Ipfs'
  }
];