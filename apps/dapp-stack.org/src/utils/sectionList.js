// $FlowExpectedError
import navDocs from '../../content/docs/nav.yml';
// $FlowExpectedError
import navTutorial from '../../content/tutorial/nav.yml';

const sectionListDocs = navDocs.map(
  (item: Object): Object => ({
    ...item,
    directory: 'docs',
  }),
);

export {
  sectionListDocs,
  navTutorial as sectionListTutorial,
};
