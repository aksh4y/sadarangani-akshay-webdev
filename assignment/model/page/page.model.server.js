/**
 * Created by Akshay on 3/20/2017.
 */

module.exports = function () {

    var model;
    var mongoose = require('mongoose');
    var q = require('q');

    var pageSchema = require('./page.schema.server.js')();
    var pageModel = mongoose.model('PageModel', pageSchema);

    var api = {
        "setModel": setModel,
        "createPage": createPage,
        "findAllPagesForWebsite": findAllPagesForWebsite,
        "findPageById": findPageById,
        "updatePage": updatePage,
        "deletePage": deletePage,
        "deletePageWidgets": deletePageWidgets
    };

    return api;

    function createPage(websiteId, page) {
        var d = q.defer();
        page._website = websiteId;
        pageModel
            .create(page, function (err, p) {
                if (err) {
                    d.reject(err);
                } else {
                    addPage(websiteId, p);
                    d.resolve(p);
                }
            });
        return d.promise;
    }

    function addPage(websiteId, page) {
        var deferred = q.defer();
        model.websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                website[0].pages.push(page);
                website[0].save();
                deferred.resolve(website[0]);
            }, function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }


    function findAllPagesForWebsite(websiteId) {
        var d = q.defer();
        pageModel
            .find({"_website": websiteId}, function (err, pages) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(pages);
                }
            });
        return d.promise;
    }

    function findPageById(pageId) {
        var d = q.defer();
        pageModel
            .find({"_id": pageId}, function (err, page) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(page);
                }
            });
        return d.promise;
    }

    function updatePage(pageId, page) {
        var d = q.defer();
        pageModel
            .findOneAndUpdate({"_id": pageId}, {$set: page}, function (err, updatedPage) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(updatedPage);
                }
            });
        return d.promise;
    }
    function deletePage(pageId) {
        var deferred = q.defer();
        findPageById(pageId)
            .then(function (p) {
                model.websiteModel
                    .removePage(p)
                    .then(function() {
                        console.log("attempt to remove page");
                        pageModel
                            .remove({"_id": pageId}, function (err, status) {
                                if (err) {
                                    deferred.reject(err);
                                } else {
                                    console.log("deleted page");
                                    deferred.resolve(status);
                                }
                            });
                    }, function (err) {
                        deferred.reject(err);
                    });
            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }


    function setModel(_model) {
        model = _model;
    }

    function deletePageWidgets(pageId) {
        var deferred = q.defer();

        model.widgetModel
            .findAllWidgetsForPage(pageId)
            .then(function (widgets) {
                for(var w in widgets) {
                    model.widgetModel
                        .deleteWidget(widgets[w]._id);
                }
            }, function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }
};