import http from 'http'
import handler from '../api/generate.js'

const PORT = 3001

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/api/generate') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', async () => {
      let parsed
      try { parsed = JSON.parse(body) } catch { parsed = {} }

      const mockReq = {
        method: req.method,
        body: parsed,
      }

      const mockRes = {
        _status: 200,
        _headers: {},
        status(code) { this._status = code; return this },
        json(data) {
          res.writeHead(this._status, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
          })
          res.end(JSON.stringify(data))
        },
      }

      try {
        await handler(mockReq, mockRes)
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Server error' }))
      }
    })
    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(PORT, () => {
  console.log(`API dev server running at http://localhost:${PORT}`)
})
