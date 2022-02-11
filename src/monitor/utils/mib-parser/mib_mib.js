function Import_mibs(import_name, mib) {
  this.import_name = import_name;
  this.mib = mib;
}

function Mib(fname) {
  this.file_name = fname;
  this.mib_name = '';
  this.mib_root = '';
  this.import_mibs = [];
  this.last_updated = '';
  this.organization = '';
  this.mib_description = '';
  this.origin = '';

  this.oid_object = [];
  this.sequence = [];
  this.textual_convetion = [];
}

module.exports = {
  Mib: Mib,
  Import_mibs: Import_mibs,
};
