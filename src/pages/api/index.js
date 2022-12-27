import { compiler } from './compiler.js';
export default function compileHandler(req, res) {
  const {
    method,
    body,
  } = req;
  const { code, data, config } = body;
  switch (method) {
  case 'POST':      
    let body = req.body;
    let code = body.code || body.src;
    let data = body.data;
    let config = body.config || {};
    if (!code || !data) {
      return res.sendStatus(400);
    }
    compiler.compile(code, data, config, function (err, data) {
      if (err && err.length) {
        res.status(500).json({error: err});
        return;
      }
      res.status(200).json(data);
    });
    break;
  default:
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
