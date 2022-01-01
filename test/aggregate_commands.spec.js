require('chai').should();

const { SnapshotCommand, TakeSnapshotCommand } = require('../lib/aggregate');


describe('SnapshotCommand', () => {
  describe('new', () => {
    describe('should return a SnapshotCommand', () => {
      it('with success', () => {
        const cmd = new SnapshotCommand();
        cmd.should.be.instanceof(SnapshotCommand);
      });
    });
  });
});

describe('TakeSnapshotCommand', () => {
  describe('new', () => {
    it('should return a TakeSnapshotCommand', () => {
      const cmd = new TakeSnapshotCommand();
      cmd.should.be.instanceof(TakeSnapshotCommand);
    });
  });
});
