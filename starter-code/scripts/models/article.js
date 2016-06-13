function Article (opts) {
  for (keys in opts) {
    this[keys] = opts[keys];
  }
}

/* TODO: Instead of a global `articles = []` array, let's track this list of all
 articles directly on the constructor function. Note: it is NOT on the prototype.
 In JavaScript, functions are themselves objects, which means we can add
 properties/values to them at any time. In this case, we have a key:value pair
 to track, that relates to ALL of the Article objects, so it does not belong on
 the prototype, as that would only be relevant to a single instantiated Article.
 */
Article.all = [];

Article.prototype.toHtml = function(scriptTemplateId) {
  var template = Handlebars.compile($(scriptTemplateId).text());
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  if(this.daysAgo < 1) {
    this.publishStatus = '(published today)';
  } else {
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  }
  this.body = marked(this.body);
  return template(this);
};

/* NOTE: There are some other functions that also relate to all articles,
 rather than just single instances. Object-oriented programming would
 call these "class-level" functions, that are relevant to the entire "class"
 of objects that are Articles, rather than just one instance. */

/* TODO: Refactor this code into a function for greater control.
    It will take in our data, and process it via the Article constructor: */
Article.loadAll = function(dataWePassIn) {
  dataWePassIn.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  }).forEach(function(ele) {
    Article.all.push(new Article(ele));
  });
};

/* This function below will retrieve the data from either a local or remote
 source, process it, then hand off control to the View: */

Article.fetchAll = function() {
  if (localStorage.hackerIpsum) {
    var data = JSON.parse(localStorage.getItem('hackerIpsum'));
    Article.loadAll(data);
    articleView.renderIndexPage();
  } else {
    $.getJSON('../../data/hackerIpsum.json', function(data) {
      localStorage.setItem('hackerIpsum', JSON.stringify(data));
      Article.loadAll(data);
      articleView.renderIndexPage();
    });
  }
};









/* Great work so far! STRETCH GOAL TIME!? Refactor your fetchAll above, or
   get some additional typing practice here. Our main goal in this part of the
   lab will be saving the eTag located in Headers, to see if it's been updated!

  Article.fetchAll = function() {
    if (localStorage.hackerIpsum) {
      // Let's make a request to get the eTag (hint: you may need to use a different
      // jQuery method for this more explicit request).
    } else {}
  }
*/
