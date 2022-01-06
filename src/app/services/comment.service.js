import httpService from "./http.service"

const commentEndpoint = "comment/"

const commentService = {
  get: async (pageId) => {
    const { data } = await httpService.get(commentEndpoint, {
      params: {
        orderBy: '"pageId"',
        equalTo: `"${pageId}"`
      }
    })

    return data
  },
  create: async (payload) => {
    const { data } = await httpService.put(
      commentEndpoint + payload._id,
      payload
    )

    return data
  },
  remove: async (commentId) => {
    const { data } = await httpService.delete(commentEndpoint + commentId)
    return data
  }
}

export default commentService
