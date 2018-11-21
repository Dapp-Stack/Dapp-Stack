import { ActionType } from 'typesafe-actions'

import * as files from './files'

export type FilesAction = ActionType<typeof files>

export type IpfsAction = FilesAction

export { files }
