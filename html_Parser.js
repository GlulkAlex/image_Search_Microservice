"use strict";
// helper
// pad string with char
/** str.replace("Microsoft","W3Schools");
* 'class="rg_meta"'.replace(/./g,"_"); => '_______________'
*/
function replace_With(
  source_Str//: str
  ,replace_Char//: str
) {
  "use strict";
  var result = "";//[];
  //>>> defaults <<<//
  if (replace_Char) {} else {replace_Char = "_";}
  //>>> defaults end <<<//

  source_Str
    .split("")
    .forEach((item, index) => {result += replace_Char;})

  return result;
}

function pad_With(
  source_Str//: str
  ,replace_Char//: str
) {
  "use strict";
  var result = "";//[];
  var source_Str_Length = source_Str.length;
  var index = 0;
  //>>> defaults <<<//
  if (replace_Char) {} else {replace_Char = "_";}
  //>>> defaults end <<<//
  for(;index < source_Str_Length;index++){result += replace_Char;}

  return result;
}

// TODO custom parser function must:
// TODO - extract from html (body) ["url", "snippet", "context", "thumbnail"]
// TODO - retrieve tags (start/end) for DIV
// TODO - retrieve tag's attribute ("class")
// TODO - retrieve tag's content (.innerHTML)
// TODO - work with streams (data chunks)
// helper
function parse_HTML(
  data_Chunk//: str
  //>>> main data accumulator <<<//
  ,extracted_Tags//: (obj | dictionary) | list of (obj | dictionary)
  ,parser_State//: obj | dictionary
  //,current_Tag//: str
  //,open_Tags//: obj | dictionary
  //,processing_State//: obj | dictionary
  //,incomplete_Data//: str
  ,is_Debug_Mode//: bool <- optional
) {// => Promise(obj) <- parse state
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
    ,"tag_Content": "{\"cl\":6,\"id\":\"JJ6AX2fz8h4wLM:\", ..."//  <- may be incomplete
    // 3 chars after '</' after "open_Tag"
    // no else / others inner tags & divs expected
    ,"close_Tag": "DIV"//</div> <- may never being completed
  };
  var str_Item_Index = 0;
  var i = 0;
  var chunk_Length = data_Chunk.length;
  var current_Char = "";
  //>>> parser's state <<<///
  var open_Tag_Start_Slide_Window = "";//"____"; // | "<div".length == 4
  var tag_Attribute_Slide_Window = "";//"_______________"; // | 'class="rg_meta"'.length == 15
  var open_Tag_End_Slide_Window = "";//"_"; // | ">".length == 1
  var tag_Content = "";// tag_Content - close_Tag_Slide_Window -> drop 5 left chars | "".slice(0, -5)
  var close_Tag_Slide_Window = "";//"_____"; // | "</div".length == 5 | "</".length == 2

  //*** defaults ***//
  if (is_Debug_Mode) {console.log("defaults:");}
  //if (is_Debug_Mode) {console.log("extracted_Tags:", extracted_Tags);}
  if (extracted_Tags) {
    if (is_Debug_Mode) {console.log("extracted_Tags.length:", extracted_Tags.length);}
  } else {
    extracted_Tags = [];//{};
    if (is_Debug_Mode) {console.log("extracted_Tags is empty:", extracted_Tags);}
  }
  /*if (current_Tag) {} else {
    current_Tag = {
      "open_Tag": ""
      ,"tag_Attribute_Name": ""
      ,"tag_Attribute_Value": ""
      ,"tag_Content": ""
      ,"close_Tag": ""
    };
  }*/
  /*if (incomplete_Data) {} else {
    incomplete_Data = "";
  }*/
  //*** defaults end ***//

  //*** initialization ***//
  if (is_Debug_Mode) {console.log("initialization:");}
  if (is_Debug_Mode) {console.log("parser_State:", parser_State);}
  if (parser_State) { // is not null | undefined & is an proper object
    //>>> set <<<//
    open_Tag_Start_Slide_Window = parser_State.open_Tag_Start;
    tag_Attribute_Slide_Window = parser_State.tag_Attribute;
    open_Tag_End_Slide_Window = parser_State.open_Tag_End;
    tag_Content = parser_State.tag_Content;
    close_Tag_Slide_Window = parser_State.close_Tag;
  } else {
  }
  if (is_Debug_Mode) {console.log("open_Tag_Start_Slide_Window:", open_Tag_Start_Slide_Window);}
  if (is_Debug_Mode) {console.log("tag_Attribute_Slide_Window:", tag_Attribute_Slide_Window);}
  if (is_Debug_Mode) {console.log("open_Tag_End_Slide_Window:", open_Tag_End_Slide_Window);}
  if (is_Debug_Mode) {console.log("tag_Content.length:", tag_Content.length);}
  if (is_Debug_Mode) {console.log("close_Tag_Slide_Window:", close_Tag_Slide_Window);}
  //*** initialization end ***//

  for (;i < chunk_Length;i++) {

    current_Char = data_Chunk[i];

    if (
      open_Tag_Start_Slide_Window == "" ||
      open_Tag_Start_Slide_Window.length < 4 ||
      open_Tag_Start_Slide_Window != "<div"
      ) {
      open_Tag_Start_Slide_Window = (open_Tag_Start_Slide_Window + current_Char).slice(-4);
      if (is_Debug_Mode) {
        console.log(
          "add to open_Tag_Start_Slide_Window:", open_Tag_Start_Slide_Window,
          ".length:", open_Tag_Start_Slide_Window.length);}
    }
    if (
      tag_Attribute_Slide_Window == "" ||
      tag_Attribute_Slide_Window.length < 15 ||
      tag_Attribute_Slide_Window != 'class="rg_meta"'
      ) {
      tag_Attribute_Slide_Window = (tag_Attribute_Slide_Window + current_Char).slice(-15);
      if (false) {
        console.log(
          "add to tag_Attribute_Slide_Window:", tag_Attribute_Slide_Window,
          ".length:", tag_Attribute_Slide_Window.length);}
    }
    if (
      open_Tag_Start_Slide_Window == "<div" &&
      tag_Attribute_Slide_Window == 'class="rg_meta"' &&
      open_Tag_End_Slide_Window != '>'
      ) {
      open_Tag_End_Slide_Window = current_Char;
      if (is_Debug_Mode) {
        console.log(
          "add to open_Tag_End_Slide_Window:", open_Tag_End_Slide_Window,
          ".length:", open_Tag_End_Slide_Window.length);}
    }
    /*
    if (
      (open_Tag_Start_Slide_Window == "<div" &&
      tag_Attribute_Slide_Window == 'class="rg_meta"' &&
      open_Tag_End_Slide_Window == '>') &&
      (close_Tag_Slide_Window == "" ||
      close_Tag_Slide_Window.length < 5 ||
      close_Tag_Slide_Window != "</div")
    ) {
      tag_Content += current_Char;
    }
    */
    if (
      (open_Tag_Start_Slide_Window == "<div" &&
      tag_Attribute_Slide_Window == 'class="rg_meta"' &&
      open_Tag_End_Slide_Window == '>') &&
      (close_Tag_Slide_Window == "" ||
      close_Tag_Slide_Window.length < 5 ||
      close_Tag_Slide_Window != "</div")
    ) {
      tag_Content += current_Char;
      close_Tag_Slide_Window = (close_Tag_Slide_Window + current_Char).slice(-5);
      //if (is_Debug_Mode) {console.log("add to tag_Content.length:", tag_Content.length);}
      if (is_Debug_Mode) {
        console.log(
          "add to close_Tag_Slide_Window:", close_Tag_Slide_Window, ".length:", close_Tag_Slide_Window.length);}
    }

    if (close_Tag_Slide_Window == "</div") {

      extracted_Tags
        .push(
          tag_Content.slice(1, -5)
        )
      ;
      if (is_Debug_Mode) {console.log("push to extracted_Tags.length:", extracted_Tags.length);}
      //>>> reset <<<//
      open_Tag_Start_Slide_Window = "";
      tag_Attribute_Slide_Window = "";
      open_Tag_End_Slide_Window = "";
      tag_Content = "";//tag_Content.slice(0, -5);
      close_Tag_Slide_Window = "";

    } else {
    }
  }
  //>>> reset <<<//
  //TypeError: Cannot assign to read only property 'open_Tag_Start'
  /*
  parser_State.open_Tag_Start = open_Tag_Start_Slide_Window;
  parser_State.tag_Attribute = tag_Attribute_Slide_Window;
  parser_State.open_Tag_End = open_Tag_End_Slide_Window;
  parser_State.tag_Content = tag_Content;
  parser_State.close_Tag = close_Tag_Slide_Window;
  */
  if (is_Debug_Mode) {console.log("return value:");}
  if (is_Debug_Mode) {console.log("open_Tag_Start_Slide_Window:", open_Tag_Start_Slide_Window);}
  if (is_Debug_Mode) {console.log("tag_Attribute_Slide_Window:", tag_Attribute_Slide_Window);}
  if (is_Debug_Mode) {console.log("open_Tag_End_Slide_Window:", open_Tag_End_Slide_Window);}
  if (is_Debug_Mode) {console.log("tag_Content.length:", tag_Content.length);}
  if (is_Debug_Mode) {console.log("close_Tag_Slide_Window:", close_Tag_Slide_Window);}
  //return Promise
  //  .resolve(
  return {
        "extracted_Tags": extracted_Tags
        ,"parser_State": {
          "open_Tag_Start": open_Tag_Start_Slide_Window
          ,"tag_Attribute": tag_Attribute_Slide_Window
          ,"open_Tag_End": open_Tag_End_Slide_Window
          ,"tag_Content": tag_Content
          ,"close_Tag": close_Tag_Slide_Window
        }
      }
  //  )
  ;
}

/*##########################################################################*/
exports.parse_HTML = parse_HTML;
