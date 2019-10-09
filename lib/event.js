class Event {
  constructor(params) {
    if (!params['aggregate_id']) {
      throw Error('Missing aggregate_id');
    }
    if (!params['sequence_number']) {
      throw Error('Missing sequence_number');
    }
    this.aggregate_id = params['aggregate_id'];
    this.sequence_number = params['sequence_number'];
    this.date_created = Date.now();
    delete params['aggregate_id'];
    delete params['sequence_number'];
    this._payload_data = params;
  }

  get payload() {
    return this._payload_data
  }
}
