API Basejump: Image Search Abstraction Layer
===
> ###Objective: 
Build a full stack JavaScript app
that is functionally similar to this:
[reference case 1](https://cryptic-ridge-9197.herokuapp.com/api/imagesearch/lolcats%20funny?offset=10)
[reference case 2](https://cryptic-ridge-9197.herokuapp.com/api/latest/imagesearch/)
and
deploy it to Heroku.
> ###User story:  
  1. user can
  get the image _URLs_,
  _alt_ text and
  **page** _urls_ for a set of images
  relating to a given _search_ string.
  2. user can
  **paginate** through the _responses_ by adding a `?offset=2` _parameter_ to the _URL_.
  3. user can
  get a _list_ of the most recently submitted _search_ strings.
  
Live demo:
---
  * [https://api-image-search-microservice.herokuapp.com/](https://api-image-search-microservice.herokuapp.com/)
> ###Usage example:
  * image search results:
  input:
    [https://api-image-search-microservice.herokuapp.com/api/imagesearch/lolcats%20funny?offset=10](https://api-image-search-microservice.herokuapp.com/api/imagesearch/lolcats%20funny?offset=10)
  output:
    ```text
    [
      {
        "url":"https://i.ytimg.com/vi/tRzXptpC3_U/hqdefault.jpg",
        "snippet":"funny lolcats and loldogs",
        "thumbnail":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS_dKvb6pMA0bod00g0v1Bk3YakSY7H4HYwpu268AqUK8pPiSdlUh9pEnYh",
        "context":"https://www.youtube.com/watch?v=tRzXptpC3_U"
      },
      ...
    ]
    ```
  * a _list_ of the most recently submitted _search_ strings:
  input:
    [https://api-image-search-microservice.herokuapp.com/api/latest/imagesearch/](https://api-image-search-microservice.herokuapp.com/api/latest/imagesearch/)
  output:
    ```json
    [
      {
        "term":"lolcats funny",
        "when":"2016-04-08T08:12:08.752Z"
      },
      ...
      {
        "term":"lolcats funny",
        "when":"2016-04-08T06:12:28.546Z"
      }
    ]
    ```
