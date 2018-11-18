import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './FileRow.module.scss';
import { shortenAddress } from '../../utils/helpers';

import Circle from '../Circle';
import Text from '../Text';

const FileRow = props => {
  const {
    hash = '',
    name = '',
    size = '',
    icon
  } = props;

  return (
    <div className={`${styles.fileRowContainer}`}>
      <div className={`${styles.leftColumn}`}>
        <div className={`${styles.profilePic}`}>
          <Circle type="blocky" input={hash} size="small" />
        </div>
        <div className={`${styles.textArea}`}>
          <div className={`${styles.textCell}`}>
            <Text onClick={props.onClick} link color="blue">
              {shortenAddress(hash)}
            </Text>
          </div>
          <div className={`${styles.textCell}`}>
            <Text>{name} ({size}KB)</Text>
          </div>
          <FontAwesomeIcon className="text-primary" icon={icon} />
        </div>
      </div>

      <div className={`${styles.rightColumn}`}>
        <FontAwesomeIcon onClick={props.delete} className="text-danger" icon={faTrash} />
      </div>
    </div>
  );
};

export default FileRow;
