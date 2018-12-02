import slugify from './slugify';

type Item = {
  id: string,
  subitems: Array<Item>,
};

type Section = {
  items: Array<Item>,
};

const findSectionForPath = (
  pathname: string,
  sections: Array<Section>,
): Section | void => {
  let activeSection;
  const slugId = pathname.split('/').slice(-1)[0];

  sections.forEach(section => {
    const match = section.items.some(
      item =>
        slugId === slugify(item.id) ||
        (item.subitems &&
          item.subitems.some(subitem => slugId === slugify(subitem.id))),
    );
    if (match) {
      activeSection = section;
    }
  });

  return activeSection;
};

export default findSectionForPath;
