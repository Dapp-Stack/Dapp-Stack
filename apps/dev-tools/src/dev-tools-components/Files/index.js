import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLevelUpAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import styles from './Files.module.scss';

import Card from '../../components/Card';
import Text from '../../components/Text';
import ZeroState from '../../components/ZeroState';
import FileRow from '../../components/FileRow';

const Files = (props) => {
  if (props.error) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.error}>
          <Card className={styles.errorCard}>
            <Card.Body>
              <ZeroState
                title={`Connection Error`}
                type="error"
                icon={faExclamationTriangle}
                iconColor="red"
                text={`DApp Stack Dev Tools could not connect to your local IPFS instance, make sure it is running on http://localhost:5001`}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
  
  const zeroFile = (
    <div className={styles.errorWrapper}>
      <div className={styles.error}>
        <Card className={styles.errorCard}>
          <Card.Body>
            <ZeroState
              title={`No files yet.`}
              icon={faExclamationTriangle}
              iconColor="orange"
              text={`There is currently zero files on ${props.root}.`}
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
  
  const files = props.files.map((file, index) => (
    <FileRow key={index} 
             hash={file.hash} 
             name={file.name} 
             size={file.size} 
             delete={() => props.delete(file)}
             onClick={() => props.open(file)}
             icon={props.icon(file)}/>
  ));

  return (
    <React.Fragment>
      <div className={styles.breadcrumb}>
        <Text typeScale="h3">
          <FontAwesomeIcon onClick={props.cwdUp} icon={faLevelUpAlt} /> CWD: {props.root}
        </Text>
      </div>
      {props.files.length <= 0 ? zeroFile : files}
    </React.Fragment>
  );
};

export default Files;
