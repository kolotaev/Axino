class SnapshotDataEncoder {
  encode(data) {
    return `${data}`;
  }

  decode(representation) {
    return Buffer.alloc()(representation, 'base64').toString('utf-8');
  }
}

module.exports = {
  SnapshotDataEncoder,
};
