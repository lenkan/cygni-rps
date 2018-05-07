function date () {
  const now = new Date()
  return now.toISOString()
}

export default {
  info (message) {
    console.log(`${date()} - ${message}`)
  },

  error (error) {
    if (error instanceof Error) {
      console.error(`${date()} - ${error.message}`)
    }
  }
}
