const follow = require('../models/follow');

async function create(req, res) {
  const data = req.body;
  const {
    fanCount
  } = await follow.create(data);
  return res.json({
    success: true,
    fanCount
  })  
}

async function get(req, res) {
  const data = req.query;
  const {
    index,
    nexti,
    fanList,
    isNext
  } = await follow.get(data);
  return res.json({
    success: true,
    fanList,
    isNext,
    index,
    nexti,
  })  
}

module.exports = {
  create,
  get
}