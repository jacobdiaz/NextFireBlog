// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// API routes
// only executes on the server. Will not add to JS bundle size
export default (req, res) => {
  res.status(200).json({ name: 'John Doe' })
}
