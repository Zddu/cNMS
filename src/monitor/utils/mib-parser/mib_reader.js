const { SearchEngine } = require('./mib_search');
const { MibParser } = require('./mib_parser');
const { generateOid } = require('./mib_list');

const mib_list = [];
const oid_list = [];
const convention_list = [];
let countdown = 0;
const root = [];
const search_engine = new SearchEngine();
const oid_autocomplete = [];

function read_file(filename, contents) {
  const mib = new MibParser(filename, contents);
  console.log(mib);
  mib_list.push(mib);
  generateOid(oid_list);
}

module.exports = {
  readMibFile: read_file,
  oid_list: oid_list,
};
