"use strict";
// TODO custom parser function must:
// TODO - extract from html (body) ["url", "snippet", "context", "thumbnail"]
// TODO - retrieve tags (start/end) for DIV
// TODO - retrieve tag's attribute ("class")
// TODO - retrieve tag's content (.innerHTML)
// TODO - work with streams (data chunks)
// helper
function parse_HTML(
  data_Chunk//: str
  ,extracted_Tags//: obj | dictionary
  //,open_Tags//: obj | dictionary
  ,incomplete_Data//: str
) {// => Promise(obj)
  "use strict";

  //var
  //*** defaults ***//
  if (extracted_Tags) {} else {
    extracted_Tags = {};
  }
  if (incomplete_Data) {} else {
    incomplete_Data = "";
  }
  //*** defaults end ***//

  return Promise
    .resolve({
      "extracted_Tags": extracted_Tags
      ,"incomplete_Data": incomplete_Data
  });
}

/*##########################################################################*/
exports.parse_HTML = parse_HTML;
