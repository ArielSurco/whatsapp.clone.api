import { UserModel } from '../../user/models/UserModel'

export const getPrivateChatName = async (userId: string, membersIds: string[]): Promise<string> => {
  const otherMember = membersIds.find((memberId) => memberId !== userId)

  const otherMemberData = await UserModel.findById(otherMember)

  return otherMemberData?.username ?? 'Unknown user'
}
