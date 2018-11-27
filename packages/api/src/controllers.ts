import { build, Structure } from '@dapp-stack/environment'
import { Request, Response } from 'express'
import * as fs from 'fs'

export class Controllers {
  public ping = (req: Request, res: Response) => {
    res.status(204).send()
  }

  public getTracker = (req: Request, res: Response) => {
    try {
      const { web } = build()
      const filename = Structure.tracker(web.framework)
      const content = fs.readFileSync(filename, 'utf-8')
      const data = JSON.parse(content)
      res.json(data)
    } catch {
      res.status(422).send({
        error:
          'We could not load the tracker file, please check your installation.'
      })
    }
  }
}
