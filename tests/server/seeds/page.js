// var scraperElement1 ={
//   name: 'element1',
//   domSelector: "HTML>BODY>DIV>MAIN>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>DIV>ARTICLE>DIV>DIV>H2>DIV",
//   selectorIndex: 0,
//   fields: JSON.stringify({
//     link: {
//       index: 0,
//       attr: 'href',
//       type: 'a'
//     },
//     content: {
//       index: 1,
//       attr: 'text',
//       type: 'a'
//     }
//   })
// };
var scraperElement2 ={
  name: 'element2',
  domSelector: "div#product-pane",
  selectorIndex: 0,
  fields: JSON.stringify({
    link: {
      index: 0,
      attr: 'href',
      type: 'a'
    },
    content: {
      index: 1,
      attr: 'text',
      type: 'a'
    }
  })
};

var scraperElement3 ={
  name: 'element3',
  domSelector: "div#product-pane",
  selectorIndex: 1,
  fields: JSON.stringify({
    link: {
      index: 0,
      attr: 'href',
      type: 'a'
    },
    content: {
      index: 1,
      attr: 'text',
      type: 'a'
    }
  })
};


var page = {
  title: 'test page',
  url: 'https://stackstore-teamwin.herokuapp.com',
  targetElements: [scraperElement2, scraperElement3]

};
module.exports = page;
