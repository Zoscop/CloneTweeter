import axios from "axios"

async function EditTweet(tweetId: number, newContent: string) {
  try {
    const response = await axios.patch(`http://localhost:3000/tweets/${tweetId}`, {
      content: newContent,
    })
    console.log("Tweet modifié :", response.data)
    return response.data
  } catch (error) {
    console.error("Erreur lors de la modification du tweet :", error)
    throw error
  }
}

export default EditTweet