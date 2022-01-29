import httpService from "./http.service"

const commentEndpoint = "comment/"

const commentService = {
  getOutput: async (id) => {
    const { data } = await httpService.get(commentEndpoint, {
      params: {
        orderBy: '"outputId"',
        equalTo: `"${id}"`
      }
    })

    return data
  },
  getInput: async (id) => {
    const { data } = await httpService.get(commentEndpoint, {
      params: {
        orderBy: '"inputId"',
        equalTo: `"${id}"`
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
