class EventStream {
  constructor(aggregateType, aggregateID, snapshotThreshold, streamRecordID) {
    this._aggregateType = aggregateType;
    this._aggregateID = aggregateID;
    this._snapshotThreshold = snapshotThreshold;
    this._streamRecordID = streamRecordID;
  }

  get aggregateType() {
    return this._aggregateType;
  }

  get aggregateID() {
    return this._aggregateID;
  }

  get snapshotThreshold() {
    return this._snapshotThreshold;
  }

  get streamRecordID() {
    return this._streamRecordID;
  }
}

class StreamRecord {}

module.exports = {
  EventStream,
  StreamRecord,
}
