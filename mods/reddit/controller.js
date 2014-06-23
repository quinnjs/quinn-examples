'use strict';

const Bluebird = require('bluebird');
const async = Bluebird.coroutine;

const respond = require('quinn-respond');
const render = require('quinn-render');

const reddit = require('./service');
const SubIndexPage = require('./view/sub-index');

exports.subreddit = async(function*(req, params) {
  const subId = params.subId;

  // Load this first so it loads in parallel
  const top = reddit.top(subId);

  // We need to make sure that the sub actually exists
  let about;
  try {
    about = yield reddit.about(subId);
  } catch (err) {
    // The reddit API redirects to search when the reddit does not exist
    if (err.statusCode === 302) {
      return respond('Not found: ' + subId).status(404);
    }
    return Bluebird.reject(err);
  }

  // `top` will be resolved by render automatically
  return render(SubIndexPage, {
    subId: subId,
    about: about,
    submissions: top
  }, {
    // Yes, I'm *that* lazy
    styles: '//maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css',
    pageTitle: '/r/' + subId + ' (top)'
  });
});
