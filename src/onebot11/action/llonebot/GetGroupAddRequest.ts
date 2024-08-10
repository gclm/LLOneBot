import { GroupNotify, GroupNotifyStatus } from '../../../ntqqapi/types'
import BaseAction from '../BaseAction'
import { ActionName } from '../types'
import { NTQQUserApi } from '../../../ntqqapi/api/user'
import { NTQQGroupApi } from '../../../ntqqapi/api/group'

interface OB11GroupRequestNotify {
  group_id: number
  user_id: number
  flag: string
}

export default class GetGroupAddRequest extends BaseAction<null, OB11GroupRequestNotify[]> {
  actionName = ActionName.GetGroupIgnoreAddRequest

  protected async _handle(payload: null): Promise<OB11GroupRequestNotify[]> {
    const data = await NTQQGroupApi.getGroupIgnoreNotifies()
    const notifies: GroupNotify[] = data.notifies.filter((notify) => notify.status === GroupNotifyStatus.WAIT_HANDLE)
    const returnData: OB11GroupRequestNotify[] = []
    for (const notify of notifies) {
      const uin = await NTQQUserApi.getUinByUid(notify.user1.uid)
      returnData.push({
        group_id: parseInt(notify.group.groupCode),
        user_id: parseInt(uin),
        flag: notify.seq,
      })
    }
    return returnData
  }
}
