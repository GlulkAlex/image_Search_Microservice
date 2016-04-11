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
  //,processing_State//: obj | dictionary
  ,incomplete_Data//: str
) {// => Promise(obj)
  "use strict";

  var result_Obj = {
    // 3 chars after '<'
    // states: empty -> (undefined | "") | partial -> "di" | complete -> "DIV"
    "open_Tag": "DIV"//<div class="rg_meta">
    // 5 chars after ' ' after "open_Tag"
    ,"tag_Attribute_Name": "class"
    // 7 chars after '="' after "tag_Attribute_Name"
    ,"tag_Attribute_Value": "rg_meta"
    // chars after '">' after "tag_Attribute_Value" and before "close_Tag"
    ,"tag_Content": "{\"cl\":6,\"id\":\"JJ6AX2fz8h4wLM:\", ..."
    // 3 chars after '</' after "open_Tag"
    // no else / others inner tags & divs expected
    ,"close_Tag": "DIV"//</div>
  };
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
