const { Syntax } = require('./mib_syntax');

function TextualConvention() {
  this.mib = '';
  this.oname = '';
  this.hint = '';
  this.syntax = new Syntax();
  this.ostatus = '';
  this.odescription = '';
}
TextualConvention.prototype.setName = function (oname) {
  this.oname = oname;
};
TextualConvention.prototype.getName = function () {
  return this.oname;
};
TextualConvention.prototype.setHint = function (hint) {
  this.hint = hint;
};
TextualConvention.prototype.getHint = function () {
  return this.hint;
};
TextualConvention.prototype.setStatus = function (ostatus) {
  this.ostatus = ostatus;
};
TextualConvention.prototype.getStatus = function () {
  return this.ostatus;
};
TextualConvention.prototype.setDescription = function (odescription) {
  this.odescription = odescription.replace(/"/g, '');
};
TextualConvention.prototype.getDescription = function () {
  return this.odescription;
};
TextualConvention.prototype.setMib = function (mib) {
  this.mib = mib;
};
TextualConvention.prototype.getMib = function () {
  return this.mib;
};

module.exports = {
  TextualConvention: TextualConvention,
};
