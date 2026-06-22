import { dummyUser, DummyUserType, dummyVideo, dummyVideosWithPagination } from "@/constants";
import { SessionUserType, UserType, VideosWithPagination, VideoWithUserResult } from "@/index";
import { authClient } from "../authClient";

export async function getUser () {
  let user: UserType = dummyUser as DummyUserType 

  if(process.env.ONLINE == "true") {
    const {data} = await authClient.getSession()
    if(data !== null) {
      user = data?.user as SessionUserType
    }
  }

  return null
}

export async function getVideos (fn: () => Promise<VideosWithPagination>) {
  if(process.env.ONLINE == 'true') {
    return await fn()
  }
  return dummyVideosWithPagination
}

export async function getVideo (fn: () => Promise<VideoWithUserResult>) {
  if(process.env.ONLINE == 'true') {
    return await fn()
  }
  return dummyVideo
}


