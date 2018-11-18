import React from 'react';

import styles from './IpfsSidebar.module.scss';

import Text from '../../components/Text';
import FileUpload from "../../components/FileUpload";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";

const IpfsSidebar = props => {
  const disabled = !!props.error;
  return (
    <div className={`${styles.ipfsSidebar} ${styles['fixed']}`}>
      <div className={styles.marginTop}>
        <Text inline typeScale="h3" weight="fontWeight-medium">
          Upload File
        </Text>
      </div>
      <div className={styles.marginTop}>
        <FileUpload disabled={disabled} onChange={props.touch} loading={props.touchInProgress}/>
      </div>
      <div className={styles.marginTop}>
        <Text inline typeScale="h3" weight="fontWeight-medium">
          Add Directory
        </Text>
      </div>
      <div className={styles.marginTop}>
        <TextInput onChange={props.newFolderName} label="Name"/>
      </div>
      <div className={styles.marginTop}>
        <Button onClick={props.mkdir} disabled={disabled}>Add</Button>
      </div>
    </div>
  );
};



export default IpfsSidebar;