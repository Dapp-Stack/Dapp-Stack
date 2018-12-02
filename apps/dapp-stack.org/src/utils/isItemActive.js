import slugify from 'utils/slugify';

const toAnchor = (href: string = ''): string => {
  const index = href.indexOf('#');
  return index >= 0 ? href.substr(index) : '';
};

type Item = {
  id: string,
  href: string,
};

const isItemActive = (location: Location, item: Item): boolean => {
  if (location.hash) {
    if (item.href) {
      return location.hash === toAnchor(item.href);
    }
  } else if (item.id.includes('html')) {
    return location.pathname.includes(item.id);
  }
  const slugId = location.pathname.split('/').slice(-1)[0];
  return slugId === slugify(item.id);
};

export default isItemActive;
